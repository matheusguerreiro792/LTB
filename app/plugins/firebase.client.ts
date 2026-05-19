import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
  }

  // Só inicializa se tiver a API Key configurada (evita quebrar sem o .env)
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase não inicializado: Variaveis de ambiente (.env) não configuradas.')
    return {
      provide: {
        auth: null,
        firestore: null,
        storage: null
      }
    }
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const storage = getStorage(app)

  return {
    provide: {
      auth,
      firestore,
      storage
    }
  }
})
