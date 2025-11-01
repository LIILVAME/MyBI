# 📧 Guide des Templates Email Vylo

Ce guide documente les templates d'email Supabase personnalisés pour Vylo, leurs règles graphiques, et les bonnes pratiques de maintenance.

---

## 📋 Table des matières

1. [Structure des Templates](#structure-des-templates)
2. [Charte Graphique Vylo](#charte-graphique-vylo)
3. [Templates Disponibles](#templates-disponibles)
4. [Variables Supabase](#variables-supabase)
5. [Configuration](#configuration)
6. [Intégration Supabase](#intégration-supabase)
7. [Tests et Validation](#tests-et-validation)
8. [Bonnes Pratiques](#bonnes-pratiques)
9. [Maintenance](#maintenance)

---

## 📁 Structure des Templates

```
emails/
├── config.json              # Configuration globale (couleurs, URLs, etc.)
├── assets/                  # Images, logos (optionnel)
└── templates/               # Templates HTML
    ├── confirmation.html    # Confirmation de compte (signup)
    ├── magic_link.html      # Connexion sans mot de passe
    ├── reset_password.html  # Réinitialisation mot de passe
    ├── invite_user.html     # Invitation utilisateur
    └── change_email.html    # Changement d'adresse email
```

---

## 🎨 Charte Graphique Vylo

### Palette de Couleurs

| Élément | Couleur | Usage |
|---------|---------|-------|
| **Couleur principale** | `#2ECC71` | Boutons, liens, logo |
| **Couleur principale hover** | `#27AE60` | État hover des boutons |
| **Texte principal** | `#1A1A1A` | Titres, texte principal |
| **Texte secondaire** | `#666666` | Sous-titres, texte secondaire |
| **Fond** | `#FFFFFF` | Arrière-plan principal |
| **Fond clair** | `#F5F7FA` | Zones secondaires |
| **Bordure** | `#E5E7EB` | Séparateurs, bordures |

### Typographie

- **Police principale** : `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Taille titre** : 24px (desktop) / 22px (mobile)
- **Taille texte** : 16px (corps) / 14px (secondaire)
- **Hauteur de ligne** : 1.6

### Principes de Design

1. **Minimalisme** : Design épuré, pas de surcharge visuelle
2. **Cohérence** : Même structure pour tous les emails
3. **Lisibilité** : Contraste suffisant, texte bien espacé
4. **Responsive** : Adaptation automatique mobile/desktop
5. **Accessibilité** : Alt text pour images, contraste WCAG AA

---

## 📧 Templates Disponibles

### 1. Confirmation Email (`confirmation.html`)

**Usage** : Envoyé lors de l'inscription pour confirmer l'adresse email.

**Variables utilisées** :
- `{{ .ConfirmationURL }}` : Lien de confirmation
- `{{ .SiteURL }}` : URL du site

**Contenu** :
- Titre : "Bienvenue sur Vylo !"
- Bouton : "Confirmer mon compte"
- Validité : 24 heures

---

### 2. Magic Link (`magic_link.html`)

**Usage** : Connexion sans mot de passe (authentification par lien).

**Variables utilisées** :
- `{{ .ConfirmationURL }}` : Lien de connexion
- `{{ .SiteURL }}` : URL du site

**Contenu** :
- Titre : "Connexion à Vylo"
- Bouton : "Se connecter à Vylo"
- Validité : 1 heure

---

### 3. Reset Password (`reset_password.html`)

**Usage** : Réinitialisation du mot de passe.

**Variables utilisées** :
- `{{ .ConfirmationURL }}` : Lien de réinitialisation
- `{{ .SiteURL }}` : URL du site

**Contenu** :
- Titre : "Réinitialiser votre mot de passe"
- Bouton : "Réinitialiser mon mot de passe"
- Validité : 1 heure
- Avertissement sécurité : Mise en évidence

---

### 4. Invite User (`invite_user.html`)

**Usage** : Invitation d'un nouvel utilisateur.

**Variables utilisées** :
- `{{ .ConfirmationURL }}` : Lien d'invitation
- `{{ .InvitedBy }}` : Nom de l'inviteur
- `{{ .SiteURL }}` : URL du site

**Contenu** :
- Titre : "Vous êtes invité(e) à rejoindre Vylo"
- Bouton : "Accepter l'invitation"
- Validité : 7 jours

---

### 5. Change Email (`change_email.html`)

**Usage** : Confirmation du changement d'adresse email.

**Variables utilisées** :
- `{{ .ConfirmationURL }}` : Lien de confirmation
- `{{ .Email }}` : Nouvelle adresse email
- `{{ .SiteURL }}` : URL du site

**Contenu** :
- Titre : "Confirmer votre nouvelle adresse email"
- Bouton : "Confirmer cette adresse"
- Affichage de la nouvelle adresse
- Validité : 24 heures

---

## 🔧 Variables Supabase

Supabase utilise des variables Go templates dans les emails. Variables disponibles :

| Variable | Description | Templates |
|----------|-------------|-----------|
| `{{ .ConfirmationURL }}` | Lien de confirmation/action | Tous |
| `{{ .Token }}` | Token de sécurité | Optionnel |
| `{{ .TokenHash }}` | Hash du token | Optionnel |
| `{{ .Email }}` | Adresse email | change_email |
| `{{ .SiteURL }}` | URL du site | Tous (footer) |
| `{{ .InvitedBy }}` | Nom de l'inviteur | invite_user |
| `{{ .RedirectTo }}` | URL de redirection | Optionnel |

**Note** : Les variables disponibles peuvent varier selon le type d'email. Consultez la [documentation Supabase](https://supabase.com/docs/guides/auth/auth-email-templates) pour la liste complète.

---

## ⚙️ Configuration

Le fichier `emails/config.json` contient la configuration globale :

```json
{
  "logo_url": "https://liilvame.github.io/Vylo/icons/icon-192x192.png",
  "primary_color": "#2ECC71",
  "support_email": "support@vylo.app",
  "support_url": "https://vylo.app/support",
  "website_url": "https://vylo.app",
  "company_name": "Vylo",
  "font_family": "Inter, -apple-system, ..."
}
```

---

## 🔌 Intégration Supabase

### Méthode 1 : Via Dashboard Supabase

1. Accéder à **Authentication** > **Email Templates**
2. Sélectionner le template (ex: "Confirm signup")
3. Coller le contenu HTML du template correspondant
4. Cliquer sur **Save**

### Méthode 2 : Via API Supabase

```bash
# Exemple : Mettre à jour le template de confirmation
curl -X PUT 'https://<project-ref>.supabase.co/rest/v1/auth/email_templates' \
  -H "apikey: <service-role-key>" \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "confirmation",
    "subject": "Confirmer votre compte Vylo",
    "body": "<!DOCTYPE html>..."
  }'
```

**⚠️ Important** : Les templates doivent être mis à jour manuellement dans le Dashboard Supabase. Les fichiers dans `emails/templates/` servent de référence versionnée.

---

## 🧪 Tests et Validation

### Test Manuel

1. **Environnement de test** :
   - Utiliser un projet Supabase de développement
   - Configurer un compte email de test
   - Déclencher chaque type d'email (signup, reset, etc.)

2. **Vérifications** :
   - ✅ Rendu dans Gmail (web + mobile)
   - ✅ Rendu dans Outlook
   - ✅ Rendu dans Apple Mail (iOS)
   - ✅ Liens fonctionnels
   - ✅ Boutons cliquables
   - ✅ Responsive (mobile)
   - ✅ Couleurs respectées
   - ✅ Logo/images affichées

### Outils de Test

- **[Email on Acid](https://www.emailonacid.com/)** : Test multi-clients
- **[Litmus](https://www.litmus.com/)** : Prévisualisation multi-clients
- **[Mailtrap](https://mailtrap.io/)** : Capture emails en développement

### Checklist de Validation

Pour chaque template :

- [ ] HTML valide (pas d'erreurs)
- [ ] Toutes les variables Supabase présentes
- [ ] Couleurs conformes à la charte
- [ ] Responsive (max-width: 600px)
- [ ] Boutons avec hover state
- [ ] Alt text pour images
- [ ] Footer avec liens support/privacy
- [ ] Notice de sécurité (si applicable)
- [ ] Testé sur Gmail, Outlook, Apple Mail

---

## ✅ Bonnes Pratiques

### Accessibilité

1. **Contraste** : Ratio minimum 4.5:1 pour le texte
2. **Alt text** : Toujours définir `alt` pour les images
3. **Liens** : Texte descriptif, pas seulement "cliquez ici"
4. **Structure** : Utiliser `<h1>`, `<h2>` pour la hiérarchie

### Compatibilité

1. **CSS inline** : Privilégier les styles inline (Gmail ne supporte pas `<style>` dans `<head>`)
2. **Tables** : Utiliser `<table>` pour la structure (compatibilité Outlook)
3. **Polices** : Fournir des fallbacks (sans-serif)
4. **Images** : Hosting externe, jamais en pièce jointe

### Sécurité

1. **Liens** : Toujours utiliser HTTPS
2. **Validité** : Mentionner la durée de validité des liens
3. **Avertissements** : Ajouter des notices de sécurité si nécessaire
4. **Phishing** : Ne jamais demander de mots de passe par email

---

## 🔄 Maintenance

### Modifier un Template

1. Éditer le fichier HTML dans `emails/templates/`
2. Tester localement (ouvrir dans un navigateur)
3. Valider le HTML (outil en ligne)
4. Copier le contenu dans Supabase Dashboard
5. Tester l'envoi réel
6. Commiter les changements dans Git

### Mettre à Jour les Couleurs

1. Modifier `emails/config.json`
2. Remplacer les couleurs dans tous les templates
3. Utiliser `find` et `replace` :
   ```bash
   # Remplacer #2ECC71 par #NouvelleCouleur
   find emails/templates -name "*.html" -exec sed -i '' 's/#2ECC71/#NouvelleCouleur/g' {} \;
   ```

### Ajouter un Nouveau Template

1. Créer `emails/templates/nouveau_template.html`
2. Utiliser la structure de base des autres templates
3. Adapter le contenu selon le besoin
4. Documenter dans ce guide
5. Ajouter dans Supabase Dashboard

### Changer le Logo

1. Héberger le logo (GitHub Pages, CDN, etc.)
2. Mettre à jour `logo_url` dans `config.json`
3. Remplacer l'URL dans tous les templates :
   ```bash
   find emails/templates -name "*.html" -exec sed -i '' 's|old-logo-url|new-logo-url|g' {} \;
   ```

---

## 📝 Versioning

Les templates sont versionnés dans Git. Chaque modification doit être :

1. Testée localement
2. Validée sur Supabase
3. Commitée avec un message descriptif
4. Documentée dans ce guide si changement majeur

**Exemple de commit** :
```bash
git add emails/
git commit -m "feat(emails): update confirmation template with new logo"
```

---

## 🔗 Ressources

- [Documentation Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Go Templates Documentation](https://pkg.go.dev/text/template)
- [Email Design Guidelines](https://www.campaignmonitor.com/dev-resources/)
- [HTML Email Best Practices](https://www.smashingmagazine.com/2021/04/complete-guide-html-email-templates-tools/)

---

## 📞 Support

Pour toute question ou problème avec les templates :

1. Vérifier ce guide
2. Consulter la documentation Supabase
3. Contacter : `support@vylo.app`

---

**Dernière mise à jour** : 2025-11-01  
**Version** : 1.0.0

