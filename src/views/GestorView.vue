<template>
  <div class="mx-auto max-w-4xl space-y-5 pb-16">

    <!-- ── Cabeçalho da unidade ── -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p :class="['text-xs font-bold uppercase tracking-widest', isDark ? 'text-slate-500' : 'text-slate-400']">
          Gestão de unidade
        </p>
        <h1 :class="['mt-1 text-xl font-black', isDark ? 'text-white' : 'text-slate-900']">
          {{ unitName }}
        </h1>
      </div>

      <!-- Contadores rápidos -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold"
          :class="isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'">
          <span class="h-2 w-2 rounded-full bg-amber-400" />
          {{ pendingCount }} pendentes
        </div>
        <div class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold"
          :class="isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'">
          <span class="h-2 w-2 rounded-full bg-emerald-400" />
          {{ confirmedCount }} confirmados
        </div>
      </div>
    </div>

    <!-- ── Feedback ── -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="feedback.message" role="alert"
        class="flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold"
        :class="feedback.type === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800'"
      >
        {{ feedback.message }}
      </div>
    </Transition>

    <!-- ── Abas ── -->
    <div class="flex gap-1 rounded-2xl p-1"
      :class="isDark ? 'bg-slate-900' : 'bg-slate-100'">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
        :class="activeTab === tab.key
          ? (isDark ? 'bg-slate-700 text-white shadow' : 'bg-white text-slate-900 shadow')
          : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.key === 'appointments' && pendingCount > 0"
          class="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-amber-900">
          {{ pendingCount }}
        </span>
      </button>
    </div>

    <!-- ══════════════════════════════════
         ABA: AGENDAMENTOS
    ═══════════════════════════════════ -->
    <section v-if="activeTab === 'appointments'">

      <!-- Filtro de status -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="f in statusFilters"
          :key="f.value"
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-bold transition-all"
          :class="statusFilter === f.value
            ? 'border-susBlue bg-susBlue text-white'
            : (isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-500 hover:border-slate-300')"
          @click="statusFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading.appointments" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
        <p :class="['text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500']">Carregando agendamentos...</p>
      </div>

      <!-- Vazio -->
      <div v-else-if="!filteredAppointments.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <svg :class="['h-10 w-10 mb-3', isDark ? 'text-slate-700' : 'text-slate-300']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        <p :class="['text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-600']">Nenhum agendamento encontrado.</p>
      </div>

      <!-- Lista de agendamentos -->
      <div v-else class="space-y-2">
        <article
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p :class="['font-bold truncate', isDark ? 'text-white' : 'text-slate-900']">
                {{ appointment.patient?.full_name || 'Paciente sem nome' }}
              </p>
              <StatusBadge :status="appointment.status" />
            </div>
            <p :class="['text-xs mt-0.5 truncate', isDark ? 'text-slate-400' : 'text-slate-500']">
              {{ appointment.schedule?.specialty?.name || '—' }} ·
              {{ formatDateTime(appointment.schedule?.starts_at) }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              :class="isDark
                ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
              :disabled="appointment.status === 'confirmado' || loading.action"
              @click="handleUpdateStatus(appointment, 'confirmado')"
            >
              Confirmar
            </button>
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              :class="isDark
                ? 'bg-rose-900/30 text-rose-300 hover:bg-rose-900/50'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'"
              :disabled="appointment.status === 'cancelado' || loading.action"
              @click="handleUpdateStatus(appointment, 'cancelado')"
            >
              Cancelar
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- ══════════════════════════════════
         ABA: HORÁRIOS
    ═══════════════════════════════════ -->
    <section v-else-if="activeTab === 'schedules'" class="space-y-5">

      <!-- Formulário: abrir horário -->
      <div class="rounded-2xl border p-5"
        :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'">
        <h2 :class="['mb-4 text-sm font-black uppercase tracking-wide', isDark ? 'text-white' : 'text-slate-800']">
          Abrir novo horário
        </h2>

        <form class="space-y-4" @submit.prevent="handleCreateSchedule">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label :class="['block text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700']" for="sch-specialty">
                Especialidade <span class="text-rose-500">*</span>
              </label>
              <select id="sch-specialty" v-model="scheduleForm.specialtyId"
                class="block w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-susBlue/30"
                :class="isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'"
                required>
                <option value="">Selecione</option>
                <option v-for="s in specialties" :key="s.id" :value="String(s.id)">{{ s.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label :class="['block text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700']" for="sch-doctor">
                Médico <span class="text-xs font-normal opacity-60">(opcional)</span>
              </label>
              <select id="sch-doctor" v-model="scheduleForm.doctorId"
                class="block w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-susBlue/30"
                :class="isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'">
                <option value="">Sem médico específico</option>
                <option v-for="d in doctors" :key="d.id" :value="String(d.id)">{{ d.full_name }}</option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label :class="['block text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700']" for="sch-date">
                Data <span class="text-rose-500">*</span>
              </label>
              <input id="sch-date" v-model="scheduleForm.date" type="date"
                class="block w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-susBlue/30"
                :class="isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'"
                required />
            </div>
            <div class="space-y-1.5">
              <label :class="['block text-sm font-bold', isDark ? 'text-slate-300' : 'text-slate-700']" for="sch-time">
                Horário <span class="text-rose-500">*</span>
              </label>
              <input id="sch-time" v-model="scheduleForm.time" type="time"
                class="block w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-susBlue/30"
                :class="isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'"
                required />
            </div>
          </div>

          <button type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-susBlue to-[#2b78ef] py-3.5 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!scheduleForm.specialtyId || !scheduleForm.date || !scheduleForm.time || loading.schedule"
          >
            <svg v-if="loading.schedule" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z" />
            </svg>
            {{ loading.schedule ? 'Abrindo...' : 'Abrir horário' }}
          </button>
        </form>
      </div>

      <!-- Lista de horários futuros -->
      <div>
        <h2 :class="['mb-3 text-sm font-black uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500']">
          Próximos horários abertos
        </h2>

        <div v-if="loading.schedules" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10"
          :class="isDark ? 'border-slate-800' : 'border-slate-200'">
          <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
        </div>

        <div v-else-if="!upcomingSchedules.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 text-center"
          :class="isDark ? 'border-slate-800' : 'border-slate-200'">
          <p :class="['text-sm font-semibold', isDark ? 'text-slate-500' : 'text-slate-400']">Nenhum horário aberto.</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="schedule in upcomingSchedules"
            :key="schedule.id"
            class="flex items-center gap-4 rounded-2xl border px-4 py-3.5"
            :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              :class="isDark ? 'bg-slate-800' : 'bg-slate-100'">
              <svg :class="['h-4 w-4', isDark ? 'text-slate-400' : 'text-slate-500']" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p :class="['font-bold text-sm', isDark ? 'text-white' : 'text-slate-900']">
                {{ formatDateTime(schedule.starts_at) }}
              </p>
              <p :class="['text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">
                {{ schedule.specialty?.name }}
                <span v-if="schedule.doctor?.full_name"> · {{ schedule.doctor.full_name }}</span>
              </p>
            </div>
            <StatusBadge :status="schedule.status" />
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════
         ABA: MÉDICOS
    ═══════════════════════════════════ -->
    <section v-else-if="activeTab === 'doctors'">
      <div v-if="loading.doctors" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
      </div>

      <div v-else-if="!doctors.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <p :class="['text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-600']">Nenhum médico cadastrado nesta unidade.</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="doctor in doctors"
          :key="doctor.id"
          class="flex items-center gap-4 rounded-2xl border px-4 py-4"
          :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            :class="isDark ? 'bg-slate-800' : 'bg-slate-100'">
            <svg :class="['h-5 w-5', isDark ? 'text-slate-400' : 'text-slate-500']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ doctor.full_name }}</p>
            <p :class="['text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">
              {{ doctor.specialty?.name }} · {{ doctor.crm }}
            </p>
          </div>
          <StatusBadge :status="doctor.is_active ? 'disponivel' : 'indisponivel'" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import {
  createSchedule,
  fetchAppointments,
  fetchDoctorsByUnit,
  fetchSchedulesByUnit,
  fetchSpecialties,
  fetchUnits,
  updateAppointmentStatus,
} from '@/services/scheduling'
import { formatDateTime } from '@/utils/formatters'

const { profile } = useAuth()
const { isDark } = useTheme()

const tabs = [
  { key: 'appointments', label: 'Agendamentos' },
  { key: 'schedules', label: 'Horários' },
  { key: 'doctors', label: 'Médicos' },
]

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'confirmado', label: 'Confirmados' },
  { value: 'cancelado', label: 'Cancelados' },
]

const activeTab = ref('appointments')
const statusFilter = ref('all')
const appointments = ref([])
const schedules = ref([])
const doctors = ref([])
const specialties = ref([])
const units = ref([])

const loading = reactive({
  appointments: true,
  schedules: false,
  doctors: false,
  schedule: false,
  action: false,
})

const feedback = reactive({ type: '', message: '' })

const scheduleForm = reactive({
  specialtyId: '',
  doctorId: '',
  date: '',
  time: '',
})

const unitId = computed(() => profile.value?.unit_id ?? null)

const unitName = computed(() => {
  if (units.value.length && unitId.value) {
    return units.value.find((u) => String(u.id) === String(unitId.value))?.name ?? 'Minha unidade'
  }
  return 'Minha unidade'
})

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') return appointments.value
  return appointments.value.filter((a) => a.status === statusFilter.value)
})

const pendingCount = computed(() =>
  appointments.value.filter((a) => a.status === 'pendente').length,
)

const confirmedCount = computed(() =>
  appointments.value.filter((a) => a.status === 'confirmado').length,
)

const upcomingSchedules = computed(() =>
  schedules.value.filter((s) => s.is_available),
)

onMounted(async () => {
  await loadAll()
})

async function loadAll() {
  if (!unitId.value) return

  loading.appointments = true
  loading.schedules = true
  loading.doctors = true

  try {
    const [allAppointments, unitSchedules, unitDoctors, specialtiesData, unitsData] = await Promise.all([
      fetchAppointments(),
      fetchSchedulesByUnit(unitId.value),
      fetchDoctorsByUnit(unitId.value),
      fetchSpecialties(),
      fetchUnits(),
    ])

    appointments.value = allAppointments.filter(
      (a) => String(a.schedule?.unit?.id) === String(unitId.value),
    )
    schedules.value = unitSchedules
    doctors.value = unitDoctors
    specialties.value = specialtiesData
    units.value = unitsData
  } catch (error) {
    setFeedback('error', 'Não foi possível carregar os dados.')
  } finally {
    loading.appointments = false
    loading.schedules = false
    loading.doctors = false
  }
}

async function handleUpdateStatus(appointment, newStatus) {
  loading.action = true
  resetFeedback()
  try {
    await updateAppointmentStatus(appointment.id, newStatus)
    const idx = appointments.value.findIndex((a) => a.id === appointment.id)
    if (idx !== -1) appointments.value[idx] = { ...appointments.value[idx], status: newStatus }
    setFeedback('success', newStatus === 'confirmado' ? 'Agendamento confirmado.' : 'Agendamento cancelado.')
  } catch {
    setFeedback('error', 'Não foi possível atualizar o status.')
  } finally {
    loading.action = false
  }
}

async function handleCreateSchedule() {
  if (!scheduleForm.specialtyId || !scheduleForm.date || !scheduleForm.time || !unitId.value) return
  loading.schedule = true
  resetFeedback()
  try {
    const startsAt = new Date(`${scheduleForm.date}T${scheduleForm.time}:00`).toISOString()
    const newSchedule = await createSchedule({
      unit_id: Number(unitId.value),
      specialty_id: Number(scheduleForm.specialtyId),
      doctor_id: scheduleForm.doctorId ? Number(scheduleForm.doctorId) : null,
      starts_at: startsAt,
    })
    schedules.value = [newSchedule, ...schedules.value].sort(
      (a, b) => new Date(a.starts_at) - new Date(b.starts_at),
    )
    scheduleForm.specialtyId = ''
    scheduleForm.doctorId = ''
    scheduleForm.date = ''
    scheduleForm.time = ''
    setFeedback('success', 'Horário aberto com sucesso!')
  } catch {
    setFeedback('error', 'Não foi possível criar o horário.')
  } finally {
    loading.schedule = false
  }
}

function setFeedback(type, message) {
  feedback.type = type
  feedback.message = message
  setTimeout(resetFeedback, 4000)
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}
</script>
