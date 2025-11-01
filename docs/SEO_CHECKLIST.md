# ✅ Checklist SEO - Doogoo

**Date** : 2025-01-28  
**Statut** : Optimisations SEO et Analytics complétées

---

## 📋 Checklist Technique

### Métadonnées HTML
- [x] Titre optimisé dans `index.html`
- [x] Meta description complète
- [x] Meta keywords
- [x] Open Graph (Facebook) complet
- [x] Twitter Cards complet
- [x] Hreflang pour multilingue (FR/EN)
- [x] Données structurées JSON-LD (SoftwareApplication)
- [x] Canonical URL
- [x] Favicon et icônes PWA configurées

### Métadonnées Dynamiques
- [x] Composable `useSEO.js` créé
- [x] Meta SEO pour toutes les routes principales
- [x] Mise à jour automatique du titre et description par route
- [x] Hreflang dynamiques par page

### Structure Sémantique
- [x] Balises `<header>`, `<main>`, `<nav>` avec `aria-label`
- [x] Logo Doogoo avec lien vers home/dashboard
- [x] Titres hiérarchiques cohérents (h1, h2, h3)
- [x] Structure HTML sémantique sur toutes les pages

### Images
- [x] Attributs `alt` descriptifs sur toutes les images
- [x] Lazy-loading activé (`loading="lazy"`)
- [x] Images optimisées pour le web

### Accessibilité
- [x] `aria-label` sur boutons et liens
- [x] `aria-expanded` sur menu mobile
- [x] Labels sur formulaires
- [x] Navigation clavier fonctionnelle
- [x] Contraste texte/fond vérifié

### Performance
- [x] Code splitting (vue-vendor, apexcharts, supabase)
- [x] CSS code splitting
- [x] Noms de fichiers avec hash pour le cache
- [x] Manual chunks configurés
- [x] Preconnect pour les polices Google

### Sitemap et Robots.txt
- [x] `sitemap.xml` créé avec toutes les routes
- [x] Hreflang dans le sitemap
- [x] `robots.txt` mis à jour avec sitemap Vercel
- [x] Pages de dev exclues du sitemap

### Analytics
- [x] Support Google Analytics 4
- [x] Support Plausible Analytics
- [x] Tracking automatique des pages vues
- [x] Tracking événements utilisateur (login, signup, etc.)
- [x] Tracking événements métier (propriétés, paiements)
- [x] Documentation complète

---

## 🔍 Vérifications Requises (À faire manuellement)

### Google Search Console
- [ ] Créer un compte Google Search Console
- [ ] Vérifier la propriété `doogoo.vercel.app`
- [ ] Soumettre le sitemap : `https://doogoo.vercel.app/sitemap.xml`
- [ ] Vérifier l'indexation des pages principales
- [ ] Corriger les erreurs d'indexation éventuelles

### Google Lighthouse
- [ ] Tester en local : `npm run build && npm run preview`
- [ ] Lancer un audit Lighthouse (objectif SEO ≥ 90)
- [ ] Tester en production : [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Vérifier les Core Web Vitals (LCP, FID, CLS)
- [ ] Corriger les problèmes identifiés

### Données Structurées
- [ ] Tester avec [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Vérifier que le JSON-LD est correctement parsé
- [ ] Vérifier l'aperçu des rich snippets

### Partage Social
- [ ] Tester Open Graph avec [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Tester Twitter Cards avec [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Vérifier les aperçus de partage

### Analytics (Optionnel)
- [ ] Configurer Google Analytics 4 (voir `docs/ANALYTICS_SETUP.md`)
- [ ] OU configurer Plausible Analytics
- [ ] Vérifier que les événements sont trackés correctement
- [ ] Vérifier les dashboards analytics

---

## 📊 Métriques Cibles

### Google Lighthouse
- [ ] **Performance** : ≥ 90
- [ ] **SEO** : ≥ 90
- [ ] **Accessibility** : ≥ 90
- [ ] **Best Practices** : ≥ 90

### Core Web Vitals
- [ ] **LCP** (Largest Contentful Paint) : < 2.5s
- [ ] **FID** (First Input Delay) : < 100ms
- [ ] **CLS** (Cumulative Layout Shift) : < 0.1

### Indexation Google
- [ ] Toutes les pages principales indexées
- [ ] Sitemap soumis et validé
- [ ] Aucune erreur d'indexation

---

## 📝 Notes

- Les optimisations techniques sont **complétées** ✅
- Les vérifications manuelles nécessitent l'accès aux outils Google
- Les analytics sont **désactivés par défaut** (respect de la vie privée)
- Pour activer les analytics : Configurer les variables d'environnement dans Vercel

---

**✅ Toutes les optimisations SEO techniques sont complétées !**

Les vérifications manuelles peuvent être effectuées après déploiement en production.

