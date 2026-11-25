<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-3xl space-y-8">
    <div v-if="isLoading" class="flex justify-center py-20">
      <Icon name="lucide:loader" class="w-10 h-10 animate-spin text-primary-600" />
    </div>

    <div v-else-if="!devocional" class="text-center py-20 space-y-4">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
        <Icon name="lucide:file-x" class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold">{{ $t('devotionals.notFoundTitle') }}</h2>
      <p class="text-gray-500">{{ $t('devotionals.notFoundDescription') }}</p>
      <NuxtLink :to="localePath('/devocionais')" class="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline pt-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ $t('devotionals.backToList') }}
      </NuxtLink>
    </div>

    <article v-else class="space-y-8">
      <NuxtLink :to="localePath('/devocionais')" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium mb-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ $t('common.back') }}
      </NuxtLink>

      <!-- Aviso discreto quando ainda não há tradução no idioma atual -->
      <div v-if="devocional._isFallback && $t('devotionals.fallbackNotice')"
        class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-sm">
        <Icon name="lucide:languages" class="w-4 h-4 shrink-0" />
        <span>{{ $t('devotionals.fallbackNotice') }}</span>
      </div>

      <header class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-3 py-1 bg-primary-100/75 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider rounded-full">
            {{ devocional.livro }}
          </span>
          <span v-if="devocional.tema" class="text-gray-600 dark:text-gray-400 text-sm">
            #{{ devocional.tema }}
          </span>
          <span class="text-gray-500 text-sm flex items-center gap-1 ml-auto">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            {{ formattedDate }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          {{ devocional.titulo }}
        </h1>

        <blockquote class="border-l-4 border-primary-500 pl-5 py-2.5 my-8 bg-linear-to-r from-primary-100/50 to-transparent dark:from-primary-900/25 rounded-r-xl">
          <p class="font-sans text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
            {{ devocional.versiculo }}
          </p>
        </blockquote>
      </header>

      <div class="ad-slot-fluid my-8">
        <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSense') }}</span>
      </div>

      <div 
        class="prose prose-lg prose-h2:mb-4 prose-h3:mb-2 dark:prose-invert prose-primary max-w-none text-gray-700 dark:text-gray-300 prose-headings:font-bold prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-9 prose-blockquote:rounded-r-xl prose-blockquote:-mb-2 prose-img:rounded-2xl prose-li:marker:text-primary-500"
        v-html="htmlContent">
      </div>

      <!-- Área de Compartilhamento e Próximos Passos -->
      <footer class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 space-y-8">
        <div class="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 text-center space-y-4">
          <h3 class="font-bold text-xl">{{ $t('devotionals.shareTitle') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            {{ $t('devotionals.shareSubtitle') }}
          </p>
          <!-- <div class="pt-4">
            <NuxtLink :to="localePath('/estudos')" class="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-medium transition-transform hover:scale-105">
              Conhecer Estudos Teológicos <Icon name="lucide:book" class="w-4 h-4" />
            </NuxtLink>
          </div> -->
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const id = route.params.id

const { data: rawDevocional, pending: isLoading } = await useFetch(`/api/devocionais/${id}`, {
  key: `devocional-${id}`
})

const devocional = computed(() => {
  if (!hasDocTranslation(rawDevocional.value, locale.value)) return null
  return useLocalizedDoc(rawDevocional.value, locale.value)
})

useSeoMeta({
  title: () => devocional.value ? `${devocional.value.titulo} | ${t('seo.siteName')}` : undefined,
  description: () => devocional.value?.versiculo,
  ogTitle: () => devocional.value?.titulo,
  ogDescription: () => devocional.value?.versiculo,
})

const htmlContent = computed(() => {
  if (!devocional.value?.conteudo) return ''
  return marked(devocional.value.conteudo, { breaks: true })
})

const formattedDate = computed(() => {
  if (!devocional.value?.createdAt) return ''
  const date = new Date(devocional.value.createdAt)
  return date.toLocaleDateString(locale.value, { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
})
</script>
