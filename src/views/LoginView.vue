<template>
  <div class="login-root flex min-h-screen w-full">

    <!-- ── Painel esquerdo: branding ── -->
    <div class="login-brand relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0a3d8a] via-[#0f62db] to-[#0f9d73] p-10 lg:flex lg:w-[52%] xl:w-[56%]">
      <!-- Grade decorativa -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]"
        style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 28px 28px;" />
      <!-- Blob decorativo -->
      <div class="pointer-events-none absolute -right-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-susGreen/20 blur-3xl" />

      <!-- Logo topo -->
      <div class="relative z-10">
        <AppLogo size="md" variant="light" />
      </div>

      <!-- Conteúdo central -->
      <div class="relative z-10 max-w-md">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-sm">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span class="text-xs font-bold uppercase tracking-widest text-white/80">Disponível 24 horas</span>
        </div>

        <h1 class="text-4xl font-black leading-[1.08] tracking-tight text-white xl:text-5xl">
          Marque sua<br />consulta com<br />
          <span class="text-emerald-300">facilidade.</span>
        </h1>

        <p class="mt-6 text-base leading-relaxed text-white/70">
          Encontre unidades de saúde próximas, escolha a especialidade e confirme seu horário em minutos — tudo pelo celular.
        </p>

        <ul class="mt-8 space-y-3.5">
          <li v-for="item in benefits" :key="item.text" class="flex items-center gap-3">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/10">
              <svg class="h-3.5 w-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span class="text-sm font-medium text-white/80">{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Rodapé do painel -->
      <div class="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
        <p class="text-xs text-white/40">© 2025 Agendamento SUS</p>
        <div class="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/10">
          <svg class="h-3.5 w-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span class="text-[11px] font-semibold text-white/60">Dados protegidos</span>
        </div>
      </div>
    </div>

    <!-- ── Painel direito: formulário ── -->
    <div class="flex flex-1 flex-col items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-14 xl:px-20">

      <!-- Logo mobile (só aparece em telas pequenas) -->
      <div class="mb-8 lg:hidden">
        <AppLogo size="md" variant="dark" />
      </div>

      <div class="w-full max-w-[400px]">

        <!-- Cabeçalho do form -->
        <div class="mb-8">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">
            {{ isRegisterMode ? 'Crie sua conta' : 'Bem-vindo!' }}
          </h2>
          <p class="mt-2 text-sm text-slate-500">
            {{ isRegisterMode
              ? 'Preencha os dados abaixo para começar.'
              : 'Entre com seu CPF para acessar o sistema.' }}
          </p>
        </div>

        <!-- Tabs -->
        <div class="mb-7 flex rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            class="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none"
            :class="!isRegisterMode
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'"
            @click="switchMode('login')"
          >
            Entrar
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none"
            :class="isRegisterMode
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'"
            @click="switchMode('register')"
          >
            Criar conta
          </button>
        </div>

        <!-- Alerta de feedback -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="feedback.message"
            role="alert"
            class="mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm"
            :class="feedback.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'"
          >
            <svg v-if="feedback.type === 'error'" class="mt-0.5 h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-medium leading-relaxed">{{ feedback.message }}</p>
          </div>
        </Transition>

        <!-- Formulário -->
        <form class="space-y-4" @submit.prevent="handleSubmit">

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="isRegisterMode" class="space-y-1.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="full-name">
                Nome completo
              </label>
              <input
                id="full-name"
                v-model.trim="form.fullName"
                type="text"
                class="login-input"
                placeholder="Seu nome completo"
                autocomplete="name"
                enterkeyhint="next"
                required
              />
            </div>
          </Transition>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="cpf">
              CPF
            </label>
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              class="login-input"
              :class="cpfError ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
              placeholder="000.000.000-00"
              inputmode="numeric"
              autocomplete="username"
              maxlength="14"
              enterkeyhint="next"
              required
              @input="onCpfInput"
            />
            <p v-if="cpfError" class="text-xs font-semibold text-rose-500">{{ cpfError }}</p>
          </div>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="isRegisterMode" class="space-y-1.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="phone">
                Telefone <span class="font-normal opacity-60">(opcional)</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="login-input"
                placeholder="(83) 99999-9999"
                inputmode="tel"
                autocomplete="tel"
                maxlength="15"
                enterkeyhint="next"
              />
            </div>
          </Transition>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500" for="password">
                Senha
              </label>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="login-input pr-12"
                :placeholder="isRegisterMode ? 'Mínimo de 6 caracteres' : 'Sua senha'"
                autocomplete="current-password"
                enterkeyhint="done"
                minlength="6"
                required
              />
              <button
                type="button"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p v-if="isRegisterMode" class="text-xs text-slate-400">
              Cada CPF pode ter somente uma conta cadastrada.
            </p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="login-submit-btn"
              :disabled="!canSubmit || loading"
            >
              <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z" />
              </svg>
              <span>{{ isRegisterMode ? 'Criar minha conta' : 'Entrar no sistema' }}</span>
              <svg v-if="!loading" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </form>

        <!-- Info rodapé -->
        <div class="mt-8 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-susBlue" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p class="text-xs leading-relaxed text-slate-500">
            Após o acesso você verá as unidades próximas, poderá escolher a especialidade e confirmar seu agendamento.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { getHomeRouteByRole } from '@/services/supabase'
