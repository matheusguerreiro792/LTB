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
            <span>Devocional do Dia</span>
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
              <NuxtLink :to="`/devocionais/${latestDevocional.id}`"
                class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
                <span>Ler Devocional Completo</span>
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </template>

          <template v-else>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              A Sabedoria para <br class="hidden md:block" /> Viver os Princípios Bíblicos
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 font-sans leading-relaxed max-w-2xl mx-auto">
              Acompanhe nossos devocionais diários baseados na palavra de Deus.
            </p>
          </template>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 space-y-16">

      <!-- Ad Slot -->
      <div class="ad-slot-fluid">
        <span class="text-xs text-gray-400 uppercase tracking-wider">Espaço Publicitário</span>
      </div>

      <!-- Últimos Estudos Teológicos -->
      <section v-if="estudos.length > 0">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">Estudos Recentes</h2>
          <NuxtLink to="/estudos"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1">
            Ver todos
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div v-if="estudos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="estudo in estudos" :key="estudo.id"
            class="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none dark:hover:border-gray-700 transition-all">
            <NuxtLink v-if="estudo.imagemCapa" :to="`/estudos/${estudo.id}`"
              class="block aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
              <img :src="estudo.imagemCapa" :alt="estudo.titulo"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </NuxtLink>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span class="text-primary-600 dark:text-primary-400">{{ estudo.tema || 'Estudo Teológico' }}</span>
              </div>
              <NuxtLink :to="`/estudos/${estudo.id}`" class="block">
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
          <p class="text-gray-500 dark:text-gray-400">Nenhum estudo publicado ainda.</p>
        </div>
      </section>

      <!-- CTA Loja / Infoprodutos -->
      <section class="bg-primary-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden dark:bg-gray-900">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32">
        </div>
        <div class="relative z-10 md:w-2/3 space-y-6">
          <h2 class="text-3xl font-bold text-white">Aprofunde seu conhecimento</h2>
          <p class="text-gray-100 text-lg leading-relaxed max-w-xl dark:text-gray-300">
            Conheça nossos materiais e livros recomendados para auxiliar nos seus estudos bíblicos e vida devocional.
          </p>
          <NuxtLink to="/materiais"
            class="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
            Acessar Materiais
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

useHead({
  title: 'Início',
})

// Buscar dados com cache SWR da Vercel
const { data: devocionaisData, pending: isLoadingDevocional } = await useFetch('/api/devocionais', {
  key: 'home-devocionais',
  default: () => []
})

const { data: estudosData } = await useFetch('/api/estudos', {
  key: 'home-estudos',
  default: () => []
})

const latestDevocional = computed(() => {
  return devocionaisData.value?.[0] || null
})

const estudos = computed(() => {
  return (estudosData.value || []).slice(0, 3)
})

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}
</script>
