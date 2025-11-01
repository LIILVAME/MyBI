# 📧 Templates Email Vylo

Ce dossier contient les templates d'email personnalisés pour Supabase Auth, alignés sur l'identité visuelle Vylo.

## 📁 Structure

```
emails/
├── config.json           # Configuration globale (couleurs, URLs)
├── assets/              # Images et logos (optionnel)
├── templates/           # Templates HTML
│   ├── confirmation.html
│   ├── magic_link.html
│   ├── reset_password.html
│   ├── invite_user.html
│   └── change_email.html
└── README.md           # Ce fichier
```

## 🚀 Utilisation

### Intégration dans Supabase

1. Ouvrir le **Dashboard Supabase**
2. Aller dans **Authentication** > **Email Templates**
3. Pour chaque template :
   - Ouvrir le fichier HTML correspondant dans `templates/`
   - Copier tout le contenu
   - Coller dans le champ HTML du template Supabase
   - Cliquer sur **Save**

### Templates disponibles

- **confirmation.html** : Confirmation de compte (signup)
- **magic_link.html** : Connexion sans mot de passe
- **reset_password.html** : Réinitialisation mot de passe
- **invite_user.html** : Invitation utilisateur
- **change_email.html** : Changement d'adresse email

## 🎨 Charte Graphique

- **Couleur principale** : `#2ECC71` (vert Vylo)
- **Police** : Inter, system fonts
- **Style** : Minimaliste, moderne, responsive

## 📖 Documentation Complète

Voir [docs/EMAIL_TEMPLATES_GUIDE.md](../docs/EMAIL_TEMPLATES_GUIDE.md) pour :
- Détails de chaque template
- Variables Supabase disponibles
- Guide de maintenance
- Bonnes pratiques

## ⚠️ Note Importante

Les templates dans ce dossier sont **versionnés** mais doivent être **copiés manuellement** dans le Dashboard Supabase. Ils ne sont pas appliqués automatiquement.

## 🔄 Maintenance

Pour modifier un template :
1. Éditer le fichier HTML
2. Tester localement
3. Copier dans Supabase Dashboard
4. Tester l'envoi réel
5. Commiter les changements

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-11-01

