# 🔌 Guide d'Intégration - Templates Email Supabase

<div align="center">
  
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 16px;">
    <rect width="64" height="64" rx="12" fill="#2ECC71"/>
    <g transform="translate(16, 14)">
      <path d="M16 6L24 12L24 26L20 26L20 18L12 18L12 26L4 26L4 12L12 6Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="14" y="18" width="6" height="8" fill="#27AE60"/>
      <rect x="6" y="14" width="4" height="4" fill="#86EFAC" stroke="#27AE60" stroke-width="0.75"/>
      <rect x="22" y="14" width="4" height="4" fill="#86EFAC" stroke="#27AE60" stroke-width="0.75"/>
    </g>
  </svg>
  
  <h3 style="color: #2ECC71; margin: 0;">Doogoo Email System</h3>
  <p style="color: #666; margin: 8px 0 0;"><em>Designed for simplicity and trust</em></p>
</div>

Guide rapide pour intégrer les templates email dans votre projet Supabase.

---

## 📑 Sommaire

1. [Prérequis](#-prérequis)
2. [Étapes d'Intégration](#-étapes-dintégration)
3. [Test des Templates](#-test-des-templates)
4. [Variables Supabase](#️-variables-supabase)
5. [Configuration Supabase](#-configuration-supabase)
6. [Dépannage](#-dépannage)
7. [Maintenance](#-maintenance)
8. [Checklist finale](#-checklist-dintégration)
9. [Automatisation Cursor](#-automatisation-cursor)

---

## 🌍 Langues & Compatibilité

**Langues supportées** : Les emails sont actuellement en 🇫🇷 **français**. Une version 🇺🇸 **anglaise** peut être ajoutée via `emails/templates/en/`.

**Compatibilité PWA** : Les liens de confirmation fonctionnent aussi depuis les apps installées (PWA). Les utilisateurs peuvent confirmer leur compte ou réinitialiser leur mot de passe directement depuis l'application installée sur leur appareil.

**Charte Doogoo** :
- 🎨 Couleur principale : `#2ECC71` (vert digital)
- 📱 Design : Responsive et moderne
- ✨ Style : Minimaliste et professionnel

---

## 📋 Prérequis

1. Accès au **Dashboard Supabase** de votre projet
2. Rôle **Owner** ou **Admin** du projet
3. Les fichiers templates dans `emails/templates/`

---

## 🚀 Étapes d'Intégration

### Étape 1 : Accéder aux Templates

1. Ouvrir le [Dashboard Supabase](https://app.supabase.com)
2. Sélectionner votre projet **Doogoo**
3. Aller dans **Authentication** (menu gauche)
4. Cliquer sur **Email Templates** (sous-menu)

### Étape 2 : Mettre à Jour Chaque Template

Pour chaque template, répéter les étapes suivantes :

#### Template 1 : Confirmation Email (Signup)

1. Cliquer sur **Confirm signup** dans la liste
2. Ouvrir `emails/templates/confirmation.html`
3. **Copier tout le contenu** du fichier HTML
4. **Coller** dans le champ **HTML** du template Supabase
5. **Optionnel** : Modifier le **Subject** si nécessaire
   - Exemple : `Confirmer votre compte Doogoo`
6. Cliquer sur **Save**

#### Template 2 : Magic Link

1. Cliquer sur **Magic Link**
2. Ouvrir `emails/templates/magic_link.html`
3. Copier tout le contenu
4. Coller dans le champ HTML
5. **Subject** : `Connexion à Doogoo`
6. **Save**

#### Template 3 : Reset Password

1. Cliquer sur **Reset Password**
2. Ouvrir `emails/templates/reset_password.html`
3. Copier tout le contenu
4. Coller dans le champ HTML
5. **Subject** : `Réinitialiser votre mot de passe Doogoo`
6. **Save**

#### Template 4 : Invite User

1. Cliquer sur **Invite User**
2. Ouvrir `emails/templates/invite_user.html`
3. Copier tout le contenu
4. Coller dans le champ HTML
5. **Subject** : `Invitation à rejoindre Doogoo`
6. **Save**

#### Template 5 : Change Email

1. Cliquer sur **Change Email Address**
2. Ouvrir `emails/templates/change_email.html`
3. Copier tout le contenu
4. Coller dans le champ HTML
5. **Subject** : `Confirmer votre nouvelle adresse email Doogoo`
6. **Save**

---

## 🧪 Test des Templates

### Test Manuel

1. **Confirmation Email** :
   - Créer un nouveau compte test
   - Vérifier la réception de l'email
   - Cliquer sur le lien de confirmation

2. **Magic Link** :
   - Utiliser "Se connecter avec Magic Link"
   - Vérifier la réception
   - Tester la connexion

3. **Reset Password** :
   - Demander une réinitialisation
   - Vérifier l'email reçu
   - Tester le lien

4. **Invite User** :
   - Inviter un utilisateur depuis le Dashboard
   - Vérifier l'email d'invitation

5. **Change Email** :
   - Changer l'email dans les paramètres
   - Vérifier l'email de confirmation

### Vérifications Visuelles

Pour chaque email reçu, vérifier :

- ✅ Logo Doogoo affiché correctement
- ✅ Couleur verte (#2ECC71) appliquée
- ✅ Boutons cliquables et centrés
- ✅ Footer avec liens Support/Privacy
- ✅ Responsive sur mobile
- ✅ Texte lisible et bien formaté

---

## ⚙️ Variables Supabase

Les templates utilisent des variables Supabase qui sont automatiquement remplacées :

| Variable | Description | Templates |
|----------|-------------|-----------|
| `{{ .ConfirmationURL }}` | Lien de confirmation/action | Tous |
| `{{ .SiteURL }}` | URL du site (définie dans Supabase) | Footer de tous |
| `{{ .Email }}` | Adresse email | change_email |
| `{{ .InvitedBy }}` | Nom de l'inviteur | invite_user |

**Important** : Assurez-vous que `SiteURL` est correctement configuré dans **Authentication** > **URL Configuration**.

---

## 🔧 Configuration Supabase

### URLs de Redirection

1. Aller dans **Authentication** > **URL Configuration**
2. Configurer :
   - **Site URL** : `https://vylo.app` (ou votre domaine)
   - **Redirect URLs** : 
     - `https://vylo.app/**`
     - `http://localhost:5173/**` (dev)

### Expiration des Liens

Les durées d'expiration peuvent être configurées dans **Authentication** > **Email Auth** :
- **Confirmation Email** : 24h (par défaut)
- **Magic Link** : 1h (par défaut)
- **Reset Password** : 1h (par défaut)
- **Invite** : 7 jours (par défaut)

---

## 🐛 Dépannage

### Les emails ne s'affichent pas correctement

- Vérifier que tout le HTML a été copié (pas seulement une partie)
- Vérifier qu'il n'y a pas d'erreurs de syntaxe HTML
- Tester dans différents clients email (Gmail, Outlook, Apple Mail)

### Les liens ne fonctionnent pas

- Vérifier que `{{ .ConfirmationURL }}` est présent dans le template
- Vérifier la configuration des URLs de redirection dans Supabase
- Tester avec un compte réel (pas seulement preview)

### Le logo ne s'affiche pas

- Vérifier que l'URL du logo est accessible (hébergée publiquement)
- Utiliser une URL HTTPS
- Vérifier les permissions du fichier/image

---

## 📝 Maintenance

### Mettre à Jour un Template

1. Modifier le fichier HTML local
2. Tester localement (ouvrir dans navigateur)
3. Copier dans Supabase Dashboard
4. Tester l'envoi réel
5. Commiter les changements

### Synchroniser les Changements

Les templates dans ce repo sont la **source de vérité**. Après chaque modification dans Supabase, mettre à jour les fichiers locaux pour garder la synchronisation.

---

## ✅ Checklist d'Intégration

Avant de considérer l'intégration comme complète :

- [ ] Tous les templates copiés dans Supabase
- [ ] Subjects personnalisés configurés
- [ ] SiteURL configuré correctement
- [ ] URLs de redirection configurées
- [ ] Test d'envoi réussi pour chaque template
- [ ] Vérification visuelle sur Gmail, Outlook, Apple Mail
- [ ] Liens fonctionnels testés
- [ ] Logo/images affichés correctement
- [ ] Documentation mise à jour si nécessaire

---

---

## 🤖 Automatisation Cursor

### Prompt Cursor — Vérification automatique

Copiez ce prompt dans Cursor pour automatiser la validation et l'audit des templates :

```markdown
💯 **Audit Automatique des Templates Email Doogoo**

Exécute un audit complet des templates email pour Doogoo :

1. **Vérifier l'existence du dossier** `emails/templates/`
2. **S'assurer que les fichiers suivants sont présents** :
   - confirmation.html
   - magic_link.html
   - reset_password.html
   - invite_user.html
   - change_email.html

3. **Pour chaque template, vérifier** :
   - Présence de `{{ .ConfirmationURL }}` (ou variables requises selon le template)
   - Présence de `{{ .SiteURL }}` dans le footer
   - Structure HTML valide (`<!DOCTYPE html>`, `<html>`, etc.)
   - Présence du logo Doogoo (SVG ou référence)
   - Couleur principale `#2ECC71` dans les styles
   - Bouton(s) d'action avec classe "button"
   - Media queries pour le responsive
   - Footer avec liens Support/Privacy

4. **Vérifier le fichier de configuration** :
   - `emails/config.json` existe
   - Couleur principale = `#2ECC71`
   - URLs de support et site définies

5. **Générer un rapport** `emails/EMAIL_AUDIT.md` avec :
   - Liste des templates valides ✅
   - Liste des erreurs trouvées ❌ (balises manquantes, variables manquantes)
   - Liste des avertissements ⚠️ (éléments recommandés manquants)
   - Statut global par template
   - Recommandations d'amélioration

6. **Exécuter** `node scripts/audit-email-templates.js` pour générer le rapport

7. **Afficher un résumé** avec le nombre de templates valides, erreurs et avertissements
```

### Exécution

Pour lancer l'audit automatiquement :

```bash
# Exécuter le script d'audit
npm run email:audit

# Ou directement avec Node.js
node scripts/audit-email-templates.js
```

Le rapport sera généré dans `emails/EMAIL_AUDIT.md`.

---

## 📚 Ressources Complémentaires

- **[EMAIL_TEMPLATES_GUIDE.md](../docs/EMAIL_TEMPLATES_GUIDE.md)** : Guide complet avec charte graphique, variables, bonnes pratiques
- **[README.md](./README.md)** : Introduction aux templates email
- **[Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)** : Documentation officielle

---

<div align="center">

**✉️ Doogoo Email System — Designed for simplicity and trust.**

*Dernière mise à jour : 2025-11-01*

</div>

