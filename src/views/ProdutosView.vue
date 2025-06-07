ProdutosView
<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl font-bold mb-4">Meus Produtos - Ebot</h1>
    <div v-if="produtos.length" class="grid gap-4">
      <div v-for="item in produtos" :key="item.id" class="bg-gray-700 text-black p-4 rounded shadow relative">
        <img :src="item.imageURL" alt="Imagem do produto" class="h-32 w-full object-cover rounded mb-2" />
        <h2 class="font-bold text-lg">{{ item.nome }}</h2>
        <p class="text-sm">Preço: R$ {{ item.preco.toFixed(2) }}</p>
        <p class="text-sm mb-2">{{ item.descricao }}</p>
        <div class="flex gap-2">
          <button class="bg-yellow-500 text-white px-3 py-1 rounded" @click="editarProduto(item)">
            Editar
          </button>
          <button class="bg-red-600 text-white px-3 py-1 rounded" @click="excluirProduto(item.id)">
            Excluir
          </button>
        </div>
      </div>
    </div>
    <p v-else>Nenhum produto cadastrado.</p>
    <div v-if="mostrarFormulario" class="fixed bottom-20 right-6 bg-white text-black p-6 rounded-lg shadow-lg w-80 z-50">
      <h2 class="text-lg font-semibold mb-4">
        {{ produto.id ? 'Editar Produto' : 'Novo Produto' }}
      </h2>
      <div class="grid gap-3">
        <input v-model="produto.nome" type="text" placeholder="Nome" class="border px-3 py-2 rounded" />
        <input v-model.number="produto.preco" type="number" placeholder="Preço" class="border px-3 py-2 rounded" />
        <input v-model="produto.descricao" type="text" placeholder="Descrição" class="border px-3 py-2 rounded" />
        <input v-model="produto.imageURL" type="text" placeholder="URL da Imagem" class="border px-3 py-2 rounded" />
      </div>
      <div class="flex justify-between mt-4">
        <button @click="salvarProduto" class="bg-blue-600 text-white px-4 py-2 rounded">
          Salvar
        </button>
        <button @click="cancelarEdicao" class="bg-gray-400 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
    <button @click="toggleFormulario" class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white text-xl px-4 py-2 rounded-full shadow-lg">
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const produtos = ref([])
const mostrarFormulario = ref(false)

const produto = ref({
  id: null,
  nome: '',
  preco: null,
  descricao: '',
  imageURL: ''
})

async function carregarProdutos() {
  try {
    const response = await api.get('/produtos')
    console.log(response.data) // <-- Veja aqui se a imagem está presente
    produtos.value = response.data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}



async function salvarProduto() {
  if (!produto.value.nome || produto.value.preco == null || !produto.value.descricao || !produto.value.imageURL) {
    alert('Preencha todos os campos!')
    return
  }

  try {
    if (produto.value.id) {
      await api.put(`/produtos/${produto.value.id}`, produto.value)
    } else {
      await api.post('/produtos', produto.value)
    }
    await carregarProdutos()
    cancelarEdicao()
  } catch (error) {
    alert('Erro ao salvar produto')
    console.error(error)
  }
}

function editarProduto(item) {
  produto.value = { ...item }
  mostrarFormulario.value = true
}

async function excluirProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return

  try {
    await api.delete(`/produtos/${id}`)
    await carregarProdutos()
  } catch (error) {
    alert('Erro ao excluir produto')
    console.error(error)
  }
}

function cancelarEdicao() {
  mostrarFormulario.value = false
  produto.value = {
    id: null,
    nome: '',
    preco: null,
    descricao: '',
    imageURL: ''
  }
}

function toggleFormulario() {
  if (mostrarFormulario.value) {
    cancelarEdicao()
  } else {
    mostrarFormulario.value = true
  }
}

onMounted(carregarProdutos)
</script>
