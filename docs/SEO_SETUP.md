# 📊 Configuration SEO et Analytics - Doogoo

**Date** : 2025-01-28  
**Statut** : ✅ Optimisations SEO complétées

---

## ✅ Optimisations réalisées

### 1. Métadonnées HTML (`index.html`)
- ✅ Titre optimisé : "Doogoo — Gestion Immobilière Simplifiée et Intelligente"
- ✅ Meta description complète
- ✅ Open Graph (Facebook) complet
- ✅ Twitter Cards
- ✅ Hreflang pour multilingue (FR/EN)
- ✅ Données structurées JSON-LD (SoftwareApplication)
- ✅ Preconnect pour les polices Google

### 2. Métadonnées dynamiques par page
- ✅ Composable `useSEO.js` créé
- ✅ Meta SEO pour toutes les routes principales :
  - `/` : Page d'accueil
  - `/login` : Connexion
  - `/signup` : Inscription
  - `/dashboard` : Tableau de bord
  - `/biens` : Gestion des biens
  - `/paiements` : Suivi des paiements
  - `/locataires` : Gestion des locataires
  - `/stats` : Statistiques
  - `/rapports` : Rapports
  - `/alertes` : Alertes
  - `/parametres` : Paramètres

### 3. Sitemap et Robots.txt
- ✅ `public/sitemap.xml` créé avec toutes les routes principales
- ✅ `public/robots.txt` mis à jour avec le sitemap Vercel
- ✅ Hreflang dans le sitemap

### 4. Structure sémantique
- ✅ Balises `<header>`, `<main>`, `<nav>` avec `aria-label`
- ✅ Logo Doogoo avec lien vers home/dashboard
- ✅ Titres hiérarchiques cohérents

### 5. Images
- ✅ Attributs `alt` descriptifs sur toutes les images
- ✅ Lazy-loading activé (`loading="lazy"`)

### 6. Accessibilité
- ✅ `aria-label` sur boutons et liens
- ✅ `aria-expanded` sur menu mobile
- ✅ Traductions pour `openMenu`/`closeMenu`

### 7. Performance
- ✅ Code splitting (vue-vendor, apexcharts, supabase)
- ✅ CSS code splitting
- ✅ Noms de fichiers avec hash pour le cache
- ✅ Manual chunks pour améliorer le cache

---

## 📊 Configuration Analytics (Optionnel)

### Google Analytics 4

**Avantages** :
- Gratuit
- Intégration avec Google Search Console
- Tracking détaillé des événements

**Configuration** :

