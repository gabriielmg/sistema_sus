<template>
  <div class="mx-auto max-w-5xl space-y-5 pb-8">
    <section class="section-panel overflow-hidden">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.26em] text-susGreen">Agendamento simples</p>
          <h1 class="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Marque sua consulta por etapas.
          </h1>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Primeiro a unidade, depois o tipo de atendimento, depois o horario. No final voce recebe a confirmacao.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <BaseButton variant="ghost" size="sm" :loading="loading.location" @click="requestLocation">
            Usar minha localizacao
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="showAppointments = !showAppointments">
            {{ showAppointments ? 'Ocultar agendamentos' : 'Ver agendamentos' }}
          </BaseButton>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-4">
        <article
          v-for="(item, index) in stepItems"
          :key="item.key"
          class="rounded-3xl border p-4 transition"
          :class="currentStepIndex >= index ? 'border-susBlue bg-susBlue-soft/70' : 'border-slate-200 bg-slate-50/80'"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em]" :class="currentStepIndex >= index ? 'text-susBlue-dark' : 'text-slate-500'">
            Etapa {{ index + 1 }}
          </p>
          <p class="mt-2 text-sm font-semibold text-ink">{{ item.label }}</p>
        </article>
      </div>
    </section>

    <div
      v-if="feedback.message"
      role="alert"
      aria-live="polite"
      class="rounded-3xl border px-4 py-3 text-sm"
      :class="feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
    >
      {{ feedback.message }}
    </div>

    <BaseCard v-if="step === 'unit'" title="Encontre a unidade mais proxima" subtitle="Escolha uma unidade para continuar.">
      <div class="space-y-4">
        <div v-if="loading.units" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Buscando unidades...
        </div>
        <div v-else-if="!orderedUnits.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Nenhuma unidade disponivel agora.
        </div>
        <div v-else class="space-y-3">
          <div class="rounded-3xl border border-susBlue/10 bg-susBlue-soft/40 p-4">
            <p class="text-sm font-semibold text-susBlue-dark">Sua localizacao</p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ searchResult?.label || 'Toque em "Usar minha localizacao" para organizar a lista pelas unidades mais proximas.' }}
            </p>
          </div>

          <button
            v-for="unit in orderedUnits.slice(0, 6)"
            :key="unit.id"
            type="button"
            class="w-full rounded-3xl border p-4 text-left transition"
            :class="String(unit.id) === String(selectedUnitId) ? 'border-susBlue bg-susBlue-soft/60 shadow-card' : 'border-slate-200/80 bg-slate-50/80 hover:border-susBlue/40 hover:bg-white'"
            @click="handleSelectUnit(unit)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-4">
                <div v-if="unit.image_url" class="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img :src="unit.image_url" :alt="`Foto da unidade ${unit.name}`" class="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 class="font-semibold text-ink">{{ unit.name }}</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-600">{{ unit.address }}</p>
                </div>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-susBlue-dark shadow-sm">
                {{ unit.distanceLabel }}
              </span>
            </div>
            <div class="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <p>Tempo estimado: <span class="font-semibold text-slate-900">{{ unit.arrivalLabel }}</span></p>
              <p>Primeira vaga: <span class="font-semibold text-slate-900">{{ unit.nextSlotLabel }}</span></p>
            </div>
          </button>
        </div>

        <div class="flex justify-end">
          <BaseButton size="lg" :disabled="!selectedUnit" @click="goToStep('specialty')">
            Prosseguir
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else-if="step === 'specialty'" title="Escolha o tipo de medico" subtitle="Selecione a especialidade para ver os horarios.">
      <div class="space-y-5">
        <div class="rounded-3xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Unidade escolhida</p>
          <p class="mt-2 text-lg font-semibold text-ink">{{ selectedUnit?.name || 'Nenhuma unidade selecionada' }}</p>
          <p class="mt-1 text-sm leading-6 text-slate-600">{{ selectedUnit?.address || 'Volte para escolher uma unidade.' }}</p>
        </div>

        <div v-if="!specialtyOptions.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Nenhuma especialidade foi cadastrada pelo administrador ainda.
        </div>
        <div v-else class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="specialty in specialtyOptions"
            :key="specialty.id"
            type="button"
            class="min-h-24 rounded-3xl border p-4 text-left transition"
            :class="String(specialty.id) === String(selectedSpecialtyId) ? 'border-susGreen bg-susGreen-soft/70 shadow-card' : 'border-slate-200/80 bg-slate-50/80 hover:border-susGreen/40 hover:bg-white'"
            @click="handleSelectSpecialty(specialty)"
          >
            <p class="text-sm font-semibold text-ink">{{ specialty.name }}</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Toque para ver os horarios disponiveis nessa unidade.
            </p>
          </button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <BaseButton variant="ghost" size="lg" @click="goToStep('unit')">Voltar</BaseButton>
          <BaseButton size="lg" :disabled="!selectedSpecialty" @click="goToStep('schedule')">Prosseguir</BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else-if="step === 'schedule'" title="Escolha data e horario" subtitle="Veja os horarios livres e confirme seu atendimento.">
      <div class="space-y-5">
        <div class="rounded-3xl bg-slate-50 p-4">
          <p class="text-sm font-semibold text-ink">{{ selectedUnit?.name }}</p>
          <p class="mt-1 text-sm leading-6 text-slate-600">{{ selectedSpecialty?.name || 'Especialidade nao escolhida' }}</p>
        </div>

        <div v-if="loading.schedules" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Buscando horarios disponiveis...
        </div>
        <div v-else-if="!displaySchedules.length" class="space-y-4">
          <div class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Nao ha horario disponivel no momento.
          </div>
          <BaseButton block variant="ghost" size="lg" :disabled="!selectedUnit || !selectedSpecialty" @click="handleJoinWaitlist">
            Entrar na fila de espera
          </BaseButton>
        </div>
        <div v-else class="space-y-3">
          <button
            v-for="schedule in displaySchedules.slice(0, 8)"
            :key="schedule.id"
            type="button"
            class="w-full rounded-3xl border p-4 text-left transition"
            :class="String(schedule.id) === String(selectedScheduleId) ? 'border-susBlue bg-susBlue-soft/70 shadow-card' : 'border-slate-200/80 bg-slate-50/80 hover:border-susBlue/40 hover:bg-white'"
            @click="selectedScheduleId = String(schedule.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-semibold text-ink">{{ formatDateTime(schedule.starts_at) }}</h3>
                <p class="mt-1 text-sm text-slate-600">{{ schedule.doctor?.full_name || 'Profissional da unidade' }}</p>
              </div>
              <StatusBadge status="disponivel" />
            </div>
          </button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <BaseButton variant="ghost" size="lg" @click="goToStep('specialty')">Voltar</BaseButton>
          <BaseButton
            size="lg"
            variant="success"
            :loading="loading.booking"
            :disabled="!selectedScheduleId || !user"
            @click="handleCreateOrRescheduleAppointment"
          >
            Prosseguir
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else title="Agendamento concluido" subtitle="Seu horario foi reservado com sucesso.">
      <div class="flex flex-col items-center justify-center px-4 py-10 text-center">
        <div class="success-burst">
          <div class="success-ring">
            <div class="success-check">
              <span></span>
            </div>
          </div>
        </div>

        <h2 class="mt-8 font-display text-3xl font-semibold text-ink">Seu agendamento foi concluido com sucesso</h2>
        <p class="mt-3 max-w-xl text-base leading-7 text-slate-600">
          {{ successMessage }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <BaseButton size="lg" @click="resetFlow">Voltar para a tela principal</BaseButton>
          <BaseButton variant="ghost" size="lg" @click="showAppointments = true">
            Ver meus agendamentos
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard
      v-if="showAppointments"
      title="Meus agendamentos"
      subtitle="Aqui voce acompanha as consultas ja marcadas."
    >
      <div v-if="loading.appointments" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Carregando seus agendamentos...
      </div>
      <div v-else-if="!myAppointments.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Nenhuma consulta agendada ainda.
      </div>
      <div v-else class="space-y-3">
        <article
          v-for="appointment in myAppointments"
          :key="appointment.id"
          class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-ink">{{ appointment.schedule?.unit?.name || 'Unidade nao informada' }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ appointment.schedule?.specialty?.name || 'Especialidade nao informada' }}</p>
              <p class="mt-1 text-sm text-slate-600">{{ formatDateTime(appointment.schedule?.starts_at) }}</p>
            </div>
            <StatusBadge :status="appointment.status" />
          </div>
        </article>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { getCurrentLocation, haversineDistanceInKm } from '@/services/api'
import {
  createAppointment,
  fetchAppointmentsByPatient,
  fetchAvailableSchedulesByUnitAndSpecialty,
  fetchSpecialties,
  fetchUnits,
} from '@/services/scheduling'
import {
  addWaitlistEntry,
  createAppointmentNotifications,
  estimateArrivalMinutes,
  formatArrivalLabel,
  loadWaitlistEntries,
  pushNotifications,
} from '@/services/patientExperience'
import { buildUnitAddress, formatDateTime, formatDistance } from '@/utils/formatters'

const stepItems = [
  { key: 'unit', label: 'Unidade' },
  { key: 'specialty', label: 'Tipo de medico' },
  { key: 'schedule', label: 'Horario' },
  { key: 'success', label: 'Concluido' },
]

const { user, profile } = useAuth()

const step = ref('unit')
const showAppointments = ref(false)
const searchResult = ref(null)
const units = ref([])
const specialties = ref([])
const selectedUnitId = ref('')
const selectedSpecialtyId = ref('')
const selectedScheduleId = ref('')
const unitSchedulesById = ref({})
const myAppointments = ref([])
const successAppointment = ref(null)

const loading = reactive({
  units: true,
  schedules: false,
  booking: false,
  appointments: false,
  location: false,
})

const feedback = reactive({
  type: '',
  message: '',
})

const specialtyOptions = computed(() => specialties.value)
const geolocationSupported =
  typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'geolocation' in navigator

const selectedUnit = computed(
  () => orderedUnits.value.find((item) => String(item.id) === String(selectedUnitId.value)) ?? null,
)

const selectedSpecialty = computed(
  () => specialtyOptions.value.find((item) => String(item.id) === String(selectedSpecialtyId.value)) ?? null,
)

const displaySchedules = computed(() =>
  selectedUnit.value ? unitSchedulesById.value[String(selectedUnit.value.id)] ?? [] : [],
)

const selectedSchedule = computed(
  () => displaySchedules.value.find((item) => String(item.id) === String(selectedScheduleId.value)) ?? null,
)

const successMessage = computed(() => {
  if (!successAppointment.value) {
    return 'Agora voce pode voltar para o inicio ou acompanhar seus agendamentos.'
  }

  const unitName = successAppointment.value.schedule?.unit?.name || selectedUnit.value?.name || 'a unidade'
  const specialtyName =
    successAppointment.value.schedule?.specialty?.name || selectedSpecialty.value?.name || 'o atendimento'
  const startsAt =
    successAppointment.value.schedule?.starts_at || selectedSchedule.value?.starts_at || null

  return `${specialtyName} em ${unitName} no dia ${formatDateTime(startsAt)}.`
})

const currentStepIndex = computed(() => stepItems.findIndex((item) => item.key === step.value))

const unitsWithDistance = computed(() =>
  units.value.map((unit) => {
    const hasCoordinates =
      Number.isFinite(Number(unit.latitude)) && Number.isFinite(Number(unit.longitude))

    const distanceKm =
      searchResult.value?.coordinates && hasCoordinates
        ? haversineDistanceInKm(searchResult.value.coordinates, {
            lat: Number(unit.latitude),
            lng: Number(unit.longitude),
          })
        : Number.POSITIVE_INFINITY

    const schedules = unitSchedulesById.value[String(unit.id)] ?? []
    const nextSlotAt = schedules[0]?.starts_at ?? null
    const arrivalMinutes = estimateArrivalMinutes(distanceKm)

    return {
      ...unit,
      address: unit.address_label || buildUnitAddress(unit) || 'Endereco indisponivel',
      distanceKm,
      distanceLabel:
        searchResult.value && Number.isFinite(distanceKm)
          ? formatDistance(distanceKm)
          : searchResult.value
            ? 'Distancia indisponivel'
            : 'Localizacao pendente',
      arrivalLabel: arrivalMinutes ? formatArrivalLabel(arrivalMinutes) : 'Tempo indisponivel',
      nextSlotAt,
      nextSlotLabel: selectedSpecialty.value
        ? nextSlotAt
          ? formatDateTime(nextSlotAt)
          : 'Sem vaga'
        : 'Selecione a especialidade',
    }
  }),
)

const orderedUnits = computed(() =>
  [...unitsWithDistance.value].sort((left, right) => {
    if (left.distanceKm === right.distanceKm) {
      return left.name.localeCompare(right.name, 'pt-BR')
    }

    return left.distanceKm - right.distanceKm
  }),
)

onMounted(async () => {
  await loadBootstrapData()
  await tryAutoLocateUser()
})

watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) {
      myAppointments.value = []
      return
    }

    loading.appointments = true

    try {
      myAppointments.value = await fetchAppointmentsByPatient(userId)
    } catch (error) {
      setFeedback('error', mapDataError(error))
    } finally {
      loading.appointments = false
    }
  },
  { immediate: true },
)

