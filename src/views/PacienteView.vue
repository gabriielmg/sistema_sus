<template>
  <div class="mx-auto max-w-2xl space-y-5 pb-16">

    <!-- ── Feedback ── -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="feedback.message"
        role="alert"
        class="flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold"
        :class="feedback.type === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800'"
      >
        <svg v-if="feedback.type === 'error'" class="h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
        <svg v-else class="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ feedback.message }}
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════
         STEP 1 — UNIDADE
    ═══════════════════════════════════════════════════ -->
    <section v-if="step === 'unit'">
      <!-- Título -->
      <div class="mb-4">
        <h1 :class="['text-xl font-black', isDark ? 'text-white' : 'text-slate-900']">Onde deseja ser atendido?</h1>
        <p :class="['text-sm mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">Escolha a unidade de saúde</p>
      </div>

      <!-- Loading -->
      <div v-if="loading.units" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
        <p :class="['text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500']">Buscando unidades...</p>
      </div>

      <!-- Vazio -->
      <div v-else-if="!orderedUnits.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <p :class="['text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-600']">Nenhuma unidade disponível.</p>
      </div>

      <!-- Lista de unidades -->
      <div v-else class="space-y-2">
        <button
          v-for="unit in orderedUnits"
          :key="unit.id"
          type="button"
          class="group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-150 focus:outline-none"
          :class="isDark
            ? 'border-slate-800 bg-slate-900/60 hover:border-susBlue/50 hover:bg-slate-800/60'
            : 'border-slate-200 bg-white hover:border-susBlue/40 hover:shadow-md'"
          @click="handleSelectUnit(unit)"
        >
          <!-- Ícone -->
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            :class="isDark ? 'bg-slate-800' : 'bg-slate-100'">
            <svg :class="['h-5 w-5', isDark ? 'text-slate-400' : 'text-slate-500']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <p :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ unit.name }}</p>
            <p :class="['mt-0.5 text-xs truncate', isDark ? 'text-slate-400' : 'text-slate-500']">{{ unit.address }}</p>
          </div>

          <svg class="h-4 w-4 shrink-0 opacity-30 transition-opacity group-hover:opacity-70"
            :class="isDark ? 'text-white' : 'text-slate-700'"
            fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         STEP 2 — ESPECIALIDADE
    ═══════════════════════════════════════════════════ -->
    <section v-else-if="step === 'specialty'">
      <!-- Voltar + contexto -->
      <button type="button" class="mb-4 flex items-center gap-2 text-sm font-semibold transition-colors"
        :class="isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'"
        @click="goToStep('unit')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {{ selectedUnit?.name }}
      </button>

      <div class="mb-4">
        <h1 :class="['text-xl font-black', isDark ? 'text-white' : 'text-slate-900']">Qual especialidade?</h1>
        <p :class="['text-sm mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">Selecione o tipo de atendimento</p>
      </div>

      <div v-if="!specialtyOptions.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 text-center"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <p :class="['text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-600']">Nenhuma especialidade disponível nesta unidade.</p>
      </div>

      <div v-else class="space-y-2">
        <button
          v-for="specialty in specialtyOptions"
          :key="specialty.id"
          type="button"
          class="group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-150 focus:outline-none"
          :class="isDark
            ? 'border-slate-800 bg-slate-900/60 hover:border-susGreen/50 hover:bg-slate-800/60'
            : 'border-slate-200 bg-white hover:border-susGreen/40 hover:shadow-md'"
          @click="handleSelectSpecialty(specialty)"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            :class="isDark ? 'bg-slate-800' : 'bg-slate-100'">
            <svg :class="['h-5 w-5', isDark ? 'text-slate-400' : 'text-slate-500']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <p :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ specialty.name }}</p>
          </div>

          <svg class="h-4 w-4 shrink-0 opacity-30 transition-opacity group-hover:opacity-70"
            :class="isDark ? 'text-white' : 'text-slate-700'"
            fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         STEP 3 — HORÁRIO
    ═══════════════════════════════════════════════════ -->
    <section v-else-if="step === 'schedule'">
      <!-- Voltar + contexto -->
      <button type="button" class="mb-4 flex items-center gap-2 text-sm font-semibold transition-colors"
        :class="isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'"
        @click="goToStep('specialty')"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {{ selectedUnit?.name }} · {{ selectedSpecialty?.name }}
      </button>

      <div class="mb-4">
        <h1 :class="['text-xl font-black', isDark ? 'text-white' : 'text-slate-900']">Escolha o horário</h1>
        <p :class="['text-sm mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">Selecione a data e hora disponível</p>
      </div>

      <!-- Loading -->
      <div v-if="loading.schedules" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12"
        :class="isDark ? 'border-slate-800' : 'border-slate-200'">
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
        <p :class="['text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500']">Buscando horários...</p>
      </div>

      <!-- Sem vagas -->
      <div v-else-if="!displaySchedules.length" class="space-y-3">
        <div class="flex flex-col items-center rounded-2xl border-2 border-amber-200 bg-amber-50 py-10 px-4 text-center"
          :class="isDark ? 'border-amber-800/40 bg-amber-900/20' : ''">
          <svg class="h-9 w-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-3 font-bold text-amber-800" :class="isDark ? 'text-amber-300' : ''">Sem vagas no momento</p>
          <p class="mt-1 text-sm text-amber-700" :class="isDark ? 'text-amber-400' : ''">Entre na fila e avisaremos quando surgir uma vaga.</p>
        </div>
        <button type="button"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-100 py-3.5 text-sm font-bold text-amber-900 transition-colors hover:bg-amber-200"
          :class="isDark ? 'border-amber-800/40 bg-amber-900/30 text-amber-200 hover:bg-amber-900/50' : ''"
          @click="handleJoinWaitlist"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Entrar na fila de espera
        </button>
      </div>

      <!-- Lista de horários -->
      <div v-else class="space-y-2">
        <button
          v-for="schedule in displaySchedules.slice(0, 9)"
          :key="schedule.id"
          type="button"
          class="flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150 focus:outline-none"
          :class="[
            String(schedule.id) === String(selectedScheduleId)
              ? (isDark ? 'border-susBlue bg-susBlue/15 ring-1 ring-susBlue/40' : 'border-susBlue bg-blue-50 ring-1 ring-susBlue/30')
              : (isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'),
          ]"
          @click="selectedScheduleId = String(schedule.id)"
        >
          <!-- Indicador de seleção -->
          <div
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
            :class="String(schedule.id) === String(selectedScheduleId)
              ? 'border-susBlue bg-susBlue'
              : (isDark ? 'border-slate-700' : 'border-slate-300')"
          >
            <svg v-if="String(schedule.id) === String(selectedScheduleId)" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <p :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">
              {{ formatDateShort(schedule.starts_at) }}
            </p>
            <p :class="['text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">
              {{ formatTimeOnly(schedule.starts_at) }} · {{ schedule.doctor?.full_name || 'Profissional da unidade' }}
            </p>
          </div>

          <span class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
            :class="isDark ? 'bg-emerald-900/40 text-emerald-300' : ''">
            Disponível
          </span>
        </button>
      </div>

      <!-- Botão confirmar -->
      <div v-if="displaySchedules.length" class="mt-5">
        <button type="button"
          class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-susGreen to-[#18b686] py-4 text-sm font-bold text-white shadow-lg shadow-susGreen/25 transition-all hover:shadow-susGreen/40 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!selectedScheduleId || !user || loading.booking"
          @click="handleCreateOrRescheduleAppointment"
        >
          <svg v-if="loading.booking" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {{ loading.booking ? 'Agendando...' : 'Confirmar Agendamento' }}
        </button>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         STEP 4 — SUCESSO
    ═══════════════════════════════════════════════════ -->
    <section v-else class="overflow-hidden rounded-3xl border"
      :class="isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white shadow-xl shadow-slate-200/40'">
      <div class="flex flex-col items-center justify-center px-6 py-16 text-center">

        <div class="relative flex h-20 w-20 items-center justify-center">
          <div class="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
          <div class="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-susGreen to-emerald-600 shadow-xl shadow-emerald-500/30">
            <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <h2 :class="['mt-7 text-2xl font-black', isDark ? 'text-white' : 'text-slate-900']">
          Consulta agendada!
        </h2>
        <p :class="['mt-3 max-w-xs text-sm leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500']">
          {{ successMessage }}
        </p>

        <div class="mt-8 flex w-full max-w-xs flex-col gap-3">
          <button type="button"
            class="rounded-xl bg-gradient-to-r from-susBlue to-[#2b78ef] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
            @click="showAppointments = true; step = 'unit'"
          >
            Ver meus agendamentos
          </button>
          <button type="button"
            :class="['rounded-xl py-3.5 text-sm font-semibold transition-all', isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200']"
            @click="resetFlow"
          >
            Novo agendamento
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         MEUS AGENDAMENTOS
    ═══════════════════════════════════════════════════ -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
    >
      <section v-if="showAppointments && step === 'unit'">
        <div class="mb-3 flex items-center justify-between">
          <h2 :class="['text-lg font-black', isDark ? 'text-white' : 'text-slate-900']">Meus agendamentos</h2>
          <button type="button" class="text-xs font-semibold"
            :class="isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'"
            @click="showAppointments = false"
          >Ocultar</button>
        </div>

        <div v-if="loading.appointments" class="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10"
          :class="isDark ? 'border-slate-800' : 'border-slate-200'">
          <div class="h-5 w-5 animate-spin rounded-full border-2 border-susBlue border-r-transparent" />
          <p :class="['text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500']">Carregando...</p>
        </div>

        <div v-else-if="!myAppointments.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 text-center"
          :class="isDark ? 'border-slate-800' : 'border-slate-200'">
          <p :class="['text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-600']">Nenhuma consulta agendada ainda.</p>
        </div>

        <div v-else class="space-y-2">
          <article
            v-for="appointment in myAppointments"
            :key="appointment.id"
            class="rounded-2xl border px-4 py-4"
            :class="isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'"
          >
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <p :class="['font-bold truncate', isDark ? 'text-white' : 'text-slate-900']">
                  {{ appointment.schedule?.specialty?.name || 'Especialidade não informada' }}
                </p>
                <p :class="['text-xs truncate mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500']">
                  {{ appointment.schedule?.unit?.name || 'Unidade não informada' }} · {{ formatDateTime(appointment.schedule?.starts_at) }}
                </p>
              </div>
              <StatusBadge :status="appointment.status" />
            </div>

            <!-- Ações do paciente -->
            <div
              v-if="isConfirmable(appointment) || isCancellable(appointment)"
              class="mt-3 flex flex-wrap gap-2 border-t pt-3"
              :class="isDark ? 'border-slate-800' : 'border-slate-100'"
            >
              <button
                v-if="isConfirmable(appointment)"
                type="button"
                class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all"
                :class="isDark ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
                @click="handleConfirmPresence(appointment)"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Confirmar presença
              </button>
              <button
                v-if="isCancellable(appointment)"
                type="button"
                class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all"
                :class="isDark ? 'bg-rose-900/20 text-rose-400 hover:bg-rose-900/40' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'"
                @click="openCancelModal(appointment)"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
            <p
              v-else-if="['pendente', 'confirmado'].includes(appointment.status) && hoursUntil(appointment.schedule?.starts_at) > 0"
              class="mt-2 text-xs"
              :class="isDark ? 'text-amber-400' : 'text-amber-600'"
            >
              Cancelamento indisponível — menos de 24h para a consulta.
            </p>
          </article>
        </div>
      </section>
    </Transition>

    <!-- ── Modal: Cancelar consulta ── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="cancelModal.show"
          class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCancelModal" />
          <div
            class="relative w-full max-w-md rounded-3xl p-6 shadow-2xl"
            :class="isDark ? 'border border-slate-800 bg-slate-900' : 'bg-white'"
          >
            <div class="mb-4 flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                <svg class="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 :class="['font-black', isDark ? 'text-white' : 'text-slate-900']">Cancelar consulta</h3>
                <p class="text-xs text-slate-500">Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <div
              v-if="cancelModal.appointment"
              class="mb-4 rounded-2xl p-4"
              :class="isDark ? 'bg-slate-800' : 'bg-slate-50'"
            >
              <p :class="['text-sm font-bold', isDark ? 'text-white' : 'text-slate-900']">
                {{ cancelModal.appointment.schedule?.specialty?.name }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500">
                {{ cancelModal.appointment.schedule?.unit?.name }} · {{ formatDateTime(cancelModal.appointment.schedule?.starts_at) }}
              </p>
            </div>

            <div class="mb-5 space-y-1.5">
              <label :class="['block text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500']">
                Motivo <span class="font-normal opacity-60">(opcional)</span>
              </label>
              <textarea
                v-model="cancelModal.reason"
                rows="3"
                placeholder="Ex: Meu quadro clínico melhorou, terei atendimento particular..."
                class="block w-full resize-none rounded-2xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                :class="isDark
                  ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500'
                  : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400'"
              />
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 rounded-2xl py-3.5 text-sm font-bold transition-all"
                :class="isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                :disabled="cancelModal.loading"
                @click="closeCancelModal"
              >
                Voltar
              </button>
              <button
                type="button"
                class="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-rose-700 disabled:opacity-50"
                :disabled="cancelModal.loading"
                @click="confirmCancel"
              >
                <svg v-if="cancelModal.loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-90" fill="currentColor" d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4Z" />
                </svg>
                {{ cancelModal.loading ? 'Cancelando...' : 'Confirmar cancelamento' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Botão flutuante "Meus agendamentos" (só no step unit) -->
    <div v-if="step === 'unit' && !showAppointments" class="flex justify-center pt-2">
      <button type="button"
        class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
        :class="isDark ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'"
        @click="showAppointments = true"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        Ver meus agendamentos
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import {
  cancelAppointmentWithReason,
  confirmPatientPresence,
  createAppointment,
  fetchAppointmentsByPatient,
  fetchAvailableSchedulesByUnitAndSpecialty,
  fetchSpecialties,
  fetchUnits,
} from '@/services/scheduling'
import {
  addWaitlistEntry,
  createAppointmentNotifications,
  loadWaitlistEntries,
  pushNotifications,
} from '@/services/patientExperience'
import { buildUnitAddress, formatDateTime } from '@/utils/formatters'

const { user, profile } = useAuth()
const { isDark } = useTheme()

const step = ref('unit')
const showAppointments = ref(false)
const units = ref([])
const specialties = ref([])
const selectedUnitId = ref('')
const selectedSpecialtyId = ref('')
const selectedScheduleId = ref('')
const unitSchedulesById = ref({})
const myAppointments = ref([])
const successAppointment = ref(null)

const loading = reactive({ units: true, schedules: false, booking: false, appointments: false })
const feedback = reactive({ type: '', message: '' })
const cancelModal = reactive({ show: false, appointment: null, reason: '', loading: false })

const specialtyOptions = computed(() => specialties.value)

const selectedUnit = computed(() =>
  orderedUnits.value.find((item) => String(item.id) === String(selectedUnitId.value)) ?? null,
)
const selectedSpecialty = computed(() =>
  specialtyOptions.value.find((item) => String(item.id) === String(selectedSpecialtyId.value)) ?? null,
)
const displaySchedules = computed(() =>
  selectedUnit.value ? unitSchedulesById.value[String(selectedUnit.value.id)] ?? [] : [],
)
const selectedSchedule = computed(() =>
  displaySchedules.value.find((item) => String(item.id) === String(selectedScheduleId.value)) ?? null,
)

const successMessage = computed(() => {
  if (!successAppointment.value) return 'Agendamento realizado com sucesso!'
  const unitName = successAppointment.value.schedule?.unit?.name || selectedUnit.value?.name || 'a unidade'
  const specialtyName = successAppointment.value.schedule?.specialty?.name || selectedSpecialty.value?.name || 'a consulta'
  const startsAt = successAppointment.value.schedule?.starts_at || selectedSchedule.value?.starts_at || null
  return `${specialtyName} em ${unitName} — ${formatDateTime(startsAt)}.`
})

const orderedUnits = computed(() =>
  [...units.value]
    .map((unit) => ({
      ...unit,
      address: unit.address_label || buildUnitAddress(unit) || 'Endereço indisponível',
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
)

function formatDateShort(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', timeZone: 'America/Fortaleza',
  })
}

function formatTimeOnly(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza',
  })
}

onMounted(async () => { await loadBootstrapData() })

watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) { myAppointments.value = []; return }
    loading.appointments = true
    try { myAppointments.value = await fetchAppointmentsByPatient(userId) }
    catch (error) { setFeedback('error', mapDataError(error)) }
    finally { loading.appointments = false }
  },
  { immediate: true },
)

