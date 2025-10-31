# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [0.1.0] - 2024-12-04

### 🎉 Version initiale

#### Ajouté
- **Landing Page** complète avec sections hero, fonctionnalités, témoignages et footer
- **Dashboard** avec vue d'ensemble des statistiques (température, humidité, qualité de l'air, consommation)
- **Liste des biens immobiliers** avec cartes détaillées et statuts (occupé/libre)
- **Section paiements à venir** avec échéances et statuts
- **Aperçu sécurité** avec statut des caméras
- **Sidebar de navigation** avec menu complet (Dashboard, Biens, Alertes, Paiements, Paramètres)
- **Composants réutilisables** : `Sidebar`, `StatCard`, `PropertyCard`
- **Données mockées** complètes pour la démonstration
- **Design responsive** (mobile, tablette, desktop)
- **Configuration Tailwind CSS** avec thème personnalisé (couleurs primaires vertes)
- **Vue Router** avec navigation entre landing et dashboard
- **README complet** avec documentation, roadmap et guidelines de contribution
- **Structure CI/CD** avec GitHub Actions pour déploiement automatique

#### Documentation
- README professionnel avec badges, table des matières et instructions complètes
- CHANGELOG pour suivre les versions
- CONTRIBUTING.md avec guidelines pour contributeurs
- CODE_OF_CONDUCT.md pour maintenir un environnement respectueux
- Documentation technique dans `docs/`

---

## [0.2.0] - Planifié

### Prévu
- [ ] Menu hamburger pour navigation mobile
- [ ] Page détail par bien immobilier
- [ ] Graphiques de tendances avec Chart.js ou ApexCharts
- [ ] Système de notifications toast pour les alertes
- [ ] Badge sur l'icône Alertes dans la sidebar
- [ ] Filtres et recherche des biens
- [ ] Tri par température, consommation, date
- [ ] Skeleton loaders pour améliorer le feedback visuel
- [ ] Tooltips sur les cartes de statistiques

---

## [0.3.0] - Planifié

### Prévu
- [ ] Authentification avec JWT ou OAuth 2.0
- [ ] API réelle avec backend (remplacement de mockData.js)
- [ ] WebSockets pour mises à jour en temps réel
- [ ] Gestion des sessions utilisateur
- [ ] Refresh tokens
- [ ] Protection CSRF
- [ ] Rate limiting sur les API

---

## [0.4.0] - Planifié

### Prévu
- [ ] Export PDF des rapports
- [ ] Notifications email/SMS
- [ ] Mode sombre (dark mode)
- [ ] Personnalisation des seuils d'alertes
- [ ] Widgets configurables sur le dashboard
- [ ] Timeline des événements et alertes
- [ ] Carte géographique des biens (Leaflet)
- [ ] Graphiques de consommation sur 30 jours par bien
- [ ] Upload de photos et documents par bien

---

## [0.5.0] - Planifié

### Prévu
- [ ] Multi-langues (i18n)
- [ ] Accessibilité améliorée (WCAG AA)
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Performance optimisations (lazy loading, code splitting)
- [ ] PWA (Progressive Web App)
- [ ] Application mobile (React Native ou Capacitor)

---

## Types de changements

- `Ajouté` pour les nouvelles fonctionnalités
- `Modifié` pour les changements dans les fonctionnalités existantes
- `Déprécié` pour les fonctionnalités qui seront bientôt supprimées
- `Supprimé` pour les fonctionnalités supprimées
- `Corrigé` pour les corrections de bugs
- `Sécurité` pour les vulnérabilités

[0.1.0]: https://github.com/votre-username/mybi/releases/tag/v0.1.0

