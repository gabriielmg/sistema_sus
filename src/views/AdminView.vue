<template>
  <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
    <AdminSidebar :items="menuItems" :active-key="activeSection" @select="activeSection = $event" />

    <div class="space-y-6">
      <section class="glass-panel overflow-hidden p-6 lg:p-7">
        <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-susBlue">
              Operacao central
            </p>
            <h2 class="mt-3 font-display text-3xl font-semibold text-ink">
              Controle os recursos da rede e acompanhe a fila em tempo real
            </h2>
            <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Cadastre unidades, amplie a oferta de especialidades, abra novos horarios e
              trate os agendamentos direto no painel.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <BaseButton variant="ghost" @click="activeSection = 'units'">Nova unidade</BaseButton>
            <BaseButton variant="ghost" @click="activeSection = 'schedules'">Abrir horario</BaseButton>
            <BaseButton variant="success" @click="activeSection = 'appointments'">
              Ver fila
            </BaseButton>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        class="rounded-3xl border px-4 py-3 text-sm"
        :class="
          feedback.type === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        "
      >
        {{ feedback.message }}
      </div>

      <BaseCard v-if="loading.initial" title="Carregando painel">
        <p class="text-sm text-slate-600">
          Buscando unidades, especialidades, horarios e agendamentos no Supabase.
        </p>
      </BaseCard>

      <template v-else>
        <BaseCard
          v-if="activeSection === 'dashboard'"
          title="Resumo operacional"
          subtitle="Visao rapida do que precisa de atencao agora."
        >
          <div class="grid gap-6 xl:grid-cols-2">
            <div class="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="font-display text-xl font-semibold text-ink">Agendamentos recentes</h3>
                <BaseButton variant="ghost" size="sm" @click="activeSection = 'appointments'">
                  Abrir fila
                </BaseButton>
              </div>
              <div v-if="!appointments.length" class="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">
                Nenhum agendamento encontrado.
              </div>
              <div v-else class="space-y-3">
                <article
                  v-for="appointment in appointments.slice(0, 5)"
                  :key="appointment.id"
                  class="rounded-2xl bg-white px-4 py-4 shadow-sm"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 class="font-semibold text-slate-900">
                        {{ appointment.patient?.full_name || appointment.patient?.email || 'Paciente sem nome' }}
                      </h4>
                      <p class="text-sm text-slate-600">
                        {{ appointment.schedule?.unit?.name || 'Unidade nao informada' }} -
                        {{ appointment.schedule?.specialty?.name || 'Especialidade nao informada' }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <StatusBadge :status="appointment.status" />
                      <span class="text-sm text-slate-500">
                        {{ formatDateTime(appointment.schedule?.starts_at) }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div class="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="font-display text-xl font-semibold text-ink">Proximos horarios</h3>
                <BaseButton variant="ghost" size="sm" @click="activeSection = 'schedules'">
                  Gerenciar
                </BaseButton>
              </div>
              <div v-if="!upcomingSchedules.length" class="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">
                Ainda nao existem horarios futuros cadastrados.
              </div>
              <div v-else class="space-y-3">
                <article
                  v-for="schedule in upcomingSchedules"
                  :key="schedule.id"
                  class="rounded-2xl bg-white px-4 py-4 shadow-sm"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 class="font-semibold text-slate-900">{{ schedule.unit?.name }}</h4>
                      <p class="text-sm text-slate-600">
                        {{ schedule.specialty?.name }} - {{ formatDateTime(schedule.starts_at) }}
                      </p>
                    </div>
                    <StatusBadge :status="schedule.status" />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </BaseCard>

        <div v-if="activeSection === 'units'" class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <BaseCard
            title="Cadastrar unidade"
            subtitle="O administrador cadastra a unidade com CEP, foto e coordenadas para a busca por proximidade."
          >
            <div v-if="!isAdmin" class="rounded-3xl bg-slate-50 px-4 py-8 text-sm text-slate-600">
              Esta conta nao possui acesso total ao sistema. O cadastro de novas unidades fica disponivel apenas para o administrador.
            </div>
            <form v-else class="space-y-4" @submit.prevent="handleCreateUnit">
              <div>
                <label class="label-text" for="unit-name">Nome da unidade</label>
                <input
                  id="unit-name"
                  v-model.trim="unitForm.name"
                  class="input-field"
                  type="text"
                  placeholder="Ex.: UBS Centro"
                  required
                />
              </div>

              <div>
                <label class="label-text" for="unit-cep">CEP</label>
                <input
                  id="unit-cep"
                  :value="unitForm.cep"
                  class="input-field"
                  type="text"
                  maxlength="9"
                  placeholder="00000-000"
                  @input="handleUnitCepInput($event.target.value)"
                />
                <p class="helper-text mt-2">
                  {{ cepLookupMessage }}
                </p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="label-text" for="unit-street">Endereco</label>
                  <input
                    id="unit-street"
                    v-model.trim="unitForm.street"
                    class="input-field"
                    type="text"
                    placeholder="Rua, avenida ou travessa"
                  />
                </div>
                <div>
                  <label class="label-text" for="unit-neighborhood">Bairro</label>
                  <input
                    id="unit-neighborhood"
                    v-model.trim="unitForm.neighborhood"
                    class="input-field"
                    type="text"
                    placeholder="Bairro"
                  />
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="label-text" for="unit-city">Cidade</label>
                  <input
                    id="unit-city"
                    v-model.trim="unitForm.city"
                    class="input-field"
                    type="text"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label class="label-text" for="unit-state">UF</label>
                  <input
                    id="unit-state"
                    v-model.trim="unitForm.state"
                    class="input-field"
                    type="text"
                    maxlength="2"
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <label class="label-text" for="unit-image">Foto da unidade</label>
                <input
                  id="unit-image"
                  type="file"
                  class="input-field"
                  accept="image/*"
                  @change="handleUnitImageChange"
                />
                <p class="helper-text mt-2">
                  Envie uma foto da fachada ou da recepcao para identificar a unidade no sistema.
                </p>
              </div>

              <div v-if="unitImagePreview" class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <img :src="unitImagePreview" alt="Preview da unidade" class="h-48 w-full object-cover" />
              </div>

              <BaseButton
                type="submit"
                block
                :loading="loading.unit"
                :disabled="!unitForm.name || !unitForm.cep || !unitForm.street || !unitForm.city || !unitForm.state"
              >
                Salvar unidade
              </BaseButton>
            </form>
          </BaseCard>

          <BaseCard
            title="Unidades cadastradas"
            subtitle="Essas unidades formam a rede do seu sistema e aparecem para o paciente por proximidade."
          >
            <div v-if="!visibleUnits.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Nenhuma unidade cadastrada ainda.
            </div>
            <div v-else class="space-y-3">
              <article
                v-for="unit in visibleUnits"
                :key="unit.id"
                class="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4"
              >
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-start gap-4">
                    <div v-if="unit.image_url" class="h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <img :src="unit.image_url" :alt="`Foto da unidade ${unit.name}`" class="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-slate-900">{{ unit.name }}</h3>
                      <p class="mt-1 text-sm text-slate-600">
                        {{ unit.address_label || buildUnitAddress(unit) || 'Endereco pendente' }}
                      </p>
                      <p class="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        CEP {{ formatCep(unit.cep) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <StatusBadge :status="unit.latitude && unit.longitude ? 'disponivel' : 'indisponivel'" />
                  </div>
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <div
          v-if="activeSection === 'specialties'"
          class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
        >
          <BaseCard
            title="Nova especialidade"
            subtitle="Cadastre especialidades para alimentar os horarios e o fluxo de agendamento."
          >
            <div v-if="isManager" class="rounded-3xl bg-slate-50 px-4 py-8 text-sm text-slate-600">
              Esta conta Ã© de gestor. Especialidades ficam sob controle do administrador.
            </div>
            <form v-else class="space-y-4" @submit.prevent="handleCreateSpecialty">
              <div>
                <label class="label-text" for="specialty-name">Especialidade</label>
                <input
                  id="specialty-name"
                  v-model.trim="specialtyForm.name"
                  type="text"
                  class="input-field"
                  placeholder="Ex.: Clinica geral"
                  required
                />
              </div>
              <BaseButton type="submit" block :loading="loading.specialty" :disabled="!specialtyForm.name">
                Salvar especialidade
              </BaseButton>
            </form>
          </BaseCard>

          <BaseCard
            title="Especialidades cadastradas"
            subtitle="Lista usada tanto pelo admin quanto pela jornada do paciente."
          >
            <div v-if="!specialties.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Nenhuma especialidade cadastrada.
            </div>
            <div v-else class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="specialty in specialties"
                :key="specialty.id"
                class="rounded-3xl border border-slate-200/70 bg-slate-50/80 px-4 py-4"
              >
                <p class="font-semibold text-slate-900">{{ specialty.name }}</p>
                <p class="mt-2 text-sm text-slate-500">
                  Criada em {{ formatDateTime(specialty.created_at) }}
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <div
          v-if="activeSection === 'doctors'"
          class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
        >
          <BaseCard
            title="Cadastrar mÃ©dico"
            subtitle="Vincule o profissional a uma unidade e especialidade."
          >
            <form class="space-y-4" @submit.prevent="handleCreateDoctor">
              <div>
                <label class="label-text" for="doctor-name">Nome do mÃ©dico</label>
                <input
                  id="doctor-name"
                  v-model.trim="doctorForm.fullName"
                  type="text"
                  class="input-field"
                  placeholder="Ex.: Dra. Maria Silva"
                  required
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="label-text" for="doctor-crm">CRM / CRO / CRP</label>
                  <input
                    id="doctor-crm"
                    v-model.trim="doctorForm.crm"
                    type="text"
                    class="input-field"
                    placeholder="Ex.: CRM 123456"
                    required
                  />
                </div>
                <div>
                  <label class="label-text" for="doctor-active">Status</label>
                  <select id="doctor-active" v-model="doctorForm.isActive" class="select-field">
                    <option :value="true">Ativo</option>
                    <option :value="false">Inativo</option>
                  </select>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="label-text" for="doctor-unit">Unidade</label>
                  <select id="doctor-unit" v-model="doctorForm.unitId" class="select-field" required>
                    <option value="">Selecione uma unidade</option>
                    <option v-for="unit in visibleUnits" :key="unit.id" :value="String(unit.id)">
                      {{ unit.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="label-text" for="doctor-specialty">Especialidade</label>
                  <select id="doctor-specialty" v-model="doctorForm.specialtyId" class="select-field" required>
                    <option value="">Selecione uma especialidade</option>
                    <option v-for="specialty in specialties" :key="specialty.id" :value="String(specialty.id)">
                      {{ specialty.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="label-text" for="doctor-notes">ObservaÃ§Ãµes</label>
                <textarea
                  id="doctor-notes"
                  v-model.trim="doctorForm.notes"
                  class="input-field min-h-28"
                  placeholder="Ex.: Atende Ã  tarde, faz retorno em 15 dias."
                ></textarea>
              </div>

              <BaseButton
                type="submit"
                block
                :loading="loading.doctor"
                :disabled="!doctorForm.fullName || !doctorForm.crm || !doctorForm.unitId || !doctorForm.specialtyId"
              >
                Salvar mÃ©dico
              </BaseButton>
            </form>
          </BaseCard>

          <BaseCard
            title="MÃ©dicos cadastrados"
            subtitle="Veja quem estÃ¡ vinculado a cada unidade."
          >
            <div v-if="!visibleDoctors.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Nenhum mÃ©dico cadastrado.
            </div>
            <div v-else class="space-y-3">
              <article
                v-for="doctor in visibleDoctors"
                :key="doctor.id"
                class="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4"
              >
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 class="font-semibold text-slate-900">{{ doctor.full_name }}</h3>
                    <p class="mt-1 text-sm text-slate-600">
                      {{ doctor.specialty?.name }} - {{ doctor.unit?.name }}
                    </p>
                    <p class="mt-2 text-sm text-slate-500">
                      {{ doctor.crm }} Â· {{ doctor.notes || 'Sem observaÃ§Ãµes' }}
                    </p>
                  </div>
                  <StatusBadge :status="doctor.is_active ? 'disponivel' : 'indisponivel'" />
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <div v-if="activeSection === 'schedules'" class="grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <BaseCard
            title="Criar horario"
            subtitle="Associe unidade, especialidade, data e hora para abrir um novo slot."
          >
            <form class="space-y-4" @submit.prevent="handleCreateSchedule">
              <div>
                <label class="label-text" for="schedule-unit">Unidade</label>
                <select id="schedule-unit" v-model="scheduleForm.unitId" class="select-field" required>
                  <option value="">Selecione uma unidade</option>
                  <option v-for="unit in visibleUnits" :key="unit.id" :value="String(unit.id)">
                    {{ unit.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="label-text" for="schedule-specialty">Especialidade</label>
                <select
                  id="schedule-specialty"
                  v-model="scheduleForm.specialtyId"
                  class="select-field"
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  <option v-for="specialty in specialties" :key="specialty.id" :value="String(specialty.id)">
                    {{ specialty.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="label-text" for="schedule-doctor">MÃ©dico</label>
                <select id="schedule-doctor" v-model="scheduleForm.doctorId" class="select-field">
                  <option value="">Opcional: selecione um mÃ©dico</option>
                  <option
                    v-for="doctor in doctorsForSelectedUnit"
                    :key="doctor.id"
                    :value="String(doctor.id)"
                  >
                    {{ doctor.full_name }}
                  </option>
                </select>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="label-text" for="schedule-date">Data</label>
                  <input id="schedule-date" v-model="scheduleForm.date" type="date" class="input-field" required />
                </div>
                <div>
                  <label class="label-text" for="schedule-time">Hora</label>
                  <input id="schedule-time" v-model="scheduleForm.time" type="time" class="input-field" required />
                </div>
              </div>

              <BaseButton
                type="submit"
                block
                :loading="loading.schedule"
                :disabled="!scheduleForm.unitId || !scheduleForm.specialtyId || !scheduleForm.date || !scheduleForm.time"
              >
                Criar horario disponivel
              </BaseButton>
            </form>
          </BaseCard>

          <BaseCard
            title="Horarios futuros"
            subtitle="Visualize os slots criados e o status atual de cada um."
          >
            <div v-if="!upcomingSchedules.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Nenhum horario futuro encontrado.
            </div>
            <div v-else class="space-y-3">
              <article
                v-for="schedule in upcomingSchedules"
                :key="schedule.id"
                class="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4"
              >
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 class="font-semibold text-slate-900">{{ schedule.unit?.name }}</h3>
                    <p class="mt-1 text-sm text-slate-600">
                      {{ schedule.specialty?.name }} - {{ formatDateTime(schedule.starts_at) }}
                    </p>
                  </div>
                  <StatusBadge :status="schedule.status" />
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <BaseCard
          v-if="activeSection === 'appointments'"
          title="Fila de agendamentos"
          subtitle="Confirme ou cancele marcacoes diretamente pelo painel."
        >
          <div v-if="!appointments.length" class="rounded-3xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Nenhum agendamento cadastrado.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left">
              <thead>
                <tr class="text-xs uppercase tracking-[0.22em] text-slate-500">
                  <th class="px-4 py-3 font-semibold">Paciente</th>
                  <th class="px-4 py-3 font-semibold">Unidade</th>
                  <th class="px-4 py-3 font-semibold">Especialidade</th>
                  <th class="px-4 py-3 font-semibold">Data/hora</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold text-right">Acoes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-for="appointment in appointments" :key="appointment.id">
                  <td class="px-4 py-4">
                    <p class="font-semibold text-slate-900">
                      {{ appointment.patient?.full_name || appointment.patient?.email || 'Paciente sem nome' }}
                    </p>
                    <p class="text-sm text-slate-500">{{ appointment.patient?.email }}</p>
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-600">
                    {{ appointment.schedule?.unit?.name || '--' }}
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-600">
                    {{ appointment.schedule?.specialty?.name || '--' }}
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-600">
                    {{ formatDateTime(appointment.schedule?.starts_at) }}
                  </td>
                  <td class="px-4 py-4">
                    <StatusBadge :status="appointment.status" />
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end gap-2">
                      <BaseButton
                        size="sm"
                        variant="success"
                        :disabled="appointment.status === 'confirmado' || loading.appointments"
                        @click="handleUpdateAppointmentStatus(appointment, 'confirmado')"
                      >
                        Confirmar
                      </BaseButton>
                      <BaseButton
                        size="sm"
                        variant="danger"
                        :disabled="appointment.status === 'cancelado' || loading.appointments"
                        @click="handleUpdateAppointmentStatus(appointment, 'cancelado')"
                      >
                        Cancelar
                      </BaseButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { buildAddressFromViaCep, fetchAddressByCep, geocodeAddress } from '@/services/api'
import {
  createDoctor,
  createSchedule,
  createSpecialty,
  createUnit,
  fetchAppointments,
  fetchDoctors,
  fetchSchedules,
  fetchSpecialties,
  fetchUnits,
  uploadUnitImage,
  updateDoctor,
  updateAppointmentStatus,
  updateSchedule,
} from '@/services/scheduling'
import { buildUnitAddress, formatCep, formatDateTime, sanitizeCep } from '@/utils/formatters'

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    description: 'Resumo do funcionamento da rede.',
    short: 'DS',
  },
  {
    key: 'units',
    label: 'Unidades',
    description: 'Cadastro e consulta das unidades.',
    short: 'UB',
  },
  {
    key: 'specialties',
    label: 'Especialidades',
    description: 'Gestao do catalogo clinico.',
    short: 'ES',
  },
  {
    key: 'doctors',
    label: 'MÃ©dicos',
    description: 'Cadastro de profissionais por unidade.',
    short: 'MD',
  },
  {
    key: 'schedules',
    label: 'Horarios',
    description: 'Oferta de slots disponiveis.',
    short: 'HR',
  },
  {
    key: 'appointments',
    label: 'Agendamentos',
    description: 'Fila com status e acoes.',
    short: 'AG',
  },
]

const activeSection = ref('dashboard')
const units = ref([])
const specialties = ref([])
const doctors = ref([])
const schedules = ref([])
const appointments = ref([])
const cepLookupState = ref('Digite o CEP da unidade para buscar o endereco via ViaCEP.')
const cepLookupTimer = ref(null)
const unitImageFile = ref(null)
const unitImagePreview = ref('')
const { profile } = useAuth()

const unitForm = reactive({
  name: '',
  cep: '',
  street: '',
  residenceNumber: '',
  neighborhood: '',
  city: '',
  state: '',
})

const specialtyForm = reactive({
  name: '',
})

const doctorForm = reactive({
  fullName: '',
  crm: '',
  notes: '',
  unitId: '',
  specialtyId: '',
  isActive: true,
})

const scheduleForm = reactive({
  unitId: '',
  specialtyId: '',
  doctorId: '',
  date: '',
  time: '',
})

const loading = reactive({
  initial: true,
  unit: false,
  specialty: false,
  doctor: false,
  schedule: false,
  appointments: false,
})

const feedback = reactive({
  type: '',
  message: '',
})

const upcomingSchedules = computed(() =>
  schedules.value
    .filter((schedule) => new Date(schedule.starts_at).getTime() >= Date.now())
    .slice(0, 8),
)

const isAdmin = computed(() => profile.value?.role === 'admin')
const isManager = computed(() => profile.value?.role === 'gestor')
const managedUnitId = computed(() => profile.value?.unit_id ?? null)

const visibleUnits = computed(() => {
  if (isManager.value && managedUnitId.value) {
    return units.value.filter((unit) => String(unit.id) === String(managedUnitId.value))
  }

  return units.value
})

const visibleDoctors = computed(() => {
  if (isManager.value && managedUnitId.value) {
    return doctors.value.filter((doctor) => String(doctor.unit_id) === String(managedUnitId.value))
  }

  return doctors.value
})

const statCards = computed(() => [
  {
    label: 'Unidades',
    value: units.value.length,
    description: 'Locais cadastrados para a oferta de horarios e o atendimento dos pacientes.',
  },
  {
    label: 'Especialidades',
    value: specialties.value.length,
    description: 'Servicos clinicos disponiveis na rede.',
  },
  {
    label: 'Horarios livres',
    value: schedules.value.filter((schedule) => schedule.is_available).length,
    description: 'Slots atualmente liberados para reserva.',
  },
  {
    label: 'Pendencias',
    value: appointments.value.filter((appointment) => appointment.status === 'pendente').length,
    description: 'Agendamentos aguardando tratamento pela equipe.',
  },
])

const doctorsForSelectedUnit = computed(() => {
  return visibleDoctors.value.filter((doctor) => {
    const matchesUnit = !scheduleForm.unitId || String(doctor.unit_id) === String(scheduleForm.unitId)
    const matchesSpecialty =
      !scheduleForm.specialtyId || String(doctor.specialty_id) === String(scheduleForm.specialtyId)

    return matchesUnit && matchesSpecialty
  })
})

const cepLookupMessage = computed(() => cepLookupState.value)

onMounted(async () => {
  await loadAdminData()
})

onBeforeUnmount(() => {
  if (cepLookupTimer.value) {
    clearTimeout(cepLookupTimer.value)
  }

  if (unitImagePreview.value) {
    URL.revokeObjectURL(unitImagePreview.value)
  }
})

async function loadAdminData() {
  loading.initial = true
  resetFeedback()

  try {
    const [unitsData, specialtiesData, doctorsData, schedulesData, appointmentsData] = await Promise.all([
      fetchUnits(),
      fetchSpecialties(),
      fetchDoctors(),
      fetchSchedules(),
      fetchAppointments(),
    ])

    units.value = unitsData
    specialties.value = specialtiesData
    doctors.value = doctorsData ?? []
    schedules.value = schedulesData
    appointments.value = appointmentsData

    if (isManager.value && managedUnitId.value) {
      doctorForm.unitId = String(managedUnitId.value)
      scheduleForm.unitId = String(managedUnitId.value)
    }
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.initial = false
  }
}

function handleUnitCepInput(value) {
  unitForm.cep = formatCep(value)
  cepLookupState.value = 'Digite o CEP da unidade para buscar o endereco via ViaCEP.'

  const normalizedCep = sanitizeCep(value)

  if (cepLookupTimer.value) {
    clearTimeout(cepLookupTimer.value)
  }

  if (normalizedCep.length !== 8) {
    return
  }

  cepLookupState.value = 'Buscando endereco...'

  cepLookupTimer.value = window.setTimeout(async () => {
    try {
      const address = await fetchAddressByCep(normalizedCep)
      unitForm.street = address.logradouro ?? ''
      unitForm.neighborhood = address.bairro ?? ''
      unitForm.city = address.localidade ?? ''
      unitForm.state = address.uf ?? ''
      cepLookupState.value = `Endereco localizado: ${buildAddressFromViaCep(address)}.`
    } catch (error) {
      cepLookupState.value = mapDataError(error)
    }
  }, 450)
}

function handleUnitImageChange(event) {
  const file = event.target?.files?.[0] ?? null
  unitImageFile.value = file

  if (unitImagePreview.value) {
    URL.revokeObjectURL(unitImagePreview.value)
    unitImagePreview.value = ''
  }

  if (file) {
    unitImagePreview.value = URL.createObjectURL(file)
  }
}

async function handleCreateUnit() {
  loading.unit = true
  resetFeedback()

  try {
    if (!isAdmin.value) {
      throw new Error('Apenas o administrador pode cadastrar novas unidades.')
    }

    const addressLabel = [unitForm.street, unitForm.neighborhood, unitForm.city, unitForm.state, 'Brasil']
      .filter(Boolean)
      .join(', ')

    const coordinates = addressLabel ? await geocodeAddress(addressLabel) : null
    const uploadedImage = unitImageFile.value ? await uploadUnitImage(unitImageFile.value) : null

    if (!coordinates?.lat || !coordinates?.lng) {
      throw new Error('Nao foi possivel obter as coordenadas dessa unidade. Revise o CEP e o endereco antes de salvar.')
    }

    await createUnit({
      name: unitForm.name.trim(),
      cep: sanitizeCep(unitForm.cep),
      street: unitForm.street.trim(),
      residence_number: unitForm.residenceNumber.trim(),
      neighborhood: unitForm.neighborhood.trim(),
      city: unitForm.city.trim(),
      state: unitForm.state.trim().toUpperCase(),
      address_label: addressLabel,
      image_url: uploadedImage?.publicUrl ?? null,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    })

    units.value = await fetchUnits()
    resetUnitForm()
    setFeedback('success', 'Unidade salva com sucesso.')
    activeSection.value = 'units'
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.unit = false
  }
}

async function handleCreateSpecialty() {
  loading.specialty = true
  resetFeedback()

  try {
    await createSpecialty(specialtyForm.name.trim())
    specialties.value = await fetchSpecialties()
    specialtyForm.name = ''
    setFeedback('success', 'Especialidade salva com sucesso.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.specialty = false
  }
}

async function handleCreateDoctor() {
  loading.doctor = true
  resetFeedback()

  try {
    await createDoctor({
      full_name: doctorForm.fullName.trim(),
      crm: doctorForm.crm.trim(),
      notes: doctorForm.notes.trim(),
      unit_id: Number(doctorForm.unitId),
      specialty_id: Number(doctorForm.specialtyId),
      is_active: doctorForm.isActive,
    })

    doctors.value = await fetchDoctors()
    resetDoctorForm()
    setFeedback('success', 'MÃ©dico salvo com sucesso.')
    activeSection.value = 'doctors'
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.doctor = false
  }
}

async function handleCreateSchedule() {
  loading.schedule = true
  resetFeedback()

  try {
    const startsAt = new Date(`${scheduleForm.date}T${scheduleForm.time}:00`)

    if (Number.isNaN(startsAt.getTime())) {
      throw new Error('Informe uma data e hora validas.')
    }

    if (
      scheduleForm.doctorId &&
      !doctorsForSelectedUnit.value.some((doctor) => String(doctor.id) === String(scheduleForm.doctorId))
    ) {
      throw new Error('Selecione um mÃ©dico compatÃ­vel com a unidade e especialidade.')
    }

    await createSchedule({
      unit_id: Number(scheduleForm.unitId),
      specialty_id: Number(scheduleForm.specialtyId),
      doctor_id: scheduleForm.doctorId ? Number(scheduleForm.doctorId) : null,
      starts_at: startsAt.toISOString(),
    })

    schedules.value = await fetchSchedules()
    resetScheduleForm()
    setFeedback('success', 'Horario criado com sucesso.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.schedule = false
  }
}

async function handleUpdateAppointmentStatus(appointment, status) {
  loading.appointments = true
  resetFeedback()

  try {
    await updateAppointmentStatus(appointment.id, status)
    appointments.value = await fetchAppointments()
    schedules.value = await fetchSchedules()
    setFeedback(
      'success',
      status === 'confirmado'
        ? 'Agendamento confirmado com sucesso.'
        : 'Agendamento cancelado e horario devolvido para a fila.',
    )
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.appointments = false
  }
}

function resetUnitForm() {
  unitForm.name = ''
  unitForm.cep = ''
  unitForm.street = ''
  unitForm.residenceNumber = ''
  unitForm.neighborhood = ''
  unitForm.city = ''
  unitForm.state = ''
  unitImageFile.value = null
  if (unitImagePreview.value) {
    URL.revokeObjectURL(unitImagePreview.value)
  }
  unitImagePreview.value = ''
  cepLookupState.value = 'Digite o CEP da unidade para buscar o endereco via ViaCEP.'
}

function resetScheduleForm() {
  scheduleForm.unitId = ''
  scheduleForm.specialtyId = ''
  scheduleForm.doctorId = ''
  scheduleForm.date = ''
  scheduleForm.time = ''
}

function resetDoctorForm() {
  doctorForm.fullName = ''
  doctorForm.crm = ''
  doctorForm.notes = ''
  doctorForm.unitId = isManager.value && managedUnitId.value ? String(managedUnitId.value) : ''
  doctorForm.specialtyId = ''
  doctorForm.isActive = true
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

  if (message.includes('duplicate')) {
    return 'Esse registro ja existe no banco de dados.'
  }

  if (message.includes('coordenadas') || message.includes('imagem') || message.includes('administrador')) {
    return message
  }

  if (message.includes('Nao foi possivel')) {
    return message
  }

  return 'Nao foi possivel concluir a operacao no Supabase.'
}
</script>
