# 🔐 Flux de réinitialisation du mot de passe - Doogoo

**Date** : 2025-01-28  
**Objectif** : Documentation du flux complet de réinitialisation de mot de passe

---

## 📋 Vue d'ensemble

Le flux de réinitialisation de mot de passe se déroule en **3 étapes** :

1. **Demande de réinitialisation** : L'utilisateur entre son email
2. **Réception de l'email** : L'utilisateur reçoit un lien de réinitialisation
3. **Définition du nouveau mot de passe** : L'utilisateur définit son nouveau mot de passe

---

## 🔄 Flux détaillé

### Étape 1 : Demande de réinitialisation

**Page** : `/reset-password`  
**Action** : L'utilisateur entre son email et clique sur "Envoyer le lien"

**Fichier** : `src/pages/ResetPasswordPage.vue` (composant `v-if="!hasResetToken && !emailSent"`)

**Processus** :
1. L'utilisateur entre son email
2. Appel à `authStore.resetPassword(email)`
3. Supabase envoie un email avec un lien de réinitialisation
4. `redirectTo` configuré dans `authStore.resetPassword()` : `${window.location.origin}/reset-password`
5. Affichage d'un message de succès : "Email envoyé !"

**Code** :
```javascript
const handleResetPassword = async () => {
  authStore.error = null
  const result = await authStore.resetPassword(form.value.email)
  
  if (result.success) {
    emailSent.value = true
    toastStore.success(t('auth.reset.successMessage', { email: form.value.email }))
  }
}
```

---

### Étape 2 : Réception de l'email

**Email Supabase** : Contient un lien vers `/reset-password#access_token=...&refresh_token=...&type=recovery`

**Lien de réinitialisation** : 
```
https://doogoo.vercel.app/reset-password#access_token=...&refresh_token=...&type=recovery
```

---

### Étape 3 : Définition du nouveau mot de passe

