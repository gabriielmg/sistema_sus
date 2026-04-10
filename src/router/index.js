import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'
import LoginView from '../views/LoginView.vue'
import PacienteView from '../views/PacienteView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/paciente', name: 'paciente', component: PacienteView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } }
  ]
})

// Proteção de rotas (Segurança: impede entrar nas telas sem fazer login)
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    next('/') // Se tentar acessar sem login, joga de volta pra tela inicial
  } else {
    next() // Se estiver tudo ok, deixa passar
  }
})

export default router