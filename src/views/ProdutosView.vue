<template>
  <div class="p-6 text-white max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold mb-6 text-center md:text-left">Meus Produtos - Ebot</h1>

    <div v-if="produtos.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="item in produtos" :key="item.id" class="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col">
        <div class="w-full aspect-[4/3] overflow-hidden rounded-lg mb-4">
          <img :src="item.imageURL" alt="Imagem do produto" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"/>
        </div>

        <h2 class="font-semibold text-xl text-white mb-2 truncate" :title="item.nome">{{ item.nome }}</h2>
        <p class="text-blue-400 font-semibold mb-4">R$ {{ item.preco.toFixed(2) }}</p>

        <div class="mt-auto flex gap-3">
          <button @click="editarProduto(item)" class="flex-1 bg-yellow-500 hover:bg-yellow-600 transition rounded-md px-4 py-2 text-white font-semibold">
            Editar
          </button>
          <button @click="excluirProduto(item.id)" class="flex-1 bg-red-600 hover:bg-red-700 transition rounded-md px-4 py-2 text-white font-semibold">
            Excluir
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-300 mt-10 text-lg">Nenhum produto cadastrado.</p>

    <!-- Cadastro -->
    <transition name="fade">
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" @click.stop>
          <h2 class="text-2xl font-semibold mb-5 text-gray-800">
            {{ produto.id ? 'Editar Produto' : 'Novo Produto' }}
          </h2>
          <div class="text-stone-800 flex flex-col gap-4">
            <input v-model="produto.nome" type="text" placeholder="Nome" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            <input v-model.number="produto.preco" type="number" placeholder="Preço" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            <input v-model="produto.descricao" type="text" placeholder="Descrição" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            <input v-model="produto.imageURL" type="text" placeholder="URL da Imagem" class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button @click="cancelarEdicao" class="px-5 py-2 rounded-md bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button @click="salvarProduto" class="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Salvar
            </button>
          </div>

          <button @click="toggleFormulario" aria-label="Fechar" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition text-2xl font-bold">
            &times;
          </button>
        </div>
      </div>
    </transition>

    <button @click="toggleFormulario" class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white text-4xl font-bold px-5 py-2 rounded-full shadow-lg flex items-center justify-center" aria-label="Adicionar novo produto">
      +
    </button>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

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
    const response = await api.get('/produtos/meus')
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
