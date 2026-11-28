<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
    <header class="space-y-4">
      <h1 class="text-3xl md:text-4xl font-bold">{{ $t('articles.heading') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        {{ $t('articles.subtitle') }}
      </p>

      <!-- Barra de busca -->
      <div class="pt-2 relative max-w-md">
        <Icon name="lucide:search" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="$t('articles.searchPlaceholder')"
          class="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
        />
      </div>
    </header>

    <div class="ad-slot-fluid my-8">
      <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSpace') }}</span>
    </div>

    <!-- Lista de Artigos -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
    </div>

    <div v-else-if="filteredArtigos.length === 0" class="text-center py-12 text-gray-500">
      {{ $t('articles.empty') }}
    </div>

    <div v-else class="space-y-6">
      <NuxtLink v-for="art in filteredArtigos" :key="art.id" :to="localePath(`/artigos/${art.id}`)" class="block outline-none focus:ring-2 focus:ring-primary-500 rounded-2xl">
        <article class="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-pointer h-full">
          <div class="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center text-primary-600 dark:text-primary-400">
            <span class="text-xs font-bold uppercase">{{ formatDate(art.createdAt).month }}</span>
            <span class="text-2xl font-bold leading-none">{{ formatDate(art.createdAt).day }}</span>
          </div>
          <div class="space-y-2 flex-1">
            <h2 class="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ art.titulo }}
            </h2>
            <div v-if="art.versiculo" class="font-sans text-gray-700 dark:text-gray-300 text-sm italic">
              {{ art.versiculo }}
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t('articles.pageTitle'),
}))

const { data: artigosData, pending: isLoading } = await useFetch('/api/artigos', {
  key: 'artigos-list',
  default: () => []
})

const searchQuery = ref('')

const artigos = computed(() => {
  return (artigosData.value || [])
    .filter(a => hasDocTranslation(a, locale.value))
    .map(a => useLocalizedDoc(a, locale.value))
})

const filteredArtigos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return artigos.value
  return artigos.value.filter(a => {
    const titulo = (a.titulo || '').toLowerCase()
    const versiculo = (a.versiculo || '').toLowerCase()
    return titulo.includes(q) || versiculo.includes(q)
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return { day: '', month: '' }
  const date = new Date(dateStr)
  const month = date.toLocaleString(locale.value, { month: 'short' }).replace('.', '').toUpperCase().substring(0, 3)
  const day = date.getDate().toString().padStart(2, '0')
  return { month, day }
}
</script>
