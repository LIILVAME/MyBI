# 📧 Configuration Email : Changement de mot de passe - Supabase

**Date** : 2025-11-01  
**Objectif** : Configurer l'envoi automatique d'email de confirmation lors du changement de mot de passe

---

## 🔧 Configuration dans Supabase Dashboard

### 1. Accéder aux Email Templates

**URL** : [Supabase Dashboard → Authentication → Email Templates](https://app.supabase.com/project/_/auth/templates)

---

### 2. Activer le template "Password Changed Notification"

1. Dans la liste des templates, chercher **"Change Password"** ou **"Password Changed Notification"**
2. Si le template existe :
   - Cliquer dessus pour l'éditer
   - Vérifier qu'il est **activé** (Enable)
   - Copier le contenu du fichier `emails/templates/password_changed.html` dans le template

3. Si le template n'existe pas :
   - Cliquer sur **"Add Template"** ou **"New Template"**
   - Sélectionner le type : **"Change Password"** ou **"Password Changed"**
   - **Subject** : `Mot de passe modifié - Doogoo`
   - **Body** : Copier le contenu de `emails/templates/password_changed.html`
   - Activer le template

---

### 3. Variables disponibles dans le template

Supabase fournit automatiquement ces variables :
- `{{ .Email }}` : Email de l'utilisateur
- `{{ .SiteURL }}` : URL du site configurée dans Supabase
- `{{ .Timestamp }}` : Date/heure du changement (si disponible)

---

### 4. Activer l'envoi automatique

1. Aller dans **Authentication → Settings**
2. Chercher **"Enable Email Notifications"** ou **"Password Change Notification"**
3. S'assurer que l'option est **activée**
4. Sauvegarder

---

## 🧪 Test de l'email

### Test manuel

1. Aller sur `https://doogoo.vercel.app/parametres`
2. Cliquer sur "Modifier le mot de passe"
3. Changer votre mot de passe
4. Vérifier votre boîte email (y compris le dossier spam)
5. Vous devriez recevoir un email avec :
   - ✅ Icône de succès
   - ✅ Message "Mot de passe modifié avec succès"
   - ✅ Information que le compte reste connecté
   - ✅ Avertissement de sécurité si ce n'était pas vous

---

### Test depuis Supabase Dashboard

1. Aller dans **Authentication → Email Templates**
2. Sélectionner le template "Change Password"
3. Cliquer sur **"Send Test Email"**
4. Entrer votre email de test
5. Vérifier la réception

---

## ✅ Checklist de configuration

- [ ] Template "Change Password" créé/activé dans Supabase
- [ ] Subject configuré : `Mot de passe modifié - Doogoo`
- [ ] Body HTML copié depuis `emails/templates/password_changed.html`
- [ ] Template activé (Enable)
- [ ] Notifications email activées dans Authentication Settings
- [ ] Test manuel effectué avec succès
- [ ] Email reçu et formaté correctement

---

## 📝 Notes importantes

### Envoi automatique

Supabase envoie automatiquement un email de notification lorsque :
- Un utilisateur authentifié change son mot de passe via `supabase.auth.updateUser({ password: newPassword })`
- Le template est activé dans le dashboard
- Les notifications email sont activées

### Délai d'envoi

L'email est généralement envoyé immédiatement après le changement de mot de passe, mais peut prendre quelques secondes.

### Variables non standard

Certaines variables comme `{{ .Timestamp }}` peuvent ne pas être disponibles dans tous les templates Supabase. Si c'est le cas, retirer cette variable du template ou utiliser une alternative.

---

## 🔗 Liens utiles

- **Supabase Dashboard** : https://app.supabase.com
- **Email Templates** : https://app.supabase.com/project/_/auth/templates
- **Documentation Supabase** : https://supabase.com/docs/guides/auth/auth-email-templates

---

**✅ Une fois configuré, tous les utilisateurs recevront automatiquement un email de confirmation lors du changement de mot de passe !**

