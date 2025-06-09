<template>
  <div class="p-4 max-w-6xl mx-auto text-white">
    <h1 class="text-xl sm:text-2xl font-bold mb-4 text-center">📩 Perguntas a Responder - Ebot</h1>

    <div v-if="produtosComPerguntas.length === 0" class="text-center text-gray-400">
      Nenhuma pergunta pendente encontrada.
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="produto in produtosComPerguntas" :key="produto.id" class="p-3 bg-gray-800 rounded shadow-md">
        <h2 class="text-base font-bold mb-2">{{ produto.nome }}</h2>

        <div class="w-full aspect-[4/3] overflow-hidden rounded mb-2">
          <img :src="produto.imageURL" alt="Produto" class="w-full h-full object-cover"/>
        </div>

        <div v-if="produto.perguntas.length">
          <h3 class="text-sm font-semibold mb-2">Perguntas:</h3>

          <div v-for="pergunta in produto.perguntas" :key="pergunta.id" class="bg-gray-700 p-2 rounded mb-2">
            <p class="text-sm mb-1"><strong>Q:</strong> {{ pergunta.conteudo }}</p>

            <input v-model="respostas[pergunta.id]" type="text" placeholder="Responder..." class="w-full px-2 py-1 rounded text-sm bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"/>
            <button @click="responder(pergunta.id)" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition w-full">
              Responder
            </button>
          </div>
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