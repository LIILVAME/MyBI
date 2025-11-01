# 🔍 Audit - Écran Blanc sur /login

**Date** : 2025-11-01  
**Problème** : Écran blanc lors de la navigation vers `/login` depuis la landing page  
**Statut Landing Page** : ✅ Fonctionne correctement

---

## 🔎 Hypothèses de Causes Possibles

### 1. ❌ Erreur JavaScript non capturée
- **Symptôme** : Écran blanc = composant ne se rend pas
- **Causes possibles** :
  - Erreur dans `onMounted` de `LoginPage.vue`
  - Erreur lors du chargement d'un composant enfant
  - Import manquant ou erreur de syntaxe

### 2. ❌ Extension de navigateur interfère
- **Symptôme** : L'erreur "Invalid linked format" apparaît
- **Hypothèse** : Extension modifie le DOM et casse le rendu Vue

### 3. ❌ Problème avec AuthLayout ou composants Auth
- **Symptôme** : Les nouveaux composants `AuthLayout`, `AuthInput`, etc. causent une erreur
- **Causes possibles** :
  - Import manquant
  - Erreur de syntaxe dans un composant
  - Problème avec `useI18n()` non disponible

### 4. ❌ Router Guard bloque la navigation
- **Symptôme** : Le guard `beforeEach` pourrait causer une boucle ou erreur
- **Hypothèse** : Problème avec `loadingSession` qui reste bloqué

---

## 📋 Vérifications Effectuées

### ✅ Fichiers Existent
- `src/layouts/AuthLayout.vue` : ✅ Existe
- `src/components/auth/AuthInput.vue` : ✅ Existe
- `src/components/auth/AuthButton.vue` : ✅ Existe
- `src/components/auth/AuthOAuth.vue` : ✅ Existe
- `src/pages/LoginPage.vue` : ✅ Existe

### ⚠️ Problèmes Potentiels Identifiés

#### 1. AuthLayout utilise `$t()` sans `useI18n()`
```vue
<!-- AuthLayout.vue ligne 12 -->
<p class="text-gray-600 text-xs sm:text-sm">{{ $t('auth.tagline') }}</p>
```
**Problème** : `AuthLayout.vue` utilise `$t()` dans le template mais n'importe pas `useI18n()` dans le script.  
**Solution** : Ajouter `useI18n()` ou utiliser `<script>` avec accès global à `$t()`.

#### 2. LoginPage.onMounted() peut causer des erreurs
```javascript
onMounted(async () => {
  // ... code qui peut échouer
  const user = await authStore.fetchUser(true)
})
```
**Problème** : Si `fetchUser()` échoue, cela peut casser le rendu.  
**Solution** : Ajouter try/catch.

#### 3. Router Guard peut bloquer
```javascript
if (authStore.loadingSession) {
  // Attente jusqu'à 5 secondes
  while (authStore.loadingSession && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
```
**Problème** : Si `loadingSession` reste `true`, cela peut bloquer la navigation.  
**Solution** : Vérifier que `loadingSession` se réinitialise correctement.

---

## 🔧 Corrections à Appliquer

### Correction 1 : AuthLayout - Ajouter useI18n()

**Fichier** : `src/layouts/AuthLayout.vue`

**Problème** : Utilise `$t()` sans importer `useI18n()`.

**Solution** : Ajouter l'import dans le script.

### Correction 2 : LoginPage - Protection onMounted

**Fichier** : `src/pages/LoginPage.vue`

**Problème** : Pas de gestion d'erreur dans `onMounted`.

**Solution** : Ajouter try/catch autour des appels async.

### Correction 3 : Améliorer ErrorHandler

**Fichier** : `src/main.js`

**Problème** : Les erreurs peuvent casser le rendu.

**Solution** : S'assurer que l'errorHandler ne bloque jamais le rendu.

---

## 📊 Tests à Effectuer

1. **Test Navigation** :
   - [ ] Landing page → `/login` (via router-link ou programmatique)
   - [ ] Vérifier console pour erreurs
   - [ ] Vérifier que le composant se monte

2. **Test Composants Auth** :
   - [ ] AuthLayout se rend correctement
   - [ ] AuthInput fonctionne
   - [ ] AuthButton fonctionne
   - [ ] AuthOAuth fonctionne

3. **Test i18n** :
   - [ ] Les traductions `auth.*` existent
   - [ ] `$t()` fonctionne dans AuthLayout
   - [ ] Pas d'erreur si clé manquante

4. **Test Router Guard** :
   - [ ] Navigation vers `/login` ne bloque pas
   - [ ] `loadingSession` se réinitialise correctement

---

## 🚨 Action Immédiate

**Problème le plus probable** : `AuthLayout.vue` utilise `$t('auth.tagline')` sans avoir `useI18n()` importé.

**Correction urgente** : Ajouter `useI18n()` dans `AuthLayout.vue`.