1. **Créer un compte Google Analytics 4** :
   - Aller sur [Google Analytics](https://analytics.google.com/)
   - Créer une propriété pour `doogoo.vercel.app`
   - Récupérer le **MEASUREMENT_ID** (format : `G-XXXXXXXXXX`)

2. **Ajouter les variables d'environnement dans Vercel** :
   ```
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_ENABLE_ANALYTICS=true
   ```

3. **Redéployer l'application**

**Événements trackés automatiquement** :
- Pages visitées (via router)
- Connexion utilisateur
- Déconnexion utilisateur
- Ajout/modification/suppression de biens
- Ajout/modification/suppression de paiements
- Changement de langue/devise

**Utilisation manuelle dans le code** :
```javascript
import { trackDoogooEvent, DoogooEvents } from '@/utils/analytics'

// Track un événement personnalisé
trackDoogooEvent(DoogooEvents.PROPERTY_ADDED, {
  property_type: 'appartement',
  rent_amount: 800
})
```

---

### Plausible Analytics (Alternative respectueuse de la vie privée)

**Avantages** :
- ✅ Respect de la vie privée (RGPD compliant)
- ✅ Pas de cookies
- ✅ Interface simple et claire
- ✅ Open source

**Configuration** :

1. **S'abonner à Plausible** :
   - Aller sur [Plausible.io](https://plausible.io/)
   - Créer un compte et ajouter le site `doogoo.vercel.app`

2. **Ajouter les variables d'environnement dans Vercel** :
   ```
   VITE_PLAUSIBLE_DOMAIN=doogoo.vercel.app
   VITE_ENABLE_ANALYTICS=true
   ```

3. **Redéployer l'application**

**Note** : Plausible est une alternative à Google Analytics, vous pouvez utiliser l'un ou l'autre (ou les deux).

---

## 🔍 Vérifications SEO recommandées

### 1. Google Lighthouse

**Test local** :
```bash
npm run build
npm run preview
# Ouvrir Chrome DevTools > Lighthouse > Run audit
```

**Objectifs** :
- ✅ Performance : ≥ 90
- ✅ SEO : ≥ 90
- ✅ Accessibility : ≥ 90
- ✅ Best Practices : ≥ 90

**Test en production** :
- Aller sur [PageSpeed Insights](https://pagespeed.web.dev/)
- Entrer l'URL : `https://doogoo.vercel.app`
- Vérifier les scores SEO

---

### 2. Google Search Console

1. **Créer un compte** :
   - Aller sur [Google Search Console](https://search.google.com/search-console)
   - Ajouter la propriété `doogoo.vercel.app`

2. **Vérifier la propriété** :
   - Méthode recommandée : Ajouter un enregistrement TXT dans les DNS
   - Ou utiliser la méthode "Balise HTML" (ajout dans `index.html`)

3. **Soumettre le sitemap** :
   - Aller dans "Sitemaps"
   - Ajouter : `https://doogoo.vercel.app/sitemap.xml`
   - Google indexera automatiquement les pages

4. **Vérifier l'indexation** :
   - Aller dans "Couverture"
   - Vérifier que les pages principales sont indexées
   - Corriger les erreurs éventuelles

---

### 3. Données structurées (Rich Snippets)

**Tester les données structurées** :
- Aller sur [Google Rich Results Test](https://search.google.com/test/rich-results)
- Entrer l'URL : `https://doogoo.vercel.app`
- Vérifier que le JSON-LD est correctement parsé

**Vérifier dans le code source** :
```bash
curl https://doogoo.vercel.app | grep -A 50 "application/ld+json"
```

---

### 4. Open Graph et Twitter Cards

**Tester Open Graph** :
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Entrer l'URL : `https://doogoo.vercel.app`
- Vérifier l'aperçu du partage

**Tester Twitter Cards** :
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Entrer l'URL : `https://doogoo.vercel.app`
- Vérifier l'aperçu de la carte

---

## 📈 Suivi des performances

### Métriques importantes à surveiller

1. **Indexation Google** :
   - Nombre de pages indexées (Google Search Console)
   - Temps de crawl
   - Erreurs d'indexation

2. **Trafic organique** :
   - Nombre de sessions organiques (Google Analytics)
   - Taux de rebond
   - Pages les plus visitées

3. **Performance** :
   - Core Web Vitals (LCP, FID, CLS)
   - Temps de chargement des pages
   - Score Lighthouse

4. **Conversions** :
   - Taux d'inscription
   - Pages visitées par session
   - Temps moyen sur le site

---

## 🎯 Prochaines étapes recommandées

1. ✅ **Configuration Analytics** (Google Analytics 4 ou Plausible)
2. ✅ **Soumission du sitemap** dans Google Search Console
3. ✅ **Vérification Lighthouse** (objectif SEO ≥ 90)
4. ✅ **Test des données structurées** avec Google Rich Results Test
5. ✅ **Monitoring régulier** des métriques SEO

---

## 📝 Notes importantes

- Les analytics sont **désactivés par défaut** (respect de la vie privée)
- Pour activer : Définir `VITE_ENABLE_ANALYTICS=true` dans les variables d'environnement Vercel
- Le tracking est **opt-in** : Les utilisateurs doivent accepter les cookies (si applicable)
- Toutes les données sont **anonymisées** (IP anonymisée pour Google Analytics)

---

**✅ L'application Doogoo est maintenant optimisée pour le SEO et prête pour l'indexation par Google !**