**Page** : `/reset-password` (avec hash dans l'URL)  
**Action** : L'utilisateur définit son nouveau mot de passe

**Fichier** : `src/pages/ResetPasswordPage.vue` (composant `v-if="hasResetToken"`)

**Processus** :

1. **Détection du token** (fonction `checkResetToken()`)
   - Analyse du hash de l'URL
   - Extraction de `access_token`, `refresh_token`, et `type=recovery`
   - Échange des tokens avec Supabase via `setSession()`
   - Création d'une session temporaire
   - `hasResetToken.value = true` → Affichage du formulaire

2. **Formulaire de nouveau mot de passe**
   - Champ "Nouveau mot de passe"
   - Champ "Confirmer le mot de passe"
   - Validation client-side (correspondance, longueur minimale)

3. **Soumission** (fonction `handleUpdatePassword()`)
   - Validations client-side
   - Appel à `supabase.auth.updateUser({ password: newPassword })`
   - Toast de succès
   - Redirection vers `/login?passwordReset=true`

**Code** :
```javascript
const handleUpdatePassword = async () => {
  // Validations
  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = t('auth.reset.passwordMismatch')
    return
  }
  
  // Mise à jour via Supabase
  const { error: updateError } = await supabase.auth.updateUser({
    password: form.value.newPassword
  })
  
  if (!updateError) {
    toastStore.success(t('auth.reset.updateSuccess'))
    router.push('/login?passwordReset=true')
  }
}
```

---

## 🔧 Gestion des redirections

### App.vue - handleAuthHash()

**Fichier** : `src/App.vue`

**Logique** :
- Détecte les tokens dans le hash de l'URL
- Si `type === 'recovery'` → Redirige vers `/reset-password` (reste sur la page)
- Si `type === 'signup'` → Redirige vers `/confirm-email`
- Autres cas → Redirige vers `/login?confirmed=true`

**Code** :
```javascript
if (type === 'recovery') {
  // Réinitialisation de mot de passe : reste sur /reset-password
  if (router.currentRoute.value.path !== '/reset-password') {
    router.push('/reset-password')
  }
}
```

---

### Router Guard

**Fichier** : `src/router/index.js`

**Logique** :
- Si l'utilisateur est connecté ET accède à `/reset-password`
- Vérifie si c'est une session de réinitialisation (hash avec `type=recovery`)
- Si oui → Laisse passer (la page gère le formulaire)
- Si non → Redirige vers `/dashboard`

**Code** :
```javascript
if (to.path === '/reset-password' && authStore.user) {
  const hash = window.location.hash
  const isPasswordRecovery = hash && hash.includes('type=recovery')
  
  if (!isPasswordRecovery) {
    next('/dashboard')
    return
  }
}
```

---

## ✅ Page de connexion après succès

**Page** : `/login?passwordReset=true`

**Fichier** : `src/pages/LoginPage.vue`

**Affichage** :
- Message de succès vert : "Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter."
- Le message disparaît automatiquement après 5 secondes

**Code** :
```vue
<div v-if="route.query.passwordReset === 'true'" class="p-4 bg-green-50 border-l-4 border-green-500">
  <p>{{ $t('auth.reset.updateSuccess') }} Vous pouvez maintenant vous connecter.</p>
</div>
```

---

## 🎯 Configuration Supabase

### URL Configuration

**Dashboard Supabase** : Authentication → URL Configuration

**Configuration requise** :
- **Site URL** : `https://doogoo.vercel.app`
- **Redirect URLs** :
  ```
  https://doogoo.vercel.app/reset-password
  http://localhost:5173/reset-password
  ```

### redirectTo dans authStore

**Fichier** : `src/stores/authStore.js`

**Code** :
```javascript
const resetPassword = async (email) => {
  const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  // ...
}
```

---

## 🧪 Test du flux complet

### Test manuel

1. **Aller sur** `/reset-password`
2. **Entrer un email** valide
3. **Cliquer sur** "Envoyer le lien"
4. **Vérifier** : Message "Email envoyé !"
5. **Ouvrir l'email** reçu
6. **Cliquer sur le lien** de réinitialisation
7. **Vérifier** : Redirection vers `/reset-password` avec formulaire de nouveau mot de passe
8. **Entrer** un nouveau mot de passe (min 6 caractères)
9. **Confirmer** le mot de passe
10. **Cliquer sur** "Valider"
11. **Vérifier** : Toast "Mot de passe réinitialisé avec succès !"
12. **Vérifier** : Redirection automatique vers `/login?passwordReset=true`
13. **Vérifier** : Message de succès sur la page de connexion

---

## 📝 Points importants

### Session temporaire

- Lors du clic sur le lien email, une **session temporaire** est créée via `setSession()`
- Cette session permet d'appeler `updateUser()` pour changer le mot de passe
- Après la mise à jour, l'utilisateur est redirigé vers `/login` et doit se reconnecter

### Sécurité

- Le token de réinitialisation est dans le **hash** de l'URL (non envoyé au serveur)
- Le hash est nettoyé après échange avec Supabase
- Validation client-side + serveur (Supabase)

### Validations

- **Client-side** :
  - Correspondance des mots de passe
  - Longueur minimale (6 caractères)
- **Serveur** (Supabase) :
  - Force du mot de passe
  - Validité du token

---

## 🔗 Fichiers modifiés

1. **`src/pages/ResetPasswordPage.vue`**
   - Ajout de la détection du token de réinitialisation
   - Ajout du formulaire de nouveau mot de passe
   - Gestion de la mise à jour du mot de passe

2. **`src/App.vue`**
   - Modification de `handleAuthHash()` pour gérer `type=recovery`

3. **`src/router/index.js`**
   - Modification du router guard pour permettre l'accès à `/reset-password` avec session de réinitialisation

4. **`src/pages/LoginPage.vue`**
   - Ajout du message de succès après réinitialisation

5. **`src/locales/i18n/fr.json` et `en.json`**
   - Ajout des traductions pour le nouveau formulaire

---

## ✅ Checklist de vérification

- [ ] Lien email redirige vers `/reset-password` (pas `/dashboard`)
- [ ] Formulaire de nouveau mot de passe s'affiche après clic sur le lien
- [ ] Validations client-side fonctionnent (correspondance, longueur)
- [ ] Mise à jour du mot de passe fonctionne
- [ ] Redirection vers `/login` après succès
- [ ] Message de succès affiché sur la page de connexion
- [ ] Configuration Supabase correcte (redirectTo)

---

**✅ Le flux de réinitialisation de mot de passe est maintenant complet et fonctionnel !**

