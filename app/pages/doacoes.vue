<template>
  <div class="container mx-auto px-4 py-12 md:py-16 max-w-3xl space-y-10">
    <header class="text-center space-y-4">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/75 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-sm font-medium">
        <Icon name="lucide:heart" class="w-4 h-4" />
        <span>{{ $t('donations.badge') }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold">{{ $t('donations.heading') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
        {{ $t('donations.subtitle') }}
      </p>
    </header>

    <!-- Opção internacional (quando configurada, especialmente em EN) -->
    <section v-if="donationExternalUrl && (locale === 'en' || !hasPixKey)"
      class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 text-center space-y-5 shadow-sm">
      <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto">
        <Icon name="lucide:globe" class="w-6 h-6" />
      </div>
      <h2 class="text-2xl font-bold">{{ $t('donations.internationalTitle') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {{ $t('donations.internationalDescription') }}
      </p>
      <div>
        <a :href="donationExternalUrl" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-primary-500/25">
          <span>{{ $t('donations.internationalButton') }}</span>
          <Icon name="lucide:external-link" class="w-4 h-4" />
        </a>
      </div>
    </section>

    <!-- Pix com QR Code (mínimo R$ 1,00) -->
    <section v-if="hasPixKey"
      class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 space-y-8 shadow-sm">
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-center">{{ $t('donations.chooseAmount') }}</h2>

        <div class="flex flex-wrap justify-center gap-2.5">
          <button
            v-for="preset in presets"
            :key="preset"
            type="button"
            @click="selectPreset(preset)"
            :class="Number(amountInput) === preset ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-primary-400'"
            class="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer">
            R$ {{ preset }}
          </button>
        </div>

        <div class="max-w-xs mx-auto pt-2">
          <label for="donation-amount" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 text-center">
            {{ $t('donations.customAmountLabel') }}
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">R$</span>
            <input
              id="donation-amount"
              v-model.number="amountInput"
              type="number"
              min="1"
              step="0.50"
              class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500">
          </div>
          <p v-if="!isValidAmount" class="text-xs text-red-500 text-center mt-2">
            {{ $t('donations.minAmountError') }}
          </p>
        </div>
      </div>

      <div v-if="isValidAmount && qrDataUrl" class="flex flex-col items-center space-y-6 pt-2 border-t border-gray-100 dark:border-gray-800">
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center pt-4">
          {{ $t('donations.qrInstruction') }}
        </p>

        <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <img :src="qrDataUrl" :alt="`QR Code Pix R$ ${formattedAmount}`" class="w-56 h-56 block" />
        </div>

        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          R$ {{ formattedAmount }}
        </div>

        <div class="w-full max-w-md space-y-2">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 text-center uppercase tracking-wider">
            {{ $t('donations.pixCopyLabel') }}
          </p>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              :value="pixPayload"
              aria-label="Pix Copia e Cola"
              class="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-600 dark:text-gray-300 truncate focus:outline-none">
            <button
              type="button"
              @click="copyPixCode"
              class="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 cursor-pointer">
              <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
              <span>{{ copied ? $t('donations.copiedButton') : $t('donations.copyButton') }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="!donationExternalUrl"
      class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 text-center text-gray-500">
      {{ $t('donations.notConfigured') }}
    </section>

    <p class="text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
      {{ $t('donations.transparencyNote') }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

if (!config.public.pix?.key?.trim()) {
  await navigateTo(localePath('/'), { replace: true })
}

useHead(() => ({
  title: t('donations.pageTitle'),
}))

const presets = [1, 5, 10, 25, 50]
const amountInput = ref(10)
const qrDataUrl = ref('')
const copied = ref(false)

const pixConfig = computed(() => config.public.pix || {})
const hasPixKey = computed(() => Boolean(pixConfig.value.key && pixConfig.value.key.trim() !== ''))
const donationExternalUrl = computed(() => (config.public.donationExternalUrl || '').trim())

const numericAmount = computed(() => Number(amountInput.value))
const isValidAmount = computed(() => Number.isFinite(numericAmount.value) && numericAmount.value >= 1)
const formattedAmount = computed(() => numericAmount.value.toFixed(2).replace('.', ','))

const pixPayload = computed(() => {
  if (!hasPixKey.value || !isValidAmount.value) return ''
  return buildPixPayload({
    pixKey: pixConfig.value.key,
    merchantName: pixConfig.value.merchantName,
    merchantCity: pixConfig.value.merchantCity,
    amount: numericAmount.value,
  })
})

watch(
  pixPayload,
  async (payload) => {
    if (!payload) {
      qrDataUrl.value = ''
      return
    }
    try {
      qrDataUrl.value = await QRCode.toDataURL(payload, {
        width: 240,
        margin: 2,
        color: {
          dark: '#111827',
          light: '#ffffff',
        },
      })
    } catch (error) {
      console.error('Erro ao gerar QR Code Pix:', error)
      qrDataUrl.value = ''
    }
  },
  { immediate: true }
)

const selectPreset = (value) => {
  amountInput.value = value
}

const copyPixCode = async () => {
  if (!pixPayload.value) return
  try {
    await navigator.clipboard.writeText(pixPayload.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (error) {
    console.error('Erro ao copiar código Pix:', error)
  }
}
</script>
