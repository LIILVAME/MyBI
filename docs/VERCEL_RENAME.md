# 🔄 Renommer le projet dans Vercel

> **Note** : Ce document explique comment renommer le projet Vercel si vous avez migré depuis l'ancien nom.

## 📋 Étapes pour changer le nom du projet Vercel

Le nom du projet dans Vercel est indépendant du code source. Vous devez le changer manuellement dans le Dashboard Vercel.

### 🎯 Option 1 : Via le Dashboard Vercel (Recommandé)

1. **Connectez-vous à Vercel** : [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Sélectionnez votre projet** :
   - Trouvez le projet actuel (si vous migrez depuis un ancien nom)
   - Cliquez dessus pour ouvrir les paramètres du projet

3. **Accédez aux paramètres** :
   - Cliquez sur **"Settings"** (Paramètres) dans le menu de navigation du projet
   - Ou utilisez l'URL directe : `https://vercel.com/[votre-team]/[nom-projet]/settings`

4. **Renommez le projet** :
   - Allez dans la section **"General"** (Général)
   - Trouvez le champ **"Project Name"** (Nom du projet)
   - Changez l'ancien nom en **"Vylo"**
   - Cliquez sur **"Save"** (Enregistrer)

5. **Vérifiez le déploiement** :
   - Le projet sera maintenant accessible sous le nouveau nom
   - L'URL de déploiement pourrait changer selon votre configuration
   - Exemple : `vylo.vercel.app`

### 🔧 Option 2 : Via la CLI Vercel (Alternative)

Si vous avez installé la CLI Vercel :

```bash
# Installer la CLI Vercel (si pas déjà fait)
npm i -g vercel

# Vous connecter
vercel login

# Lier le projet
vercel link

# Le projet sera reconnu avec le nouveau nom depuis le code
```

### 📝 Notes importantes

- **Le fichier `vercel.json`** ne contient pas le nom du projet - il est géré par Vercel Dashboard
- **L'URL de déploiement** peut changer si vous utilisez un nom de projet personnalisé
- **Les variables d'environnement** restent intactes après le renommage
- **Les déploiements précédents** conservent leur historique

### ✅ Après le renommage

1. Vérifiez que le nouveau nom apparaît dans le Dashboard Vercel
2. Testez l'URL de déploiement pour confirmer qu'elle fonctionne
3. Mettez à jour les bookmarks et liens externes si nécessaire
4. Vérifiez que les variables d'environnement sont toujours configurées correctement

---

**Besoin d'aide ?** Consultez la [documentation Vercel](https://vercel.com/docs/projects/overview/project-settings)

