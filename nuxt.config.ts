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
      }
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
    '@nuxt/icon'
  ],

  routeRules: {
    '/': { isr: 3600 },
    '/materiais': { isr: 3600 },
    '/devocionais': { isr: 3600 },
    '/devocionais/**': { isr: 3600 },
    '/estudos': { isr: 3600 },
    '/estudos/**': { isr: 3600 },
    '/sobre': { prerender: true },

    '/api/**': {
      swr: 3600,
      headers: {
        'cache-control': 's-maxage=3600, stale-while-revalidate'
      }
    },

    '/admin': { ssr: false },
    '/admin/**': { ssr: false }
  }
})