watch(
  selectedSpecialtyId,
  async (specialtyId) => {
    selectedScheduleId.value = ''

    if (!specialtyId || !units.value.length) {
      unitSchedulesById.value = {}
      return
    }

    loading.schedules = true

    try {
      const entries = await Promise.all(
        units.value.map(async (unit) => {
          const schedules = await fetchAvailableSchedulesByUnitAndSpecialty(unit.id, specialtyId)
          return [String(unit.id), schedules]
        }),
      )

      unitSchedulesById.value = Object.fromEntries(entries)
    } catch (error) {
      unitSchedulesById.value = {}
      setFeedback('error', mapDataError(error))
    } finally {
      loading.schedules = false
    }
  },
  { immediate: true },
)

async function loadBootstrapData() {
  loading.units = true

  try {
    const [unitsData, specialtiesData] = await Promise.all([fetchUnits(), fetchSpecialties()])
    units.value = unitsData
    specialties.value = specialtiesData
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.units = false
  }
}

async function requestLocation() {
  if (!geolocationSupported) {
    setFeedback('error', 'Seu navegador nao permite usar localizacao.')
    return
  }

  loading.location = true
  resetFeedback()

  try {
    const result = await getCurrentLocation()
    searchResult.value = result

    if (orderedUnits.value.length) {
      handleSelectUnit(orderedUnits.value[0])
    }

    if (!orderedUnits.value.some((unit) => Number.isFinite(unit.distanceKm))) {
      setFeedback('error', 'Nenhuma unidade cadastrada possui coordenadas suficientes para ordenar por proximidade.')
    }
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.location = false
  }
}

