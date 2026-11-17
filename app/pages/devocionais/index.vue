<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
    <header class="space-y-4">
      <h1 class="text-3xl md:text-4xl font-bold">{{ $t('devotionals.heading') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        {{ $t('devotionals.subtitle') }}
      </p>
      
      <!-- Filtros -->
      <div class="flex items-center gap-2 pt-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          @click="selectedFilter = 'ALL'"
          :class="selectedFilter === 'ALL' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          {{ $t('common.all') }}
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
      <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSpace') }}</span>
    </div>

    <!-- Lista de Devocionais -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
    </div>
    
    <div v-else-if="filteredDevocionais.length === 0" class="text-center py-12 text-gray-500">
      {{ $t('devotionals.empty') }}
    </div>

    <div v-else class="space-y-6">
      <NuxtLink v-for="dev in filteredDevocionais" :key="dev.id" :to="localePath(`/devocionais/${dev.id}`)" class="block outline-none focus:ring-2 focus:ring-primary-500 rounded-2xl">
        <article class="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer h-full">
          <div class="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center text-primary-600 dark:text-primary-400">
            <span class="text-xs font-bold uppercase">{{ formatDate(dev.createdAt).month }}</span>
            <span class="text-2xl font-bold leading-none">{{ formatDate(dev.createdAt).day }}</span>
          </div>
          <div class="space-y-2 flex-1">
            <h2 class="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ dev.titulo }}
            </h2>
            <div class="font-sans text-gray-700 dark:text-gray-300 text-sm italic">
              {{ dev.versiculo }}
            </div>
            <div v-if="dev.tema" class="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200">
              #{{ dev.tema }}
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t('devotionals.pageTitle'),
}))

const { data: devocionaisData, pending: isLoading } = await useFetch('/api/devocionais', {
  key: 'devocionais-list',
  default: () => []
})

const selectedFilter = ref('ALL')

const devocionais = computed(() => {
  return (devocionaisData.value || [])
    .filter(d => hasDocTranslation(d, locale.value))
    .map(d => useLocalizedDoc(d, locale.value))
})

// Extrair lista única de livros
const availableBooks = computed(() => {
  const books = devocionais.value.map(d => d.livro).filter(Boolean)
  return [...new Set(books)].sort()
})

// Filtragem
const filteredDevocionais = computed(() => {
  if (selectedFilter.value === 'ALL') {
    return devocionais.value
  }
  return devocionais.value.filter(d => d.livro === selectedFilter.value)
})

const formatDate = (dateStr) => {
  if (!dateStr) return { day: '', month: '' }
  const date = new Date(dateStr)
  const month = date.toLocaleString(locale.value, { month: 'short' }).replace('.', '').toUpperCase().substring(0, 3)
  const day = date.getDate().toString().padStart(2, '0')
  return { month, day }
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}
</script>
