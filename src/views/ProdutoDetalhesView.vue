<template>
  <div class="p-6 max-w-3xl mx-auto">
    <button @click="voltar" class="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
      ← Voltar
    </button>

    <div v-if="loading" class="text-white">Carregando produto...</div>
    <div v-else-if="erro" class="text-red-500">{{ erro }}</div>
    <div v-else-if="produto" class="bg-gray-700 p-6 rounded-lg shadow-md">
      <img
        :src="produto.imageURL"
        :alt="produto.nome"
        class="w-full h-64 object-cover rounded mb-6"
      />
      <h1 class="text-3xl font-bold mb-4 text-white">{{ produto.nome }}</h1>
      <p class="text-gray-300 mb-4">{{ produto.descricao }}</p>
      <p class="text-xl font-bold text-blue-500 mb-6">R$ {{ produto.preco }}</p>

      <!-- Lista de perguntas -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-white">Perguntas sobre o produto</h2>

        <div v-if="perguntas.length === 0" class="text-gray-300 mb-4">
          Nenhuma pergunta ainda. Seja o primeiro a perguntar!
        </div>

        <ul>
          <li v-for="p in perguntas" :key="p.id" class="mb-4 bg-gray-600 p-4 rounded">
            <p class="text-white font-semibold">Q: {{ p.conteudo }}</p>
            <p v-if="p.resposta" class="text-green-400 mt-2">R: {{ p.resposta.conteudo }}</p>
          </li>
        </ul>
      </section>

      <!-- Campo para enviar nova pergunta -->
      <section>
        <h3 class="text-xl font-semibold mb-2 text-white">Faça uma pergunta</h3>
        <textarea
          v-model="novaPergunta"
          rows="3"
          placeholder="Digite sua pergunta aqui..."
          class="w-full p-3 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        ></textarea>
        <button
          @click="enviarPergunta"
          :disabled="enviando || novaPergunta.trim() === ''"
          class="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ enviando ? 'Enviando...' : 'Enviar Pergunta' }}
        </button>
      </section>
    </div>
    <div v-else class="text-white">Produto não encontrado.</div>
  </div>
</template>

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
