# 📋 Checklist Variables d'Environnement Vercel

## 🔍 Vérification dans Vercel Dashboard

### Étapes

1. **Aller sur** : [Vercel Dashboard](https://vercel.com/dashboard)
2. **Sélectionner le projet** : `doogoo` (ou `MyBI`)
3. **Naviguer vers** : **Settings → Environment Variables**

### Variables Requises

| Nom de Variable | Valeur Exemple | Incluse dans Build ? |
|----------------|----------------|---------------------|
| `VITE_SUPABASE_URL` | `https://hvhcyraudbabctsrxpqr.supabase.co` | ✅ **OUI** |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (clé publique) | ✅ **OUI** |
| `VITE_APP_NAME` | `Doogoo` | ✅ **OUI** |
| `VITE_ADMIN_EMAIL` | `votre@email.com` | ✅ **OUI** |
| `VITE_SENTRY_DSN` | `https://...@...sentry.io/...` | ⚠️ Optionnel |

### ⚠️ Important

- **`VITE_*`** variables doivent être **"Included in Build"** ✅
- Les variables non préfixées `VITE_` ne sont **PAS** accessibles dans le code client
- Après ajout/modification → **Redeploy** nécessaire

### Actions à Effectuer

1. ✅ Vérifier chaque variable existe
2. ✅ Vérifier "Included in Build" est coché
3. ✅ Si manquante → **Add** → Valeur → **Save**
4. ✅ **Redeploy** le dernier déploiement ou créer un nouveau commit

---

## 🔧 Configuration Vercel

### Build Settings

- **Framework Preset** : Vite
- **Build Command** : `npm run build` (défaut)
- **Output Directory** : `dist`
- **Install Command** : `npm install` (défaut)

### Domaine

- **Production Domain** : `doogoo.vercel.app` ou `doogoo.app`
- Vérifier les **Custom Domains** si configuré

---

## 🚨 Problèmes Courants

### 1. Variable manquante au build

**Symptôme** : `ReferenceError: import.meta.env.VITE_SUPABASE_URL is undefined`

**Solution** : Vérifier "Included in Build" dans Vercel Dashboard

### 2. Variable mal typée

**Symptôme** : Erreur `VITE_SUPABASE_URL` non trouvée

**Solution** : Vérifier l'orthographe exacte (majuscules/minuscules)

### 3. Cache de build

**Symptôme** : Variables mises à jour mais pas appliquées

**Solution** : Forcer un redeploy complet (nouveau commit)

---

## 📝 Commande de Vérification Locale

```bash
# Vérifier que les variables sont bien utilisées dans le code
grep -r "import.meta.env.VITE_" src/
```

