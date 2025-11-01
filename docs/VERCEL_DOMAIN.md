# 🌐 Configuration des Domaines Vercel

## 📋 Comportement après Renommage

Quand vous renommez un projet dans Vercel Dashboard, **le domaine par défaut ne change pas automatiquement** pour préserver la stabilité des déploiements.

### 🔍 Domaines Disponibles

Vercel génère plusieurs domaines pour chaque projet :

1. **Domaine principal** : `[project-name].vercel.app`
2. **Domaines de branche** : `[project-name]-[git-hash].vercel.app`
3. **Domaine de production** : Défini dans Settings → Domains

---

## ✅ Solution 1 : Vérifier le Domaine Généré

### Étape 1 : Accéder aux Domaines

1. Ouvrir [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet **Vylo**
3. Aller dans **Settings → Domains**

### Étape 2 : Voir les Domaines Actifs

Vous devriez voir :
- `vylo.vercel.app` (nouveau domaine généré)
- `my-bi.vercel.app` (ancien domaine, toujours actif pour compatibilité)

### Étape 3 : Tester le Nouveau Domaine

Visitez directement : **https://vylo.vercel.app**

Si ça fonctionne, vous pouvez :
- Utiliser ce nouveau domaine
- Ou configurer un domaine personnalisé (voir Solution 2)

---

## ✅ Solution 2 : Configurer un Domaine Personnalisé

### Option A : Domaine Gratuit Vercel

1. **Settings → Domains → Add Domain**
2. Entrer : `vylo.vercel.app` (ou votre domaine personnalisé)
3. Vercel génère automatiquement les enregistrements DNS
4. Suivre les instructions pour configurer DNS

### Option B : Domaine Externe (Ex: vylo.com)

1. **Settings → Domains → Add Domain**
2. Entrer votre domaine : `vylo.com` (ou `www.vylo.com`)
3. Vercel affiche les enregistrements DNS à configurer
4. Mettre à jour les DNS chez votre registrar :
   - Type : `CNAME`
   - Valeur : `cname.vercel-dns.com`

---

## ✅ Solution 3 : Redéployer pour Forcer la Mise à Jour

Si le domaine `vylo.vercel.app` n'est pas encore disponible :

### Via Dashboard

1. **Deployments** → Sélectionner le dernier déploiement
2. Cliquer sur **"Redeploy"** (⋯ → Redeploy)
3. Vérifier le nouveau domaine après déploiement

### Via CLI

```bash
# Redéployer depuis le terminal
vercel --prod
```

---

## 🔍 Vérification

### Commandes Utiles

```bash
# Lister les domaines du projet
vercel domains ls

# Inspecter un déploiement
vercel inspect [deployment-url]

# Voir les informations du projet
vercel project ls
```

---

## ⚙️ Configuration Recommandée

### 1. Domaine Principal

Dans **Settings → General** :
- **Production Domain** : `vylo.vercel.app` (ou votre domaine personnalisé)
- **Preview Domain** : Auto-généré par Vercel

### 2. Redirections (Optionnel)

Si vous voulez rediriger l'ancien domaine vers le nouveau :

1. **Settings → Domains**
2. Ajouter une redirection :
   - De : `my-bi.vercel.app`
   - Vers : `vylo.vercel.app`
   - Type : Permanent (301)

### 3. Variables d'Environnement

Vérifier que toutes les variables d'environnement sont toujours configurées :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📝 Notes Importantes

- **Les anciens domaines restent actifs** pour éviter les ruptures
- **Le nouveau domaine `vylo.vercel.app`** devrait être disponible immédiatement
- **Un redéploiement** peut être nécessaire pour que tous les domaines soient synchronisés
- **Les domaines de branche** (preview) sont automatiquement mis à jour

---

## 🎯 Actions Immédiates

1. ✅ Vérifier **Settings → Domains** dans Vercel Dashboard
2. ✅ Tester **https://vylo.vercel.app**
3. ✅ Si nécessaire, redéployer le projet
4. ✅ Mettre à jour les liens/bookmarks vers le nouveau domaine
5. ✅ (Optionnel) Configurer une redirection depuis l'ancien domaine

---

**Besoin d'aide ?** Consultez la [documentation Vercel sur les domaines](https://vercel.com/docs/concepts/projects/domains)

