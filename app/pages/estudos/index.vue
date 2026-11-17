<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl space-y-12">
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">{{ $t('studies.heading') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-sans">
        {{ $t('studies.subtitle') }}
      </p>

      <!-- Filtros por Tema -->
      <div v-if="availableThemes.length > 0" class="flex flex-wrap items-center justify-center gap-2 pt-6">
        <button 
          @click="selectedFilter = 'ALL'"
          :class="selectedFilter === 'ALL' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          {{ $t('common.all') }}
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
      {{ $t('studies.empty') }}
    </div>

    <div v-else class="space-y-12">
      <article v-for="estudo in filteredEstudos" :key="estudo.id" class="group space-y-4">
        <!-- Imagem de capa (se existir) -->
        <NuxtLink v-if="estudo.imagemCapa" :to="localePath(`/estudos/${estudo.id}`)" class="block aspect-[2/1] md:aspect-[2.5/1] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative">
          <img :src="estudo.imagemCapa" :alt="estudo.titulo" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </NuxtLink>
        <div class="space-y-3">
          <div class="flex items-center gap-3 text-sm">
            <span class="text-primary-600 dark:text-primary-400 font-medium">{{ estudo.tema || $t('common.theologicalStudy') }}</span>
            <span class="text-gray-300 dark:text-gray-700">•</span>
            <span class="text-gray-500">{{ formatDate(estudo.createdAt) }}</span>
          </div>
          <NuxtLink :to="localePath(`/estudos/${estudo.id}`)" class="block">
            <h2 class="text-2xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
              {{ estudo.titulo }}
            </h2>
          </NuxtLink>
          <div class="text-gray-600 dark:text-gray-400 font-sans leading-relaxed line-clamp-3 prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0" v-html="renderMarkdown(estudo.conteudo)">
          </div>
          <div>
            <NuxtLink :to="localePath(`/estudos/${estudo.id}`)" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline inline-flex items-center gap-1 mt-2">
              {{ $t('common.readFullArticle') }}
            </NuxtLink>
          </div>
        </div>
      </article>

      <div class="ad-slot-fluid mt-12">
        <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSpace') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t('studies.pageTitle'),
}))

const { data: estudosData, pending: isLoading } = await useFetch('/api/estudos', {
  key: 'estudos-list',
  default: () => []
})

const selectedFilter = ref('ALL')

const estudos = computed(() => {
  return (estudosData.value || [])
    .filter(e => hasDocTranslation(e, locale.value))
    .map(e => useLocalizedDoc(e, locale.value))
})

// Extrair lista única de temas
const availableThemes = computed(() => {
  const temas = estudos.value.map(e => e.tema).filter(Boolean)
  return [...new Set(temas)].sort()
})

// Filtragem
const filteredEstudos = computed(() => {
  if (selectedFilter.value === 'ALL') {
    return estudos.value
  }
  return estudos.value.filter(e => e.tema === selectedFilter.value)
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value, { 
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
