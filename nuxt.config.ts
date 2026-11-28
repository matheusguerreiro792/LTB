import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      pix: {
        key: process.env.PIX_KEY || '',
        merchantName: process.env.PIX_MERCHANT_NAME || 'Viva a Biblia',
        merchantCity: process.env.PIX_MERCHANT_CITY || 'SAO PAULO',
      },
      donationExternalUrl: process.env.DONATION_EXTERNAL_URL || ''
    }
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Provide the default app configuration for Nuxt 4 explicitly just in case, but minimal does this usually.
  future: {
    compatibilityVersion: 4,
  },
  
  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  modules: [
    '@nuxt/icon',
    '@nuxtjs/i18n'
  ],

  icon: {
    clientBundle: {
      scan: true,
    },
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vivaabiblia.com.br',
    defaultLocale: 'pt-BR',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'pt-BR', language: 'pt-BR', name: 'Português', file: 'pt-BR.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en-US.json' }
    ],
    customRoutes: 'config',
    pages: {
      'devocionais/index': { 'pt-BR': '/devocionais', en: '/devotionals' },
      'devocionais/[id]': { 'pt-BR': '/devocionais/[id]', en: '/devotionals/[id]' },
      'estudos/index': { 'pt-BR': '/estudos', en: '/studies' },
      'estudos/[id]': { 'pt-BR': '/estudos/[id]', en: '/studies/[id]' },
      'artigos/index': { 'pt-BR': '/artigos', en: '/articles' },
      'artigos/[id]': { 'pt-BR': '/artigos/[id]', en: '/articles/[id]' },
      materiais: { 'pt-BR': '/materiais', en: '/materials' },
      sobre: { 'pt-BR': '/sobre', en: '/about' },
      doacoes: { 'pt-BR': '/doacoes', en: '/donations' },
      'politica-de-privacidade': { 'pt-BR': '/politica-de-privacidade', en: '/privacy-policy' },
      admin: { 'pt-BR': '/admin', en: '/admin' }
    }
  },

  routeRules: process.env.NODE_ENV === 'production'
    ? {
        '/': { isr: 3600 },
        '/materiais': { isr: 3600 },
        '/devocionais': { isr: 3600 },
        '/devocionais/**': { isr: 3600 },
        '/estudos': { isr: 3600 },
        '/estudos/**': { isr: 3600 },
        '/artigos': { isr: 3600 },
        '/artigos/**': { isr: 3600 },
        '/sobre': { prerender: true },
        '/doacoes': { prerender: true },
        '/politica-de-privacidade': { prerender: true },

        '/en': { isr: 3600 },
        '/en/materials': { isr: 3600 },
        '/en/devotionals': { isr: 3600 },
        '/en/devotionals/**': { isr: 3600 },
        '/en/studies': { isr: 3600 },
        '/en/studies/**': { isr: 3600 },
        '/en/articles': { isr: 3600 },
        '/en/articles/**': { isr: 3600 },
        '/en/about': { prerender: true },
        '/en/donations': { prerender: true },
        '/en/privacy-policy': { prerender: true },

        '/api/**': {
          swr: 3600,
          headers: {
            'cache-control': 's-maxage=3600, stale-while-revalidate'
          }
        },

        '/admin': { ssr: false },
        '/admin/**': { ssr: false },
        '/en/admin': { ssr: false },
        '/en/admin/**': { ssr: false }
      }
    : {
        '/admin': { ssr: false },
        '/admin/**': { ssr: false },
        '/en/admin': { ssr: false },
        '/en/admin/**': { ssr: false }
      }
})

