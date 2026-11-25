<template>
  <div class="flex flex-col gap-12 pb-16">
    <!-- Hero / Devocional em Destaque -->
    <section class="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div
        class="absolute inset-0 bg-linear-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent pointer-events-none">
      </div>
      <div class="container mx-auto px-4 py-16 md:py-24 relative">
        <div class="max-w-3xl mx-auto text-center space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/75 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            <Icon name="lucide:book-open" class="w-4 h-4" />
            <span>{{ $t('home.dailyDevotionalBadge') }}</span>
          </div>
          <template v-if="isLoadingDevocional">
            <div class="py-12 flex justify-center">
              <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
            </div>
          </template>

          <template v-else-if="latestDevocional">
            <h1
              class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {{ latestDevocional.titulo }}
            </h1>
            <p class="text-lg text-gray-700 dark:text-gray-300 font-sans leading-relaxed italic mx-auto font-medium">
              {{ latestDevocional.versiculo }}
            </p>
            <div class="pt-4">
              <NuxtLink :to="localePath(`/devocionais/${latestDevocional.id}`)"
                class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
                <span>{{ $t('home.readFullDevotional') }}</span>
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </template>

          <template v-else>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {{ $t('home.fallbackTitleLine1') }} <br class="hidden md:block" /> {{ $t('home.fallbackTitleLine2') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 font-sans leading-relaxed max-w-2xl mx-auto">
              {{ $t('home.fallbackSubtitle') }}
            </p>
          </template>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 space-y-16">

      <!-- Ad Slot -->
      <div class="ad-slot-fluid">
        <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSpace') }}</span>
      </div>

      <!-- Últimos Estudos Teológicos -->
      <section v-if="estudos.length > 0">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">{{ $t('home.recentStudies') }}</h2>
          <NuxtLink :to="localePath('/estudos')"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1">
            {{ $t('common.viewAll') }}
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div v-if="estudos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="estudo in estudos" :key="estudo.id"
            class="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none dark:hover:border-gray-700 transition-all">
            <NuxtLink v-if="estudo.imagemCapa" :to="localePath(`/estudos/${estudo.id}`)"
              class="block aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
              <img :src="estudo.imagemCapa" :alt="estudo.titulo"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </NuxtLink>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span class="text-primary-600 dark:text-primary-400">{{ estudo.tema || $t('common.theologicalStudy') }}</span>
              </div>
              <NuxtLink :to="localePath(`/estudos/${estudo.id}`)" class="block">
                <h3
                  class="font-bold text-xl leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {{ estudo.titulo }}
                </h3>
              </NuxtLink>
              <div
                class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0"
                v-html="renderMarkdown(estudo.conteudo)">
              </div>
            </div>
          </article>
        </div>
        <div v-else
          class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p class="text-gray-500 dark:text-gray-400">{{ $t('home.noStudies') }}</p>
        </div>
      </section>

      <!-- CTA Loja / Infoprodutos -->
      <section v-if="hasMaterials" class="bg-primary-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden dark:bg-gray-900">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32">
        </div>
        <div class="relative z-10 md:w-2/3 space-y-6">
          <h2 class="text-3xl font-bold text-white">{{ $t('home.ctaTitle') }}</h2>
          <p class="text-gray-100 text-lg leading-relaxed max-w-xl dark:text-gray-300">
            {{ $t('home.ctaDescription') }}
          </p>
          <NuxtLink :to="localePath('/materiais')"
            class="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
            {{ $t('home.ctaButton') }}
            <Icon name="lucide:shopping-bag" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t('home.title'),
}))

// Buscar dados com cache SWR da Vercel
const { data: devocionaisData, pending: isLoadingDevocional } = await useFetch('/api/devocionais', {
  key: 'home-devocionais',
  default: () => []
})

const { data: estudosData } = await useFetch('/api/estudos', {
  key: 'home-estudos',
  default: () => []
})

const { data: materiaisData } = await useFetch('/api/materiais', {
  key: 'materiais-list',
  default: () => []
})

const hasMaterials = computed(() => {
  return (materiaisData.value || []).some(
    item => item.ativo !== false && hasDocTranslation(item, locale.value)
  )
})

const latestDevocional = computed(() => {
  const list = (devocionaisData.value || []).filter(d => hasDocTranslation(d, locale.value))
  return list[0] ? useLocalizedDoc(list[0], locale.value) : null
})

const estudos = computed(() => {
  return (estudosData.value || [])
    .filter(e => hasDocTranslation(e, locale.value))
    .slice(0, 3)
    .map(e => useLocalizedDoc(e, locale.value))
})

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}
</script>
