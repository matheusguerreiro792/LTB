<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Configurações globais de SEO (Head)
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Viva a Bíblia` : 'Viva a Bíblia | Devocionais & Estudos';
  },
  meta: [
    { name: 'description', content: 'Devocionais diários e estudos teológicos gratuitos baseados em comentários de Matthew Henry e Beacon.' }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap'
    }
  ]
})
</script>
