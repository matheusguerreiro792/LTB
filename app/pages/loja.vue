<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl space-y-12">
    <header class="text-center space-y-4 max-w-2xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold">Nossa Loja</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Aprofunde seus estudos com nossa seleção de infoprodutos, e-books e materiais recomendados.
      </p>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Produto Mock 1 -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group flex flex-col h-full hover:shadow-xl transition-all">
        <div class="aspect-square bg-primary-50 dark:bg-gray-800 relative flex items-center justify-center p-8">
          <div class="w-32 h-40 bg-white dark:bg-gray-700 shadow-xl rounded-r-md border-l-4 border-primary-600 flex items-center justify-center relative">
            <span class="text-xs font-bold text-center px-2 text-gray-800 dark:text-white">Guia de Estudo Beacon</span>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">E-Book</div>
          <h3 class="text-lg font-bold mb-2">Guia Prático: Como Estudar com o Comentário Beacon</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">Aprenda a extrair o máximo das suas leituras com este método passo a passo.</p>
          <div class="flex items-center justify-between mt-auto">
            <span class="text-xl font-bold">R$ 29,90</span>
            <button class="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl transition-colors">
              <Icon name="lucide:shopping-cart" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Produto Mock 2 -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group flex flex-col h-full hover:shadow-xl transition-all">
        <div class="aspect-square bg-primary-50 dark:bg-gray-800 relative flex items-center justify-center p-8">
          <div class="w-32 h-40 bg-white dark:bg-gray-700 shadow-xl rounded-r-md border-l-4 border-primary-600 flex items-center justify-center relative">
            <span class="text-xs font-bold text-center px-2 text-gray-800 dark:text-white">Devocional 365</span>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">Livro Físico</div>
          <h3 class="text-lg font-bold mb-2">Devocional 365 Dias com Matthew Henry</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">Um ano inteiro de leituras inspiradoras compiladas em um lindo livro de capa dura.</p>
          <div class="flex items-center justify-between mt-auto">
            <span class="text-xl font-bold">R$ 79,90</span>
            <button class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 p-2 rounded-xl transition-colors">
              <Icon name="lucide:external-link" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Loja',
})
</script>
