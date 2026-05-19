<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
    <header class="space-y-4">
      <h1 class="text-3xl md:text-4xl font-bold">Devocionais Diários</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Reflexões inspiradas nos comentários de Matthew Henry para edificar o seu dia.
      </p>
      
      <!-- Filtros -->
      <div class="flex items-center gap-2 pt-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          @click="selectedFilter = 'Todos'"
          :class="selectedFilter === 'Todos' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          Todos
        </button>
        <button 
          v-for="livro in availableBooks" :key="livro"
          @click="selectedFilter = livro"
          :class="selectedFilter === livro ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          {{ livro }}
        </button>
      </div>
    </header>

    <div class="ad-slot-fluid my-8">
      <span class="text-xs text-gray-400 uppercase tracking-wider">Espaço Publicitário</span>
    </div>

    <!-- Lista de Devocionais -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
    </div>
    
    <div v-else-if="filteredDevocionais.length === 0" class="text-center py-12 text-gray-500">
      Nenhum devocional encontrado.
    </div>

    <div v-else class="space-y-6">
      <NuxtLink v-for="dev in filteredDevocionais" :key="dev.id" :to="`/devocionais/${dev.id}`" class="block outline-none focus:ring-2 focus:ring-primary-500 rounded-2xl">
        <article class="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer h-full">
          <div class="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center text-primary-600 dark:text-primary-400">
            <span class="text-xs font-bold uppercase">{{ formatDate(dev.createdAt).month }}</span>
            <span class="text-2xl font-bold leading-none">{{ formatDate(dev.createdAt).day }}</span>
          </div>
          <div class="space-y-2 flex-1">
            <h2 class="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ dev.titulo }}
            </h2>
            <div class="font-sans text-gray-600 dark:text-gray-300 text-sm italic">
              "{{ dev.versiculo }}"
            </div>
            <div 
              class="prose prose-sm dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 line-clamp-2 pt-2 prose-p:my-0 prose-headings:my-0" 
              v-html="renderMarkdown(dev.conteudo)">
            </div>
            <div v-if="dev.tema" class="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
              #{{ dev.tema }}
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { marked } from 'marked'

useHead({
  title: 'Devocionais',
})

const { $firestore } = useNuxtApp()
const devocionais = ref([])
const isLoading = ref(true)
const selectedFilter = ref('Todos')

const availableBooks = computed(() => {
  const books = devocionais.value.map(d => d.livro).filter(Boolean)
  return [...new Set(books)].sort()
})

const filteredDevocionais = computed(() => {
  if (selectedFilter.value === 'Todos') {
    return devocionais.value
  }
  return devocionais.value.filter(dev => dev.livro === selectedFilter.value)
})

const fetchDevocionais = async () => {
  if (!$firestore) {
    isLoading.value = false
    return
  }
  
  try {
    const q = query(collection($firestore, 'devocionais'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    devocionais.value = docs
  } catch (error) {
    console.error("Erro ao buscar devocionais:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDevocionais()
})

const formatDate = (timestamp) => {
  if (!timestamp) return { month: '', day: '' }
  const date = timestamp.toDate()
  const month = date.toLocaleString('pt-BR', { month: 'short' }).substring(0, 3)
  const day = date.getDate().toString().padStart(2, '0')
  return { month, day }
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}
</script>
