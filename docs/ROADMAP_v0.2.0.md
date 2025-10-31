# 🗺️ Roadmap v0.2.0 - Intégration Backend

**Date de début** : À définir  
**Date de fin estimée** : 2-3 semaines  
**Objectif** : Connecter le dashboard à une API réelle et améliorer la maintenabilité

---

## 🎯 Objectifs Principaux

1. ✅ Éliminer la duplication de code
2. ✅ Ajouter un store global (Pinia)
3. ✅ Créer les services API
4. ✅ Intégrer la gestion d'erreurs
5. ✅ Ajouter les états de chargement

---

## 📋 Sprint 1 : Refactoring & Utilitaires (3-4 jours)

### Jour 1-2 : Création des utilitaires
- [x] Créer `src/utils/formatters.js`
- [x] Créer `src/utils/constants.js`
- [ ] Refactoriser les composants pour utiliser les utilitaires
- [ ] Ajouter tests unitaires pour les formatters

### Jour 3-4 : Amélioration des composants
- [ ] Créer composant `LoadingSpinner.vue`
- [ ] Créer composant `ErrorMessage.vue`
- [ ] Créer composant `EmptyState.vue`
- [ ] Ajouter validation des props avec `PropType`

**Livrables** :
- Code sans duplication
- Composants communs réutilisables
- Tests de base

---

## 📋 Sprint 2 : État Global avec Pinia (4-5 jours)

### Jour 1-2 : Installation et configuration
- [ ] Installer Pinia (`npm install pinia`)
- [ ] Configurer Pinia dans `main.js`
- [ ] Créer store `usePropertiesStore`
- [ ] Créer store `usePaymentsStore`
- [ ] Créer store `useAuthStore` (squelette)

### Jour 3-4 : Migration des composants
- [ ] Refactoriser `DashboardPage.vue` pour utiliser les stores
- [ ] Créer composables `useProperties()` et `usePayments()`
- [ ] Migrer la logique de calcul des stats vers les stores
- [ ] Ajouter gestion du loading et des erreurs

### Jour 5 : Tests et optimisation
- [ ] Tester la réactivité des stores
- [ ] Optimiser les computed properties
- [ ] Vérifier les performances

**Livrables** :
- Stores Pinia fonctionnels
- Composants migrés vers les stores
- État global cohérent

---

## 📋 Sprint 3 : Services API (5-6 jours)

### Jour 1-2 : Configuration API Client
- [ ] Installer axios (`npm install axios`)
- [ ] Créer `src/api/client.js` avec configuration de base
- [ ] Créer `src/api/endpoints.js` avec routes API
- [ ] Ajouter intercepteurs pour erreurs/auth

### Jour 3-4 : Services métier
- [ ] Créer `src/api/services/properties.js`
- [ ] Créer `src/api/services/payments.js`
- [ ] Créer `src/api/services/stats.js`
- [ ] Intégrer les services dans les stores

### Jour 5-6 : Gestion d'erreurs
- [ ] Créer `src/utils/errorHandler.js`
- [ ] Ajouter notifications d'erreur (toast)
- [ ] Implémenter retry logic pour les requêtes
- [ ] Ajouter fallback vers mockData en cas d'erreur

**Livrables** :
- Services API fonctionnels
- Gestion d'erreurs robuste
- Compatibilité avec mockData pour le dev

---

## 📋 Sprint 4 : Améliorations UX (3-4 jours)

### Jour 1-2 : États de chargement
- [ ] Ajouter loading states dans tous les composants
- [ ] Créer skeletons loaders
- [ ] Optimiser les transitions

### Jour 3-4 : Filtres et recherche
- [ ] Ajouter filtres par statut (occupé/libre)
- [ ] Ajouter recherche par nom/ville
- [ ] Ajouter tri par loyer/date
- [ ] Persister les filtres dans l'URL (query params)

**Livrables** :
- UX fluide avec loading states
- Filtres fonctionnels
- Recherche opérationnelle

---

## 🔧 Stack Technique Ajoutée

```json
{
  "dependencies": {
    "pinia": "^2.1.7",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0"
  }
}
```

---

## 📊 Métriques de Succès

- ✅ 0 duplication de code (formatCurrency, formatDate)
- ✅ 100% des composants utilisent les stores
- ✅ Gestion d'erreurs sur toutes les requêtes API
- ✅ Loading states visibles sur toutes les actions
- ✅ Temps de chargement < 2s

---

## 🚨 Risques Identifiés

1. **Risque de régression** : Migration progressive requise
   - **Mitigation** : Tests unitaires avant migration

2. **API non disponible** : Backend pas encore prêt
   - **Mitigation** : Garder mockData comme fallback

3. **Complexité des stores** : Risque de sur-ingénierie
   - **Mitigation** : Commencer simple, itérer

---

## 📝 Notes de Migration

### Ordre de migration recommandé

1. **Utils** → Impact faible, permet d'améliorer immédiatement
2. **Stores** → Centralise la logique avant l'API
3. **Services API** → Connecte progressivement chaque endpoint
4. **UX** → Améliore l'expérience utilisateur en dernier

### Compatibilité avec v0.1.0

- Tous les composants doivent fonctionner avec mockData
- Migration progressive sans breaking changes
- Possibilité de rollback facile

---

**Document créé le** : Décembre 2024  
**Dernière mise à jour** : Décembre 2024

