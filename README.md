# 🏠 MyBI - Monitoring Immobilier

> Plateforme web temps réel pour la gestion locative et le suivi des paiements

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/LIILVAME/MyBI/releases)
[![Vue 3](https://img.shields.io/badge/Vue-3.4.21-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">

**Supervisez vos biens immobiliers depuis une seule plateforme en temps réel**

[🚀 Démo Live](https://liilvame.github.io/MyBI/) • [📖 Documentation](docs/project_overview.md) • [🤝 Contribuer](CONTRIBUTING.md) • [📝 Changelog](CHANGELOG.md)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#️-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration Supabase](#-configuration-supabase)
- [Structure du Projet](#-structure-du-projet)
- [Utilisation](#-utilisation)
- [Design & UX](#-design--ux)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Documentation](#-documentation)
- [Sécurité](#️-sécurité)
- [Roadmap](#-roadmap)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

## 🎯 À propos

**MyBI** est une application web moderne permettant aux propriétaires et gestionnaires de biens immobiliers de suivre à distance leurs appartements en location, gérer leurs locataires et suivre les paiements en temps réel.

### ✨ Principales capacités

- 📊 **Monitoring en temps réel** : Synchronisation automatique des données via Supabase Realtime
- 🔔 **Alertes intelligentes** : Notifications instantanées en cas de paiements en retard ou départs de locataires
- 💰 **Gestion des paiements** : Suivi des loyers et paiements à venir avec statistiques automatiques
- 🔒 **Sécurité** : Authentification Supabase avec Row Level Security (RLS) sur toutes les tables
- 📱 **Interface responsive** : Accessible sur mobile, tablette et desktop
- 📈 **Analytics** : Graphiques ApexCharts pour visualiser les revenus et taux d'occupation

---

## 🚀 Fonctionnalités v0.2.0

### 🏠 Dashboard

- Vue d'ensemble des biens, locataires, paiements et revenus
- Statistiques globales en temps réel (nombre de biens, taux d'occupation, revenus totaux)
- Ajout rapide de biens via modal
- Synchronisation temps réel entre toutes les pages via Supabase Realtime
- Liste des paiements à venir avec statuts (payé, en attente, en retard)

### 🏘️ Biens Immobiliers

- **CRUD complet** : Ajouter, modifier, supprimer des biens
- Filtres dynamiques par statut (occupés/libres) et recherche par nom/ville
- Affichage des locataires associés à chaque bien
- Statut automatique basé sur la présence de locataires
- Cartes visuelles avec toutes les informations essentielles

### 💰 Paiements

- Suivi complet des paiements locatifs avec historique
- Ajout de nouveaux paiements avec montant, date d'échéance, statut
- Statistiques automatiques (revenus mensuels, paiements payés/en attente)
- Filtres par statut (payé, en attente, en retard)
- Synchronisation temps réel des modifications

### 👥 Locataires

- Suivi des locataires liés à chaque bien immobilier
- Ajout automatique lors de la création d'un bien occupé
- Informations détaillées (date d'entrée, date de sortie, statut de paiement)
- Filtres par statut (à jour, en retard)
- Gestion des départs et arrivées

### ⚙️ Paramètres

- Gestion du profil utilisateur (nom, email, téléphone, entreprise)
- Modification des informations personnelles via Supabase
- Déconnexion sécurisée avec persistance de session
- Préparation pour intégration multi-comptes (v0.3.0)

### 📊 Statistiques & Analytics

- Graphiques ApexCharts interactifs :
  - **Revenus mensuels** : Évolution des revenus sur les 12 derniers mois
  - **Taux d'occupation** : Pourcentage de biens occupés vs libres
  - **Statut des paiements** : Répartition (payé, en attente, en retard)
  - **Répartition par bien** : Revenus par bien immobilier

### 🔔 Alertes

- Détection automatique des paiements en retard
- Alertes pour départs de locataires à venir
- Notifications visuelles via toast system
- Page dédiée pour consulter toutes les alertes

### 📄 Rapports

- Génération de rapports mensuels (PDF/Excel)
- Export des données des biens, locataires et paiements
- Historique complet des transactions

---

## 🛠️ Stack Technique

| Côté | Technologie | Version | Usage |
|------|-------------|---------|-------|
| **Frontend** | Vue 3 (Composition API) | ^3.4.21 | SPA responsive avec Tailwind CSS |
| **État global** | Pinia | ^3.0.3 | 8 stores modulaires (auth, properties, payments, tenants, etc.) |
| **Backend** | Supabase | - | Auth, Realtime, RLS, PostgreSQL, Edge Functions |
| **Charts** | ApexCharts | ^5.3.5 | Visualisations des revenus et taux d'occupation |
| **Build** | Vite | ^5.2.0 | Build tool rapide & optimisé |
| **Routing** | Vue Router | ^4.3.0 | Navigation SPA avec guards d'authentification |
| **Styling** | Tailwind CSS | ^3.4.3 | Framework CSS utility-first |
| **Exports** | jsPDF + xlsx | ^3.0.3 | Génération de rapports PDF/Excel |
| **Hébergement** | GitHub Pages / Netlify | - | Config base `/MyBI/` prête |

### Architecture

- **Composition API** : Utilisation de `<script setup>` pour une syntaxe moderne
- **Composants modulaires** : Architecture modulaire et réutilisable
- **Stores Pinia** : Gestion d'état centralisée et réactive
- **Supabase Realtime** : Synchronisation automatique des données entre clients
- **Row Level Security** : Sécurité au niveau base de données avec `auth.uid()`

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou **yarn** / **pnpm**)
- **Compte Supabase** : [https://supabase.com](https://supabase.com)

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

### 3. Configuration Supabase

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Puis configurez vos variables d'environnement dans `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

> 📖 **Instructions détaillées** : Voir [Configuration Supabase](#-configuration-supabase) ci-dessous.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

### 5. Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

### 6. Prévisualiser le build de production

```bash
npm run preview
```

---

## ⚙️ Configuration Supabase

### 1. Créer un projet Supabase

1. Connectez-vous sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon public key**

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici

# Optionnel : Pour les Edge Functions et tests locaux
# SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

### 3. Appliquer les migrations SQL

Les migrations SQL sont disponibles dans `supabase/migrations/` :

1. Via Supabase Dashboard :
   - Allez dans **SQL Editor**
   - Copiez-collez le contenu de `supabase/migrations/20251031194132_remote_schema.sql`
   - Exécutez la requête

2. Via Supabase CLI (recommandé) :
   ```bash
   npx supabase link --project-ref votre-project-ref
   npx supabase db push
   ```

### 4. Vérifier les tables créées

Dans Supabase Dashboard → **Table Editor**, vous devriez voir :

- ✅ `properties` - Biens immobiliers
- ✅ `tenants` - Locataires
- ✅ `payments` - Paiements
- ✅ `profiles` - Profils utilisateurs

### 5. Vérifier les politiques RLS

Les **Row Level Security (RLS)** sont activées sur toutes les tables :

- Les utilisateurs ne voient que leurs propres données (`auth.uid() = user_id`)
- Les utilisateurs ne peuvent modifier que leurs propres données

📖 **Documentation complète** : Voir [docs/SUPABASE_INTEGRATION.md](docs/SUPABASE_INTEGRATION.md)

---

## 📁 Structure du Projet

```
MyBI/
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── common/             # Composants communs (Toast, Loaders, Skeletons)
│   │   ├── dashboard/          # Composants du dashboard
│   │   ├── properties/         # Composants pour les biens
│   │   ├── tenants/            # Composants pour les locataires
│   │   ├── payments/           # Composants pour les paiements
│   │   ├── charts/             # Composants graphiques (BaseChart)
│   │   └── settings/           # Composants de paramètres
│   ├── pages/                  # Pages de l'application
│   │   ├── LandingPage.vue    # Page d'accueil marketing
│   │   ├── LoginPage.vue      # Authentification (login/signup)
│   │   ├── DashboardPage.vue  # Tableau de bord principal
│   │   ├── BiensPage.vue      # Gestion des biens
│   │   ├── LocatairesPage.vue # Gestion des locataires
│   │   ├── PaiementsPage.vue  # Gestion des paiements
│   │   ├── StatsPage.vue      # Statistiques et graphiques
│   │   ├── AlertsPage.vue     # Alertes et notifications
│   │   ├── ReportsPage.vue    # Rapports et exports
│   │   └── ParametresPage.vue # Paramètres utilisateur
│   ├── stores/                 # Stores Pinia
│   │   ├── authStore.js       # Authentification Supabase
│   │   ├── propertiesStore.js # Gestion des biens
│   │   ├── paymentsStore.js   # Gestion des paiements
│   │   ├── tenantsStore.js    # Gestion des locataires
│   │   ├── analyticsStore.js  # Analytics et statistiques
│   │   ├── alertsStore.js     # Alertes
│   │   ├── reportsStore.js    # Rapports
│   │   └── toastStore.js      # Notifications toast
│   ├── router/                 # Configuration du routeur Vue
│   │   └── index.js            # Routes avec guards d'authentification
│   ├── lib/                    # Bibliothèques externes
│   │   └── supabaseClient.js  # Client Supabase configuré
│   ├── composables/            # Composables Vue réutilisables
│   │   └── useRealtime.js     # Hook pour Supabase Realtime
│   ├── utils/                  # Utilitaires
│   │   ├── formatters.js      # Formatage de données (devises, dates)
│   │   ├── constants.js       # Constantes de l'application
│   │   └── exportUtils.js     # Utilitaires d'export (PDF/Excel)
│   ├── data/                   # Données mockées (uniquement landing page)
│   │   └── mockData.js        # Témoignages pour la landing page
│   ├── App.vue                 # Composant racine
│   ├── main.js                 # Point d'entrée de l'application
│   └── style.css               # Styles globaux Tailwind
├── supabase/
│   ├── migrations/             # Migrations SQL
│   │   └── 20251031194132_remote_schema.sql
│   └── functions/              # Supabase Edge Functions
│       ├── checkAlerts/       # Fonction pour vérifier les alertes
│       └── generateMonthlyReport/ # Fonction pour générer les rapports
├── docs/                       # Documentation du projet
│   ├── AUDIT_360_PRE_RELEASE_v0.2.0.md
│   ├── SUPABASE_INTEGRATION.md
│   ├── SPRINT_3_REALTIME_UX.md
│   ├── SPRINT_4_ANALYTICS.md
│   └── ...
├── public/                     # Assets statiques
├── index.html                  # Template HTML principal
├── package.json                # Dépendances et scripts npm
├── vite.config.js             # Configuration Vite
├── tailwind.config.js         # Configuration Tailwind CSS
├── postcss.config.js          # Configuration PostCSS
├── .env.example               # Exemple de variables d'environnement
└── README.md                  # Documentation du projet
```

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
- **Skeletons** : Loading states avec animations
- **Toasts** : Notifications utilisateur avec feedback visuel
- **Modals** : Overlays avec fermeture ESC et focus trap

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

- **`Sidebar`** : Navigation latérale avec menu hamburger responsive
- **`StatCard`** : Affiche une métrique avec icône, valeur, label
- **`SkeletonCard`** : Loading state pour les cartes de biens
- **`InlineLoader`** : Loader inline pour les refreshes
- **`Toast`** : Système de notifications toast global
- **`BaseChart`** : Wrapper ApexCharts avec gestion d'erreurs

#### Pages

- **`LandingPage`** : Page marketing avec sections hero, features, testimonials
- **`LoginPage`** : Authentification (login + signup) avec Supabase Auth
- **`DashboardPage`** : Interface principale de monitoring avec temps réel
- **`BiensPage`** : CRUD complet des biens avec filtres et recherche
- **`PaiementsPage`** : Gestion des paiements avec statistiques
- **`LocatairesPage`** : Gestion des locataires liés aux biens
- **`StatsPage`** : Analytics avec graphiques ApexCharts
- **`AlertsPage`** : Alertes et notifications
- **`ReportsPage`** : Rapports et exports PDF/Excel
- **`ParametresPage`** : Paramètres utilisateur et profil

### Notes techniques

- **Icônes SVG** : Définies inline dans les composants (pas de dépendance externe)
- **Tailwind Purge** : Purge automatique en production pour réduire la taille CSS
- **Routing** : Vue Router avec history mode (URLs propres sans `#`)
- **Temps réel** : Supabase Realtime pour synchronisation automatique
- **Authentification** : Supabase Auth avec persistance de session

---

## 🚀 Déploiement

### GitHub Pages

1. **Activer GitHub Pages** :
   - Settings → Pages → Source → **GitHub Actions**

2. **Workflow automatique** :
   - Le workflow `deploy.yml` build et déploie automatiquement
   - Base path : `/MyBI/` (configuré dans `vite.config.js`)

3. **URL de déploiement** :
   - [https://liilvame.github.io/MyBI/](https://liilvame.github.io/MyBI/)

### Netlify (optionnel)

1. **Connecter le repository** :
   - Connectez `LIILVAME/MyBI` sur Netlify

2. **Configuration** :
   - Build command : `npm run build`
   - Publish directory : `dist/`
   - Base directory : `/` (racine)

3. **Variables d'environnement** :
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans Netlify Dashboard

---

## 📚 Documentation

### Documentation technique

- **[AUDIT_360_PRE_RELEASE_v0.2.0.md](docs/AUDIT_360_PRE_RELEASE_v0.2.0.md)** : Audit complet pré-publication
- **[SUPABASE_INTEGRATION.md](docs/SUPABASE_INTEGRATION.md)** : Guide d'intégration Supabase
- **[SPRINT_3_REALTIME_UX.md](docs/SPRINT_3_REALTIME_UX.md)** : Documentation temps réel
- **[SPRINT_4_ANALYTICS.md](docs/SPRINT_4_ANALYTICS.md)** : Documentation analytics
- **[CHECKLIST_PRODUCTION.md](docs/CHECKLIST_PRODUCTION.md)** : Checklist de production

### Documentation utilisateur

- **[project_overview.md](docs/project_overview.md)** : Vue d'ensemble du projet
- **[CHANGELOG.md](CHANGELOG.md)** : Journal des modifications

---

## 🔒 Sécurité

### Authentification

- ✅ **Supabase Auth** : Authentification email + mot de passe
- ✅ **Sessions persistantes** : Refresh token automatique
- ✅ **Redirection automatique** : Si non connecté, redirection vers `/login`
- ✅ **Router guards** : Protection des routes avec `meta.requiresAuth`

### Base de données

- ✅ **Row Level Security (RLS)** : Activé sur toutes les tables
- ✅ **Policies basées sur `auth.uid()`** : Chaque utilisateur voit uniquement ses données
- ✅ **Triggers automatiques** : Mise à jour de `updated_at` et création de profil
- ✅ **Validation côté serveur** : Contraintes SQL (check constraints, foreign keys)

### Variables d'environnement

- ✅ **`.env` exclu de Git** : Sécurité des clés API
- ✅ **`.env.example` documenté** : Template pour configuration
- ✅ **Pas de données sensibles** : Aucune clé dans le code source

### Infrastructure

- ✅ **HTTPS obligatoire** : Tous les déploiements en HTTPS
- ✅ **CORS configuré** : Supabase gère le CORS automatiquement
- ✅ **Headers de sécurité** : Configurés par le serveur d'hébergement

---

## 🗺️ Roadmap

### Version 0.2.0 (Actuelle) ✅ MVP Stable

- [x] Authentification Supabase complète
- [x] CRUD Biens / Locataires / Paiements
- [x] Temps réel avec Supabase Realtime
- [x] Graphiques ApexCharts (analytics)
- [x] Système de notifications toast
- [x] Export PDF/Excel
- [x] Responsive design complet
- [x] Row Level Security (RLS)

### Version 0.3.0 (Planifiée)

- [ ] Upload d'images pour les biens (Supabase Storage)
- [ ] Notifications email/SMS pour alertes
- [ ] Multi-comptes / équipes
- [ ] Mode sombre (dark mode)
- [ ] Optimisation ApexCharts (lazy loading)
- [ ] Tests unitaires (Vitest)
- [ ] Amélioration accessibilité (WCAG AA)

### Version 0.4.0 (Future)

- [ ] API REST complète
- [ ] Webhooks Supabase
- [ ] Intégration calendrier (réservations)
- [ ] Application mobile (React Native / Capacitor)
- [ ] Analytics avancées (prédictions, tendances)
- [ ] Intégration paiements en ligne (Stripe)

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
- **Documentation** : Voir la section [Documentation](#-documentation)

---

<div align="center">

**Fait avec ❤️ en utilisant Vue 3, Supabase et Tailwind CSS**

[⬆ Retour en haut](#-mybi---monitoring-immobilier)

</div>

