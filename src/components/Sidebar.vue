<template>
  <!-- Menu hamburger mobile -->
  <button
    @click="toggleSidebar"
    :class="[
      'lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-300 ease-in-out',
      // Cache le bouton hamburger au scroll down sur mobile
      isScrollVisible || isDesktop ? 'translate-y-0' : '-translate-y-full'
    ]"
    aria-label="Toggle menu"
  >
    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Overlay mobile -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 overflow-y-auto z-40 lg:static lg:z-auto transition-transform duration-300 ease-in-out',
      // Sur desktop : toujours visible (lg:static lg:translate-x-0)
      // Sur mobile : visible si menu ouvert ET scroll vers le haut (ou desktop)
      (isDesktop || (isOpen && isScrollVisible)) ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="p-6">
      <h1 class="text-2xl font-bold text-primary-600 mb-8">MyBI</h1>
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          @click="closeSidebar"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
          :class="{ 'bg-primary-50 text-primary-600': isActive(item.path) }"
        >
          <span v-html="getIcon(item.icon)" class="w-5 h-5 mr-3 flex-shrink-0"></span>
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>
      <div class="mt-8 pt-8 border-t border-gray-200">
        <button
          @click="handleLogout"
          :disabled="authStore.loading"
          class="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium">{{ authStore.loading ? 'Déconnexion...' : 'Déconnexion' }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const isOpen = ref(false)
const isScrollVisible = ref(true)
const lastScrollY = ref(0)
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)

/**
 * Détecte le scroll pour cacher/afficher la sidebar sur mobile
 */
const handleScroll = () => {
  // Ne gère le scroll que sur mobile (pas desktop)
  if (isDesktop.value) {
    return
  }

  const currentScrollY = window.scrollY || window.pageYOffset
  
  // Seuil pour déclencher le comportement (évite les micro-mouvements)
  const SCROLL_THRESHOLD = 100

  // Scroll vers le bas → cacher (si on est assez bas)
  if (currentScrollY > lastScrollY.value && currentScrollY > SCROLL_THRESHOLD) {
    isScrollVisible.value = false
  } 
  // Scroll vers le haut → afficher
  else if (currentScrollY < lastScrollY.value) {
    isScrollVisible.value = true
  }
  // En haut de page → toujours visible
  else if (currentScrollY <= SCROLL_THRESHOLD) {
    isScrollVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

/**
 * Détecte le redimensionnement pour gérer desktop/mobile
 */
const handleResize = () => {
  const wasDesktop = isDesktop.value
  isDesktop.value = window.innerWidth >= 1024
  
  // Si on passe en desktop, réinitialiser l'état du menu
  if (isDesktop.value && !wasDesktop) {
    isOpen.value = false
    isScrollVisible.value = true
  }
  
  // Si on passe en mobile, réinitialiser le scroll
  if (!isDesktop.value && wasDesktop) {
    isScrollVisible.value = true
    lastScrollY.value = window.scrollY || window.pageYOffset
  }
}

/**
 * Bascule l'état d'ouverture du menu mobile
 */
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  // Quand on ouvre manuellement, on force la visibilité
  if (isOpen.value) {
    isScrollVisible.value = true
    lastScrollY.value = window.scrollY || window.pageYOffset
  }
}

/**
 * Ferme le menu mobile
 */
const closeSidebar = () => {
  isOpen.value = false
}

onMounted(() => {
  // Initialise la position de scroll
  lastScrollY.value = window.scrollY || window.pageYOffset
  isDesktop.value = window.innerWidth >= 1024
  
  // Écouteurs d'événements
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'home'
  },
  {
    name: 'Biens',
    path: '/biens',
    icon: 'building'
  },
  {
    name: 'Paiements',
    path: '/paiements',
    icon: 'currency'
  },
  {
    name: 'Locataires',
    path: '/locataires',
    icon: 'users'
  },
  {
    name: 'Statistiques',
    path: '/stats',
    icon: 'chart'
  },
  {
    name: 'Rapports',
    path: '/rapports',
    icon: 'report'
  },
  {
    name: 'Alertes',
    path: '/alertes',
    icon: 'alert'
  },
  {
    name: 'Paramètres',
    path: '/parametres',
    icon: 'cog'
  }
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const getIcon = (iconName) => {
  const icons = {
    home: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
    building: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
    currency: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z" /></svg>',
    users: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
    chart: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
    report: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
    alert: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    cog: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
  }
  return icons[iconName] || ''
}

/**
 * Gère la déconnexion
 */
const handleLogout = async () => {
  try {
    const result = await authStore.logout()
    
    if (result?.success) {
      // Ferme la sidebar
      closeSidebar()
      
      // Redirection immédiate vers /login
      // Utilise window.location pour forcer un rechargement complet et éviter les états résiduels
      window.location.href = '/login'
    } else {
      // En cas d'erreur, affiche un message (le toast est géré dans authStore)
      console.error('Erreur lors de la déconnexion:', result?.error)
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Redirige quand même vers login en cas d'erreur
    window.location.href = '/login'
  }
}
</script>

