# 🧪 Test du changement de mot de passe

**Date** : 2025-01-28  
**Objectif** : Vérifier que toutes les étapes du changement de mot de passe fonctionnent correctement

---

## 📋 Vue d'ensemble

Le composant `PasswordChangeTest.vue` permet de tester automatiquement toutes les étapes du processus de changement de mot de passe dans l'application.

---

## 🚀 Accès au test

**Emplacement** : Paramètres → Sécurité → Section "🧪 Test du changement de mot de passe"

---

## ✅ Tests effectués

Le composant vérifie les **7 étapes** suivantes :

### 1. Authentification utilisateur
- ✅ Vérifie que l'utilisateur est bien authentifié
- ✅ Récupère l'email de l'utilisateur

### 2. Validations client-side
- ✅ Correspondance entre nouveau mot de passe et confirmation
- ✅ Longueur minimale (6 caractères minimum)
- ✅ Nouveau mot de passe différent de l'ancien

### 3. Vérification ancien mot de passe
- ✅ Tentative de connexion avec l'ancien mot de passe
- ✅ Vérifie que l'ancien mot de passe est correct avant de continuer

### 4. Mise à jour via Supabase
- ✅ Appel à `supabase.auth.updateUser({ password: newPassword })`
- ✅ Gestion des erreurs spécifiques (mot de passe trop faible, identique, etc.)

### 5. Événement USER_UPDATED
- ✅ Détection de l'événement `USER_UPDATED` émis par Supabase
- ✅ Vérification que la session est mise à jour

### 6. Persistance de session
- ✅ Vérifie que l'utilisateur reste connecté après le changement
- ✅ Vérifie que la session est toujours valide