import { formatCpf } from '@/utils/formatters'
import AppLogo from '@/components/ui/AppLogo.vue'

const router = useRouter()
const { signInWithCpf, signUpWithCpf } = useAuth()

const mode = ref('login')
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({ fullName: '', cpf: '', phone: '', password: '' })
const feedback = reactive({ type: '', message: '' })
const cpfError = ref('')

function validateCpf(raw) {
  const d = raw.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const calc = (len) => {
    const sum = Array.from({ length: len }, (_, i) => parseInt(d[i]) * (len + 1 - i)).reduce((a, b) => a + b, 0)
    const rem = (sum * 10) % 11
    return rem >= 10 ? 0 : rem
  }
  return calc(9) === parseInt(d[9]) && calc(10) === parseInt(d[10])
}

function onCpfInput() {
  form.cpf = formatCpf(form.cpf)
  const digits = form.cpf.replace(/\D/g, '')
  if (isRegisterMode.value && digits.length === 11) {
    cpfError.value = validateCpf(form.cpf) ? '' : 'CPF inválido.'
  } else {
    cpfError.value = ''
  }
}

const benefits = [
  { text: 'Unidades de saúde próximas de você' },
  { text: 'Múltiplas especialidades disponíveis' },
  { text: 'Confirmação instantânea do horário' },
  { text: 'Acompanhe e gerencie seus agendamentos' },
]

const isRegisterMode = computed(() => mode.value === 'register')
const canSubmit = computed(() => {
  if (cpfError.value) return false
  return isRegisterMode.value
    ? Boolean(form.fullName && form.cpf && form.password.length >= 6)
    : Boolean(form.cpf && form.password)
})

async function handleSubmit() {
  loading.value = true
  resetFeedback()
  try {
    const result = isRegisterMode.value
      ? await signUpWithCpf({ fullName: form.fullName, cpf: form.cpf, password: form.password, phone: form.phone })
      : await signInWithCpf({ cpf: form.cpf, password: form.password })

    feedback.type = 'success'
    feedback.message = isRegisterMode.value
      ? 'Conta criada com sucesso. Você já pode usar o sistema.'
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
  if (mode.value === nextMode) return
  mode.value = nextMode
  resetFeedback()
  form.password = ''
  if (nextMode === 'login') { form.fullName = ''; form.phone = '' }
  cpfError.value = ''
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function mapAuthError(error) {
  const message = error?.message ?? ''
  if (message.includes('Invalid login credentials')) return 'CPF ou senha inválidos.'
  if (message.includes('Ja existe uma conta')) return 'Já existe uma conta cadastrada para este CPF.'
  if (message.includes('11 digitos')) return 'Informe um CPF válido com 11 dígitos.'
  if (message.includes('pelo menos 6 caracteres')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (message.includes('confirmacao de email')) return 'No Supabase, desative a confirmação de email para liberar o cadastro por CPF.'
  return 'Não foi possível concluir a autenticação agora.'
}
</script>

<style scoped>
.login-root {
  min-height: 100dvh;
}

.login-input {
  display: block;
  width: 100%;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  padding: 0.8rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
}
.login-input::placeholder {
  color: #94a3b8;
}
.login-input:hover {
  border-color: #cbd5e1;
  background: #fff;
}
.login-input:focus {
  border-color: #0f62db;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(15, 98, 219, 0.1);
}

.login-submit-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f62db, #2b78ef);
  padding: 0.9rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px -8px rgba(15, 98, 219, 0.5);
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}
.login-submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px -8px rgba(15, 98, 219, 0.6);
}
.login-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}
.login-submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
