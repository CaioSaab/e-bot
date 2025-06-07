AnunciosView
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-white">Anúncios - Ebot</h1>
    <div v-if="produtos.length === 0" class="text-white">
      Nenhum produto encontrado.
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="produto in produtos" :key="produto.id" class="bg-gray-700 p-4 rounded-lg shadow-md">
        <img :src="produto.imageURL" :alt="produto.nome" class="w-full h-40 object-cover rounded mb-4"/>
        <h2 class="text-lg font-bold mb-1">{{ produto.nome }}</h2>
        <p class="text-gray-600 mb-1">{{ produto.descricao }}</p>
        <p class="font-bold text-blue-600 mb-4">R$ {{ produto.preco }}</p>
        <div class="mb-2 color-stone-950">
          <label class="block text-sm text-gray-700 mb-1">
            Pergunte sobre este produto:
          </label>
          <input v-model="perguntas[produto.id]" type="text" placeholder="Digite sua pergunta..." class="text-stone-950 w-full px-3 py-2 border rounded bg-gray-200 focus:outline-none"/>
        </div>
        <button @click="enviarPergunta(produto.id)" class="w-full bg-blue-600 hover:bg-blue-700 text-stone-950 py-2 rounded">
          Enviar Pergunta
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const produtos = ref([])
const perguntas = ref({})

const backendURL = import.meta.env.VITE_BACKEND_URL

async function carregarProdutos() {
  try {
    const response = await api.get('/produtos')
    produtos.value = response.data
    console.log(response.data)
  } catch (error) {
    alert('Erro ao carregar produtos')
    console.error(error)
  }
}

async function enviarPergunta(produtoId) {
  const conteudo = perguntas.value[produtoId]

  if (!conteudo) {
    alert('Digite uma pergunta antes de enviar.')
    return
  }

  try {
    await api.post(`/produtos/${produtoId}/perguntas`, { conteudo })
    alert('Pergunta enviada com sucesso.')
    perguntas.value[produtoId] = ''
  } catch (error) {
    console.error('Erro ao enviar pergunta:', error)
    alert('Erro ao enviar pergunta.')
  }
}


onMounted(() => {
  carregarProdutos()
})
</script>