<template>
  <div class="container mx-auto px-4 py-9 max-w-3xl space-y-8">
    <header class="text-center space-y-4">
      <div
        class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mx-auto flex items-center justify-center mb-8">
        <Icon name="lucide:info" class="w-8 h-8" />
      </div>
      <h1 class="text-4xl font-bold tracking-tight">{{ $t('about.heading') }}</h1>
    </header>

    <div
      class="prose prose-lg dark:prose-invert prose-primary mx-auto font-sans leading-relaxed text-gray-700 dark:text-gray-300">
      <p class="text-xl text-gray-500 dark:text-gray-400 font-sans text-center">
        {{ $t('about.introBefore') }}<strong>{{ $t('about.introBrand') }}</strong>{{ $t('about.introAfter') }}
      </p>

      <h2 class="mb-4">{{ $t('about.missionTitle') }}</h2>
      <p>
        {{ $t('about.missionTextBefore') }}<strong>{{ $t('about.missionMatthew') }}</strong>{{ $t('about.missionAnd') }}<strong>{{ $t('about.missionBeacon') }}</strong>{{ $t('about.missionTextAfter') }}
      </p>

      <h2 class="mb-4">{{ $t('about.contentTitle') }}</h2>
      <p>
        {{ $t('about.contentIntro') }}
      </p>
      <ul>
        <li><strong>{{ $t('about.contentDevotionalsLabel') }}</strong>{{ $t('about.contentDevotionalsText') }}</li>
        <!-- <li><strong>Estudos Teológicos:</strong> Artigos profundos para quem deseja ir além na teologia.</li> -->
      </ul>

      <h2 class="mb-4">{{ $t('about.supportTitle') }}</h2>
      <p>
        {{ $t('about.supportText') }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead(() => ({
  title: t('about.pageTitle'),
}))
</script>
