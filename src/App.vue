<template>
  <div class="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-susBlue/20 selection:text-susBlue-dark">
    
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-20 top-0 h-[30rem] w-[30rem] rounded-full bg-susBlue/10 blur-[100px] transition-transform duration-1000 ease-in-out" />
      <div class="absolute -bottom-20 -right-20 h-[35rem] w-[35rem] rounded-full bg-susGreen/10 blur-[120px] transition-transform duration-1000 ease-in-out" />
    </div>

    <header
      v-if="showShell"
      class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-300"
    >
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        <div class="flex items-center gap-3.5">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.125rem] bg-gradient-to-br from-susBlue to-susBlue-dark text-sm font-black tracking-wide text-white shadow-lg shadow-susBlue/30 ring-1 ring-inset ring-white/20"
          >
            SUS
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
              Sistema público de saúde
            </p>
            <p class="text-sm font-extrabold text-slate-900 sm:text-base">{{ pageLabel }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <span
            v-if="profile"
            class="hidden items-center gap-2 rounded-full border border-susBlue/10 bg-susBlue-soft/50 px-3.5 py-1.5 text-xs font-bold text-susBlue-dark shadow-sm sm:inline-flex"
          >
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-susBlue opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-susBlue"></span>
            </span>
            {{ profile.role === 'admin' ? 'Equipe' : 'Paciente' }}
          </span>
          
          <BaseButton 
            variant="ghost" 
            size="sm" 
            class="group rounded-xl px-3 py-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 sm:px-4"
            @click="handleLogout"
          >
            <span class="flex items-center gap-2">
              <span class="hidden font-semibold sm:inline">Sair</span>
              <svg class="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </span>
          </BaseButton>
        </div>
      </div>
    </header>

    <main :class="showShell ? 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8' : 'flex min-h-screen w-full flex-col p-4 sm:p-6'">
      
      <div v-if="!authReady && showShell" class="mt-8 flex flex-col items-center justify-center rounded-[28px] border border-white/60 bg-white/50 p-12 text-center shadow-xl shadow-slate-200/20 backdrop-blur-md">
        <div class="relative flex h-12 w-12 items-center justify-center">
          <div class="absolute h-12 w-12 animate-ping rounded-full bg-susBlue/20"></div>
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-susBlue"></div>
        </div>
        <p class="mt-4 text-sm font-bold text-slate-600">Verificando suas credenciais...</p>
        <p class="mt-1 text-xs text-slate-500">Por favor, aguarde um momento.</p>
      </div>

      <div v-else class="animate-in fade-in zoom-in-[0.98] duration-300">
        <RouterView />
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { authReady, logout, profile } = useAuth()

const showShell = computed(() => route.name !== 'login')
const pageLabel = computed(() => {
  if (route.name === 'admin') return 'Painel da equipe'
  if (route.name === 'paciente') return 'Agendamento rápido'
  return 'Acesso'
})

async function handleLogout() {
  await logout()
  await router.push({ name: 'login' })
}
</script>