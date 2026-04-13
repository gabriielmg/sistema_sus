<template>
  <div class="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-5 lg:grid-cols-[1.05fr_minmax(0,460px)] lg:gap-8">
    <section class="section-panel relative overflow-hidden bg-gradient-to-br from-susBlue via-[#163d8f] to-susGreen p-5 text-white shadow-soft sm:p-6 lg:p-10">
      <div class="absolute inset-0 opacity-25">
        <div class="absolute left-4 top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
        <div class="absolute bottom-8 right-8 h-36 w-36 rounded-full bg-white/15 blur-3xl" />
      </div>

      <div class="relative z-10 space-y-6">
        <div class="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
          Acesso simples
        </div>

        <div>
          <h1 class="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Entre com CPF e receba um código por SMS para marcar sua consulta.
          </h1>
          <p class="mt-4 max-w-xl text-base leading-7 text-slate-100/90">
            Pensado para celular, com texto claro, botões grandes e uma entrada rápida para quem precisa de atendimento perto de casa.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <article class="rounded-3xl border border-white/15 bg-white/10 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">1. CPF</p>
            <p class="mt-2 text-sm leading-6 text-slate-100">Digite seu CPF e confirme o celular cadastrado.</p>
          </article>
          <article class="rounded-3xl border border-white/15 bg-white/10 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">2. SMS</p>
            <p class="mt-2 text-sm leading-6 text-slate-100">Receba um código curto no seu telefone.</p>
          </article>
          <article class="rounded-3xl border border-white/15 bg-white/10 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">3. Consulta</p>
            <p class="mt-2 text-sm leading-6 text-slate-100">Escolha especialidade, unidade e horário.</p>
          </article>
        </div>

        <div class="rounded-3xl border border-white/15 bg-white/10 p-4">
          <p class="text-sm font-semibold text-white">Acessibilidade ativa</p>
          <p class="mt-2 text-sm leading-6 text-slate-100">
            Fonte grande, contraste alto, navegação por etapas e foco no que importa para terminar o agendamento rápido.
          </p>
        </div>
      </div>
    </section>

    <BaseCard class="mx-auto w-full max-w-xl rounded-[28px]">
      <div class="mb-6 flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-susBlue">Paciente</p>
          <h2 class="mt-2 font-display text-3xl font-semibold text-ink">
            {{ step === 'code' ? 'Digite o código' : 'Entrar com CPF' }}
          </h2>
        </div>
        <span class="rounded-full bg-susBlue-soft px-3 py-1 text-xs font-semibold text-susBlue-dark">
          {{ step === 'code' ? 'Etapa 2 de 2' : 'Etapa 1 de 2' }}
        </span>
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

      <form class="space-y-4" @submit.prevent="step === 'code' ? handleVerifyCode() : handleRequestCode()">
        <template v-if="step === 'identification'">
          <div>
            <label class="label-text" for="cpf">CPF</label>
            <input
              id="cpf"
              v-model.trim="form.cpf"
              type="text"
              class="input-field"
              placeholder="000.000.000-00"
              inputmode="numeric"
              autocomplete="off"
              enterkeyhint="next"
              required
            />
          </div>

          <div>
            <label class="label-text" for="phone">Celular para SMS</label>
            <input
              id="phone"
              v-model.trim="form.phone"
              type="tel"
              class="input-field"
              placeholder="(11) 99999-9999"
              autocomplete="tel"
              inputmode="tel"
              enterkeyhint="done"
              required
            />
            <p class="helper-text mt-2">
              Use o número cadastrado para receber o código de acesso.
            </p>
          </div>
        </template>

        <template v-else>
          <div class="rounded-3xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Código enviado para</p>
            <p class="mt-2 text-lg font-semibold text-ink">{{ maskedPhone }}</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Digite o código de 6 números recebido por SMS. Se o celular estiver errado, volte e ajuste.
            </p>
          </div>

          <div>
            <label class="label-text" for="code">Código de verificação</label>
            <input
              id="code"
              v-model.trim="form.code"
              type="text"
              class="input-field text-center tracking-[0.35em]"
              placeholder="000000"
              inputmode="numeric"
              maxlength="6"
              autocomplete="one-time-code"
              enterkeyhint="done"
              required
            />
          </div>
        </template>

        <BaseButton type="submit" block size="lg" :loading="loading" :disabled="!canSubmit">
          {{ step === 'code' ? 'Entrar no sistema' : 'Receber código por SMS' }}
        </BaseButton>
      </form>

      <div class="mt-6 rounded-3xl bg-slate-50 px-4 py-4">
        <p class="text-sm font-semibold text-slate-800">O que vai acontecer depois</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Você verá unidades próximas, escolherá a especialidade primeiro e seguirá passo a passo até confirmar a consulta.
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
import { formatCpf, formatPhone } from '@/utils/formatters'

const router = useRouter()
const { sendLoginCode, verifyLoginCode } = useAuth()

const step = ref('identification')
const loading = ref(false)
const maskedPhone = ref('')

const form = reactive({
  cpf: '',
  phone: '',
  code: '',
})

const feedback = reactive({
  type: '',
  message: '',
})

const canSubmit = computed(() => {
  if (step.value === 'code') {
    return form.code.length >= 4
  }

  return Boolean(form.cpf && form.phone)
})

async function handleRequestCode() {
  loading.value = true
  resetFeedback()

  try {
    const result = await sendLoginCode({
      cpf: form.cpf,
      phone: form.phone,
    })

    maskedPhone.value = formatPhone(result.phone)
    form.cpf = formatCpf(form.cpf)
    step.value = 'code'
    feedback.type = 'success'
    feedback.message = 'Código enviado. Veja o SMS e digite os 6 números para continuar.'
  } catch (error) {
    feedback.type = 'error'
    feedback.message = mapAuthError(error)
  } finally {
    loading.value = false
  }
}

async function handleVerifyCode() {
  loading.value = true
  resetFeedback()

  try {
    const result = await verifyLoginCode({
      cpf: form.cpf,
      phone: form.phone,
      code: form.code,
    })

    await router.replace(getHomeRouteByRole(result.profile?.role))
  } catch (error) {
    feedback.type = 'error'
    feedback.message = mapAuthError(error)
  } finally {
    loading.value = false
  }
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function mapAuthError(error) {
  const message = error?.message ?? ''

  if (message.includes('Invalid token') || message.includes('otp')) {
    return 'Código inválido. Confira o SMS e tente novamente.'
  }

  if (message.includes('phone')) {
    return 'Informe um celular válido para receber o código.'
  }

  if (message.includes('Configure VITE_SUPABASE_URL')) {
    return 'Falta configurar o Supabase no arquivo .env.'
  }

  return 'Nao foi possivel concluir o acesso agora.'
}
</script>