watch(
  selectedSpecialtyId,
  async (specialtyId) => {
    selectedScheduleId.value = ''
    if (!specialtyId || !units.value.length) { unitSchedulesById.value = {}; return }
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
    } finally { loading.schedules = false }
  },
  { immediate: true },
)

async function loadBootstrapData() {
  loading.units = true
  try {
    const [unitsData, specialtiesData] = await Promise.all([fetchUnits(), fetchSpecialties()])
    units.value = unitsData
    specialties.value = specialtiesData
  } catch (error) { setFeedback('error', mapDataError(error)) }
  finally { loading.units = false }
}

function handleSelectUnit(unit) {
  selectedUnitId.value = String(unit.id)
  selectedScheduleId.value = ''
  resetFeedback()
  goToStep('specialty')
}

function handleSelectSpecialty(specialty) {
  selectedSpecialtyId.value = String(specialty.id)
  selectedScheduleId.value = ''
  resetFeedback()
  goToStep('schedule')
}

function goToStep(targetStep) {
  if (targetStep === 'specialty' && !selectedUnit.value) return
  if (targetStep === 'schedule' && (!selectedUnit.value || !selectedSpecialty.value)) return
  step.value = targetStep
  resetFeedback()
}

async function handleCreateOrRescheduleAppointment() {
  if (!user.value?.id || !selectedScheduleId.value) return
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
      pushNotifications(createAppointmentNotifications({
        appointment,
        patientName: profile.value?.full_name || '',
        unitName: selectedUnit.value.name,
        specialtyName: selectedSpecialty.value.name,
        doctorName: selectedSchedule.value.doctor?.full_name || 'Profissional da unidade',
      }))
    }
    if (selectedUnit.value && selectedSpecialtyId.value) {
      unitSchedulesById.value[String(selectedUnit.value.id)] =
        await fetchAvailableSchedulesByUnitAndSpecialty(selectedUnit.value.id, selectedSpecialtyId.value)
    }
    loadWaitlistEntries()
    step.value = 'success'
  } catch (error) { setFeedback('error', mapDataError(error)) }
  finally { loading.booking = false }
}

