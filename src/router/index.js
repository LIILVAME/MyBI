import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import ResetPasswordPage from '../pages/ResetPasswordPage.vue'
import ConfirmEmailPage from '../pages/ConfirmEmailPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import BiensPage from '../pages/BiensPage.vue'
import PaiementsPage from '../pages/PaiementsPage.vue'
import LocatairesPage from '../pages/LocatairesPage.vue'
import ParametresPage from '../pages/ParametresPage.vue'
import StatsPage from '../pages/StatsPage.vue'
import ReportsPage from '../pages/ReportsPage.vue'
import AlertsPage from '../pages/AlertsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login-debug',
    name: 'LoginDebug',
    component: () => import('../pages/LoginPageDebug.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
    component: ConfirmEmailPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/biens',
    name: 'Biens',
    component: BiensPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/paiements',
    name: 'Paiements',
    component: PaiementsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/locataires',
    name: 'Locataires',
    component: LocatairesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/rapports',
    name: 'Rapports',
    component: ReportsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/alertes',
    name: 'Alertes',
    component: AlertsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/parametres',
    name: 'Parametres',
    component: ParametresPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnostics',
    name: 'Diagnostics',
    component: () => import('@/pages/DiagnosticPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test-supabase',
    name: 'TestSupabase',
    component: () => import('@/components/dev/TestSupabase.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Navigation guard : vérifie l'authentification avant d'accéder aux routes protégées
 * Note: L'initialisation de la session est gérée dans App.vue
 */
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()

    // Attend que l'initialisation de la session soit terminée
    // Cela évite les problèmes de race condition lors du refresh
    if (authStore.loadingSession) {
      // Attend que loadingSession passe à false (max 5 secondes)
      let attempts = 0
      while (authStore.loadingSession && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      // Timeout de sécurité : si loadingSession reste true, on continue quand même
      if (authStore.loadingSession) {
        console.warn('Timeout: loadingSession reste true, continuation de la navigation')
        authStore.loadingSession = false
      }
    }

    // Si la route nécessite une authentification
    if (to.meta.requiresAuth) {
      // Si pas d'utilisateur après initialisation, redirige vers login
      if (!authStore.user) {
        next({
          path: '/login',
          query: { redirect: to.fullPath } // Sauvegarde l'URL de destination
        })
        return
      }
    }

    // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth, redirige vers le dashboard
    if ((to.path === '/login' || to.path === '/signup' || to.path === '/reset-password') && authStore.user) {
      next('/dashboard')
      return
    }

    next()
  } catch (error) {
    console.error('Erreur dans le router guard:', error)
    // En cas d'erreur, redirige vers login si route protégée
    if (to.meta.requiresAuth) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
})

export default router

