<template>
  <div class="p-6 max-w-7xl mx-auto text-white">
    <!-- Título -->
    <h1 class="text-3xl font-bold mb-6">🛍️ Anúncios - Ebot</h1>

    <!-- Campo de busca -->
    <input
      v-model="filtroNome"
      type="text"
      placeholder="Buscar produto pelo nome..."
      class="mb-8 w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <!-- Sem resultados -->
    <div v-if="produtosFiltrados.length === 0" class="text-gray-400 text-center">
      Nenhum produto encontrado.
    </div>

    <!-- Grid de produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="produto in produtosPagina"
        :key="produto.id"
        class="bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
        @click="irParaDetalhes(produto.id)"
      >
        <div class="w-full aspect-square overflow-hidden rounded-lg mb-4">
          <img
            :src="produto.imageURL"
            :alt="produto.nome"
            class="w-full h-full object-cover transform group-hover:scale-105 transition"
          />
        </div>

        <h2 class="text-xl font-semibold mb-1">{{ produto.nome }}</h2>
        <p class="text-blue-400 font-bold text-lg">R$ {{ produto.preco.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center mt-10 gap-4">
      <button
        @click="paginaAtual--"
        :disabled="paginaAtual === 1"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
      >
        ← Anterior
      </button>

      <span class="px-4 py-2 text-white font-medium">
        Página {{ paginaAtual }} de {{ totalPaginas }}
      </span>

      <button
        @click="paginaAtual++"
        :disabled="paginaAtual === totalPaginas"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
      >
        Próxima →
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

const produtosFiltrados = computed(() => {
  if (!filtroNome.value) return produtos.value

  return produtos.value.filter((p) =>
    p.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
  )
})

const totalPaginas = computed(() =>
  Math.ceil(produtosFiltrados.value.length / limitePorPagina)
)

const produtosPagina = computed(() => {
  const start = (paginaAtual.value - 1) * limitePorPagina
  const end = paginaAtual.value * limitePorPagina
  return produtosFiltrados.value.slice(start, end)
})

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
