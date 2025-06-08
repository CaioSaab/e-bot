<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-white">Anúncios - Ebot</h1>

    <!-- Campo de busca -->
    <input
      v-model="filtroNome"
      type="text"
      placeholder="Buscar produto pelo nome..."
      class="mb-6 w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
    />

    <div v-if="produtosFiltrados.length === 0" class="text-white">
      Nenhum produto encontrado.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="produto in produtosPagina"
        :key="produto.id"
        class="bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer"
        @click="irParaDetalhes(produto.id)"
      >
        <img
          :src="produto.imageURL"
          :alt="produto.nome"
          class="w-full h-40 object-cover rounded mb-4"
        />
        <h2 class="text-lg font-bold mb-1">{{ produto.nome }}</h2>
        <p class="text-gray-600 mb-1">{{ produto.descricao }}</p>
        <p class="font-bold text-blue-600 mb-4">R$ {{ produto.preco }}</p>
      </div>
    </div>

    <div class="flex justify-center mt-6 gap-2">
      <button
        @click="paginaAtual--"
        :disabled="paginaAtual === 1"
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span class="text-white px-4 py-2">
        Página {{ paginaAtual }} de {{ totalPaginas }}
      </span>

      <button
        @click="paginaAtual++"
        :disabled="paginaAtual === totalPaginas"
        class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'

const produtos = ref([])
const paginaAtual = ref(1)
const limitePorPagina = 6
const filtroNome = ref('')

const router = useRouter()

async function carregarProdutos() {
  try {
    const response = await api.get('/produtos')
    produtos.value = response.data
  } catch (error) {
    alert('Erro ao carregar produtos')
    console.error(error)
  }
}

// Filtra produtos pelo nome (case insensitive)
const produtosFiltrados = computed(() => {
  if (!filtroNome.value) return produtos.value

  return produtos.value.filter((p) =>
    p.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
  )
})

// Atualiza o total de páginas com base nos produtos filtrados
const totalPaginas = computed(() =>
  Math.ceil(produtosFiltrados.value.length / limitePorPagina)
)

// Calcula os produtos da página atual com base no filtro
const produtosPagina = computed(() => {
  const start = (paginaAtual.value - 1) * limitePorPagina
  const end = paginaAtual.value * limitePorPagina
  return produtosFiltrados.value.slice(start, end)
})

// Se o filtro mudar, volta para a primeira página
watch(filtroNome, () => {
  paginaAtual.value = 1
})

function irParaDetalhes(id) {
  router.push({ name: 'ProdutoDetalhes', params: { id } })
}

onMounted(() => {
  carregarProdutos()
})
</script>
