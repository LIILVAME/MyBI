#!/bin/bash

# Script d'audit PWA complet pour Vylo
# Usage: ./scripts/audit-pwa.sh

set -e

echo "🚀 Audit PWA Vylo"
echo "=================="
echo ""

# Créer le dossier audits s'il n'existe pas
AUDITS_DIR="docs/audits"
mkdir -p "$AUDITS_DIR"

# Date pour le nom de fichier
DATE=$(date +%Y%m%d-%H%M%S)
REPORT_HTML="$AUDITS_DIR/lighthouse-$DATE.html"
REPORT_JSON="$AUDITS_DIR/lighthouse-$DATE.json"

# URL de preview (par défaut)
PREVIEW_URL="${1:-http://localhost:4173}"

echo "📊 Étape 1: Build de production..."
npm run build

echo ""
echo "📊 Étape 2: Démarrage du serveur de preview..."
npm run preview > /tmp/vite-preview.log 2>&1 &
PREVIEW_PID=$!

# Attendre que le serveur soit prêt
echo "⏳ Attente du serveur de preview..."
sleep 5

# Vérifier que le serveur répond
if ! curl -s "$PREVIEW_URL" > /dev/null; then
  echo "❌ Erreur: Le serveur de preview n'est pas accessible à $PREVIEW_URL"
  kill $PREVIEW_PID 2>/dev/null || true
  exit 1
fi

echo "✅ Serveur prêt à $PREVIEW_URL"
echo ""

# Vérifier si Lighthouse est installé
if ! command -v lighthouse &> /dev/null; then
  echo "⚠️  Lighthouse n'est pas installé globalement"
  echo "   Installation avec npm..."
  npm install -g lighthouse || {
    echo "❌ Impossible d'installer Lighthouse globalement"
    echo "   Utilisation de npx..."
    LIGHTHOUSE_CMD="npx lighthouse"
  }
else
  LIGHTHOUSE_CMD="lighthouse"
fi

echo ""
echo "📊 Étape 3: Exécution de Lighthouse..."
echo "   URL: $PREVIEW_URL"
echo "   Rapport HTML: $REPORT_HTML"
echo "   Rapport JSON: $REPORT_JSON"
echo ""

# Exécuter Lighthouse
$LIGHTHOUSE_CMD "$PREVIEW_URL" \
  --output=html,json \
  --output-path="$AUDITS_DIR/lighthouse-$DATE" \
  --chrome-flags="--headless --no-sandbox" \
  --view=false \
  --quiet=false

# Renommer les fichiers générés
if [ -f "$AUDITS_DIR/lighthouse-$DATE.html" ]; then
  mv "$AUDITS_DIR/lighthouse-$DATE.html" "$REPORT_HTML"
fi
if [ -f "$AUDITS_DIR/lighthouse-$DATE.json" ]; then
  mv "$AUDITS_DIR/lighthouse-$DATE.json" "$REPORT_JSON"
fi

echo ""
echo "✅ Audit terminé !"
echo "   📄 HTML: $REPORT_HTML"
echo "   📊 JSON: $REPORT_JSON"
echo ""

# Extraire les scores du rapport JSON
if [ -f "$REPORT_JSON" ]; then
  echo "📊 Scores Lighthouse:"
  echo ""
  
  # Extraire les scores (nécessite jq ou Node.js)
  if command -v jq &> /dev/null; then
    PERFORMANCE=$(jq -r '.categories.performance.score * 100' "$REPORT_JSON" 2>/dev/null || echo "N/A")
    ACCESSIBILITY=$(jq -r '.categories.accessibility.score * 100' "$REPORT_JSON" 2>/dev/null || echo "N/A")
    BEST_PRACTICES=$(jq -r '.categories["best-practices"].score * 100' "$REPORT_JSON" 2>/dev/null || echo "N/A")
    SEO=$(jq -r '.categories.seo.score * 100' "$REPORT_JSON" 2>/dev/null || echo "N/A")
    PWA=$(jq -r '.categories.pwa.score * 100' "$REPORT_JSON" 2>/dev/null || echo "N/A")
    
    echo "   Performance:      $PERFORMANCE"
    echo "   Accessibilité:    $ACCESSIBILITY"
    echo "   Bonnes pratiques: $BEST_PRACTICES"
    echo "   SEO:              $SEO"
    echo "   PWA:              $PWA"
    echo ""
  else
    echo "   (Installez 'jq' pour afficher les scores automatiquement)"
    echo "   Ou ouvrez $REPORT_HTML dans votre navigateur"
  fi
fi

# Arrêter le serveur de preview
echo "🛑 Arrêt du serveur de preview..."
kill $PREVIEW_PID 2>/dev/null || true

echo ""
echo "✅ Audit terminé !"
echo "   Ouvrez $REPORT_HTML dans votre navigateur pour voir les détails"

