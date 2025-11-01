import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { formatCurrency, formatDate } from './formatters'

/**
 * Utilitaires pour l'export de données en PDF et Excel
 */

/**
 * Exporte un tableau de données en PDF
 * @param {string} title - Titre du document
 * @param {Array} data - Tableau d'objets à exporter
 * @param {Array} columns - Configuration des colonnes (optionnel)
 * @param {string} filename - Nom du fichier (optionnel)
 */
export const exportToPDF = (title, data, columns = null, filename = null) => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  const doc = new jsPDF()
  const fileTitle = filename || title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  
  // En-tête
  doc.setFontSize(18)
  doc.text(title, 14, 20)
  
  // Date d'export
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(
    `Généré le ${formatDate(new Date(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    14,
    28
  )
  doc.setTextColor(0, 0, 0)

  // Configuration des colonnes
  let headers = []
  let rows = []

  if (columns) {
    // Utilisation des colonnes personnalisées
    headers = columns.map(col => col.header)
    rows = data.map(item => columns.map(col => {
      const value = col.accessor ? col.accessor(item) : item[col.key]
      return col.formatter ? col.formatter(value) : value
    }))
  } else {
    // Auto-détection des colonnes
    if (data.length > 0) {
      headers = Object.keys(data[0])
      rows = data.map(item => headers.map(key => {
        const value = item[key]
        // Formatage basique
        if (typeof value === 'number' && (key.includes('amount') || key.includes('rent') || key.includes('price'))) {
          return formatCurrency(value)
        }
        if (value instanceof Date || (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/))) {
          return formatDate(value)
        }
        return value !== null && value !== undefined ? String(value) : ''
      }))
    }
  }

  // Tableau
  autoTable(doc, {
    startY: 35,
    head: [headers],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 35 }
  })

  // Enregistrement
  doc.save(`${fileTitle}.pdf`)
}

/**
 * Exporte un tableau de données en Excel
 * @param {string} filename - Nom du fichier
 * @param {Array} data - Tableau d'objets à exporter
 * @param {string} sheetName - Nom de l'onglet (optionnel)
 */
export const exportToExcel = (filename, data, sheetName = 'Données') => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  try {
    // Convertit les données en worksheet
    const ws = XLSX.utils.json_to_sheet(data)
    
    // Définit la largeur des colonnes
    const wscols = []
    if (data.length > 0) {
      const firstRow = data[0]
      Object.keys(firstRow).forEach(key => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => {
            const value = row[key]
            return value !== null && value !== undefined ? String(value).length : 0
          })
        )
        wscols.push({ wch: Math.min(maxLength + 2, 50) })
      })
    }
    ws['!cols'] = wscols

    // Crée le workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Génère le fichier
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    saveAs(blob, `${filename}.xlsx`)
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    throw error
  }
}

/**
 * Exporte un rapport mensuel complet en PDF
 * @param {Object} reportData - Données du rapport
 */
export const exportMonthlyReport = (reportData) => {
  const doc = new jsPDF()
  const { month, properties, payments, statistics } = reportData

  // En-tête
  doc.setFontSize(20)
  doc.text('Rapport Mensuel - Doogoo', 14, 20)
  
  doc.setFontSize(12)
  doc.text(`Période : ${month}`, 14, 30)
  doc.text(
    `Généré le ${formatDate(new Date(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    14,
    38
  )

  let yPos = 50

  // Statistiques
  doc.setFontSize(14)
  doc.text('Statistiques', 14, yPos)
  yPos += 10

  doc.setFontSize(10)
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['Revenu total', formatCurrency(statistics.totalRevenue)],
      ['Taux d\'occupation', `${statistics.occupancyRate}%`],
      ['Paiements reçus', statistics.paidPayments],
      ['Paiements en retard', statistics.latePayments]
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    margin: { top: yPos }
  })

  yPos = doc.lastAutoTable.finalY + 20

  // Paiements
  if (payments && payments.length > 0) {
    doc.setFontSize(14)
    doc.text('Paiements', 14, yPos)
    yPos += 10

    const paymentRows = payments.map(p => [
      p.property || 'N/A',
      p.tenant || 'N/A',
      formatCurrency(p.amount),
      formatDate(p.dueDate),
      p.status === 'paid' ? 'Payé' : p.status === 'pending' ? 'En attente' : 'En retard'
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Bien', 'Locataire', 'Montant', 'Date', 'Statut']],
      body: paymentRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { top: yPos }
    })

    yPos = doc.lastAutoTable.finalY + 20
  }

  // Sauvegarde
  const filename = `rapport_mensuel_${month.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
  doc.save(filename)
}

