import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import PacienteView from '@/views/PacienteView.vue'
import AdminView from '@/views/AdminView.vue'
import {
  getHomeRouteByRole,
  getProfileByUserId,
  getRoleFromUser,
  getSession,
} from '@/services/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/paciente',
      name: 'paciente',
      component: PacienteView,
      meta: {
        requiresAuth: true,
        role: 'paciente',
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        role: ['admin', 'gestor'],
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const session = await getSession().catch(() => null)

  if (!session && to.meta.requiresAuth) {
    return { name: 'login' }
  }

  if (!session) {
    return true
  }

  const profile = await getProfileByUserId(session.user.id).catch(() => null)
  const resolvedRole = profile?.role ?? getRoleFromUser(session.user)
  const homeRoute = getHomeRouteByRole(resolvedRole)

  if (to.meta.guestOnly) {
    return to.path === homeRoute ? true : homeRoute
  }

  if (to.meta.role && Array.isArray(to.meta.role) && !to.meta.role.includes(resolvedRole)) {
    return to.path === homeRoute ? true : homeRoute
  }

  if (to.meta.role && !Array.isArray(to.meta.role) && resolvedRole !== to.meta.role) {
    return to.path === homeRoute ? true : homeRoute
  }

  return true
})

export default router
