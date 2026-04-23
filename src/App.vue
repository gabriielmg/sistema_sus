<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300 selection:bg-susBlue/20',
      isDark ? 'bg-slate-950/40 text-slate-100 selection:text-white' : 'bg-slate-50/50 text-slate-800 selection:text-susBlue-dark',
    ]"
  >
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        :class="[
          'absolute -left-20 top-0 h-[30rem] w-[30rem] rounded-full blur-[100px] transition-all duration-1000 ease-in-out',
          isDark ? 'bg-susBlue/20' : 'bg-susBlue/10',
        ]"
      />
      <div
        :class="[
          'absolute -bottom-20 -right-20 h-[35rem] w-[35rem] rounded-full blur-[120px] transition-all duration-1000 ease-in-out',
          isDark ? 'bg-susGreen/20' : 'bg-susGreen/10',
        ]"
      />
    </div>

    <BaseButton
      v-if="!showShell"
      variant="ghost"
      size="sm"
      class="fixed right-4 top-4 z-50 rounded-full px-4 shadow-lg shadow-slate-900/20"
      :aria-label="themeActionLabel"
      :title="themeActionLabel"
      @click="toggleTheme"
    >
      <span class="flex items-center gap-2">
        <svg
          v-if="isDark"
          class="h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75a9.75 9.75 0 0 1-9.75-9.75 9.718 9.718 0 0 1 .748-3.752A9.75 9.75 0 1 0 21.752 15.002Z"
          />
        </svg>
        <svg
          v-else
          class="h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.864 6.364-1.06-1.06M6.197 6.197 5.136 5.136m13.728 0-1.06 1.06M6.197 17.803l-1.06 1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <span class="font-semibold">{{ themeBadgeLabel }}</span>
      </span>
    </BaseButton>

    <header
      v-if="showShell"
      :class="[
        'sticky top-0 z-40 backdrop-blur-xl transition-all duration-300',
        isDark ? 'border-b border-slate-800/80 bg-slate-950/75' : 'border-b border-slate-200/60 bg-white/70',
      ]"
    >
      <div :class="shellHeaderClass">
        
        <div class="flex items-center gap-3.5">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.125rem] bg-gradient-to-br from-susBlue to-susBlue-dark text-sm font-black tracking-wide text-white shadow-lg shadow-susBlue/30 ring-1 ring-inset ring-white/20"
          >
            SUS
          </div>
          <div class="flex flex-col justify-center">
            <p :class="['text-[10px] font-bold uppercase tracking-wider sm:text-xs', isDark ? 'text-slate-400' : 'text-slate-500']">
              Sistema público de saúde
            </p>
            <p :class="['text-sm font-extrabold sm:text-base', isDark ? 'text-slate-50' : 'text-slate-900']">{{ pageLabel }}</p>
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
            class="rounded-xl px-3 py-2 sm:px-4"
            :aria-label="themeActionLabel"
            :title="themeActionLabel"
            @click="toggleTheme"
          >
            <span class="flex items-center gap-2">
              <svg
                v-if="isDark"
                class="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75a9.75 9.75 0 0 1-9.75-9.75 9.718 9.718 0 0 1 .748-3.752A9.75 9.75 0 1 0 21.752 15.002Z"
                />
              </svg>
              <svg
                v-else
                class="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.864 6.364-1.06-1.06M6.197 6.197 5.136 5.136m13.728 0-1.06 1.06M6.197 17.803l-1.06 1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
              <span class="hidden font-semibold sm:inline">{{ themeBadgeLabel }}</span>
            </span>
          </BaseButton>

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

    <main :class="shellMainClass">
      
      <div
        v-if="!authReady && showShell"
        :class="[
          'mt-8 flex flex-col items-center justify-center rounded-[28px] border p-12 text-center shadow-xl backdrop-blur-md transition-colors duration-300',
          isDark ? 'border-slate-800/80 bg-slate-900/60 shadow-slate-950/30' : 'border-white/60 bg-white/50 shadow-slate-200/20',
        ]"
      >
        <div class="relative flex h-12 w-12 items-center justify-center">
          <div class="absolute h-12 w-12 animate-ping rounded-full bg-susBlue/20"></div>
          <div :class="['h-8 w-8 animate-spin rounded-full border-4 border-t-susBlue', isDark ? 'border-slate-700' : 'border-slate-200']"></div>
        </div>
        <p :class="['mt-4 text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-600']">Verificando suas credenciais...</p>
        <p :class="['mt-1 text-xs', isDark ? 'text-slate-400' : 'text-slate-500']">Por favor, aguarde um momento.</p>
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
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { authReady, logout, profile } = useAuth()
const { isDark, toggleTheme } = useTheme()

const showShell = computed(() => route.name !== 'login')
const shellHeaderClass = computed(() => {
  if (route.name === 'admin') {
    return 'mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 xl:px-8 2xl:px-10'
  }

  return 'mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8'
})
const shellMainClass = computed(() => {
  if (!showShell.value) {
    return 'flex min-h-screen w-full flex-col p-4 sm:p-6'
  }

  if (route.name === 'admin') {
    return 'mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-6 xl:px-8 2xl:px-10'
  }

  return 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'
})
const pageLabel = computed(() => {
  if (route.name === 'admin') return 'Painel da equipe'
  if (route.name === 'paciente') return 'Agendamento rápido'
  return 'Acesso'
})

const themeBadgeLabel = computed(() => (isDark.value ? 'Dark' : 'Normal'))
const themeActionLabel = computed(() => (isDark.value ? 'Ativar tema normal' : 'Ativar tema dark'))

async function handleLogout() {
  await logout()
  await router.push({ name: 'login' })
}
</script>
