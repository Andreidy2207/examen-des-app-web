import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ProductosView from '../views/ProductosView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true } // Ruta protegida
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosView,
    meta: { requiresAuth: true } // Ruta protegida
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard: bloquea rutas protegidas si no hay sesión
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login') // Sin sesión → al login
  } else if (to.path === '/login' && token) {
    next('/usuarios') // Ya autenticado → no vuelve al login
  } else {
    next()
  }
})

export default router