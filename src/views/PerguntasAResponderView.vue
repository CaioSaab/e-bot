<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl font-bold mb-4">Perguntas a Responder - Ebot</h1>

    <div v-if="produtosComPerguntas.length === 0">Nenhuma pergunta pendente encontrada.</div>

    <div v-for="produto in produtosComPerguntas" :key="produto.id" class="mb-6 p-4 bg-gray-800 rounded shadow">
      <h2 class="text-xl font-bold mb-2">{{ produto.nome }}</h2>
      <img :src="produto.imageURL" alt="Produto" class="w-full h-40 object-cover rounded mb-2"/>
      <p class="text-sm mb-4">{{ produto.descricao }}</p>

      <div v-if="produto.perguntas.length">
        <h3 class="text-lg font-semibold mb-2">Perguntas Pendentes:</h3>
        <div v-for="pergunta in produto.perguntas" :key="pergunta.id" class="bg-gray-700 p-3 rounded mb-3">
          <p class="mb-2"><strong>Pergunta:</strong> {{ pergunta.conteudo }}</p>
          <input
            v-model="respostas[pergunta.id]"
            type="text"
            placeholder="Digite sua resposta..."
            class="w-full px-3 py-2 border rounded bg-gray-200 text-black mb-2"
          />
          <button @click="responder(pergunta.id)" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">
            Responder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const produtosComPerguntas = ref([])
const respostas = ref({})

async function carregarProdutosComPerguntas() {
  try {
    const resProdutos = await api.get('/produtos/meus')
    const produtos = resProdutos.data

    const produtosFiltrados = []
    for (const produto of produtos) {
      const resPerguntas = await api.get(`/produtos/${produto.id}/perguntas`)
      const perguntasSemResposta = resPerguntas.data.filter(p => !p.resposta)

      if (perguntasSemResposta.length > 0) {
        produtosFiltrados.push({
          ...produto,
          perguntas: perguntasSemResposta
        })
      }
    }

    produtosComPerguntas.value = produtosFiltrados
  } catch (err) {
    console.error('Erro ao carregar perguntas pendentes:', err)
    alert('Erro ao carregar perguntas pendentes.')
  }
}

async function responder(perguntaId) {
  const conteudo = respostas.value[perguntaId]
  if (!conteudo) {
    alert('Digite uma resposta.')
    return
  }

  try {
    await api.post(`/perguntas/${perguntaId}/respostas`, { conteudo })
    alert('Resposta enviada com sucesso!')
    respostas.value[perguntaId] = ''
    await carregarProdutosComPerguntas()
  } catch (err) {
    console.error('Erro ao enviar resposta:', err)
    alert('Erro ao enviar resposta.')
  }
}

onMounted(carregarProdutosComPerguntas)
</script>
