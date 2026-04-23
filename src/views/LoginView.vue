<template>
  <div class="mx-auto flex min-h-[calc(100vh-2rem)] items-center justify-center p-4 sm:p-6">
    <BaseCard class="mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 sm:p-8">
      
      <header class="mb-8 flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-susBlue">Paciente</p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {{ isRegisterMode ? 'Criar conta' : 'Entrar com CPF' }}
          </h2>
        </div>
        <span class="inline-flex items-center rounded-full bg-susBlue-soft px-3 py-1 text-xs font-semibold text-susBlue-dark ring-1 ring-inset ring-susBlue/10">
          {{ isRegisterMode ? 'Novo cadastro' : 'Acesso rápido' }}
        </span>
      </header>

      <div class="mb-8 flex rounded-2xl bg-slate-100/80 p-1.5 shadow-inner">
        <button
          type="button"
          class="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-susBlue/50"
          :class="!isRegisterMode ? 'bg-white text-susBlue shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'"
          @click="switchMode('login')"
        >
          Entrar
        </button>
        <button
          type="button"
          class="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-susBlue/50"
          :class="isRegisterMode ? 'bg-white text-susBlue shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'"
          @click="switchMode('register')"
        >
          Criar conta
        </button>
      </div>

      <div
        v-if="feedback.message"
        role="alert"
        aria-live="polite"
        class="mb-8 flex items-start gap-3 rounded-2xl border p-4 text-sm transition-all animate-in fade-in slide-in-from-top-2"
        :class="feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'"
      >
        <svg v-if="feedback.type === 'error'" class="mt-0.5 h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg v-else class="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <p class="font-medium leading-relaxed">{{ feedback.message }}</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        
        <div v-if="isRegisterMode" class="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
          <label class="block text-sm font-medium text-slate-700" for="full-name">Nome completo</label>
          <input
            id="full-name"
            v-model.trim="form.fullName"
            type="text"
            class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all hover:border-slate-300 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10"
            placeholder="Digite seu nome completo"
            autocomplete="name"
            enterkeyhint="next"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="form.cpf"
            type="text"
            class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all hover:border-slate-300 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="username"
            maxlength="14"
            enterkeyhint="next"
            required
            @input="form.cpf = formatCpf(form.cpf)"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700" for="password">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all hover:border-slate-300 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10"
            :placeholder="isRegisterMode ? 'Mínimo de 6 caracteres' : 'Digite sua senha secreta'"
            autocomplete="current-password"
            enterkeyhint="done"
            minlength="6"
            required
          />
          <p v-if="isRegisterMode" class="mt-2 text-xs text-slate-500">
            Cada CPF pode ter somente uma conta cadastrada.
          </p>
        </div>

        <div class="pt-2">
          <BaseButton 
            type="submit" 
            block 
            size="lg" 
            class="w-full rounded-xl py-3.5 text-base font-bold shadow-lg shadow-susBlue/20 transition-transform active:scale-[0.98]"
            :loading="loading" 
            :disabled="!canSubmit"
          >
            {{ isRegisterMode ? 'Criar minha conta' : 'Entrar no sistema' }}
          </BaseButton>
        </div>
      </form>

      <div class="mt-8 flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 relative overflow-hidden">
        <div class="absolute left-0 top-0 h-full w-1.5 bg-susBlue"></div>
        <svg class="mt-1 h-5 w-5 shrink-0 text-susBlue" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p class="text-sm font-bold text-slate-800">Depois do acesso</p>
          <p class="mt-1 text-sm leading-relaxed text-slate-600">
            Você verá as unidades de saúde próximas, poderá escolher a especialidade e seguir até a confirmação do agendamento.
          </p>
        </div>
      </div>

    </BaseCard>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAuth } from '@/composables/useAuth'
import { getHomeRouteByRole } from '@/services/supabase'
import { formatCpf } from '@/utils/formatters'

const router = useRouter()
const { signInWithCpf, signUpWithCpf } = useAuth()

const mode = ref('login')
const loading = ref(false)

const form = reactive({
  fullName: '',
  cpf: '',
  password: '',
})

const feedback = reactive({
  type: '',
  message: '',
})

const isRegisterMode = computed(() => mode.value === 'register')

const canSubmit = computed(() => {
  if (isRegisterMode.value) {
    return Boolean(form.fullName && form.cpf && form.password.length >= 6)
  }

  return Boolean(form.cpf && form.password)
})

async function handleSubmit() {
  loading.value = true
  resetFeedback()

  try {
    const result = isRegisterMode.value
      ? await signUpWithCpf({
          fullName: form.fullName,
          cpf: form.cpf,
          password: form.password,
        })
      : await signInWithCpf({
          cpf: form.cpf,
          password: form.password,
        })

    feedback.type = 'success'
    feedback.message = isRegisterMode.value
      ? 'Conta criada com sucesso. Voce ja pode usar o sistema.'
      : 'Acesso realizado com sucesso.'

    await router.replace(getHomeRouteByRole(result.profile?.role))
  } catch (error) {
    feedback.type = 'error'
    feedback.message = mapAuthError(error)
  } finally {
    loading.value = false
  }
}

function switchMode(nextMode) {
  if (mode.value === nextMode) {
    return
  }

  mode.value = nextMode
  resetFeedback()
  form.password = ''

  if (nextMode === 'login') {
    form.fullName = ''
  }
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function mapAuthError(error) {
  const message = error?.message ?? ''

  if (message.includes('Invalid login credentials')) {
    return 'CPF ou senha invalidos.'
  }

  if (message.includes('Ja existe uma conta cadastrada para este CPF')) {
    return 'Ja existe uma conta cadastrada para este CPF.'
  }

  if (message.includes('nome completo')) {
    return message
  }

  if (message.includes('11 digitos')) {
    return 'Informe um CPF valido com 11 digitos.'
  }

  if (message.includes('pelo menos 6 caracteres')) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }

  if (message.includes('confirmacao de email')) {
    return 'No Supabase, desative a confirmacao de email para liberar cadastro por CPF e senha.'
  }

  if (message.includes('Configure VITE_SUPABASE_URL')) {
    return 'Falta configurar o Supabase no arquivo .env.'
  }

  return 'Nao foi possivel concluir a autenticacao agora.'
}
</script>