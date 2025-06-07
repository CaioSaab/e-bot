<template>
  <div class="space-y-4">
    <div v-for="pergunta in perguntas" :key="pergunta.id" class="bg-gray-800 p-4 rounded text-white">
      <h2 class="font-bold">{{ pergunta.produto?.nome || 'Produto desconhecido' }}</h2>
      <p class="text-sm text-gray-400 mb-2">{{ pergunta.produto?.descricao }}</p>
      <p class="mb-2">❓ {{ pergunta.conteudo }}</p>
      <button class="bg-blue-500 text-white px-3 py-1 rounded">Responder</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const perguntas = ref([])

async function carregarPerguntas() {
  try {
    const response = await api.get('/perguntas-a-responder') // rota que vamos criar abaixo
    perguntas.value = response.data
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error)
  }
}

onMounted(() => {
  carregarPerguntas()
})
</script>