async function tryAutoLocateUser() {
  if (!geolocationSupported || searchResult.value) {
    return
  }

  try {
    const permissionState = await getGeolocationPermissionState()

    if (permissionState !== 'denied') {
      await requestLocation()
    }
  } catch {
    // Keep the journey usable even if auto-location fails.
  }
}

async function getGeolocationPermissionState() {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'prompt'
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state
  } catch {
    return 'prompt'
  }
}

function handleSelectUnit(unit) {
  selectedUnitId.value = String(unit.id)
  selectedScheduleId.value = ''
  resetFeedback()
}

function handleSelectSpecialty(specialty) {
  selectedSpecialtyId.value = String(specialty.id)
  selectedScheduleId.value = ''
  resetFeedback()
}

function goToStep(targetStep) {
  if (targetStep === 'specialty' && !selectedUnit.value) {
    return
  }

  if (targetStep === 'schedule' && (!selectedUnit.value || !selectedSpecialty.value)) {
    return
  }

  step.value = targetStep
  resetFeedback()
}

async function handleCreateOrRescheduleAppointment() {
  if (!user.value?.id || !selectedScheduleId.value) {
    return
  }

  loading.booking = true
  resetFeedback()

  try {
    const appointment = await createAppointment({
      patientId: user.value.id,
      scheduleId: Number(selectedScheduleId.value),
    })

    successAppointment.value = appointment
    myAppointments.value = await fetchAppointmentsByPatient(user.value.id)

    if (selectedUnit.value && selectedSpecialty.value && selectedSchedule.value) {
      pushNotifications(
        createAppointmentNotifications({
          appointment,
          patientName: profile.value?.full_name || '',
          unitName: selectedUnit.value.name,
          specialtyName: selectedSpecialty.value.name,
          doctorName: selectedSchedule.value.doctor?.full_name || 'Profissional da unidade',
        }),
      )
    }

    if (selectedUnit.value && selectedSpecialtyId.value) {
      unitSchedulesById.value[String(selectedUnit.value.id)] =
        await fetchAvailableSchedulesByUnitAndSpecialty(selectedUnit.value.id, selectedSpecialtyId.value)
    }

    waitlistCleanup()
    step.value = 'success'
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.booking = false
  }
}

