#!/bin/bash

# Script de validation PWA rapide pour Vylo
# Vérifie les éléments essentiels sans exécuter Lighthouse complet

set -e

PREVIEW_URL="${1:-http://localhost:4173}"
REPORT_FILE="docs/PWA_VALIDATION_REPORT.md"

echo "🔍 Validation PWA Vylo"
echo "======================"
echo ""

# Vérifier que le serveur est accessible
if ! curl -s "$PREVIEW_URL" > /dev/null; then
  echo "❌ Erreur: Le serveur n'est pas accessible à $PREVIEW_URL"
  echo "   Lancez: npm run preview"
  exit 1
fi

echo "✅ Serveur accessible"
echo ""

# Vérifier le manifest
echo "📱 Vérification du manifest..."
MANIFEST=$(curl -s "$PREVIEW_URL/manifest.webmanifest")
if [ -z "$MANIFEST" ]; then
  echo "   ❌ Manifest introuvable"
  exit 1
fi

echo "$MANIFEST" | jq -r '.name' > /dev/null 2>&1 || {
  echo "   ❌ Manifest invalide (JSON)"
  exit 1
}

NAME=$(echo "$MANIFEST" | jq -r '.name')
SHORT_NAME=$(echo "$MANIFEST" | jq -r '.short_name')
START_URL=$(echo "$MANIFEST" | jq -r '.start_url')
DISPLAY=$(echo "$MANIFEST" | jq -r '.display')
ICON_COUNT=$(echo "$MANIFEST" | jq '.icons | length')

echo "   ✅ Nom: $NAME"
echo "   ✅ Short name: $SHORT_NAME"
echo "   ✅ Start URL: $START_URL"
echo "   ✅ Display: $DISPLAY"
echo "   ✅ Icônes: $ICON_COUNT"

# Vérifier le service worker
echo ""
echo "⚙️  Vérification du Service Worker..."
SW=$(curl -s "$PREVIEW_URL/sw.js")
if [ -z "$SW" ]; then
  echo "   ❌ Service Worker introuvable"
  exit 1
fi

echo "   ✅ Service Worker présent ($(echo "$SW" | wc -c | xargs) bytes)"

# Vérifier les icônes
echo ""
echo "🖼️  Vérification des icônes..."
ICON_SIZES=(72 96 128 144 152 192 384 512)
MISSING=0

for size in "${ICON_SIZES[@]}"; do
  if curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL/icons/icon-${size}x${size}.png" | grep -q "200"; then
    echo "   ✅ icon-${size}x${size}.png"
  else
    echo "   ❌ icon-${size}x${size}.png manquante"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "⚠️  $MISSING icône(s) manquante(s)"
else
  echo ""
  echo "✅ Toutes les icônes sont présentes"
fi

echo ""
echo "📊 Résumé de validation:"
echo "   ✅ Manifest: OK"
echo "   ✅ Service Worker: OK"
if [ $MISSING -eq 0 ]; then
  echo "   ✅ Icônes: OK"
else
  echo "   ⚠️  Icônes: $MISSING manquante(s)"
fi

echo ""
echo "💡 Pour un audit complet avec Lighthouse:"
echo "   npm run audit:lighthouse"

