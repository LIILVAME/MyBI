# Rapport des traductions manquantes

## Pages

### DashboardPage.vue
- ❌ `aria-label="Ajouter un bien"` → `common.addProperty`
- ❌ `Erreur :` → `common.error`

### BiensPage.vue  
- ❌ `aria-label="Ajouter un bien"` → `common.addProperty`
- ❌ `Erreur :` → `common.error`

### PaiementsPage.vue
- ❌ `Erreur :` → `common.error`
- ✅ Déjà bien traduit

### LocatairesPage.vue
- ❌ `Chargement des locataires...` → `tenants.loading`
- ❌ `Tous` → `common.all`
- ❌ `À jour` → `status.onTime`
- ❌ `En retard` → `status.late`

### AlertsPage.vue
- ❌ `Alertes` → `alerts.title` (déjà présent mais pas utilisé)
- ❌ `Surveillez les paiements en retard...` → `alerts.subtitle`
- ❌ `Alertes critiques` → `alerts.criticalAlerts`
- ❌ `Alertes moyennes` → `alerts.mediumAlerts`
- ❌ `Informations` → `alerts.information`
- ❌ `Chargement des alertes...` → `alerts.loading`
- ❌ `Erreur :` → `common.error`
- ❌ `Critique` / `Important` / `Info` → `alerts.severity.*`
- ❌ `Date :` → `common.date`
- ❌ `Retard :` → `alerts.daysLate`
- ❌ `Impayé depuis :` → `alerts.daysOverdue`
- ❌ `Dans :` → `alerts.daysUntil`
- ❌ `jour(s)` → `common.days`
- ❌ `Voir` → `common.view`
- ❌ `Marquer comme résolu` → `alerts.markAsResolved`
- ❌ `Aucune alerte` → `alerts.noAlerts`
- ❌ `Tout est en ordre ! Aucune action requise...` → `alerts.allGood`

### LandingPage.vue
- ❌ `Fonctionnalités` → `landing.features`
- ❌ `Témoignages` → `landing.testimonials`
- ❌ `Commencer maintenant` → `landing.getStarted`
- ❌ `Essayer` → `landing.tryIt`
- ❌ `Supervisez vos biens immobiliers...` → `landing.heroTitle`
- ❌ `Monitoring en temps réel...` → `landing.heroDescription`
- ❌ `Essayer gratuitement` → `landing.tryFree`
- ❌ `Tout ce dont vous avez besoin` → `landing.featuresTitle`
- ❌ `Une solution complète...` → `landing.featuresDescription`
- ❌ `Surveillance en temps réel` → `landing.featureMonitoring`
- ❌ `Suivez température...` → `landing.featureMonitoringDesc`
- ❌ `Alertes intelligentes` → `landing.featureAlerts`
- ❌ `Recevez des notifications...` → `landing.featureAlertsDesc`
- ❌ `Gestion des paiements` → `landing.featurePayments`
- ❌ `Suivez vos loyers...` → `landing.featurePaymentsDesc`
- ❌ `Ce que disent nos clients` → `landing.testimonialsTitle`
- ❌ `Prêt à optimiser...` → `landing.ctaTitle`
- ❌ `Rejoignez des centaines...` → `landing.ctaDescription`

### LoginPage.vue
- ❌ `Gestion immobilière intelligente` → `login.tagline`
- ❌ `Connexion` → `login.title` (déjà présent)
- ❌ `Connectez-vous à votre compte` → `login.subtitle`
- ❌ `Email` → `login.email` (déjà présent)
- ❌ `votre@email.com` → `login.emailPlaceholder`
- ❌ `Mot de passe` → `login.password` (déjà présent)
- ❌ `Créer un compte` → `login.signup` (déjà présent)
- ❌ `Création...` → `login.creating`
- ❌ `Rejoignez Vylo dès aujourd'hui` → `login.signupSubtitle`

## Composants

### Modals (AddPropertyModal, AddTenantModal, AddPaymentModal, EditPaymentModal)
- Nom du bien, Adresse, Ville, Type, Loyer, Statut, etc. → `properties.*` et `tenants.*`
- Placeholders → `properties.placeholders.*`

### Autres composants
- À analyser individuellement

