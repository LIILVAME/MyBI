# ✅ Fix : Redirection après confirmation d'email

**Date** : 2025-11-01  
**Problème** : Après clic sur le lien de confirmation, redirection vers URL avec tokens dans le hash au lieu de `/confirm-email`

---

## 🔧 Correction appliquée

### Changements dans le code

1. **`src/App.vue`** : Ajout de la fonction `handleAuthHash()`
   - Détecte les tokens dans le hash URL (`#access_token=...`)
   - Échange les tokens avec Supabase pour créer une session
   - Redirige automatiquement vers `/confirm-email` pour les inscriptions

2. **`src/pages/ConfirmEmailPage.vue`** : Amélioration de l'expérience
   - Détecte si l'utilisateur est connecté
   - Bouton dynamique : "Aller au tableau de bord" si connecté, "Se connecter" sinon

3. **`src/stores/authStore.js`** : Mise à jour de `emailRedirectTo`
   - Pointe maintenant vers la racine (`/`) au lieu de `/login`
   - `App.vue` gère ensuite la redirection appropriée

---

## ⚙️ Configuration Supabase requise

### 1. Authentication → URL Configuration

**URL** : [Supabase Dashboard → Authentication → URL Configuration](https://app.supabase.com/project/_/auth/url-configuration)

#### Site URL
- **Valeur** : `https://doogoo.vercel.app`

#### Redirect URLs (Allowed URLs)
Ajouter **chaque ligne séparément** :
```
https://doogoo.vercel.app/**
https://doogoo.vercel.app
http://localhost:5173/**
http://localhost:5173
```

⚠️ **Important** : 
- Utiliser `/**` pour autoriser tous les chemins sous le domaine
- Cliquer **Save** après chaque modification
- Attendre 1-2 minutes pour la propagation

---

## 🧪 Test de la correction

### Test en production

1. **Créer un compte de test** sur `https://doogoo.vercel.app/signup`
2. **Vérifier l'email** reçu (vérifier aussi le spam)
3. **Cliquer sur le lien de confirmation** dans l'email
4. **Résultat attendu** :
   - Redirection automatique vers `https://doogoo.vercel.app/confirm-email`
   - Message "Email confirmé" affiché
   - Bouton "Aller au tableau de bord" visible
   - Clic sur le bouton → redirection vers `/dashboard`

### Test en développement local

1. **Démarrer le serveur** : `npm run dev`
2. **Créer un compte** sur `http://localhost:5173/signup`
3. **Cliquer sur le lien de confirmation** dans l'email
4. **Résultat attendu** : Même comportement qu'en production

---

## 🔍 Dépannage

### Problème : Lien redirige toujours vers l'URL avec hash

**Cause** : Redirect URLs non configurées dans Supabase

**Solution** :
1. Aller dans Supabase → Authentication → URL Configuration
2. Ajouter `https://doogoo.vercel.app/**` dans Redirect URLs
3. Sauvegarder
4. Attendre 1-2 minutes
5. Réessayer

---

### Problème : Redirection vers `/login` au lieu de `/confirm-email`

**Cause** : Ancien code en cache ou configuration Supabase

**Solution** :
1. Vider le cache du navigateur (Ctrl+Shift+R / Cmd+Shift+R)
2. Vérifier que `emailRedirectTo` dans `authStore.js` pointe vers `/` (racine)
3. Redéployer l'application sur Vercel si nécessaire

---

### Problème : Tokens expirés

**Cause** : Le lien de confirmation a expiré (24h par défaut)

**Solution** :
1. Demander un nouvel email de confirmation
2. Ou créer un nouveau compte de test

---

## 📝 Flux complet

```
1. Utilisateur crée un compte → signUp()
2. Supabase envoie email avec lien de confirmation
3. Utilisateur clique sur le lien
4. Supabase redirige vers : https://doogoo.vercel.app/#access_token=...&type=signup
5. App.vue intercepte le hash → handleAuthHash()
6. Tokens échangés avec Supabase → setSession()
7. Session créée → authStore mis à jour
8. Redirection automatique → /confirm-email
9. Utilisateur voit la page de confirmation
10. Clic sur "Aller au tableau de bord" → /dashboard
```

---

## ✅ Checklist de vérification

### Avant déploiement
- [x] Code modifié dans `App.vue`
- [x] Code modifié dans `ConfirmEmailPage.vue`
- [x] Code modifié dans `authStore.js`
- [x] Traductions ajoutées (`common.goToDashboard`)
- [ ] Tests locaux passés

### Configuration Supabase
- [ ] Site URL configuré : `https://doogoo.vercel.app`
- [ ] Redirect URLs incluent : `https://doogoo.vercel.app/**`
- [ ] Redirect URLs incluent : `http://localhost:5173/**` (dev)
- [ ] Templates email utilisent `{{ .ConfirmationURL }}`

### Tests production
- [ ] Création compte test réussie
- [ ] Email de confirmation reçu
- [ ] Lien de confirmation fonctionne
- [ ] Redirection vers `/confirm-email` fonctionne
- [ ] Bouton "Aller au tableau de bord" visible et fonctionnel

---

## 🚀 Déploiement

1. **Commit les changements** :
   ```bash
   git add .
   git commit -m "fix: Gestion des tokens de confirmation d'email dans le hash"
   git push origin main
   ```

2. **Vercel déploiera automatiquement**

3. **Vérifier après déploiement** :
   - Créer un nouveau compte de test
   - Tester le flux complet de confirmation

---

**✅ Fix terminé !** La redirection après confirmation d'email devrait maintenant fonctionner correctement en production.

