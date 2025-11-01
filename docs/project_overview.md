# 📊 Vue d'ensemble du projet Doogoo

## 🎯 Vision du produit

Doogoo est une plateforme web moderne conçue pour permettre aux propriétaires et gestionnaires de biens immobiliers de superviser à distance l'état de leurs appartements en location.

### Objectifs principaux

1. **Réduction des visites physiques** : Monitoring à distance pour limiter les déplacements
2. **Réactivité** : Alertes instantanées en cas d'anomalie ou d'incident
3. **Transparence** : Accès en temps réel aux données de chaque bien
4. **Optimisation** : Suivi de la consommation énergétique pour réduire les coûts
5. **Sécurité** : Surveillance continue via caméras et capteurs

---

## 🏗️ Architecture technique

### Stack frontend

```
Vue 3 (Composition API)
    ↓
Vite (Build tool)
    ↓
Vue Router (Navigation)
    ↓
Tailwind CSS (Styling)
```

### Structure des composants

```
App.vue (Root)
├── LandingPage.vue
│   ├── Hero Section
│   ├── Features Section
│   ├── Dashboard Preview
│   ├── Testimonials
│   └── Footer
│
└── DashboardPage.vue
    ├── Sidebar (Navigation)
    ├── Global Stats (4 cards)
    ├── Properties Grid
    ├── Payments Section
    └── Security Preview
```

### Flux de données

```
mockData.js (Données mockées)
    ↓
Composants Vue (Import)
    ↓
Template (Affichage)
    ↓
Utilisateur (Interaction)
```

**Note** : Actuellement en mode démo avec données mockées. Prêt pour intégration API réelle.

---

## 📱 Pages et routes

### Landing Page (`/`)

**Objectif** : Présenter le produit et convertir les visiteurs

**Sections** :
1. Hero avec message principal et CTA
2. Fonctionnalités (4 avantages clés)
3. Preview du dashboard
4. Témoignages clients
5. Footer avec contact

**Métriques cibles** :
- Taux de conversion vers dashboard
- Temps passé sur la page
- Clics sur CTA

### Dashboard (`/dashboard`)

**Objectif** : Interface principale de monitoring

**Composants principaux** :
- **Statistiques globales** : Vue d'ensemble des métriques
- **Liste des biens** : Cartes détaillées avec statut et alertes
- **Paiements** : Loyers à venir avec échéances
- **Sécurité** : Aperçu des caméras actives

**Actions utilisateur** :
- Ajouter un bien
- Consulter les détails d'un bien
- Gérer les paiements
- Voir les alertes

---

## 🎨 Design System

### Couleurs

| Nom | Code | Usage |
|-----|------|-------|
| Primary | `#22c55e` | Actions principales, liens |
| Success | `#10b981` | Statuts positifs |
| Warning | `#f59e0b` | Alertes modérées |
| Danger | `#ef4444` | Alertes critiques |
| Background | `#f9fafb` | Fond principal |
| Text | `#111827` | Texte principal |

### Typographie

- **Famille** : Inter (Google Fonts)
- **Hiérarchie** :
  - H1 : `text-4xl lg:text-5xl font-bold`
  - H2 : `text-3xl lg:text-4xl font-bold`
  - H3 : `text-2xl font-bold`
  - Body : `text-base font-normal`

### Composants UI

#### Cards
- `rounded-xl` : Bordures arrondies
- `shadow-sm` : Ombres légères
- `hover:shadow-md` : Interaction hover

#### Boutons
- Primary : `bg-primary-600 text-white`
- Secondary : `bg-white text-primary-600 border-2`

#### Badges
- Status : `px-2.5 py-0.5 rounded-full text-xs`

---

## 📊 Métriques et données

### Données mockées actuelles

- **3 biens immobiliers** (Paris, Lyon, Marseille)
- **2 paiements à venir**
- **Statistiques globales** agrégées
- **3 témoignages clients**

### Structure des données

#### Bien immobilier
```javascript
{
  id: Number,
  name: String,
  address: String,
  status: 'occupied' | 'vacant',
  temperature: Number,
  humidity: Number,
  airQuality: String,
  energyConsumption: Number,
  alerts: Number,
  image: String (URL)
}
```

#### Paiement
```javascript
{
  id: Number,
  property: String,
  tenant: String,
  amount: Number,
  dueDate: String (ISO),
  status: 'pending' | 'paid' | 'overdue'
}
```

---

## 🔄 Flux utilisateur

### Parcours principal

1. **Arrivée** → Landing Page
2. **Découverte** → Sections fonctionnalités
3. **Intérêt** → CTA "Commencer maintenant"
4. **Dashboard** → Vue d'ensemble des biens
5. **Action** → Consultation détail / Ajout bien

### Parcours secondaire

1. **Dashboard** → Alertes
2. **Consultation** → Détails de l'alerte
3. **Action** → Résolution / Notification

---

## 🚀 Évolution prévue

### Phase 1 (v0.1.0) ✅
- Landing + Dashboard de base
- Données mockées
- Design responsive

### Phase 2 (v0.2.0)
- Authentification
- API réelle
- WebSockets temps réel

### Phase 3 (v0.3.0)
- Graphiques avancés
- Exports PDF
- Notifications email/SMS

### Phase 4 (v0.4.0)
- Mode sombre
- Personnalisation
- PWA

---

## 🧪 Tests et qualité

### Tests à implémenter

- [ ] Tests unitaires (composants Vue)
- [ ] Tests d'intégration (routing)
- [ ] Tests E2E (parcours utilisateur)
- [ ] Tests de performance (Lighthouse)
- [ ] Tests d'accessibilité (WCAG)

### Outils recommandés

- **Vitest** : Tests unitaires
- **Playwright** : Tests E2E
- **Lighthouse CI** : Performance
- **axe-core** : Accessibilité

---

## 📈 Métriques de succès

### KPIs techniques

- Temps de chargement < 2s
- Score Lighthouse > 90
- Taux d'erreur < 0.1%
- Disponibilité > 99.9%

### KPIs produit

- Taux de conversion landing → dashboard
- Temps moyen sur dashboard
- Nombre de biens ajoutés par utilisateur
- Taux de résolution des alertes

---

## 🔐 Sécurité

### Mesures actuelles

- Pas d'authentification (mode démo)
- Données mockées uniquement
- Pas de données sensibles

### Mesures à implémenter

- [ ] Authentification JWT
- [ ] HTTPS obligatoire
- [ ] Validation côté serveur
- [ ] Protection CSRF
- [ ] Rate limiting
- [ ] Chiffrement des données sensibles
- [ ] Conformité RGPD

---

## 📚 Ressources

### Documentation

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vue Router](https://router.vuejs.org/)

### Design

- [Heroicons](https://heroicons.com/) - Icônes SVG
- [Unsplash](https://unsplash.com/) - Images libres
- [Inter Font](https://rsms.me/inter/) - Typographie

---

**Dernière mise à jour** : 2024-12-04
**Version** : 0.1.0

