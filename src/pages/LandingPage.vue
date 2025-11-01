<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <header>
      <nav class="border-b border-gray-100 bg-white sticky top-0 z-50" role="navigation" aria-label="Navigation principale">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <router-link to="/" aria-label="Doogoo - Accueil">
                <h1 class="text-2xl font-bold text-primary-600">Doogoo</h1>
              </router-link>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('landing.features') }}</a>
            <a href="#testimonials" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('landing.testimonials') }}</a>
            <button @click="goToDashboard" class="btn-primary">{{ $t('landing.getStarted') }}</button>
          </div>
          <button @click="goToDashboard" class="md:hidden btn-primary text-sm px-4 py-2">
            {{ $t('landing.tryIt') }}
          </button>
        </div>
      </div>
    </nav>
    </header>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {{ $t('landing.heroTitle') }}
          </h2>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            {{ $t('landing.heroDescription') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="goToDashboard" class="btn-primary text-lg px-8 py-4">
              {{ $t('landing.getStarted') }}
            </button>
            <button class="btn-secondary text-lg px-8 py-4">
              {{ $t('landing.tryFree') }}
            </button>
          </div>
        </div>
        <div class="relative">
          <div class="card p-2 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" 
              alt="Aperçu du tableau de bord Doogoo avec statistiques et graphiques immobiliers" 
              class="rounded-lg w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('landing.featuresTitle') }}
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ $t('landing.featuresDescription') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2">{{ $t('landing.featureMonitoring') }}</h4>
            <p class="text-gray-600">
              {{ $t('landing.featureMonitoringDesc') }}
            </p>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2">{{ $t('landing.featureAlerts') }}</h4>
            <p class="text-gray-600">
              {{ $t('landing.featureAlertsDesc') }}
            </p>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z" />
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2">{{ $t('landing.featurePayments') }}</h4>
            <p class="text-gray-600">
              {{ $t('landing.featurePaymentsDesc') }}
            </p>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2">Sécurité renforcée</h4>
            <p class="text-gray-600">
              Caméras et capteurs de sécurité pour protéger vos biens 24/7
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Une interface intuitive et moderne
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Accédez à toutes les informations importantes en un seul coup d'œil
          </p>
        </div>
        <div class="card p-4 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200" 
            alt="Interface du tableau de bord Doogoo montrant la gestion de biens immobiliers" 
            class="rounded-lg w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('landing.testimonialsTitle') }}
          </h3>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.name"
            class="card"
          >
            <div class="flex items-center mb-4">
              <img 
                :src="testimonial.avatar" 
                :alt="testimonial.name"
                class="w-12 h-12 rounded-full mr-4"
              >
              <div>
                <h4 class="font-semibold">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.text }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-600 py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-3xl lg:text-4xl font-bold text-white mb-6">
          {{ $t('landing.ctaTitle') }}
        </h3>
        <p class="text-xl text-primary-100 mb-8">
          {{ $t('landing.ctaDescription') }}
        </p>
        <button @click="goToDashboard" class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
          {{ $t('landing.tryFree') }}
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-white text-xl font-bold mb-4">Doogoo</h4>
            <p class="text-sm">
              La solution complète pour le monitoring de vos biens immobiliers.
            </p>
          </div>
          <div>
            <h5 class="text-white font-semibold mb-4">Produit</h5>
            <ul class="space-y-2 text-sm">
              <li><a href="#features" class="hover:text-white transition-colors">{{ $t('landing.features') }}</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-semibold mb-4">Entreprise</h5>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Carrières</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-semibold mb-4">Contact</h5>
            <ul class="space-y-2 text-sm">
              <li><a href="mailto:contact@doogoo.app" class="hover:text-white transition-colors">contact@doogoo.app</a></li>
              <li><a href="tel:+33123456789" class="hover:text-white transition-colors">+33 1 23 45 67 89</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Doogoo. Tous droits réservés. | <a href="#" class="hover:text-white transition-colors">Mentions légales</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { mockTestimonials } from '../data/mockData'

const { t } = useI18n()

const router = useRouter()
const testimonials = ref(mockTestimonials)

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

