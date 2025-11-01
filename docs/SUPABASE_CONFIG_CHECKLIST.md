# 📋 Checklist Configuration Supabase

## 🔍 Vérification dans Supabase Dashboard

### 1. Authentication → URL Configuration

**URL** : [Supabase Dashboard → Authentication → URL Configuration](https://app.supabase.com/project/_/auth/url-configuration)

#### Site URL
- **Valeur** : `https://doogoo.vercel.app`
- ✅ Doit pointer vers le domaine de production

#### Redirect URLs (Allowed URLs)
Ajouter **chaque ligne séparément** :
```
https://doogoo.vercel.app/**
https://doogoo.vercel.app
https://doogoo.vercel.app/login
https://doogoo.vercel.app/dashboard
http://localhost:5173/**
http://localhost:5173
```

⚠️ **Important** : 
- Utiliser `/**` pour autoriser tous les chemins sous le domaine
- Ajouter aussi `http://localhost:5173/**` pour le développement local
- Cliquer **Save** après chaque modification

---

### 2. Authentication → Email Templates

**URL** : [Supabase Dashboard → Authentication → Email Templates](https://app.supabase.com/project/_/auth/templates)

#### Templates à Vérifier

1. **Confirmation** (`confirmation`)
   - Vérifier que le lien utilise : `{{ .ConfirmationURL }}`
   - Vérifier que le branding mentionne "Doogoo" (pas "Vylo")

2. **Reset Password** (`reset_password`)
   - Vérifier que le lien utilise : `{{ .ActionURL }}`
   - Vérifier le branding Doogoo

3. **Magic Link** (`magic_link`)
   - Vérifier que le lien utilise : `{{ .ActionURL }}`

4. **Change Email** (`change_email`)
   - Vérifier que le lien utilise : `{{ .ConfirmationURL }}`

#### Variables Disponibles
- `{{ .Email }}` : Email de l'utilisateur
- `{{ .ConfirmationURL }}` : URL de confirmation
- `{{ .ActionURL }}` : URL d'action (reset, magic link)
- `{{ .Token }}` : Token (si nécessaire)
- `{{ .TokenHash }}` : Hash du token
- `{{ .SiteURL }}` : URL du site configurée

---

### 3. Settings → General

**URL** : [Supabase Dashboard → Settings → General](https://app.supabase.com/project/_/settings/general)

#### Project Name
- **Valeur** : `Doogoo` (ou laisser tel quel si non critique)

---

### 4. API Settings

**URL** : [Supabase Dashboard → Settings → API](https://app.supabase.com/project/_/settings/api)

#### Vérifier
- **Project URL** : `https://hvhcyraudbabctsrxpqr.supabase.co`
- **anon/public key** : Doit correspondre à `VITE_SUPABASE_ANON_KEY` dans Vercel
- **service_role key** : ⚠️ Ne JAMAIS exposer dans le client

---

## 🚨 Problèmes Courants

### 1. Redirect URL non autorisée

**Symptôme** : `redirect_to URL is not allowed`

**Solution** : Ajouter l'URL exacte dans "Redirect URLs" avec `/**`

### 2. Email ne fonctionne pas

**Symptôme** : Pas de réception d'emails

**Solution** : 
- Vérifier les templates utilisent les bonnes variables (`{{ .ConfirmationURL }}`)
- Vérifier "Site URL" est correcte
- Tester avec "Send Test Email"

### 3. OAuth ne fonctionne pas

**Symptôme** : Erreur de redirection OAuth

**Solution** :
- Vérifier "Redirect URLs" inclut le domaine de production
- Vérifier les credentials OAuth (Google/Apple) dans Supabase

---

## 📝 Test de Configuration

### Test Email
1. Aller dans **Authentication → Email Templates**
2. Cliquer sur un template (ex: "Confirmation")
3. Cliquer **Send Test Email**
4. Vérifier la réception et que les liens fonctionnent

### Test OAuth
1. Aller sur `https://doogoo.vercel.app/login`
2. Cliquer sur "Se connecter avec Google"
3. Vérifier la redirection fonctionne

