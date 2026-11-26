<template>
  <div class="container mx-auto px-4 py-12 md:py-16 max-w-3xl space-y-10">
    <header class="space-y-3 border-b border-gray-200 dark:border-gray-800 pb-6">
      <h1 class="text-3xl md:text-4xl font-bold">{{ $t('privacy.heading') }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('privacy.lastUpdated') }}</p>
    </header>

    <div class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 md:p-10 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
      <p>{{ $t('privacy.intro') }}</p>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.dataCollectionTitle') }}</h2>
        <p>{{ $t('privacy.dataCollectionText') }}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.adsenseTitle') }}</h2>
        <p>{{ $t('privacy.adsenseText1') }}</p>
        <p>
          {{ $t('privacy.adsenseText2') }}
        </p>
        <div class="flex flex-wrap gap-3 pt-1 text-sm">
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:underline font-medium">
            <span>adssettings.google.com</span>
            <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
          </a>
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:underline font-medium">
            <span>aboutads.info/choices</span>
            <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.cookiesTitle') }}</h2>
        <p>{{ $t('privacy.cookiesText') }}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.infraTitle') }}</h2>
        <p>{{ $t('privacy.infraText') }}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.lgpdTitle') }}</h2>
        <p>{{ $t('privacy.lgpdText') }}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('privacy.changesTitle') }}</h2>
        <p>{{ $t('privacy.changesText') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead(() => ({
  title: t('privacy.pageTitle'),
}))
</script>
