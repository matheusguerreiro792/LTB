<template>
  <div class="container mx-auto px-4 py-12 max-w-6xl space-y-12">
    <header class="text-center space-y-4 max-w-2xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold">{{ $t('materials.heading') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        {{ $t('materials.subtitle') }}
      </p>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-20">
      <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-primary-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="materiaisAtivos.length === 0" class="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
      <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:shopping-bag" class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold">{{ $t('materials.emptyTitle') }}</h3>
      <p class="text-gray-500 text-sm mt-1">{{ $t('materials.emptyDescription') }}</p>
    </div>

    <!-- Grid de Materiais Dinâmicos -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="item in materiaisAtivos"
        :key="item.id"
        :class="item.destaque ? 'ring-2 ring-primary-500/50 shadow-xl shadow-primary-500/5' : ''"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group flex flex-col h-full hover:shadow-xl transition-all relative"
      >
        <!-- Badge de Destaque -->
        <div v-if="item.destaque" class="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <Icon name="lucide:star" class="w-3.5 h-3.5 fill-current" />
          <span>{{ $t('common.featured') }}</span>
        </div>

        <!-- Capa do Produto (Imagem real ou mock estilizado) -->
        <div class="aspect-video bg-primary-50 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden">
          <img
            v-if="item.urlImagem"
            :src="item.urlImagem"
            :alt="item.titulo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="p-6 flex items-center justify-center">
            <div class="w-28 h-36 bg-white dark:bg-gray-700 shadow-lg rounded-r-md border-l-4 border-primary-600 flex items-center justify-center p-2 text-center">
              <span class="text-xs font-bold text-gray-800 dark:text-white line-clamp-3">{{ item.titulo }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-1">
          <div class="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
            {{ item.categoria || $t('common.material') }}
          </div>
          <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">{{ item.titulo }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3 whitespace-pre-line">{{ item.descricao }}</p>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              <template v-if="item.preco > 0">
                {{ locale === 'en' ? `$ ${Number(item.preco).toFixed(2)}` : `R$ ${Number(item.preco).toFixed(2).replace('.', ',')}` }}
              </template>
              <template v-else>{{ $t('common.free') }}</template>
            </span>
            <a
              v-if="item.urlCheckout"
              :href="item.urlCheckout"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-primary-500/20"
            >
              <span>{{ $t('common.access') }}</span>
              <Icon name="lucide:external-link" class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { t, locale } = useI18n()

useHead(() => ({
  title: t('materials.pageTitle'),
}))

const { data, pending } = await useFetch('/api/materiais', {
  key: 'materiais-list',
  default: () => []
})

// Filtra apenas os ativos, com tradução no idioma atual, e dá prioridade para os que estão em destaque
const materiaisAtivos = computed(() => {
  const list = data.value || []
  return list
    .filter(item => item.ativo !== false && hasDocTranslation(item, locale.value))
    .map(item => useLocalizedDoc(item, locale.value))
    .sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0))
})
</script>
