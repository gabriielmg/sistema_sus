<template>
  <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-5 lg:grid-cols-[1.1fr_minmax(0,480px)] lg:gap-8">
    <section class="glass-panel p-5 sm:p-6 lg:hidden">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-susBlue">Sistema SUS</p>
      <h1 class="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
        Marque sua consulta de forma simples pelo celular.
      </h1>
      <p class="mt-3 text-base leading-7 text-slate-700">
        Entre com seu email e senha. Se ainda nao tiver conta, toque em criar conta.
      </p>
      <div class="mt-4 grid gap-3">
        <div class="rounded-3xl bg-susBlue-soft/70 p-4">
          <p class="text-sm font-semibold text-susBlue-dark">1. Entre ou crie sua conta</p>
          <p class="mt-1 text-sm leading-6 text-slate-700">O cadastro e gratuito e rapido.</p>
        </div>
        <div class="rounded-3xl bg-susGreen-soft/70 p-4">
          <p class="text-sm font-semibold text-susGreen-dark">2. Busque a unidade pelo CEP</p>
          <p class="mt-1 text-sm leading-6 text-slate-700">Depois escolha especialidade e horario.</p>
        </div>
      </div>
    </section>

    <section class="relative hidden overflow-hidden rounded-[36px] bg-slate-900 p-10 text-white shadow-soft lg:block">
      <div class="absolute inset-0 bg-gradient-to-br from-susBlue/80 via-slate-900 to-susGreen/70" />
      <div class="absolute -right-10 top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div class="absolute bottom-8 left-8 h-40 w-40 rounded-full bg-susGreen/20 blur-3xl" />

      <div class="relative z-10 flex h-full flex-col justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100">
            Sistema SUS
          </p>
          <h1 class="mt-5 font-display text-5xl font-semibold leading-tight">
            Acesso simples para marcar consulta na rede publica.
          </h1>
          <p class="mt-6 max-w-xl text-base leading-7 text-slate-200">
            Uma porta de entrada clara para pacientes e equipes, com foco em uso rapido,
            leitura facil e funcionamento no celular.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-3xl border border-white/10 bg-white/10 p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-200">Acesso</p>
            <h2 class="mt-3 text-lg font-semibold">Entrar ou criar conta</h2>
            <p class="mt-2 text-sm text-slate-200">
              Login por email e senha com redirecionamento automatico.
            </p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/10 p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-200">Atendimento</p>
            <h2 class="mt-3 text-lg font-semibold">Horarios organizados</h2>
            <p class="mt-2 text-sm text-slate-200">
              Unidades, especialidades e horarios reunidos no mesmo sistema.
            </p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/10 p-4">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-200">Paciente</p>
            <h2 class="mt-3 text-lg font-semibold">Busca por CEP</h2>
            <p class="mt-2 text-sm text-slate-200">
              Veja unidades proximas e escolha o horario disponivel.
            </p>
          </div>
        </div>
      </div>
    </section>

    <BaseCard class="mx-auto w-full max-w-xl rounded-[28px]">
      <div class="mb-8">
        <div class="mb-4 inline-flex rounded-full bg-susBlue-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-susBlue-dark">
          {{ isRegisterMode ? 'Criar conta' : 'Entrar' }}
        </div>
        <h2 class="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {{ isRegisterMode ? 'Crie sua conta de paciente' : 'Entrar para marcar consulta' }}
        </h2>
        <p class="mt-3 text-base leading-7 text-slate-700">
          {{ isRegisterMode ? 'Depois do cadastro, voce podera buscar unidades, especialidades e horarios.' : 'Use os dados da sua conta para acompanhar e marcar atendimentos.' }}
        </p>
      </div>

      <div
        v-if="feedback.message"
        role="alert"
        aria-live="polite"
        class="mb-6 rounded-2xl border px-4 py-3 text-sm"
        :class="
          feedback.type === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        "
      >
        {{ feedback.message }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="isRegisterMode">
          <label class="label-text" for="full-name">Nome completo</label>
          <input
            id="full-name"
            v-model.trim="form.fullName"
            type="text"
            class="input-field"
            placeholder="Ex.: Maria da Silva"
            autocomplete="name"
            enterkeyhint="next"
          />
        </div>

        <div>
          <label class="label-text" for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            class="input-field"
            placeholder="voce@exemplo.com"
            autocomplete="email"
            autocapitalize="off"
            inputmode="email"
            enterkeyhint="next"
            required
          />
        </div>

        <div>
          <label class="label-text" for="password">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="input-field"
            placeholder="Digite sua senha"
            autocomplete="current-password"
            enterkeyhint="done"
            required
          />
          <p class="helper-text mt-2">
            Use pelo menos 6 caracteres.
          </p>
        </div>

        <BaseButton type="submit" block size="lg" :loading="loading" :disabled="!canSubmit">
          {{ isRegisterMode ? 'Criar minha conta' : 'Entrar agora' }}
        </BaseButton>
      </form>

      <div class="mt-6 flex flex-col gap-4 rounded-3xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold text-slate-800">
            {{ isRegisterMode ? 'Ja possui conta?' : 'Ainda nao tem conta?' }}
          </p>
          <p class="text-sm leading-6 text-slate-600">
            {{ isRegisterMode ? 'Volte para a tela de entrada.' : 'Crie sua conta de paciente em poucos passos.' }}
          </p>
        </div>

        <button
          type="button"
          class="min-h-12 rounded-2xl border border-susBlue/20 bg-white px-4 py-3 text-sm font-semibold text-susBlue transition hover:text-susBlue-dark"
          @click="toggleMode"
        >
          {{ isRegisterMode ? 'Voltar para entrar' : 'Criar conta' }}
        </button>
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

const router = useRouter()
const { signInWithPassword, signUpWithPassword } = useAuth()

const mode = ref('login')
const loading = ref(false)
const form = reactive({
  fullName: '',
  email: '',
  password: '',
})

const feedback = reactive({
  type: '',
  message: '',
})

const isRegisterMode = computed(() => mode.value === 'register')
const canSubmit = computed(() => Boolean(form.email && form.password))

async function handleSubmit() {
  loading.value = true
  resetFeedback()

  try {
    if (isRegisterMode.value) {
      const result = await signUpWithPassword({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      })

      if (result.requiresEmailConfirmation) {
        feedback.type = 'success'
        feedback.message =
          'Conta criada. Confirme o email enviado pelo Supabase antes de entrar.'
        mode.value = 'login'
        form.password = ''
        return
      }

      await router.replace(getHomeRouteByRole(result.profile?.role))
      return
    }

    const result = await signInWithPassword({
      email: form.email,
      password: form.password,
    })

    await router.replace(getHomeRouteByRole(result.profile?.role))
  } catch (error) {
    feedback.type = 'error'
    feedback.message = mapAuthError(error)
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  mode.value = isRegisterMode.value ? 'login' : 'register'
  resetFeedback()
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function mapAuthError(error) {
  const message = error?.message ?? ''

  if (message.includes('Invalid login credentials')) {
    return 'Email ou senha invalidos.'
  }

  if (message.includes('Email not confirmed')) {
    return 'Confirme o email enviado pelo Supabase antes de entrar.'
  }

  if (message.includes('Configure VITE_SUPABASE_URL')) {
    return 'Falta configurar o arquivo .env com a URL e a chave anon do Supabase.'
  }

  if (message.includes('valor de exemplo')) {
    return 'O VITE_SUPABASE_URL ainda esta com o valor de exemplo. Ajustei o host esperado, mas reinicie o Vite para recarregar o .env.'
  }

  if (message.includes('pertencem a projetos diferentes')) {
    return 'A URL e a anon key do Supabase nao combinam entre si. Revise o .env.'
  }

  if (message.includes('already registered')) {
    return 'Esse email ja possui cadastro.'
  }

  if (message.toLowerCase().includes('password')) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }

  return 'Nao foi possivel concluir a autenticacao agora.'
}
</script>
