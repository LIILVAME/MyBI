# 🏠 MyBI - Monitoring de Biens Immobiliers

> Plateforme web moderne pour la supervision et le monitoring de biens immobiliers en temps réel

[![Vue 3](https://img.shields.io/badge/Vue-3.4.21-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/LIILVAME/MyBI/workflows/CI%20-%20Tests%20and%20Linting/badge.svg)](https://github.com/LIILVAME/MyBI/actions)
[![Deploy](https://github.com/LIILVAME/MyBI/workflows/Build%20and%20Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/LIILVAME/MyBI/actions)
[![GitHub Pages](https://img.shields.io/badge/Pages-Live-success)](https://liilvame.github.io/MyBI/)

<div align="center">

**Supervisez vos biens immobiliers depuis une seule plateforme**

[🚀 Démo Live](https://liilvame.github.io/MyBI/) • [📖 Documentation](docs/project_overview.md) • [🤝 Contribuer](CONTRIBUTING.md) • [📝 Changelog](CHANGELOG.md)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#️-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Structure du Projet](#-structure-du-projet)
- [Utilisation](#-utilisation)
- [Design & UX](#-design--ux)
- [Développement](#-développement)
- [Roadmap](#-roadmap)
- [Contribuer](#-contribuer)
- [Documentation](#-documentation)
- [Sécurité](#️-sécurité)
- [Licence](#-licence)

---

## 🎯 À propos

**MyBI** est une application web moderne permettant aux propriétaires et gestionnaires de biens immobiliers de suivre à distance l'état de leurs appartements en location.

### 🎨 Aperçu

<!-- TODO: Ajouter des screenshots du dashboard et de la landing page -->
<!-- 
![Dashboard Preview](docs/screenshots/dashboard.png)
![Landing Page Preview](docs/screenshots/landing.png)
-->

### ✨ Principales capacités

- 📊 **Monitoring en temps réel** : Température, humidité, qualité de l'air, consommation énergétique
- 🔔 **Alertes intelligentes** : Notifications instantanées en cas d'anomalie
- 💰 **Gestion des paiements** : Suivi des loyers et paiements à venir
- 🔒 **Sécurité** : Aperçu des caméras et capteurs de sécurité
- 📱 **Interface responsive** : Accessible sur mobile, tablette et desktop

---

## 🚀 Fonctionnalités

### Landing Page
- Section hero avec message principal et CTA
- Présentation des 4 avantages clés
- Preview de l'interface dashboard
- Témoignages clients
- Footer complet avec contact

### Dashboard
- **Vue d'ensemble** : Statistiques globales (température moyenne, humidité, qualité de l'air, consommation totale)
- **Liste des biens** : Cartes détaillées avec statut (occupé/libre), alertes, métriques environnementales
- **Paiements à venir** : Liste des loyers avec échéances et statuts
- **Sécurité** : Aperçu des caméras avec statut en ligne
- **Navigation** : Sidebar avec menu complet (Dashboard, Biens, Alertes, Paiements, Paramètres)

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **Vue 3** | ^3.4.21 | Framework frontend (Composition API) |
| **Vite** | ^5.2.0 | Build tool et dev server |
| **Vue Router** | ^4.3.0 | Navigation et routing |
| **Tailwind CSS** | ^3.4.3 | Framework CSS utility-first |
| **PostCSS** | ^8.4.38 | Traitement CSS |
| **Autoprefixer** | ^10.4.19 | Préfixes CSS automatiques |

### Architecture

- **Composition API** : Utilisation de `<script setup>` pour une syntaxe moderne
- **Composants modulaires** : Architecture modulaire et réutilisable
- **Données mockées** : JSON local pour la démo (prêt pour intégration API)

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou **yarn** / **pnpm**)

Pour vérifier vos versions :

```bash
node --version  # v18.0.0 ou supérieur
npm --version   # 9.0.0 ou supérieur
```

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/LIILVAME/MyBI.git
cd MyBI
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

### 4. Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

### 5. Prévisualiser le build de production

```bash
npm run preview
```

---

## 📁 Structure du Projet

```
MyBI/
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── Sidebar.vue         # Navigation latérale avec menu
│   │   ├── StatCard.vue        # Carte de statistique réutilisable
│   │   └── PropertyCard.vue    # Carte de bien immobilier
│   ├── pages/                   # Pages de l'application
│   │   ├── LandingPage.vue    # Page d'accueil marketing
│   │   └── DashboardPage.vue  # Tableau de bord principal
│   ├── router/                  # Configuration du routeur Vue
│   │   └── index.js            # Routes de l'application
│   ├── data/                    # Données mockées
│   │   └── mockData.js         # Données de démonstration
│   ├── App.vue                  # Composant racine
│   ├── main.js                  # Point d'entrée de l'application
│   └── style.css                # Styles globaux Tailwind
├── index.html                   # Template HTML principal
├── package.json                 # Dépendances et scripts npm
├── vite.config.js              # Configuration Vite
├── tailwind.config.js          # Configuration Tailwind CSS
├── postcss.config.js           # Configuration PostCSS
└── README.md                   # Documentation du projet
```

### Description des fichiers clés

- **`src/main.js`** : Initialise l'application Vue et configure le routeur
- **`src/router/index.js`** : Définit les routes (`/` pour landing, `/dashboard` pour dashboard)
- **`src/data/mockData.js`** : Contient toutes les données mockées (biens, paiements, stats, témoignages)
- **`src/components/`** : Composants réutilisables pour la construction des pages
- **`tailwind.config.js`** : Configuration du thème (couleurs primaires vertes)

---

## 🎨 Design & UX

### Palette de couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| **Primary** | `#22c55e` (green-500) | Boutons, liens, éléments interactifs |
| **Background** | `#f9fafb` (gray-50) | Fond principal de l'application |
| **Text** | `#111827` (gray-900) | Texte principal |
| **Border** | `#e5e7eb` (gray-200) | Bordures et séparateurs |

### Typographie

- **Police principale** : Inter (Google Fonts)
- **Hiérarchie** : Titres en `font-bold`, texte en `font-medium` ou `font-normal`

### Responsive Design

| Breakpoint | Comportement |
|------------|--------------|
| **Mobile** (< 640px) | Navigation adaptée, grilles en colonne unique, sidebar masquée |
| **Tablet** (640px - 1024px) | Grilles 2 colonnes, sidebar optionnelle |
| **Desktop** (> 1024px) | Layout complet avec sidebar fixe, grilles 3-4 colonnes |

### Composants UI

- **Cards** : Bordures arrondies (`rounded-xl`), ombres légères (`shadow-sm`)
- **Boutons** : Styles primaire et secondaire avec transitions
- **StatCards** : Affichage de métriques avec icônes et tendances

---

## 🚀 Utilisation

### Navigation

| Route | Description |
|-------|-------------|
| `/` | Landing page - Présentation du produit |
| `/dashboard` | Tableau de bord principal - Monitoring des biens |

### Données mockées

Les données sont disponibles dans `src/data/mockData.js` :

```javascript
// Exports disponibles
export const mockProperties      // Array de biens immobiliers
export const mockPayments        // Array de paiements à venir
export const mockGlobalStats     // Objet de statistiques globales
export const mockTestimonials    // Array de témoignages clients
```

**Exemple d'utilisation** :

```javascript
import { mockProperties, mockGlobalStats } from '@/data/mockData'

// Utiliser dans un composant
const properties = ref(mockProperties)
const stats = ref(mockGlobalStats)
```

---

## 💻 Développement

### Scripts disponibles

```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Build de production (optimisé et minifié)
npm run preview  # Prévisualiser le build de production
```

### Architecture des composants

#### Composants réutilisables

- **`StatCard`** : Affiche une métrique avec icône, valeur, label et tendance optionnelle
- **`PropertyCard`** : Carte complète d'un bien avec toutes les métriques
- **`Sidebar`** : Navigation latérale avec menu et état actif

#### Pages

- **`LandingPage`** : Page marketing avec sections hero, features, testimonials
- **`DashboardPage`** : Interface principale de monitoring

### Notes techniques

- **Icônes SVG** : Définies inline dans les composants (pas de dépendance externe)
- **Tailwind Purge** : Purge automatique en production pour réduire la taille CSS
- **Routing** : Vue Router avec history mode (URLs propres sans `#`)
- **API Ready** : Structure prête pour remplacer `mockData.js` par des appels API réels

---

## 🗺️ Roadmap

### Version 0.1.0 (Actuelle) ✅

- [x] Landing page complète
- [x] Dashboard avec statistiques
- [x] Liste des biens immobiliers
- [x] Section paiements
- [x] Aperçu sécurité
- [x] Navigation sidebar
- [x] Design responsive

### Version 0.2.0 (Planifiée)

- [ ] Menu hamburger pour mobile
- [ ] Page détail par bien
- [ ] Graphiques de tendances (Chart.js)
- [ ] Système de notifications toast
- [ ] Filtres et recherche des biens

### Version 0.3.0 (Future)

- [ ] Authentification (JWT)
- [ ] API réelle avec backend
- [ ] WebSockets pour temps réel
- [ ] Mode sombre (dark mode)
- [ ] Export PDF des rapports

---

## 💡 Suggestions d'amélioration UX

### 1. Navigation mobile
- Menu hamburger pour la sidebar sur mobile
- Transition slide-in pour l'ouverture/fermeture
- Overlay pour fermer la sidebar

### 2. Interactivité
- Tooltips sur les cartes de statistiques
- Animation de chargement lors du fetch des données
- Skeleton loaders pour un meilleur feedback visuel

### 3. Filtres et recherche
- Barre de recherche pour filtrer les biens
- Filtres par statut (occupé/libre), ville, type
- Tri par température, consommation, date

### 4. Graphiques et visualisations
- Graphiques de tendances avec [Chart.js](https://www.chartjs.org/) ou [ApexCharts](https://apexcharts.com/)
- Timeline des événements et alertes
- Carte géographique des biens ([Leaflet](https://leafletjs.com/))

### 5. Notifications
- Système de notifications toast pour les alertes
- Badge sur l'icône Alertes dans la sidebar
- Son optionnel pour les alertes critiques

### 6. Détails de bien
- Page dédiée par bien avec historique complet
- Graphiques de consommation sur 30 jours
- Photos et documents associés

### 7. Personnalisation
- Mode sombre (dark mode)
- Personnalisation des seuils d'alertes
- Widgets configurables sur le dashboard

### 8. Accessibilité
- Contraste amélioré pour WCAG AA
- Navigation au clavier complète
- Attributs ARIA sur les éléments interactifs

### 9. Performance
- Lazy loading des images
- Code splitting des routes
- Caching des données mockées

### 10. Intégrations futures
- API réelle avec authentification
- WebSockets pour les mises à jour temps réel
- Export PDF des rapports
- Notifications email/SMS

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer au projet :

> 📖 **Pour plus de détails**, consultez le [Guide de contribution complet](CONTRIBUTING.md)

### 1. Fork le projet

```bash
git clone https://github.com/LIILVAME/MyBI.git
cd MyBI
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 3. Faire vos modifications

- Suivre les conventions de code Vue 3
- Utiliser Composition API avec `<script setup>`
- Ajouter des commentaires pour le code complexe
- Tester vos changements localement

### 4. Commiter vos changements

```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
```

**Convention de commits** : Utiliser [Conventional Commits](https://www.conventionalcommits.org/)

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage
- `refactor:` Refactorisation
- `test:` Tests

### 5. Pousser vers GitHub

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

### 6. Ouvrir une Pull Request

Créer une PR sur GitHub avec :
- Description claire des changements
- Screenshots si UI modifiée
- Référence aux issues liées

### Guidelines

- Code clair et commenté
- Respecter l'architecture existante
- Tester sur mobile et desktop
- Maintenir la cohérence du design

---

## 🔒 Sécurité

Pour la mise en production, les points suivants doivent être implémentés :

### Authentification
- [ ] JWT ou OAuth 2.0
- [ ] Refresh tokens
- [ ] Gestion des sessions

### Validation
- [ ] Validation des données côté serveur
- [ ] Sanitization des inputs
- [ ] Protection CSRF

### Infrastructure
- [ ] HTTPS obligatoire
- [ ] Rate limiting sur les API
- [ ] CORS configuré correctement
- [ ] Headers de sécurité (CSP, HSTS)

### Données
- [ ] Chiffrement des données sensibles
- [ ] Backups réguliers
- [ ] Conformité RGPD

---

## 📄 Licence

Ce projet est sous licence **MIT**.

```
MIT License

Copyright (c) 2024 MyBI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

- **Email** : contact@mybi.fr
- **Issues** : [GitHub Issues](https://github.com/LIILVAME/MyBI/issues)
- **Documentation** : Voir la section [Documentation](#-structure-du-projet)

---

<div align="center">

**Fait avec ❤️ en utilisant Vue 3 et Tailwind CSS**

[⬆ Retour en haut](#-mybi---monitoring-de-biens-immobiliers)

</div>
