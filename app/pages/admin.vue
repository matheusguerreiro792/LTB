<template>
  <div class="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
    <div v-if="!isAuthenticated"
      class="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none">
      <div class="text-center mb-8">
        <div
          class="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:lock" class="w-6 h-6" />
        </div>
        <h1 class="text-2xl font-bold">Acesso Restrito</h1>
        <p class="text-gray-500 text-sm mt-2">Área exclusiva para gerenciamento de conteúdo.</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
          <input v-model="email" type="email" placeholder="admin@vivaabiblia.com" required
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
          <input v-model="password" type="password" placeholder="••••••••" required
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow">
        </div>
        <div v-if="errorMessage" class="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="isLoading"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
          <span v-if="!isLoading">Entrar no Painel</span>
          <span v-else>Entrando...</span>
          <Icon v-if="!isLoading" name="lucide:arrow-right" class="w-4 h-4" />
        </button>
      </form>
    </div>

    <div v-else class="w-full max-w-5xl space-y-8">
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Painel Administrativo</h1>
          <p class="text-gray-500">Gerencie devocionais e estudos</p>
        </div>
        <button @click="logout"
          class="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors">
          <Icon name="lucide:log-out" class="w-4 h-4" />
          Sair
        </button>
      </header>

      <div v-if="currentView === 'dashboard'" class="space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div @click="openForm('new_devocional')"
            class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 cursor-pointer transition-colors group">
            <div
              class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:file-text" class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-lg">Novo Devocional</h3>
            <p class="text-sm text-gray-500 mt-1">Criar reflexão diária</p>
          </div>
          
          <div @click="openForm('new_estudo')"
            class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 cursor-pointer transition-colors group">
            <div
              class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="lucide:book-open" class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-lg">Novo Estudo</h3>
            <p class="text-sm text-gray-500 mt-1">Criar artigo teológico</p>
          </div>

          <div
            class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 cursor-pointer transition-colors">
            <div
              class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-4">
              <Icon name="lucide:settings" class="w-5 h-5" />
            </div>
            <h3 class="font-bold text-lg">Configurações</h3>
            <p class="text-sm text-gray-500 mt-1">Gerenciar site</p>
          </div>
        </div>

        <!-- Listagem de Devocionais -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="lucide:list" class="w-5 h-5 text-primary-600" />
            Devocionais Publicados
          </h2>
          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div v-if="devocionaisList.length === 0" class="p-6 text-center text-gray-500">Nenhum devocional encontrado.</div>
            <div v-for="dev in devocionaisList" :key="dev.id" class="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex-1 mb-2 sm:mb-0">
                <h4 class="font-bold text-gray-900 dark:text-gray-100">{{ dev.titulo }}</h4>
                <div class="text-sm text-gray-500 flex items-center gap-2">
                  <span class="text-primary-600 font-medium">{{ dev.livro }}</span> &bull; 
                  <span>{{ formatDate(dev.createdAt) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="editItem(dev, 'devocional')" class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" title="Editar">
                  <Icon name="lucide:edit-2" class="w-4 h-4" />
                </button>
                <button @click="deleteItem(dev.id, 'devocionais')" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Excluir">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Listagem de Estudos -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon name="lucide:list" class="w-5 h-5 text-primary-600" />
            Estudos Publicados
          </h2>
          <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div v-if="estudosList.length === 0" class="p-6 text-center text-gray-500">Nenhum estudo encontrado.</div>
            <div v-for="estudo in estudosList" :key="estudo.id" class="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex-1 mb-2 sm:mb-0">
                <h4 class="font-bold text-gray-900 dark:text-gray-100">{{ estudo.titulo }}</h4>
                <div class="text-sm text-gray-500 flex items-center gap-2">
                  <span class="text-primary-600 font-medium">{{ estudo.livro }} {{ estudo.capitulo }}</span> &bull; 
                  <span>{{ formatDate(estudo.createdAt) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="editItem(estudo, 'estudo')" class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" title="Editar">
                  <Icon name="lucide:edit-2" class="w-4 h-4" />
                </button>
                <button @click="deleteItem(estudo.id, 'estudos')" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Excluir">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de Novo Devocional -->
      <div v-else-if="currentView === 'new_devocional'" class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="currentView = 'dashboard'" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </button>
            <h2 class="text-xl font-bold">{{ editingId ? 'Editar Devocional' : 'Criar Novo Devocional' }}</h2>
          </div>
        </div>
        
        <form @submit.prevent="submitDevocional" class="p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input v-model="devocionalForm.titulo" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
            
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Livro Bíblico (Ex: Salmos)</label>
              <input v-model="devocionalForm.livro" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Versículo (Ex: Salmos 56:3 - "No dia em que eu...")</label>
              <input v-model="devocionalForm.versiculo" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
            
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tema (Uma palavra, Ex: Confiança)</label>
              <input v-model="devocionalForm.tema" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo do Devocional (Markdown suportado)</label>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" class="text-xs text-primary-600 hover:underline flex items-center gap-1">
                <Icon name="lucide:help-circle" class="w-3 h-3" />
                Guia de formatação
              </a>
            </div>
            <textarea v-model="devocionalForm.conteudo" required rows="12" placeholder="## Título principal&#10;&#10;Escreva o seu texto aqui usando marcação...&#10;&#10;* **Negrito**&#10;* *Itálico*&#10;* [Links](https://...)" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow resize-y font-mono text-sm"></textarea>
          </div>

          <div v-if="submitMessage" :class="submitError ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'bg-green-50 text-green-600 dark:bg-green-900/30'" class="p-4 rounded-xl text-sm">
            {{ submitMessage }}
          </div>

          <div class="pt-4 flex justify-end gap-4">
            <button type="button" @click="currentView = 'dashboard'" class="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="isSubmitting" class="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center gap-2">
              <Icon v-if="isSubmitting" name="lucide:loader" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Publicar Devocional') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Formulário de Novo Estudo -->
      <div v-else-if="currentView === 'new_estudo'" class="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="currentView = 'dashboard'" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </button>
            <h2 class="text-xl font-bold">{{ editingId ? 'Editar Estudo' : 'Criar Novo Estudo' }}</h2>
          </div>
        </div>
        
        <form @submit.prevent="submitEstudo" class="p-6 md:p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input v-model="estudoForm.titulo" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
            
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tema (Uma palavra)</label>
              <input v-model="estudoForm.tema" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da Imagem de Capa (Opcional)</label>
              <input v-model="estudoForm.imagemCapa" type="url" placeholder="https://..." class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
              <p class="text-xs text-gray-500 mt-1">Cole o link público da imagem. Pode ser do Google Drive (link direto).</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Livro</label>
              <input v-model="estudoForm.livro" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
            
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Capítulo</label>
              <input v-model="estudoForm.capitulo" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Versículo(s)</label>
              <input v-model="estudoForm.versiculos" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow">
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo do Estudo (Markdown suportado)</label>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" class="text-xs text-primary-600 hover:underline flex items-center gap-1">
                <Icon name="lucide:help-circle" class="w-3 h-3" />
                Guia de formatação
              </a>
            </div>
            <textarea v-model="estudoForm.conteudo" required rows="15" placeholder="## Introdução&#10;&#10;Escreva o estudo detalhado..." class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-shadow resize-y font-mono text-sm"></textarea>
          </div>

          <div v-if="submitMessage" :class="submitError ? 'bg-red-50 text-red-600 dark:bg-red-900/30' : 'bg-green-50 text-green-600 dark:bg-green-900/30'" class="p-4 rounded-xl text-sm">
            {{ submitMessage }}
          </div>

          <div class="pt-4 flex justify-end gap-4">
            <button type="button" @click="currentView = 'dashboard'" class="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="isSubmitting" class="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center gap-2">
              <Icon v-if="isSubmitting" name="lucide:loader" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Publicar Estudo') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore'

useHead({
  title: 'Admin',
})

const { $auth, $firestore } = useNuxtApp()

const isAuthenticated = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Dashboard State
const currentView = ref('dashboard')

// Formulário Devocional
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitError = ref(false)

const devocionalForm = reactive({
  titulo: '',
  livro: '',
  versiculo: '',
  tema: '',
  conteudo: ''
})

const devocionaisList = ref([])
const estudosList = ref([])
const editingId = ref(null)

const estudoForm = reactive({
  titulo: '',
  livro: '',
  capitulo: '',
  versiculos: '',
  tema: '',
  imagemCapa: '',
  conteudo: ''
})

const fetchLists = async () => {
  if (!$firestore) return
  
  try {
    // Buscar devocionais
    const devQ = query(collection($firestore, 'devocionais'), orderBy('createdAt', 'desc'))
    const devSnap = await getDocs(devQ)
    devocionaisList.value = devSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Buscar estudos
    const estQ = query(collection($firestore, 'estudos'), orderBy('createdAt', 'desc'))
    const estSnap = await getDocs(estQ)
    estudosList.value = estSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Erro ao buscar listas:", error)
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return timestamp.toDate().toLocaleDateString('pt-BR')
}

onMounted(() => {
  if ($auth) {
    onAuthStateChanged($auth, (user) => {
      isAuthenticated.value = !!user
      if (user) {
        fetchLists()
      }
    })
  }
})

const login = async () => {
  if (!$auth) {
    errorMessage.value = "Firebase não inicializado corretamente. Verifique suas chaves."
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await signInWithEmailAndPassword($auth, email.value, password.value)
    // O onAuthStateChanged vai mudar o isAuthenticated automaticamente
  } catch (error) {
    errorMessage.value = "Acesso negado. Verifique seu e-mail e senha."
    console.error("Erro no login:", error)
  } finally {
    isLoading.value = false
  }
}

const logout = async () => {
  if ($auth) {
    await signOut($auth)
  }
}

const submitDevocional = async () => {
  if (!$firestore) {
    submitError.value = true
    submitMessage.value = "Erro: Firestore não está conectado."
    return
  }

  isSubmitting.value = true
  submitError.value = false
  submitMessage.value = ''

  try {
    const data = {
      titulo: devocionalForm.titulo,
      livro: devocionalForm.livro,
      versiculo: devocionalForm.versiculo,
      tema: devocionalForm.tema,
      conteudo: devocionalForm.conteudo,
    }

    if (editingId.value) {
      const docRef = doc($firestore, "devocionais", editingId.value)
      await updateDoc(docRef, data)
      submitMessage.value = "Devocional atualizado com sucesso!"
    } else {
      data.createdAt = serverTimestamp()
      await addDoc(collection($firestore, "devocionais"), data)
      submitMessage.value = "Devocional publicado com sucesso!"
    }
    
    // Limpar form
    devocionalForm.titulo = ''
    devocionalForm.versiculo = ''
    devocionalForm.tema = ''
    devocionalForm.conteudo = ''
    devocionalForm.livro = ''
    editingId.value = null
    
    fetchLists()
    setTimeout(() => {
      submitMessage.value = ''
      currentView.value = 'dashboard'
    }, 2000)
    
  } catch (e) {
    console.error("Erro ao salvar devocional: ", e)
    submitError.value = true
    submitMessage.value = "Erro ao salvar devocional. Tente novamente."
  } finally {
    isSubmitting.value = false
  }
}

const submitEstudo = async () => {
  if (!$firestore) {
    submitError.value = true
    submitMessage.value = "Erro: Firestore não está conectado."
    return
  }

  isSubmitting.value = true
  submitError.value = false
  submitMessage.value = ''

  try {
    const data = {
      titulo: estudoForm.titulo,
      livro: estudoForm.livro,
      capitulo: estudoForm.capitulo,
      versiculos: estudoForm.versiculos,
      tema: estudoForm.tema,
      imagemCapa: estudoForm.imagemCapa || '',
      conteudo: estudoForm.conteudo,
    }

    if (editingId.value) {
      const docRef = doc($firestore, "estudos", editingId.value)
      await updateDoc(docRef, data)
      submitMessage.value = "Estudo atualizado com sucesso!"
    } else {
      data.createdAt = serverTimestamp()
      await addDoc(collection($firestore, "estudos"), data)
      submitMessage.value = "Estudo publicado com sucesso!"
    }
    
    // Limpar form
    estudoForm.titulo = ''
    estudoForm.livro = ''
    estudoForm.capitulo = ''
    estudoForm.versiculos = ''
    estudoForm.tema = ''
    estudoForm.imagemCapa = ''
    estudoForm.conteudo = ''
    editingId.value = null
    
    fetchLists()
    setTimeout(() => {
      submitMessage.value = ''
      currentView.value = 'dashboard'
    }, 2000)
    
  } catch (e) {
    console.error("Erro ao salvar estudo: ", e)
    submitError.value = true
    submitMessage.value = "Erro ao salvar estudo. Tente novamente."
  } finally {
    isSubmitting.value = false
  }
}

const openForm = (viewName) => {
  editingId.value = null
  if (viewName === 'new_devocional') {
    devocionalForm.titulo = ''
    devocionalForm.livro = ''
    devocionalForm.versiculo = ''
    devocionalForm.tema = ''
    devocionalForm.conteudo = ''
  } else if (viewName === 'new_estudo') {
    estudoForm.titulo = ''
    estudoForm.livro = ''
    estudoForm.capitulo = ''
    estudoForm.versiculos = ''
    estudoForm.tema = ''
    estudoForm.imagemCapa = ''
    estudoForm.conteudo = ''
  }
  currentView.value = viewName
}

const editItem = (item, type) => {
  editingId.value = item.id
  if (type === 'devocional') {
    devocionalForm.titulo = item.titulo || ''
    devocionalForm.livro = item.livro || ''
    devocionalForm.versiculo = item.versiculo || ''
    devocionalForm.tema = item.tema || ''
    devocionalForm.conteudo = item.conteudo || ''
    currentView.value = 'new_devocional'
  } else if (type === 'estudo') {
    estudoForm.titulo = item.titulo || ''
    estudoForm.livro = item.livro || ''
    estudoForm.capitulo = item.capitulo || ''
    estudoForm.versiculos = item.versiculos || ''
    estudoForm.tema = item.tema || ''
    estudoForm.imagemCapa = item.imagemCapa || ''
    estudoForm.conteudo = item.conteudo || ''
    currentView.value = 'new_estudo'
  }
}

const deleteItem = async (id, collectionName) => {
  if (!confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) return
  
  if (!$firestore) return
  try {
    await deleteDoc(doc($firestore, collectionName, id))
    fetchLists()
  } catch (error) {
    console.error("Erro ao excluir item:", error)
    alert('Erro ao excluir. Tente novamente.')
  }
}
</script>
