<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { t } = useI18n()
const i18nHead = useLocaleHead({
  addSeoAttributes: true
})

// Configurações globais de SEO (Head)
useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${t('seo.siteName')}` : t('seo.defaultTitle')
  },
  meta: [
    ...(i18nHead.value.meta || []),
    { name: 'description', content: t('seo.defaultDescription') }
  ],
  link: [
    ...(i18nHead.value.link || []),
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap'
    }
  ]
}))
</script>