function handleJoinWaitlist() {
  if (!selectedSpecialty.value) {
    return
  }

  addWaitlistEntry({
    patientId: user.value?.id ?? null,
    specialtyId: selectedSpecialty.value.id,
    specialtyName: selectedSpecialty.value.name,
    unitId: selectedUnit.value?.id ?? null,
    unitName: selectedUnit.value?.name || '',
  })

  setFeedback('success', 'Voce entrou na fila de espera. Vamos avisar quando surgir vaga.')
}

function resetFlow() {
  step.value = 'unit'
  selectedUnitId.value = ''
  selectedSpecialtyId.value = ''
  selectedScheduleId.value = ''
  successAppointment.value = null
  resetFeedback()

  if (orderedUnits.value.length) {
    selectedUnitId.value = String(orderedUnits.value[0].id)
  }
}

function waitlistCleanup() {
  loadWaitlistEntries()
}

function setFeedback(type, message) {
  feedback.type = type
  feedback.message = message
}

function resetFeedback() {
  feedback.type = ''
  feedback.message = ''
}

function mapDataError(error) {
  const message = error?.message ?? ''

  if (message.includes('Invalid') || message.includes('duplicate')) {
    return 'Nao foi possivel concluir essa acao. Tente outro horario.'
  }

  if (message.includes('localizacao') || message.includes('Geolocalizacao') || message.includes('HTTPS')) {
    return message
  }

  if (message.includes('row-level security')) {
    return 'Seu projeto Supabase precisa de permissoes liberadas para essa etapa.'
  }

  return message || 'Nao foi possivel concluir a operacao agora.'
}
</script>
