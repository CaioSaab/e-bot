<template>
  <div class="p-6 max-w-5xl mx-auto text-white">
    <!-- Botão de voltar -->
    <button @click="voltar" class="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
      ← Voltar
    </button>

    <!-- Estados de carregamento/erro -->
    <div v-if="loading" class="text-white">Carregando produto...</div>
    <div v-else-if="erro" class="text-red-500">{{ erro }}</div>

    <!-- Produto carregado -->
    <div v-else-if="produto" class="bg-gray-800 p-6 rounded-lg shadow-xl">
      
      <!-- Imagem + informações lado a lado -->
      <div class="flex flex-col md:flex-row gap-10 mb-10">
        <!-- Imagem -->
        <div class="w-[300px] h-[300px] rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
          <img :src="produto.imageURL" :alt="produto.nome" class="w-full h-full object-cover" />
        </div>

        <!-- Nome, descrição e preço -->
        <div class="flex-1 flex flex-col justify-center">
          <h1 class="text-3xl font-bold mb-4">{{ produto.nome }}</h1>
          <p class="text-gray-300 mb-4">{{ produto.descricao }}</p>
          <p class="text-2xl font-bold text-blue-400">R$ {{ produto.preco.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Perguntas feitas -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">Perguntas sobre o produto</h2>
          <button
            @click="togglePerguntas"
            class="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 transition"
          >
            {{ perguntasMinimizadas ? 'Mostrar perguntas' : 'Minimizar perguntas' }}
          </button>
        </div>

        <div v-if="!perguntasMinimizadas">
          <div v-if="perguntas.length === 0" class="text-gray-400 mb-4">
            Nenhuma pergunta ainda. Seja o primeiro a perguntar!
          </div>

          <ul class="space-y-4">
            <li
              v-for="p in perguntas"
              :key="p.id"
              class="bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <p class="font-semibold">Q: {{ p.conteudo }}</p>
              <p v-if="p.resposta" class="text-green-400 mt-2">R: {{ p.resposta.conteudo }}</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- Campo para fazer pergunta -->
      <section class="bg-gray-700 p-6 rounded-lg shadow-md">
  <h3 class="text-xl font-semibold mb-4 text-white">📩 Faça uma pergunta</h3>

  <div class="space-y-4">
    <textarea
      v-model="novaPergunta"
      rows="4"
      placeholder="Digite sua pergunta aqui..."
      class="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
    ></textarea>

    <div class="flex justify-end">
      <button
        @click="enviarPergunta"
        :disabled="enviando || novaPergunta.trim() === ''"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 font-medium transition-all duration-200"
      >
        {{ enviando ? 'Enviando...' : 'Enviar Pergunta' }}
      </button>
    </div>
  </div>
</section>

    </div>

    <div v-else class="text-white">Produto não encontrado.</div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      perguntasMinimizadas: false,
      // suas outras propriedades aqui, ex:
      // produto, perguntas, novaPergunta, enviando, loading, erro...
    };
  },
  methods: {
    togglePerguntas() {
      this.perguntasMinimizadas = !this.perguntasMinimizadas;
    },
    // seus métodos existentes aqui, ex: enviarPergunta, voltar...
  },
};
</script>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const produto = ref(null)
const perguntas = ref([])
const novaPergunta = ref('')
const loading = ref(true)
const erro = ref(null)
const enviando = ref(false)

async function carregarProduto() {
  loading.value = true
  erro.value = null
  try {
    const id = route.params.id
    const response = await api.get(`/produtos/${id}`)
    produto.value = response.data
  } catch (e) {
    erro.value = 'Erro ao carregar produto.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function carregarPerguntas() {
  try {
    const id = route.params.id
    const response = await api.get(`/produtos/${id}/perguntas`)
    perguntas.value = response.data
  } catch (e) {
    console.error('Erro ao carregar perguntas:', e)
  }
}

async function enviarPergunta() {
  if (!novaPergunta.value.trim()) {
    alert('Digite uma pergunta antes de enviar.')
    return
  }
  enviando.value = true
  try {
    const id = route.params.id
    await api.post(`/produtos/${id}/perguntas`, { conteudo: novaPergunta.value.trim() })
    novaPergunta.value = ''
    await carregarPerguntas()
    alert('Pergunta enviada com sucesso.')
  } catch (e) {
    console.error('Erro ao enviar pergunta:', e)
    alert('Erro ao enviar pergunta.')
  } finally {
    enviando.value = false
  }
}

function voltar() {
  router.back()
}

onMounted(async () => {
  await carregarProduto()
  await carregarPerguntas()
})
</script>
