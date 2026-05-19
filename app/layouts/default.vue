<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 selection:bg-primary-500/30">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold group-hover:bg-primary-500 transition-colors">
            VB
          </div>
          <span class="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Viva a <span class="text-primary-600 dark:text-primary-400">Bíblia</span></span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8 font-medium">
          <NuxtLink to="/devocionais" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Devocionais</NuxtLink>
          <NuxtLink to="/estudos" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Estudos</NuxtLink>
          <NuxtLink to="/loja" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Loja</NuxtLink>
          <NuxtLink to="/sobre" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sobre</NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Alternar Tema">
            <Icon v-if="isDark" name="lucide:sun" class="w-5 h-5 text-gray-400 hover:text-yellow-400" />
            <Icon v-else name="lucide:moon" class="w-5 h-5 text-gray-500 hover:text-primary-600" />
          </button>
          
          <NuxtLink to="/admin" class="hidden md:flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-primary-500/20 text-sm">
            <span>Admin</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
          
          <!-- Mobile Menu Toggle -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-4">
        <NuxtLink @click="isMobileMenuOpen = false" to="/devocionais" class="block font-medium hover:text-primary-600">Devocionais</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/estudos" class="block font-medium hover:text-primary-600">Estudos</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/loja" class="block font-medium hover:text-primary-600">Loja</NuxtLink>
        <NuxtLink @click="isMobileMenuOpen = false" to="/sobre" class="block font-medium hover:text-primary-600">Sobre</NuxtLink>
        <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
          <NuxtLink @click="isMobileMenuOpen = false" to="/admin" class="flex items-center justify-between font-medium">
            Painel Admin
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <NuxtLink to="/" class="flex items-center gap-2 group mb-4">
              <div class="w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
                VB
              </div>
              <span class="font-bold tracking-tight text-gray-900 dark:text-white">Viva a Bíblia</span>
            </NuxtLink>
            <p class="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed">
              Compartilhando conhecimento bíblico e devocionais com profundidade, baseado nos comentários de Matthew Henry e Beacon. Para a edificação da Igreja.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Links Rápidos</h3>
            <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><NuxtLink to="/devocionais" class="hover:text-primary-600 transition-colors">Devocionais Diários</NuxtLink></li>
              <li><NuxtLink to="/estudos" class="hover:text-primary-600 transition-colors">Estudos Teológicos</NuxtLink></li>
              <li><NuxtLink to="/loja" class="hover:text-primary-600 transition-colors">Nossa Loja</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Apoie</h3>
            <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" class="hover:text-primary-600 transition-colors">Adquirir Materiais</a></li>
              <li><a href="#" class="hover:text-primary-600 transition-colors">Doações</a></li>
              <li><NuxtLink to="/sobre" class="hover:text-primary-600 transition-colors">Sobre o Projeto</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-400">
            &copy; {{ new Date().getFullYear() }} Viva a Bíblia. Todos os direitos reservados.
          </p>
          <div class="flex items-center gap-4 text-gray-400">
            <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="lucide:instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="lucide:youtube" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMobileMenuOpen = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>
