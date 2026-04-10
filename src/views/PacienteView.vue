<template>
  <div class="space-y-6">
    <section class="glass-panel overflow-hidden p-6 lg:p-7">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-susGreen">
            Atendimento perto de voce
          </p>
          <h2 class="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
            Digite seu CEP, veja as unidades proximas e escolha um horario
          </h2>
          <p class="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            O sistema mostra no mapa as unidades cadastradas, ordena pela distancia e ajuda
            voce a marcar o atendimento pelo celular.
          </p>
        </div>

        <form class="w-full max-w-xl" @submit.prevent="handleSearchCep">
          <label class="label-text" for="search-cep">Digite seu CEP</label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              id="search-cep"
              :value="searchCep"
              type="text"
              maxlength="9"
              class="input-field"
              placeholder="00000-000"
              inputmode="numeric"
              enterkeyhint="search"
              @input="handleSearchCepInput($event.target.value)"
            />
            <BaseButton type="submit" size="lg" :loading="loading.search" class="sm:min-w-[132px]">
              Buscar
            </BaseButton>
          </div>
          <p class="helper-text mt-2">
            {{ searchHelperText }}
          </p>
        </form>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-3">
        <div class="rounded-3xl border border-susBlue/10 bg-susBlue-soft/50 p-5">
          <p class="text-sm font-semibold text-susBlue-dark">Como funciona</p>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            1. Digite o CEP. 2. Escolha a unidade. 3. Selecione o horario.
          </p>
        </div>
        <div
          v-for="card in statCards"
          :key="card.label"
          class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {{ card.label }}
          </p>
          <h3 class="mt-3 text-3xl font-bold text-ink">{{ card.value }}</h3>
          <p class="mt-2 text-sm text-slate-600">{{ card.description }}</p>
        </div>
      </div>
    </section>

    <div
      v-if="feedback.message"
      role="alert"
      aria-live="polite"
      class="rounded-3xl border px-4 py-3 text-sm"
      :class="
        feedback.type === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      "
    >
      {{ feedback.message }}
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
      <div class="space-y-6">
        <LeafletMap
          :center="mapCenter"
          :units="unitsWithDistance"
          :selected-unit-id="selectedUnitId"
          :search-label="searchResult?.label || ''"
          @select-unit="handleSelectUnit"
        />

        <BaseCard
          title="Unidades proximas"
          subtitle="Clique em uma unidade para abrir a etapa de agendamento."
        >
          <div v-if="loading.initial" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Buscando unidades cadastradas...
          </div>
          <div
            v-else-if="!unitsWithDistance.length"
            class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            Nenhuma unidade com coordenadas disponiveis para exibir no mapa.
          </div>
          <div v-else class="grid gap-4 lg:grid-cols-2">
            <article
            v-for="unit in nearbyUnits"
            :key="unit.id"
            class="cursor-pointer rounded-3xl border p-4 transition"
              :class="
                String(unit.id) === String(selectedUnitId)
                  ? 'border-susBlue bg-susBlue-soft/70 shadow-card'
                  : 'border-slate-200/80 bg-slate-50/80 hover:border-susBlue/40 hover:bg-white'
              "
              @click="handleSelectUnit(unit)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-slate-900">{{ unit.name }}</h3>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    {{ unit.address_label || buildUnitAddress(unit) || 'Endereco indisponivel' }}
                  </p>
                </div>
                <span
                  class="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-susBlue-dark shadow-sm"
                >
                  {{ unit.distanceLabel }}
                </span>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                  CEP {{ formatCep(unit.cep) }}
                </p>
                <BaseButton size="sm" :variant="String(unit.id) === String(selectedUnitId) ? 'primary' : 'ghost'">
                  Agendar nesta unidade
                </BaseButton>
              </div>
            </article>
          </div>
        </BaseCard>
      </div>

      <div class="space-y-6">
        <BaseCard
          title="Escolher horario"
          subtitle="Siga a ordem: unidade, especialidade e horario."
        >
          <div v-if="!selectedUnit" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Selecione uma unidade no mapa ou na lista para continuar.
          </div>

          <template v-else>
            <div class="rounded-3xl bg-slate-50/80 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Unidade selecionada
              </p>
              <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ selectedUnit.name }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ selectedUnit.address_label || buildUnitAddress(selectedUnit) || 'Endereco indisponivel' }}
              </p>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <label class="label-text" for="patient-specialty">Especialidade</label>
                <select
                  id="patient-specialty"
                  v-model="selectedSpecialtyId"
                  class="select-field"
                  :disabled="loading.schedules || !availableSpecialties.length"
                >
                  <option value="">Selecione uma especialidade</option>
                  <option
                    v-for="specialty in availableSpecialties"
                    :key="specialty.id"
                    :value="String(specialty.id)"
                  >
                    {{ specialty.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="label-text">Horarios disponiveis</label>
                <div
                  v-if="loading.schedules"
                  class="rounded-3xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500"
                >
                  Buscando horarios livres...
                </div>
                <div
                  v-else-if="!filteredSchedules.length"
                  class="rounded-3xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500"
                >
                  Nenhum horario disponivel para essa combinacao.
                </div>
                <div v-else class="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                  <button
                    v-for="schedule in filteredSchedules"
                    :key="schedule.id"
                    type="button"
                    class="w-full rounded-3xl border p-4 text-left transition"
                    :class="
                      String(schedule.id) === String(selectedScheduleId)
                        ? 'border-susGreen bg-susGreen-soft/60 shadow-card'
                        : 'border-slate-200/80 bg-slate-50/80 hover:border-susGreen/40 hover:bg-white'
                    "
                    @click="selectedScheduleId = String(schedule.id)"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <p class="font-semibold text-slate-900">
                          {{ schedule.specialty?.name }}
                        </p>
                        <p class="mt-2 text-sm text-slate-600">
                          {{ formatDateTime(schedule.starts_at) }}
                        </p>
                      </div>
                      <StatusBadge status="disponivel" />
                    </div>
                  </button>
                </div>
              </div>

              <BaseButton
                block
                variant="success"
                size="lg"
                :loading="loading.booking"
                :disabled="!selectedScheduleId || !user"
                @click="handleCreateAppointment"
              >
                Confirmar meu agendamento
              </BaseButton>
            </div>
          </template>
        </BaseCard>

        <BaseCard
          title="Meus agendamentos"
          subtitle="Acompanhe aqui seus pedidos de consulta."
        >
          <div
            v-if="loading.appointments"
            class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            Carregando seus agendamentos...
          </div>
          <div
            v-else-if="!myAppointments.length"
            class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            Nenhum agendamento encontrado para esta conta.
          </div>
          <div v-else class="space-y-3">
            <article
              v-for="appointment in myAppointments"
              :key="appointment.id"
              class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-slate-900">
                    {{ appointment.schedule?.unit?.name || 'Unidade nao informada' }}
                  </h3>
                  <p class="mt-2 text-sm text-slate-600">
                    {{ appointment.schedule?.specialty?.name || 'Especialidade nao informada' }}
                  </p>
                </div>
                <StatusBadge :status="appointment.status" />
              </div>
              <p class="mt-3 text-sm text-slate-600">
                {{ formatDateTime(appointment.schedule?.starts_at) }}
              </p>
            </article>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import LeafletMap from '@/components/maps/LeafletMap.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { geocodeCep, haversineDistanceInKm } from '@/services/api'
import {
  createAppointment,
  fetchAppointmentsByPatient,
  fetchAvailableSchedulesByUnit,
  fetchUnits,
} from '@/services/scheduling'
import {
  buildUnitAddress,
  formatCep,
  formatDateTime,
  formatDistance,
  sanitizeCep,
} from '@/utils/formatters'

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
  zoom: 11,
}

const { user } = useAuth()

const searchCep = ref('')
const searchResult = ref(null)
const mapCenter = ref(defaultCenter)
const units = ref([])
const selectedUnitId = ref(null)
const unitSchedules = ref([])
const selectedSpecialtyId = ref('')
const selectedScheduleId = ref('')
const myAppointments = ref([])

const loading = reactive({
  initial: true,
  search: false,
  schedules: false,
  booking: false,
  appointments: false,
})

const feedback = reactive({
  type: '',
  message: '',
})

const unitsWithDistance = computed(() =>
  units.value
    .filter((unit) => Number.isFinite(Number(unit.latitude)) && Number.isFinite(Number(unit.longitude)))
    .map((unit) => {
      const distanceKm = searchResult.value?.coordinates
        ? haversineDistanceInKm(searchResult.value.coordinates, {
            lat: Number(unit.latitude),
            lng: Number(unit.longitude),
          })
        : Number.POSITIVE_INFINITY

      return {
        ...unit,
        distanceKm,
        distanceLabel: searchResult.value ? formatDistance(distanceKm) : 'Sem busca',
      }
    })
    .sort((left, right) => left.distanceKm - right.distanceKm),
)

const nearbyUnits = computed(() => unitsWithDistance.value.slice(0, 8))

const selectedUnit = computed(
  () => unitsWithDistance.value.find((unit) => String(unit.id) === String(selectedUnitId.value)) ?? null,
)

const availableSpecialties = computed(() => {
  const map = new Map()

  unitSchedules.value.forEach((schedule) => {
    if (schedule.specialty?.id && !map.has(schedule.specialty.id)) {
      map.set(schedule.specialty.id, schedule.specialty)
    }
  })

  return [...map.values()]
})

const filteredSchedules = computed(() =>
  unitSchedules.value.filter((schedule) =>
    selectedSpecialtyId.value ? String(schedule.specialty_id) === String(selectedSpecialtyId.value) : true,
  ),
)

const searchHelperText = computed(() =>
  searchResult.value?.label
    ? `Mapa centralizado em ${searchResult.value.label}.`
    : 'Digite um CEP valido para ver no mapa as unidades mais proximas.',
)

const statCards = computed(() => [
  {
    label: 'Unidades encontradas',
    value: unitsWithDistance.value.length,
    description: 'Locais que podem aparecer no mapa.',
  },
  {
    label: 'Mais perto de voce',
    value: nearbyUnits.value.length,
    description: 'Lista organizada pela distancia do CEP.',
  },
  {
    label: 'Meus pedidos',
    value: myAppointments.value.length,
    description: 'Agendamentos registrados nesta conta.',
  },
])

onMounted(async () => {
  await loadUnits()
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

function handleSearchCepInput(value) {
  searchCep.value = formatCep(value)
}

async function loadUnits() {
  loading.initial = true

  try {
    units.value = await fetchUnits()
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.initial = false
  }
}

async function handleSearchCep() {
  loading.search = true
  resetFeedback()

  try {
    const result = await geocodeCep(searchCep.value)

    if (!result.coordinates) {
      throw new Error('Nao foi possivel centralizar o mapa para esse CEP.')
    }

    searchResult.value = result
    mapCenter.value = {
      lat: result.coordinates.lat,
      lng: result.coordinates.lng,
      zoom: 13,
    }

    if (nearbyUnits.value.length) {
      await handleSelectUnit(nearbyUnits.value[0])
    }
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.search = false
  }
}

async function handleSelectUnit(unit) {
  selectedUnitId.value = String(unit.id)
  selectedSpecialtyId.value = ''
  selectedScheduleId.value = ''
  loading.schedules = true

  try {
    unitSchedules.value = await fetchAvailableSchedulesByUnit(unit.id)

    if (availableSpecialties.value.length) {
      selectedSpecialtyId.value = String(availableSpecialties.value[0].id)
    }
  } catch (error) {
    unitSchedules.value = []
    setFeedback('error', mapDataError(error))
  } finally {
    loading.schedules = false
  }
}

async function handleCreateAppointment() {
  if (!user.value?.id || !selectedScheduleId.value) {
    return
  }

  loading.booking = true
  resetFeedback()

  try {
    await createAppointment({
      patientId: user.value.id,
      scheduleId: Number(selectedScheduleId.value),
    })

    myAppointments.value = await fetchAppointmentsByPatient(user.value.id)

    if (selectedUnit.value) {
      unitSchedules.value = await fetchAvailableSchedulesByUnit(selectedUnit.value.id)
    }

    selectedScheduleId.value = ''
    if (availableSpecialties.value.length) {
      selectedSpecialtyId.value = String(availableSpecialties.value[0].id)
    }

    setFeedback('success', 'Agendamento confirmado com sucesso. O horario foi reservado.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.booking = false
  }
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
    return 'Nao foi possivel reservar esse horario. Tente escolher outro slot.'
  }

  if (message.includes('Nao foi possivel') || message.includes('Esse horario')) {
    return message
  }

  if (message.includes('row-level security')) {
    return 'Seu projeto Supabase precisa das politicas da tabela de agendamentos para permitir esta acao.'
  }

  return 'Nao foi possivel concluir a operacao agora.'
}
</script>
