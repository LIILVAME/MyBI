import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
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
 */
router.beforeEach(async (to, from, next) => {
  try {
  const authStore = useAuthStore()

  // Initialise l'écouteur d'événements Supabase (une seule fois)
  if (!authStore.session) {
    authStore.initAuthListener()
  }

  // Si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    // Récupère l'utilisateur depuis Supabase
    if (!authStore.user) {
        try {
      await authStore.fetchUser()
        } catch (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', err)
          // En cas d'erreur, redirige vers login pour sécurité
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
          return
        }
    }

    // Si toujours pas d'utilisateur, redirige vers login
    if (!authStore.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Sauvegarde l'URL de destination
      })
      return
    }
  }

  // Si l'utilisateur est connecté et essaie d'accéder à /login, redirige vers le dashboard
  if (to.path === '/login' && authStore.user) {
    next('/dashboard')
    return
  }

  next()
  } catch (error) {
    console.error('Erreur dans le router guard:', error)
    // En cas d'erreur, laisse passer pour éviter l'écran blanc
    next()
  }
})

export default router

