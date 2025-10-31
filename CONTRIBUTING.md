# 🤝 Guide de contribution

Merci de votre intérêt pour contribuer à MyBI ! Ce document fournit les guidelines pour contribuer au projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Convention de commits](#convention-de-commits)
- [Processus de Pull Request](#processus-de-pull-request)

---

## 📜 Code de conduite

Ce projet adhère au [Code de Conduite](CODE_OF_CONDUCT.md). En participant, vous acceptez de respecter ce code.

---

## 🚀 Comment contribuer

### Types de contributions

Nous acceptons différents types de contributions :

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📝 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- ⚡ **Optimisations de performance**
- ♿ **Améliorations d'accessibilité**
- 🧪 **Tests**

### Avant de commencer

1. **Vérifier les issues existantes** : Regardez si votre contribution n'a pas déjà été proposée
2. **Créer une issue** : Pour les grosses fonctionnalités, créez d'abord une issue pour discuter
3. **Assigner l'issue** : Si vous travaillez sur une issue existante, assignez-la à vous-même

---

## 💻 Processus de développement

### 1. Fork et clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/votre-username/mybi.git
cd mybi
```

### 2. Créer une branche

```bash
# Créer une branche depuis main
git checkout -b feature/ma-fonctionnalite
# ou
git checkout -b fix/correction-bug
# ou
git checkout -b docs/amelioration-doc
```

**Convention de nommage des branches** :
- `feature/` : Nouvelles fonctionnalités
- `fix/` : Corrections de bugs
- `docs/` : Documentation
- `refactor/` : Refactorisation
- `test/` : Tests
- `style/` : Formatage/style

### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

### 5. Faire vos modifications

- Suivez les [standards de code](#standards-de-code)
- Testez vos changements localement
- Vérifiez que le build fonctionne : `npm run build`

### 6. Commiter vos changements

```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
```

Suivez la [convention de commits](#convention-de-commits).

### 7. Pousser vers votre fork

```bash
git push origin feature/ma-fonctionnalite
```

### 8. Créer une Pull Request

- Allez sur GitHub et créez une PR depuis votre fork
- Remplissez le template de PR
- Ajoutez des screenshots si UI modifiée
- Référencez les issues liées avec `Closes #123`

---

## 📐 Standards de code

### Vue 3 - Composition API

Utilisez `<script setup>` pour tous les nouveaux composants :

```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### Style de code

- **Indentation** : 2 espaces
- **Guillemets** : Simple quotes pour JS, double pour HTML
- **Noms de composants** : PascalCase
- **Noms de fichiers** : PascalCase pour composants, kebab-case pour utilitaires

### Tailwind CSS

- Utilisez les classes Tailwind plutôt que du CSS custom
- Respectez le design system défini dans `tailwind.config.js`
- Utilisez les utilitaires plutôt que des styles inline

### Exemple de composant

```vue
<template>
  <div class="card">
    <h3 class="text-xl font-bold mb-4">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String
})
</script>
```

---

## 📝 Convention de commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation uniquement
- `style` : Formatage, point-virgules manquants, etc.
- `refactor` : Refactorisation du code
- `perf` : Amélioration de performance
- `test` : Ajout/modification de tests
- `chore` : Tâches de maintenance (build, dépendances, etc.)

### Exemples

```bash
feat(dashboard): ajout du filtre par statut
fix(sidebar): correction du menu mobile
docs(readme): mise à jour des instructions d'installation
style(components): formatage avec Prettier
refactor(api): simplification de la logique de fetch
perf(dashboard): optimisation du rendu des cartes
test(utils): ajout de tests pour formatDate
chore(deps): mise à jour de Vue vers 3.4.21
```

### Scope (optionnel)

Le scope indique la partie du code affectée :
- `dashboard`, `landing`, `sidebar`, `api`, `router`, etc.

---

## 🔍 Processus de Pull Request

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai testé mes changements localement
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests si nécessaire

## Screenshots (si UI modifiée)
<!-- Ajouter des captures d'écran -->

## Issues liées
Closes #123
```

### Revue de code

- ✅ Votre PR sera revue par au moins un mainteneur
- 💬 Répondez aux commentaires de manière constructive
- 🔄 Faites les modifications demandées si nécessaire
- ✅ Une fois approuvée, votre PR sera mergée

### Critères d'acceptation

- ✅ Code respecte les standards
- ✅ Build réussi sans erreurs
- ✅ Tests passent (quand disponibles)
- ✅ Documentation à jour
- ✅ Pas de régression introduite

---

## 🐛 Signaler un bug

### Avant de créer une issue

1. Vérifiez que le bug n'existe pas déjà dans les issues
2. Testez avec la dernière version
3. Collectez les informations nécessaires

### Template d'issue bug

```markdown
**Description du bug**
Description claire du problème

**Reproduction**
Étapes pour reproduire :
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer

**Comportement actuel**
Ce qui se passe réellement

**Screenshots**
Si applicable

**Environnement**
- OS: [ex: macOS 14.0]
- Navigateur: [ex: Chrome 120]
- Version: [ex: 0.1.0]

**Informations additionnelles**
Tout autre contexte utile
```

---

## 💡 Proposer une fonctionnalité

### Template d'issue feature

```markdown
**Description de la fonctionnalité**
Description claire de ce que vous voulez

**Problème résolu**
Quel problème cette fonctionnalité résout-elle ?

**Solution proposée**
Comment vous imaginez cette fonctionnalité

**Alternatives considérées**
Autres solutions envisagées

**Contexte additionnel**
Mockups, exemples, etc.
```

---

## ❓ Questions

Si vous avez des questions :
- 📧 Email : contact@mybi.fr
- 💬 Issues : Créez une issue avec le label `question`
- 📖 Documentation : Consultez le README et `docs/`

---

## 🙏 Remerciements

Merci de contribuer à MyBI ! Votre aide est précieuse pour améliorer le projet.

---

**Dernière mise à jour** : 2024-12-04

