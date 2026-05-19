<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl space-y-12">
    <header class="text-center space-y-4">
      <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
        <Icon name="lucide:info" class="w-8 h-8" />
      </div>
      <h1 class="text-4xl font-bold tracking-tight">Sobre o Projeto</h1>
    </header>

    <div class="prose prose-lg dark:prose-invert prose-primary mx-auto font-sans leading-relaxed text-gray-700 dark:text-gray-300">
      <p class="text-xl text-gray-500 dark:text-gray-400 font-sans text-center mb-10">
        O <strong>Viva a Bíblia</strong> nasceu do desejo de tornar acessível o conhecimento teológico profundo e a sabedoria dos clássicos para o crente moderno.
      </p>

      <h2>Nossa Missão</h2>
      <p>
        Acreditamos que a Bíblia é a palavra inerrante de Deus, e que o estudo diligente das escrituras é essencial para o crescimento espiritual. Nosso objetivo é compartilhar devocionais e estudos bíblicos estruturados, baseados em obras clássicas como os comentários de <strong>Matthew Henry</strong> e o <strong>Comentário Bíblico Beacon</strong>.
      </p>

      <h2>O Conteúdo</h2>
      <p>
        Todo o nosso material de leitura é 100% gratuito. Queremos que você tenha acesso livre a:
      </p>
      <ul>
        <li><strong>Devocionais Diários:</strong> Reflexões curtas para aplicar no dia a dia.</li>
        <li><strong>Estudos Teológicos:</strong> Artigos profundos para quem deseja ir além na teologia.</li>
      </ul>

      <h2>Como o projeto se mantém?</h2>
      <p>
        Para manter o site no ar e acessível a todos, utilizamos espaços discretos para anúncios (Google AdSense) e mantemos uma loja com infoprodutos selecionados e links de afiliados para materiais teológicos que recomendamos.
      </p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Sobre',
})
</script>
