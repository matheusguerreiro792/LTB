<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl space-y-12">
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">Estudos Teológicos</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-sans">
        Artigos profundos baseados nos comentários Bíblicos Beacon para sua edificação e crescimento espiritual.
      </p>

      <!-- Filtros por Tema -->
      <div v-if="availableThemes.length > 0" class="flex flex-wrap items-center justify-center gap-2 pt-6">
        <button 
          @click="selectedFilter = 'Todos'"
          :class="selectedFilter === 'Todos' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          Todos
        </button>
        <button 
          v-for="tema in availableThemes" :key="tema"
          @click="selectedFilter = tema"
          :class="selectedFilter === tema ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          {{ tema }}
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
    </div>
    
    <div v-else-if="filteredEstudos.length === 0" class="text-center py-12 text-gray-500">
      Nenhum estudo encontrado.
    </div>

    <div v-else class="space-y-12">
      <article v-for="estudo in filteredEstudos" :key="estudo.id" class="group space-y-4">
        <!-- Imagem de capa (se existir) -->
        <NuxtLink v-if="estudo.imagemCapa" :to="`/estudos/${estudo.id}`" class="block aspect-[2/1] md:aspect-[2.5/1] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative">
          <img :src="estudo.imagemCapa" :alt="estudo.titulo" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </NuxtLink>
        <div class="space-y-3">
          <div class="flex items-center gap-3 text-sm">
            <span class="text-primary-600 dark:text-primary-400 font-medium">{{ estudo.tema || 'Estudo Teológico' }}</span>
            <span class="text-gray-300 dark:text-gray-700">•</span>
            <span class="text-gray-500">{{ formatDate(estudo.createdAt) }}</span>
          </div>
          <NuxtLink :to="`/estudos/${estudo.id}`" class="block">
            <h2 class="text-2xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
              {{ estudo.titulo }}
            </h2>
          </NuxtLink>
          <div class="text-gray-600 dark:text-gray-400 font-sans leading-relaxed line-clamp-3 prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0" v-html="renderMarkdown(estudo.conteudo)">
          </div>
          <div>
            <NuxtLink :to="`/estudos/${estudo.id}`" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline inline-flex items-center gap-1 mt-2">
              Ler artigo completo
            </NuxtLink>
          </div>
        </div>
      </article>

      <div class="ad-slot-fluid mt-12">
        <span class="text-xs text-gray-400 uppercase tracking-wider">Espaço Publicitário</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { marked } from 'marked'

useHead({
  title: 'Estudos',
})

const { $firestore } = useNuxtApp()
const estudos = ref([])
const isLoading = ref(true)
const selectedFilter = ref('Todos')

const availableThemes = computed(() => {
  const temas = estudos.value.map(e => e.tema).filter(Boolean)
  return [...new Set(temas)].sort()
})

const filteredEstudos = computed(() => {
  if (selectedFilter.value === 'Todos') return estudos.value
  return estudos.value.filter(e => e.tema === selectedFilter.value)
})

const fetchEstudos = async () => {
  if (!$firestore) {
    isLoading.value = false
    return
  }
  
  try {
    const q = query(collection($firestore, 'estudos'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    estudos.value = docs
  } catch (error) {
    console.error("Erro ao buscar estudos:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEstudos()
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}
</script>
