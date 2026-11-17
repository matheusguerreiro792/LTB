<template>
  <div class="container mx-auto px-4 py-8 md:py-12 max-w-3xl space-y-8">
    <div v-if="isLoading" class="flex justify-center py-20">
      <Icon name="lucide:loader" class="w-10 h-10 animate-spin text-primary-600" />
    </div>

    <div v-else-if="!estudo" class="text-center py-20 space-y-4">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
        <Icon name="lucide:file-x" class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold">{{ $t('studies.notFoundTitle') }}</h2>
      <p class="text-gray-500">{{ $t('studies.notFoundDescription') }}</p>
      <NuxtLink :to="localePath('/estudos')" class="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline pt-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ $t('studies.backToList') }}
      </NuxtLink>
    </div>

    <article v-else class="space-y-10">
      <NuxtLink :to="localePath('/estudos')" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium mb-4">
        <Icon name="lucide:arrow-left" class="w-4 h-4" /> {{ $t('common.back') }}
      </NuxtLink>

      <!-- Aviso discreto quando ainda não há tradução no idioma atual -->
      <div v-if="estudo._isFallback && $t('studies.fallbackNotice')"
        class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-sm">
        <Icon name="lucide:languages" class="w-4 h-4 shrink-0" />
        <span>{{ $t('studies.fallbackNotice') }}</span>
      </div>

      <header class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider rounded-full">
            {{ estudo.tema || $t('common.theologicalStudy') }}
          </span>
          <span class="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1 ml-auto">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            {{ formattedDate }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
          {{ estudo.titulo }}
        </h1>

        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm">
          <Icon name="lucide:book-open" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          {{ estudo.livro }} {{ estudo.capitulo }}:{{ estudo.versiculos }}
        </div>
      </header>

      <!-- Capa do estudo (se existir) -->
      <div v-if="estudo.imagemCapa" class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden relative border border-gray-200 dark:border-gray-700/50">
        <img :src="estudo.imagemCapa" :alt="estudo.titulo" class="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div class="ad-slot-fluid my-8">
        <span class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('common.adSense') }}</span>
      </div>

      <div 
        class="prose prose-lg dark:prose-invert prose-primary max-w-none text-gray-700 dark:text-gray-300 font-sans prose-headings:font-bold prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-img:rounded-2xl"
        v-html="htmlContent">
      </div>

      <!-- Área de Compartilhamento e Próximos Passos -->
      <footer class="pt-10 mt-10 border-t border-gray-100 dark:border-gray-800 space-y-8">
        <div class="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 text-center space-y-4">
          <h3 class="font-bold text-xl">{{ $t('studies.footerTitle') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            {{ $t('studies.footerDescription') }}
          </p>
          <div class="pt-4">
            <NuxtLink :to="localePath('/materiais')" class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-primary-500/30">
              {{ $t('studies.footerButton') }} <Icon name="lucide:shopping-bag" class="w-4 h-4" />
            </NuxtLink>
          </div>
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

const { data: rawEstudo, pending: isLoading } = await useFetch(`/api/estudos/${id}`, {
  key: `estudo-${id}`
})

const estudo = computed(() => useLocalizedDoc(rawEstudo.value, locale.value))

useSeoMeta({
  title: () => estudo.value ? `${estudo.value.titulo} | ${t('common.theologicalStudy')}` : undefined,
  description: () => estudo.value ? t('studies.seoDescription', { book: estudo.value.livro, chapter: estudo.value.capitulo }) : undefined,
  ogTitle: () => estudo.value?.titulo,
  ogDescription: () => estudo.value ? t('studies.seoDescription', { book: estudo.value.livro, chapter: estudo.value.capitulo }) : undefined,
})

const htmlContent = computed(() => {
  if (!estudo.value?.conteudo) return ''
  return marked(estudo.value.conteudo, { breaks: true })
})

const formattedDate = computed(() => {
  if (!estudo.value?.createdAt) return ''
  const date = new Date(estudo.value.createdAt)
  return date.toLocaleDateString(locale.value, { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
})
</script>
