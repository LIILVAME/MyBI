# 📊 Configuration Analytics - Doogoo

**Date** : 2025-01-28  
**Statut** : ✅ Système d'analytics intégré

---

## 📋 Vue d'ensemble

Le système d'analytics de Doogoo supporte **Google Analytics 4** et **Plausible Analytics**. Les deux solutions peuvent être configurées indépendamment ou utilisées simultanément.

**Par défaut, les analytics sont désactivés** pour respecter la vie privée des utilisateurs.

---

## 🔧 Configuration

### Variables d'environnement requises

Dans **Vercel Dashboard** → **Settings** → **Environment Variables**, ajouter :

#### Pour Google Analytics 4
```
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

#### Pour Plausible Analytics
```
VITE_PLAUSIBLE_DOMAIN=doogoo.vercel.app
VITE_ENABLE_ANALYTICS=true
```

#### Pour activer les deux
```
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=doogoo.vercel.app
VITE_ENABLE_ANALYTICS=true
```

---

## 📊 Google Analytics 4

### 1. Créer un compte Google Analytics 4

1. Aller sur [Google Analytics](https://analytics.google.com/)
2. Créer une nouvelle propriété pour `doogoo.vercel.app`
3. Récupérer le **MEASUREMENT_ID** (format : `G-XXXXXXXXXX`)
4. Configurer le flux de données web si nécessaire

### 2. Configurer dans Vercel

- Ajouter `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`
- Ajouter `VITE_ENABLE_ANALYTICS=true`
- Redéployer l'application

### 3. Vérifier l'installation

- Ouvrir l'application en production
- Vérifier dans la console : `✅ Google Analytics 4 initialisé`
- Dans Google Analytics → Realtime, vérifier les événements

---

## 🔒 Plausible Analytics

### 1. S'abonner à Plausible

1. Aller sur [Plausible.io](https://plausible.io/)
2. Créer un compte
3. Ajouter le site `doogoo.vercel.app`
4. Noter le domaine exact

### 2. Configurer dans Vercel

- Ajouter `VITE_PLAUSIBLE_DOMAIN=doogoo.vercel.app`
- Ajouter `VITE_ENABLE_ANALYTICS=true`
- Redéployer l'application

### 3. Vérifier l'installation

- Ouvrir l'application en production
- Vérifier dans la console : `✅ Plausible Analytics initialisé`
- Dans le dashboard Plausible, vérifier les visites

---

## 📈 Événements trackés

### Événements automatiques

#### Authentification
- ✅ `USER_LOGGED_IN` : Connexion réussie
- ✅ `USER_SIGNED_UP` : Inscription réussie
- ✅ `USER_LOGGED_OUT` : Déconnexion

#### Biens immobiliers
- ✅ `PROPERTY_ADDED` : Ajout d'un bien (avec `property_type`, `rent_amount`)
- ✅ `PROPERTY_UPDATED` : Modification d'un bien (avec `property_id`)
- ✅ `PROPERTY_DELETED` : Suppression d'un bien (avec `property_id`)

#### Navigation
- ✅ `PAGE_VIEWED` : Vue de page (automatique via router)

### Événements personnalisés (à implémenter)

#### Paiements
- ⏳ `PAYMENT_ADDED` : Ajout d'un paiement
- ⏳ `PAYMENT_UPDATED` : Modification d'un paiement
- ⏳ `PAYMENT_DELETED` : Suppression d'un paiement

#### Paramètres
- ⏳ `LANGUAGE_CHANGED` : Changement de langue (avec `language`)
- ⏳ `CURRENCY_CHANGED` : Changement de devise (avec `currency`)

---

## 💻 Utilisation dans le code

### Tracking manuel d'un événement

```javascript
import { trackDoogooEvent, DoogooEvents } from '@/utils/analytics'

// Track un événement simple
trackDoogooEvent(DoogooEvents.PROPERTY_ADDED, {
  property_type: 'appartement',
  rent_amount: 800
})

// Track un événement personnalisé
trackDoogooEvent('custom_event_name', {
  custom_param: 'value'
})
```

### Tracking de page view

```javascript
import { trackPageView } from '@/utils/analytics'

trackPageView('/dashboard', 'Tableau de bord')
```

---

## 🔍 Vérifications

### Console du navigateur

Vérifier les messages :
- `✅ Google Analytics 4 initialisé` (si GA4 configuré)
- `✅ Plausible Analytics initialisé` (si Plausible configuré)
- `📊 Google Analytics désactivé` (si non configuré)
- `📊 Plausible Analytics désactivé` (si non configuré)

### Google Analytics Dashboard

1. Aller dans **Realtime** → **Events**
2. Vérifier que les événements apparaissent en temps réel
3. Vérifier les **Events** dans **Reports** → **Engagement**

### Plausible Dashboard

1. Aller sur le dashboard Plausible
2. Vérifier les visites en temps réel
3. Vérifier les pages visitées dans **Top Pages**

---

## 🎯 Bonnes pratiques

### Respect de la vie privée

- ✅ Analytics **désactivés par défaut**
- ✅ IP anonymisée pour Google Analytics (`anonymize_ip: true`)
- ✅ Pas de cookies personnalisés
- ✅ Données anonymisées

### Performance

- ✅ Chargement asynchrone (ne bloque pas le rendu)
- ✅ Import dynamique pour éviter le bundle initial
- ✅ Gestion d'erreur non-bloquante

### Événements

- ✅ Événements significatifs uniquement
- ✅ Paramètres pertinents (pas de données sensibles)
- ✅ Noms d'événements cohérents (snake_case)

---

## 🐛 Dépannage

### Analytics ne s'initialise pas

**Vérifier** :
1. Variables d'environnement définies dans Vercel
2. `VITE_ENABLE_ANALYTICS=true` est présent
3. Application redéployée après ajout des variables
4. Console du navigateur pour les erreurs

### Événements non trackés

**Vérifier** :
1. Analytics initialisés (messages dans la console)
2. `window.gtag` existe (pour GA4)
3. `window.plausible` existe (pour Plausible)
4. Pas d'erreurs dans la console

### Données manquantes dans les dashboards

**Vérifier** :
1. Délai de traitement (Google Analytics : quelques minutes)
2. Filtres dans les dashboards
3. Période sélectionnée
4. Configuration correcte du domaine (Plausible)

---

## 📚 Ressources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Plausible Analytics Documentation](https://plausible.io/docs)
- [Doogoo Analytics Utils](../../src/utils/analytics.js)

---

**✅ Le système d'analytics est prêt à être utilisé !**

Pour activer : Configurez les variables d'environnement dans Vercel et redéployez.

