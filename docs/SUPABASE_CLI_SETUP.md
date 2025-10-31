# 🔗 Configuration Supabase CLI - MyBI

## ✅ Statut actuel

- ✅ Supabase CLI installé (v2.34.3 - mise à jour recommandée vers v2.54.11)
- ✅ CLI ajouté comme devDependency dans `package.json`
- ⏳ Projet non encore lié (nécessite authentification)
- ⏳ Fichier `.env` à créer

---

## 📋 Étapes de configuration

### 1️⃣ Se connecter à Supabase

```bash
npx supabase login
```

👉 Obtenez votre **access token** depuis :
https://supabase.com/dashboard/account/tokens

> 💡 **Important** : Le token ne s'affiche qu'une seule fois. Gardez la fenêtre ouverte pendant la saisie.

---

### 2️⃣ Lier le projet local

```bash
npx supabase link --project-ref hvhcyraudbabctsrxpqr
```

Cette commande va :
- Créer `.supabase/config.toml` avec la configuration du projet
- Associer le répertoire local au projet Supabase distant

---

### 3️⃣ Vérifier la connexion

```bash
npx supabase status
```

✅ Résultat attendu :
```
✔ Linked project: hvhcyraudbabctsrxpqr
✔ API URL: https://hvhcyraudbabctsrxpqr.supabase.co
✔ Status: online
```

---

### 4️⃣ Synchroniser le schéma distant

```bash
npx supabase db pull
```

Cette commande télécharge le schéma SQL actuel vers :
```
supabase/migrations/remote_schema.sql
```

> 📝 Permet de comparer la base distante avec votre code local.

---

### 5️⃣ Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec :

```env
# Supabase Configuration
# Récupère ces valeurs depuis : https://supabase.com/dashboard/project/hvhcyraudbabctsrxpqr/settings/api

VITE_SUPABASE_URL=https://hvhcyraudbabctsrxpqr.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_from_dashboard>

# Optionnel : Pour les Edge Functions et tests locaux
# SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key_from_dashboard>
```

👉 **Où trouver les clés** :
1. Aller sur https://supabase.com/dashboard/project/hvhcyraudbabctsrxpqr/settings/api
2. Copier l'**URL** (Project URL)
3. Copier la **anon/public key**
4. (Optionnel) Copier la **service_role key** (⚠️ gardez-la secrète)

---

### 6️⃣ Vérifier les variables d'environnement

```bash
# Vérifier que les variables sont chargées
cat .env
```

---

### 7️⃣ Tester la connexion

```bash
# Lister les fonctions Edge (test de connexion)
npx supabase functions list
```

✅ Résultat attendu :
```
Functions:
  checkAlerts
  generateMonthlyReport
```

---

## 🎯 Commandes CLI utiles

### Gestion des migrations

```bash
# Créer une nouvelle migration
npx supabase migration new <nom_migration>

# Appliquer les migrations locales
npx supabase db push

# Voir les migrations appliquées
npx supabase migration list
```

### Edge Functions

```bash
# Lister les fonctions
npx supabase functions list

# Déployer une fonction
npx supabase functions deploy <nom_fonction>

# Tester une fonction localement
npx supabase functions serve <nom_fonction>
```

### Database

```bash
# Ouvrir le SQL Editor dans le navigateur
npx supabase db open

# Générer les types TypeScript depuis le schéma
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## ✅ Vérification finale

Une fois toutes les étapes terminées, vérifiez que :

- ✅ Le projet est lié (`npx supabase status` affiche les infos)
- ✅ Le fichier `.env` existe et contient les bonnes clés
- ✅ Le schéma est synchronisé (`supabase/migrations/remote_schema.sql` existe)
- ✅ Les commandes CLI fonctionnent (`functions list`, `db pull`)

---

## 🔧 Dépannage

### Erreur "Project not linked"

```bash
npx supabase link --project-ref hvhcyraudbabctsrxpqr
```

### Erreur "Not logged in"

```bash
npx supabase login
```

### Erreur "Cannot connect to Docker"

Le CLI local nécessite Docker pour certaines fonctionnalités. Pour la connexion distante, Docker n'est pas requis.

### Variables d'environnement non chargées

Vérifiez que :
1. Le fichier `.env` existe à la racine
2. Les variables commencent par `VITE_` pour Vite
3. Vous redémarrez le serveur de dev après modification

---

## 📚 Documentation

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli/introduction)
- [Project Settings](https://supabase.com/dashboard/project/hvhcyraudbabctsrxpqr/settings/api)

