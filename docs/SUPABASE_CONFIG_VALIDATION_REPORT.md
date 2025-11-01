# ⚙️ Rapport de Validation - Configuration Supabase

**Date** : Généré manuellement  
**Projet** : Doogoo

---

## 📋 Checklist de Configuration Supabase

### ✅ 1. Authentication → URL Configuration

**URL Dashboard** : [Supabase Dashboard → Authentication → URL Configuration](https://app.supabase.com/project/_/auth/url-configuration)

#### Site URL
- [ ] **Valeur** : `https://doogoo.vercel.app`
- [ ] Doit pointer vers le domaine de production principal

#### Redirect URLs (Allowed URLs)
Ajouter **chaque ligne séparément** :
- [ ] `https://doogoo.vercel.app/**`
- [ ] `https://doogoo.vercel.app`
- [ ] `https://doogoo.vercel.app/login`
- [ ] `https://doogoo.vercel.app/dashboard`
- [ ] `http://localhost:5173/**`
- [ ] `http://localhost:5173`

**⚠️ Important** : 
- Utiliser `/**` pour autoriser tous les chemins sous le domaine
- Cliquer **Save** après chaque modification

---

### ✅ 2. Authentication → Email Templates

**URL Dashboard** : [Supabase Dashboard → Authentication → Email Templates](https://app.supabase.com/project/_/auth/templates)

#### Template: Confirmation (Signup)
- [ ] Le lien utilise : `{{ .ConfirmationURL }}`
- [ ] Le branding mentionne "Doogoo" (pas "Vylo")
- [ ] Test email envoyé et vérifié

#### Template: Magic Link
- [ ] Le lien utilise : `{{ .ActionURL }}`
- [ ] Le branding mentionne "Doogoo"

#### Template: Reset Password
- [ ] Le lien utilise : `{{ .ActionURL }}`
- [ ] Le branding mentionne "Doogoo"
- [ ] Test email envoyé et vérifié

#### Template: Change Email
- [ ] Le lien utilise : `{{ .ConfirmationURL }}`
- [ ] Le branding mentionne "Doogoo"

#### Template: Invite User
- [ ] Le lien utilise : `{{ .ConfirmationURL }}`
- [ ] Le branding mentionne "Doogoo"

---

### ✅ 3. Settings → General

**URL Dashboard** : [Supabase Dashboard → Settings → General](https://app.supabase.com/project/_/settings/general)

- [ ] **Project Name** : Vérifier (optionnel, peut rester tel quel)

---

### ✅ 4. API Settings

**URL Dashboard** : [Supabase Dashboard → Settings → API](https://app.supabase.com/project/_/settings/api)

- [ ] **Project URL** : `https://hvhcyraudbabctsrxpqr.supabase.co` (ou votre URL)
- [ ] **anon/public key** : Correspond à `VITE_SUPABASE_ANON_KEY` dans Vercel
- [ ] ⚠️ **service_role key** : Ne JAMAIS exposer dans le client

---

## 🧪 Tests de Validation

### Test 1: Redirection après Signup

1. Créer un compte de test sur `https://doogoo.vercel.app/signup`
2. Vérifier la réception de l'email de confirmation
3. Cliquer sur le lien de confirmation
4. **Résultat attendu** : Redirection vers `https://doogoo.vercel.app/login` ou `/dashboard`

**Statut** : ⚪ À tester

---

### Test 2: OAuth Google

1. Aller sur `https://doogoo.vercel.app/login`
2. Cliquer sur "Se connecter avec Google"
3. **Résultat attendu** : 
   - Redirection vers Google OAuth
   - Après authentification, redirection vers `https://doogoo.vercel.app/dashboard`

**Statut** : ⚪ À tester

---

### Test 3: OAuth Apple

1. Aller sur `https://doogoo.vercel.app/login`
2. Cliquer sur "Se connecter avec Apple"
3. **Résultat attendu** :
   - Redirection vers Apple OAuth
   - Après authentification, redirection vers `https://doogoo.vercel.app/dashboard`

**Statut** : ⚪ À tester

---

### Test 4: Reset Password

1. Aller sur `https://doogoo.vercel.app/reset-password`
2. Entrer un email valide
3. Vérifier la réception de l'email
4. Cliquer sur le lien de reset
5. **Résultat attendu** : Redirection vers `https://doogoo.vercel.app/reset-password?token=...`

**Statut** : ⚪ À tester

---

## 🔍 Vérification des Erreurs Courantes

### Erreur: "redirect_to URL is not allowed"

**Cause** : L'URL de redirection n'est pas dans la liste des Redirect URLs autorisées

**Solution** :
1. Aller dans Supabase → Authentication → URL Configuration
2. Ajouter l'URL exacte dans "Redirect URLs"
3. Utiliser `/**` pour autoriser tous les chemins
4. Sauvegarder

---

### Erreur: "Email confirmation link is invalid or has expired"

**Cause** : Le template email n'utilise pas la bonne variable ou l'URL n'est pas configurée

**Solution** :
1. Vérifier que le template utilise `{{ .ConfirmationURL }}`
2. Vérifier que "Site URL" pointe vers `https://doogoo.vercel.app`
3. Vérifier que "Redirect URLs" inclut `https://doogoo.vercel.app/**`

---

### Erreur: "OAuth redirect failed"

**Cause** : Les Redirect URLs ne sont pas configurées pour OAuth

**Solution** :
1. Ajouter `https://doogoo.vercel.app/**` dans Redirect URLs
2. Vérifier les credentials OAuth dans Supabase (Google/Apple)
3. Vérifier que les Redirect URLs dans les providers OAuth correspondent

---

## 📝 Notes de Validation

### Date de validation
- **Créé le** : ___/___/___
- **Validé par** : ________________
- **Dernière mise à jour** : ___/___/___

### Statut des Tests
- [x] URL Configuration vérifiée
- [ ] Templates email vérifiés
- [ ] Test Signup réussi
- [ ] Test OAuth Google réussi
- [ ] Test OAuth Apple réussi
- [ ] Test Reset Password réussi

---

## 💡 Actions Requises

### Si des erreurs sont détectées :

1. **Redirections échouent** :
   - Vérifier "Redirect URLs" inclut `https://doogoo.vercel.app/**`
   - Sauvegarder et attendre 1-2 minutes (propagation)

2. **Emails non reçus** :
   - Vérifier le spam
   - Vérifier que les templates utilisent `{{ .ConfirmationURL }}`
   - Utiliser "Send Test Email" dans Supabase

3. **OAuth échoue** :
   - Vérifier les credentials OAuth dans Supabase
   - Vérifier les Redirect URLs dans les providers (Google/Apple)
   - Vérifier que "Site URL" est correcte

---

## 🔗 Liens Utiles

- **Supabase Dashboard** : https://app.supabase.com
- **URL Configuration** : https://app.supabase.com/project/_/auth/url-configuration
- **Email Templates** : https://app.supabase.com/project/_/auth/templates
- **API Settings** : https://app.supabase.com/project/_/settings/api

---

**⚠️ Note** : Ce rapport doit être complété manuellement après vérification dans le Dashboard Supabase.