### 7. Configuration email Supabase
- ⚠️ Vérification basique (ne peut pas vraiment tester l'envoi depuis le client)
- ⚠️ Fournit des instructions pour vérifier la configuration dans Supabase Dashboard

---

## 🔧 Utilisation

### Prérequis

1. **Être connecté** à l'application
2. **Avoir un mot de passe actuel** (pour le test)
3. **Créer un mot de passe de test** (minimum 6 caractères)

### Étapes

1. Aller dans **Paramètres → Sécurité**
2. Scroller jusqu'à la section **"🧪 Test du changement de mot de passe"**
3. Cliquer sur **"Lancer tous les tests"**
4. Entrer votre **mot de passe actuel** dans la popup
5. Entrer un **nouveau mot de passe de test** (minimum 6 caractères)
6. Observer les résultats en temps réel
7. Le test restaure automatiquement votre ancien mot de passe à la fin

### ⚠️ Attention

**Le test change réellement votre mot de passe !**

- Le test va :
  1. Changer temporairement votre mot de passe
  2. Vérifier toutes les étapes
  3. **Restaurer automatiquement** votre ancien mot de passe

- Si la restauration échoue :
  - Le test affichera une alerte avec votre nouveau mot de passe
  - Vous devrez utiliser ce mot de passe pour vous connecter
  - Vous pourrez ensuite le changer manuellement

---

## 📊 Interprétation des résultats

### ✅ Tests réussis (vert)

- Toutes les étapes fonctionnent correctement
- Le changement de mot de passe est opérationnel
- La session est persistante

### ⚠️ Tests partiellement réussis (orange)

- Certaines étapes fonctionnent, d'autres non
- Vérifier les messages d'erreur pour chaque test

### ❌ Tests échoués (rouge)

- Des problèmes ont été détectés
- Vérifier les messages d'erreur spécifiques
- Consulter la documentation de dépannage

---

## 🔍 Dépannage

### Test 1 : Authentification échoue

**Problème** : `Utilisateur non authentifié`

**Solution** :
- Se reconnecter à l'application
- Vérifier que la session n'a pas expiré

---

### Test 2 : Validations client-side échouent

**Problèmes possibles** :
- Mots de passe ne correspondent pas → Vérifier que vous avez bien saisi deux fois le même mot de passe
- Longueur insuffisante → Utiliser un mot de passe de 6+ caractères
- Mot de passe identique à l'ancien → Utiliser un mot de passe différent

---

### Test 3 : Vérification ancien mot de passe échoue

**Problème** : `Le mot de passe actuel est incorrect`

**Solution** :
- Vérifier que vous avez bien saisi votre mot de passe actuel
- Si vous venez de changer votre mot de passe, utiliser le nouveau

---

### Test 4 : Mise à jour Supabase échoue

**Problèmes possibles** :
- `Password is too weak` → Utiliser un mot de passe plus fort (lettres + chiffres)
- `New password cannot be the same as the old password` → Utiliser un mot de passe différent
- Erreur réseau → Vérifier votre connexion internet

---

### Test 5 : Événement USER_UPDATED non détecté

**Problème** : `Événement non détecté`

**Causes possibles** :
- L'événement peut mettre quelques secondes à être émis
- Délai trop court entre la mise à jour et la vérification

**Note** : Ce n'est pas nécessairement un problème si la mise à jour a réussi (test 4)

---

### Test 6 : Persistance de session échoue

**Problème** : `Session perdue après changement`

**Causes possibles** :
- Bug dans `App.vue` → Vérifier que `USER_UPDATED` est bien géré
- Problème de session Supabase → Se reconnecter

---

### Test 7 : Configuration email Supabase échoue

**Problème** : `L'email de confirmation n'est peut-être pas configuré`

**Solution** : Vérifier la configuration dans Supabase Dashboard :

1. **Aller dans Supabase Dashboard**
   - URL : https://app.supabase.com
   - Projet : Votre projet Doogoo

2. **Vérifier les Email Templates**
   - Menu : **Authentication → Email Templates**
   - Chercher : **"Change Password"** ou **"Password Changed"**
   - Vérifier : Le template est **activé** (Enable)

3. **Vérifier les paramètres SMTP**
   - Menu : **Authentication → Settings**
   - Section : **Email Auth**
   - Vérifier : Les notifications email sont activées

4. **Vérifier le template HTML**
   - Le template doit contenir le HTML depuis `emails/templates/password_changed.html`
   - Subject : `Mot de passe modifié - Doogoo`

5. **Tester l'envoi d'email**
   - Dans Email Templates, cliquer sur **"Send Test Email"**
   - Entrer votre email
   - Vérifier la réception

**Documentation complète** : Voir `docs/SUPABASE_PASSWORD_CHANGE_EMAIL_SETUP.md`

---

## 📧 Vérification de l'email de confirmation

### Pourquoi ne recevez-vous pas d'email ?

**Causes possibles** :

1. **Template non activé dans Supabase**
   - ✅ Solution : Activer le template "Change Password" dans Supabase Dashboard

2. **Notifications email désactivées**
   - ✅ Solution : Activer dans Authentication → Settings

3. **Email dans le dossier spam**
   - ✅ Solution : Vérifier votre dossier spam/courrier indésirable

4. **Adresse email invalide**
   - ✅ Solution : Vérifier que votre email dans Supabase est correct

5. **Délai d'envoi**
   - ✅ Solution : Attendre quelques minutes (peut prendre jusqu'à 5 minutes)

6. **Limite de taux Supabase**
   - ✅ Solution : Vérifier les logs Supabase pour des erreurs de rate limiting

### Comment vérifier si Supabase envoie bien l'email ?

1. **Vérifier les logs Supabase**
   - Menu : **Logs → Auth**
   - Chercher : `password change` ou `updateUser`
   - Vérifier : S'il y a des erreurs d'envoi

2. **Tester depuis le Dashboard**
   - Menu : **Authentication → Email Templates**
   - Template : **"Change Password"**
   - Action : **"Send Test Email"**
   - Entrer : Votre email de test
   - Résultat : Si vous recevez le test email, la config est OK

3. **Vérifier la configuration SMTP**
   - Si vous utilisez un SMTP custom : Vérifier les credentials
   - Si vous utilisez le SMTP par défaut : Vérifier que le projet n'a pas dépassé les limites

---

## 📝 Checklist de vérification

### Avant de lancer le test

- [ ] Être connecté à l'application
- [ ] Avoir un mot de passe actuel valide
- [ ] Avoir préparé un mot de passe de test (6+ caractères)

### Après le test

- [ ] Tous les tests 1-6 sont passés ✅
- [ ] Test 7 (email) : Configuré dans Supabase ou ignoré si non nécessaire
- [ ] Le mot de passe a été restauré automatiquement
- [ ] La session est toujours active
- [ ] Vous pouvez toujours vous connecter

### Configuration Supabase (si email nécessaire)

- [ ] Template "Change Password" activé
- [ ] Subject configuré : `Mot de passe modifié - Doogoo`
- [ ] HTML copié depuis `emails/templates/password_changed.html`
- [ ] Notifications email activées
- [ ] Test email envoyé et reçu avec succès

---

## 🔗 Liens utiles

- **Supabase Dashboard** : https://app.supabase.com
- **Email Templates** : https://app.supabase.com/project/_/auth/templates
- **Documentation email setup** : `docs/SUPABASE_PASSWORD_CHANGE_EMAIL_SETUP.md`
- **Documentation feedback improvements** : `docs/PASSWORD_CHANGE_FEEDBACK_IMPROVEMENTS.md`

---

**✅ Le test automatique permet de vérifier rapidement que toutes les étapes du changement de mot de passe fonctionnent correctement !**

