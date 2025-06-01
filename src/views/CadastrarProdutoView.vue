<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-white">Cadastro de Produtos - Ebot</h1>

    <div class="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <div class="grid grid-cols-1 gap-4">
        <input
          v-model="produto.nome"
          type="text"
          placeholder="Nome do Produto"
          class="border rounded px-3 py-2"
        />
        <input
          v-model="produto.preco"
          type="number"
          placeholder="Preço"
          class="border rounded px-3 py-2"
        />
        <input
          v-model="produto.imagem"
          type="text"
          placeholder="URL da Imagem"
          class="border rounded px-3 py-2"
        />
        <input
          v-model="produto.descricao"
          type="text"
          placeholder="Descrição"
          class="border rounded px-3 py-2"
        />
      </div>

      <button
        @click="cadastrarProduto"
        class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Cadastrar Produto
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'

const produto = ref({
  nome: '',
  preco: '',
  imagem: '',
  descricao: ''
})

function cadastrarProduto() {
  if (
    !produto.value.nome ||
    !produto.value.preco ||
    !produto.value.imagem ||
    !produto.value.descricao
  ) {
    alert('Preencha todos os campos!')
    return
  }

  const produtos = JSON.parse(localStorage.getItem('produtos')) || []

  const novoProduto = {
    ...produto.value,
    id: Date.now()
  }

  produtos.push(novoProduto)

  localStorage.setItem('produtos', JSON.stringify(produtos))

  alert('Produto cadastrado com sucesso!')

  // Limpar formulário
  produto.value = {
    nome: '',
    preco: '',
    imagem: '',
    descricao: ''
  }

  // Redireciona para página de produtos
  router.push('/produtos')
}
</script>