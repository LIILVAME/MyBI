# ✨ Feature : Store Pinia pour Synchronisation des Biens

**Date** : Décembre 2024  
**Version** : v0.1.0 → v0.2.0 (préparation)  
**Statut** : ✅ **IMPLÉMENTÉ**

---

## 🎯 Objectif

Implémenter un **store Pinia global** pour synchroniser les biens immobiliers entre :
- **DashboardPage** : Affichage et ajout de biens
- **BiensPage** : Liste complète et filtrage des biens

**Avantages** :
- ✅ Synchronisation automatique entre pages
- ✅ État centralisé et réactif
- ✅ Prêt pour intégration backend v0.2.0

---

## 📋 Fonctionnalités Implémentées

### ✅ Installation et Configuration Pinia

**Package** : `pinia` (v2.x)

**Configuration** (`src/main.js`) :
```javascript
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

---

### ✅ Store Properties (`propertiesStore.js`)

**Fichier** : `src/stores/propertiesStore.js`

**État** :
- `properties` : Liste réactive des biens immobiliers

**Actions** :
- `addProperty(propertyData)` : Ajoute un nouveau bien
- `updateProperty(id, updates)` : Met à jour un bien existant
- `removeProperty(id)` : Supprime un bien

**Getters (Computed)** :
- `totalProperties` : Nombre total de biens
- `occupiedProperties` : Nombre de biens occupés
- `vacantProperties` : Nombre de biens libres
- `totalRent` : Total des loyers mensuels

**Initialisation** :
- Les données sont initialisées avec `mockProperties` au chargement
- Compatible avec données API en v0.2.0

---

### ✅ Intégration DashboardPage

**Avant** :
```javascript
const properties = ref([...mockProperties])
const handleAddProperty = (newProperty) => {
  properties.value.push(property)
  updateGlobalStats()
}
```

**Après** :
```javascript
const propertiesStore = usePropertiesStore()
const properties = computed(() => propertiesStore.properties)

const handleAddProperty = (newProperty) => {
  propertiesStore.addProperty(newProperty)
  // Les stats sont automatiquement mises à jour via computed
}
```

**Bénéfices** :
- ✅ Plus besoin de `updateGlobalStats()` manuel
- ✅ Statistiques réactives automatiques
- ✅ Synchronisation avec BiensPage

---

### ✅ Intégration BiensPage

**Avant** :
```javascript
const properties = ref(mockProperties)
```

**Après** :
```javascript
const propertiesStore = usePropertiesStore()
const properties = computed(() => propertiesStore.properties)
```

**Bénéfices** :
- ✅ Les biens ajoutés depuis le Dashboard apparaissent immédiatement
- ✅ État partagé entre toutes les pages
- ✅ Pas de duplication de données

---

### ✅ Modal Enrichi avec Champs Locataire

**Fichier** : `src/components/dashboard/AddPropertyModal.vue`

**Nouvelles fonctionnalités** :
- ✅ Section conditionnelle "Informations du locataire"
- ✅ Affichée uniquement si `status === 'occupied'`
- ✅ Champs : Nom, Date d'entrée, Statut de paiement
- ✅ Réinitialisation automatique si on change de "occupé" à "libre"

**Structure du formulaire** :
```javascript
const form = ref({
  name: '',
  address: '',
  city: '',
  rent: null,
  status: '',
  tenant: {
    name: '',
    entryDate: '',
    status: 'on_time'
  }
})
```

**Soumission** :
- Si bien occupé → Inclut les données du locataire
- Si bien libre → `tenant: null`

---

## 🔄 Flux de Données

### Ajout d'un bien depuis Dashboard

```
1. Utilisateur clique sur "Ajouter un bien"
   ↓
2. Modal AddPropertyModal s'ouvre
   ↓
3. Utilisateur remplit le formulaire (+ champs locataire si occupé)
   ↓
4. Soumission → handleAddProperty(newProperty)
   ↓
5. propertiesStore.addProperty(newProperty)
   ↓
6. Store met à jour properties.value (réactif)
   ↓
7. DashboardPage : properties computed se met à jour
   ↓
8. BiensPage : properties computed se met à jour (SYNCHRONISÉ !)
```

---

## 📊 Structure des Données

### Format d'entrée (Modal)
```javascript
{
  name: "Appartement T2 - Paris 15e",
  address: "45 Rue de Vaugirard, 75015 Paris",
  city: "Paris",
  rent: 950,
  status: "occupied",
  tenant: {
    name: "Jean Dupont",
    entryDate: "2024-01-15",
    status: "on_time"
  }
}
```

### Format stocké (Store)
```javascript
{
  id: 5, // Généré automatiquement
  name: "Appartement T2 - Paris 15e",
  address: "45 Rue de Vaugirard, 75015 Paris",
  city: "Paris",
  status: "occupied",
  rent: 950,
  tenant: {
    name: "Jean Dupont",
    entryDate: "2024-01-15",
    exitDate: null,
    rent: 950,
    status: "on_time"
  },
  image: "https://images.unsplash.com/..."
}
```

---

## ✅ Checklist de Validation

### Store Pinia ✅
- [x] Pinia installé et configuré
- [x] Store créé avec état réactif
- [x] Actions fonctionnelles (add, update, remove)
- [x] Getters computed pour statistiques
- [x] Initialisation avec données mockées

### Synchronisation ✅
- [x] DashboardPage utilise le store
- [x] BiensPage utilise le store
- [x] Ajout depuis Dashboard visible dans BiensPage
- [x] Statistiques automatiquement mises à jour

### Modal Enrichi ✅
- [x] Champs locataire conditionnels (si occupé)
- [x] Validation des champs requis
- [x] Réinitialisation si changement de statut
- [x] Soumission avec données complètes

### Code Quality ✅
- [x] Aucune erreur de linting
- [x] Code documenté avec JSDoc
- [x] TODO clairs pour v0.2.0
- [x] Imports cohérents

---

## 🚀 Préparation v0.2.0

### Migration API

**Dans le store** (`propertiesStore.js`) :
```javascript
// TODO v0.2.0 : Remplacer par appel API
const addProperty = async (propertyData) => {
  try {
    const response = await api.post('/properties', propertyData)
    properties.value.push(response.data)
    return response.data
  } catch (error) {
    // Gestion d'erreur
    throw error
  }
}
```

**Chargement initial** :
```javascript
// TODO v0.2.0 : Charger depuis l'API au lieu de mockData
const loadProperties = async () => {
  try {
    const response = await api.get('/properties')
    properties.value = response.data
  } catch (error) {
    // Gestion d'erreur
  }
}

// Appeler au montage du store
loadProperties()
```

---

## 📝 Notes Techniques

### Réactivité Pinia
- Les `computed` dans les composants se mettent à jour automatiquement
- Pas besoin de `watch` ou de gestion manuelle de l'état
- Performance optimale grâce à la réactivité Vue 3

### Persistance
- **v0.1.0** : Données en mémoire (perdues au refresh)
- **v0.2.0** : Persistance via localStorage ou API backend

### Gestion des Erreurs
- **v0.1.0** : Aucune gestion d'erreur (données mockées)
- **v0.2.0** : Ajouter try/catch et notifications d'erreur

---

**Document créé le** : Décembre 2024  
**Fonctionnalité validée** : ✅ **PRÊTE POUR v0.1.0 ET v0.2.0**