function handleJoinWaitlist() {
  if (!selectedSpecialty.value) return
  addWaitlistEntry({
    patientId: user.value?.id ?? null,
    specialtyId: selectedSpecialty.value.id,
    specialtyName: selectedSpecialty.value.name,
    unitId: selectedUnit.value?.id ?? null,
    unitName: selectedUnit.value?.name || '',
  })
  setFeedback('success', 'Você entrou na fila de espera. Avisaremos quando surgir vaga.')
}

const CANCEL_MIN_HOURS = 24

function hoursUntil(isoString) {
  if (!isoString) return 0
  return (new Date(isoString).getTime() - Date.now()) / 3600000
}

function isCancellable(appointment) {
  return (
    ['pendente', 'confirmado'].includes(appointment.status) &&
    hoursUntil(appointment.schedule?.starts_at) > CANCEL_MIN_HOURS
  )
}

function isConfirmable(appointment) {
  return appointment.status === 'pendente' && hoursUntil(appointment.schedule?.starts_at) > 0
}

function openCancelModal(appointment) {
  cancelModal.appointment = appointment
  cancelModal.reason = ''
  cancelModal.show = true
}

function closeCancelModal() {
  if (cancelModal.loading) return
  cancelModal.show = false
  cancelModal.appointment = null
  cancelModal.reason = ''
}

