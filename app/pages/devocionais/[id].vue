<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-3xl space-y-8">
    <div v-if="isLoading" class="flex justify-center py-20">
      <Icon name="lucide:loader" class="w-10 h-10 animate-spin text-primary-600" />
    </div>

    <div v-else-if="!devocional" class="text-center py-20 space-y-4">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
        <Icon name="lucide:file-x" class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold">Devocional não encontrado</h2>
      <p class="text-gray-500">Este conteúdo pode ter sido removido ou o link está incorreto.</p>
      <NuxtLink to="/devocionais" class="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline pt-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> Voltar para devocionais
      </NuxtLink>
    </div>

    <article v-else class="space-y-10">
      <NuxtLink to="/devocionais" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium mb-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> Voltar
      </NuxtLink>

      <header class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider rounded-full">
            {{ devocional.livro }}
          </span>
          <span v-if="devocional.tema" class="text-gray-400 dark:text-gray-500 text-sm">
            #{{ devocional.tema }}
          </span>
          <span class="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1 ml-auto">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            {{ formattedDate }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          {{ devocional.titulo }}
        </h1>

        <blockquote class="border-l-4 border-primary-500 pl-6 py-2 my-8 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10 rounded-r-2xl">
          <p class="font-sans text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{{ devocional.versiculo }}"
          </p>
        </blockquote>
      </header>

      <div class="ad-slot-fluid my-8">
        <span class="text-xs text-gray-400 uppercase tracking-wider">Anúncio (AdSense)</span>
      </div>

      <div 
        class="prose prose-lg dark:prose-invert prose-primary max-w-none text-gray-700 dark:text-gray-300 prose-headings:font-bold prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-img:rounded-2xl"
        v-html="htmlContent">
      </div>

      <!-- Área de Compartilhamento e Próximos Passos -->
      <footer class="pt-10 mt-10 border-t border-gray-100 dark:border-gray-800 space-y-8">
        <div class="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 text-center space-y-4">
          <h3 class="font-bold text-xl">Gostou desta reflexão?</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            Compartilhe com seus amigos e familiares, ou explore nossos estudos aprofundados baseados no comentário Beacon.
          </p>
          <div class="pt-4">
            <NuxtLink to="/estudos" class="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-medium transition-transform hover:scale-105">
              Conhecer Estudos Teológicos <Icon name="lucide:book" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const { $firestore } = useNuxtApp()

const devocional = ref(null)
const isLoading = ref(true)

const fetchDevocional = async () => {
  if (!$firestore) return
  
  const id = route.params.id
  
  // Tratamento especial para o "/devocionais/hoje" caso seja chamado diretamente (fallback)
  if (id === 'hoje') {
    // Para simplificar, poderíamos redirecionar para a home ou buscar o mais recente aqui.
    // Como a Home já aponta para a home com a lógica, vou apenas buscar o mais recente se a URL for "hoje".
    // Por enquanto, o ideal é não usar "hoje" como ID real no banco.
  }

  try {
    const docRef = doc($firestore, 'devocionais', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      devocional.value = { id: docSnap.id, ...docSnap.data() }
      
      // Update SEO Meta tags after fetching dynamically
      useSeoMeta({
        title: `${devocional.value.titulo} | Viva a Bíblia`,
        description: devocional.value.versiculo,
        ogTitle: devocional.value.titulo,
        ogDescription: devocional.value.versiculo,
      })
    }
  } catch (error) {
    console.error("Erro ao carregar devocional:", error)
  } finally {
    isLoading.value = false
  }
}

const htmlContent = computed(() => {
  if (!devocional.value?.conteudo) return ''
  return marked(devocional.value.conteudo, { breaks: true })
})

const formattedDate = computed(() => {
  if (!devocional.value?.createdAt) return ''
  const date = devocional.value.createdAt.toDate()
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
})

onMounted(() => {
  fetchDevocional()
})
</script>
