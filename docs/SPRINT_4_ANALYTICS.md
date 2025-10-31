# 📊 Sprint 4 : Analytique & Graphiques

## ✅ Fonctionnalités implémentées

### 1. **Installation ApexCharts**
- ✅ `apexcharts` et `vue3-apexcharts` installés
- ✅ Intégration dans le projet

### 2. **Composant BaseChart**
- ✅ `src/components/charts/BaseChart.vue`
- ✅ Support de tous les types de graphiques (bar, line, pie, donut, radialBar)
- ✅ Options personnalisables
- ✅ Formattage automatique des devises et pourcentages
- ✅ État de chargement intégré
- ✅ Design cohérent avec l'application

### 3. **Store Analytics**
- ✅ `src/stores/analyticsStore.js`
- ✅ Calcul des métriques depuis Supabase :
  - **Revenu mensuel** (12 derniers mois)
  - **Revenu par bien** (agrégation)
  - **Taux d'occupation** (%)
  - **Retards de paiement** (comptage)
  - **Revenu total** (somme des paiements payés)
  - **Loyer moyen** (calcul)
  - **Répartition des statuts** (paid, pending, late)

### 4. **Page Statistiques**
- ✅ `src/pages/StatsPage.vue`
- ✅ 4 KPIs (indicateurs clés) :
  - Revenu total
  - Taux d'occupation
  - Paiements en retard
  - Loyer moyen
- ✅ 4 graphiques :
  - **Revenus mensuels** (bar chart - 12 derniers mois)
  - **Taux d'occupation** (radialBar)
  - **Revenus par bien** (bar chart horizontal)
  - **Statut des paiements** (donut chart)
- ✅ Alertes visuelles pour retards de paiement
- ✅ Responsive design
- ✅ États de chargement et d'erreur

### 5. **Navigation**
- ✅ Route `/stats` ajoutée au router
- ✅ Menu "Statistiques" dans la Sidebar
- ✅ Icône graphique dédiée
- ✅ Protection par authentification

---

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers

#### Composants
- `src/components/charts/BaseChart.vue`

#### Stores
- `src/stores/analyticsStore.js`

#### Pages
- `src/pages/StatsPage.vue`

### Fichiers modifiés

#### Router
- `src/router/index.js` : Ajout de la route `/stats`

#### Composants
- `src/components/Sidebar.vue` : Ajout de l'item "Statistiques"

---

## 🎯 Métriques calculées

### Revenu mensuel
- Agrégation des paiements **payés** (`status = 'paid'`)
- Groupement par mois sur les **12 derniers mois**
- Affichage en bar chart avec formatage EUR

### Revenu par bien
- Agrégation des paiements par propriété
- Tri décroissant (bien le plus rentable en premier)
- Bar chart horizontal pour lisibilité

### Taux d'occupation
- Calcul : `(biens occupés / biens totaux) * 100`
- Affichage en radialBar (jauge circulaire)
- Format pourcentage

### Retards de paiement
- Comptage des paiements avec `status = 'late'`
- Alerte visuelle si > 0
- Lien direct vers la page Paiements

### Revenu total
- Somme de tous les paiements payés
- Format EUR

### Loyer moyen
- Moyenne des loyers de tous les biens
- Format EUR

### Répartition des paiements
- Donut chart avec 3 catégories :
  - **Payés** (vert)
  - **En attente** (orange)
  - **En retard** (rouge)

---

## 📊 Types de graphiques utilisés

1. **Bar Chart** (Revenus mensuels, Revenus par bien)
   - Axe X : Mois / Nom du bien
   - Axe Y : Montant en EUR

2. **RadialBar** (Taux d'occupation)
   - Jauge circulaire avec pourcentage
   - Animation fluide

3. **Donut Chart** (Statut des paiements)
   - Secteurs colorés
   - Légende en bas

---

## 🎨 Design & UX

### KPIs Cards
- 4 cartes avec icônes SVG
- Couleurs distinctes (green, blue, red, purple)
- Responsive grid (1/2/4 colonnes selon écran)

### Graphiques
- Fond blanc avec bordure subtile
- Titre descriptif
- Tooltips avec formatage EUR
- Zoom et export intégrés (via ApexCharts toolbar)

### Alertes
- Section rouge pour retards de paiement
- Lien direct vers la page Paiements
- Icône d'avertissement

---

## 🔒 Sécurité

- **Filtrage par user_id** dans toutes les requêtes Supabase
- **Protection de la route** : `meta: { requiresAuth: true }`
- **RLS activé** sur les tables `properties` et `payments`

---

## 📝 Notes techniques

### Nom des colonnes Supabase
- `payments.date` → Non, la colonne s'appelle `due_date` dans Supabase
- Correction appliquée dans `analyticsStore.js`

### Formatage des données
- Utilise `formatCurrency()` de `@/utils/formatters`
- Formatage automatique dans les tooltips ApexCharts
- Locale `fr-FR` pour les dates et devises

### Performance
- Une seule requête Supabase par type de données (payments, properties)
- Calculs côté client pour l'agrégation
- Cache possible via Pinia (les données restent en mémoire)

---

## 🚀 Améliorations futures (v0.3.0+)

- [ ] **Filtres temporels** : Sélection de période (7 jours, 30 jours, 3 mois, 1 an)
- [ ] **Export PDF/Excel** : Générer des rapports
- [ ] **Comparaisons** : Comparer les mois entre eux
- [ ] **Prévisions** : Tendances et projections
- [ ] **Graphiques avancés** :
  - Évolution du taux d'occupation dans le temps
  - Heatmap des paiements
  - Graphique en cascade (waterfall) pour les revenus
- [ ] **Dashboard personnalisable** : Drag & drop des widgets
- [ ] **Notifications automatiques** : Alertes si taux d'occupation < seuil

---

## ✅ Résultat final

- ✅ Page Statistiques complète et fonctionnelle
- ✅ 4 graphiques interactifs avec ApexCharts
- ✅ 4 KPIs clairs et visuels
- ✅ Données dynamiques depuis Supabase
- ✅ Design responsive et professionnel
- ✅ Gestion d'erreurs et états de chargement
- ✅ Navigation intégrée dans l'application

Le Sprint 4 est terminé. L'application dispose maintenant d'un module d'analytique complet avec visualisations claires des données immobilières.

