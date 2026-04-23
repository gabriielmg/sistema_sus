Aqui está o código atualizado, contendo apenas a parte do formulário centralizada na tela:

```vue
<template>
  <div class="mx-auto flex min-h-[calc(100vh-2rem)] items-center justify-center p-4">
    <BaseCard class="mx-auto w-full max-w-xl rounded-[28px]">
      <div class="mb-6 flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-susBlue">Paciente</p>
          <h2 class="mt-2 font-display text-3xl font-semibold text-ink">
            {{ isRegisterMode ? 'Criar conta' : 'Entrar com CPF' }}
          </h2>
        </div>
        <span class="rounded-full bg-susBlue-soft px-3 py-1 text-xs font-semibold text-susBlue-dark">
          {{ isRegisterMode ? 'Novo cadastro' : 'Acesso rapido' }}
        </span>
      </div>
      <div class="mb-6 grid grid-cols-2 gap-2 rounded-3xl bg-slate-100 p-1">
        <button
          type="button"
          class="rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="!isRegisterMode ? 'bg-white text-susBlue shadow-card' : 'text-slate-600 hover:text-slate-800'"
          @click="switchMode('login')"
        >
          Entrar
        </button>
        <button
          type="button"
          class="rounded-2xl px-4 py-3 text-sm font-semibold transition"
          :class="isRegisterMode ? 'bg-white text-susBlue shadow-card' : 'text-slate-600 hover:text-slate-800'"
          @click="switchMode('register')"
        >
          Criar conta
        </button>
      </div>

      <div
        v-if="feedback.message"
        role="alert"
        aria-live="polite"
        class="mb-6 rounded-2xl border px-4 py-3 text-sm"
        :class="feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
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
            placeholder="Digite seu nome completo"
            autocomplete="name"
            enterkeyhint="next"
            required
          />
        </div>

        <div>
          <label class="label-text" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="form.cpf"
            type="text"
            class="input-field"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="username"
            maxlength="14"
            enterkeyhint="next"
            required
            @input="form.cpf = formatCpf(form.cpf)"
          />
        </div>

        <div>
          <label class="label-text" for="password">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="input-field"
            :placeholder="isRegisterMode ? 'Crie uma senha com pelo menos 6 caracteres' : 'Digite sua senha'"
            autocomplete="current-password"
            enterkeyhint="done"
            minlength="6"
            required
          />
          <p v-if="isRegisterMode" class="helper-text mt-2">
            Cada CPF pode ter somente uma conta cadastrada.
          </p>
        </div>

        <BaseButton type="submit" block size="lg" :loading="loading" :disabled="!canSubmit">
          {{ isRegisterMode ? 'Criar minha conta' : 'Entrar no sistema' }}
        </BaseButton>
      </form>

      <div class="mt-6 rounded-3xl bg-slate-50 px-4 py-4">
        <p class="text-sm font-semibold text-slate-800">Depois do acesso</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Voce vera as unidades proximas, podera escolher a especialidade primeiro e seguir ate a confirmacao do agendamento.
        </p>
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
