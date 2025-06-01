import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './authRoutes';
import Login from '../views/LoginView.vue'
import Dashboard from '../views/DashboardView.vue'
import Anuncios from '../views/AnunciosView.vue'
import Produtos from '../views/ProdutosView.vue'
import PerguntasResposta from '../views/PerguntasAResponderView.vue'

export const routes = {
  login: '/login',
  dashboard: '/',
  anuncio: '/anuncio',
  produtos: '/produtos',
  produto: '/produto',
  perguntas: '/perguntas-a-responder'
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: routes.login,
      name: 'Login',
      component: Login
    },
    {
      path: routes.dashboard,
      name: 'Dashboard',
      component: Dashboard,
      meta: {
          requiresAuthentication: true,
        },
    },
    {
      path: routes.anuncio,
      name: 'Anúncios',
      component: Anuncios,
      meta: {
          requiresAuthentication: true,
        },
    },
    {
      path: routes.produtos,
      name: 'Produtos',
      component: Produtos,
      meta: {
          requiresAuthentication: true,
        },
    },
    {
        path: `${routes.produto}/:id`,
        name: 'Produto',
        component: Produtos,
        meta: {
          requiresAuthentication: true,
        },
        props: true,
      },
    {
      path: routes.perguntas,
      name: 'Perguntas',
      component: PerguntasResposta,
      meta: {
          requiresAuthentication: true,
        },
    }
  ]
});

router.beforeEach(authRoutes);

export default router