async function confirmCancel() {
  if (!cancelModal.appointment || cancelModal.loading) return
  cancelModal.loading = true
  try {
    await cancelAppointmentWithReason(cancelModal.appointment.id, cancelModal.reason)
    const idx = myAppointments.value.findIndex((a) => a.id === cancelModal.appointment.id)
    if (idx !== -1) myAppointments.value[idx] = { ...myAppointments.value[idx], status: 'cancelado' }
    if (selectedUnit.value && selectedSpecialtyId.value) {
      unitSchedulesById.value[String(selectedUnit.value.id)] =
        await fetchAvailableSchedulesByUnitAndSpecialty(selectedUnit.value.id, selectedSpecialtyId.value)
    }
    closeCancelModal()
    setFeedback('success', 'Consulta cancelada com sucesso.')
  } catch {
    setFeedback('error', 'Não foi possível cancelar. Tente novamente.')
  } finally {
    cancelModal.loading = false
  }
}

async function handleConfirmPresence(appointment) {
  if (!appointment?.id) return
  try {
    await confirmPatientPresence(appointment.id)
    const idx = myAppointments.value.findIndex((a) => a.id === appointment.id)
    if (idx !== -1) myAppointments.value[idx] = { ...myAppointments.value[idx], status: 'confirmado' }
    setFeedback('success', 'Presença confirmada! Te esperamos.')
  } catch {
    setFeedback('error', 'Não foi possível confirmar presença. Tente novamente.')
  }
}

function resetFlow() {
  step.value = 'unit'
  selectedUnitId.value = ''
  selectedSpecialtyId.value = ''
  selectedScheduleId.value = ''
  successAppointment.value = null
  resetFeedback()
}

function setFeedback(type, message) { feedback.type = type; feedback.message = message }
function resetFeedback() { feedback.type = ''; feedback.message = '' }

function mapDataError(error) {
  const message = error?.message ?? ''
  if (message.includes('Invalid') || message.includes('duplicate')) return 'Não foi possível concluir. Tente outro horário.'
  if (message.includes('row-level security')) return 'Sem permissão. Contate o administrador.'
  return message || 'Não foi possível concluir a operação.'
}
</script>
