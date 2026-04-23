<template>
  <div class="mx-auto max-w-5xl space-y-6 pb-12 sm:p-4">
    
    <section class="overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-2xl">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-susGreen-soft text-susGreen-dark">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            </span>
            <p class="text-xs font-bold uppercase tracking-widest text-susGreen-dark">Agendamento simples</p>
          </div>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Marque sua consulta por etapas.
          </h1>
          <p class="mt-3 text-base leading-relaxed text-slate-600">
            Primeiro a unidade, depois o tipo de atendimento, depois o horário. No final você recebe a confirmação.
          </p>
        </div>

        <div class="shrink-0 pt-2 sm:pt-0">
          <BaseButton variant="secondary" size="sm" class="rounded-xl bg-slate-50 text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100" @click="showAppointments = !showAppointments">
            <span class="flex items-center gap-2">
              <svg v-if="!showAppointments" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              {{ showAppointments ? 'Ocultar agendamentos' : 'Ver agendamentos' }}
            </span>
          </BaseButton>
        </div>
      </div>

      <div class="mt-8">
        <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:gap-4 sm:pb-0">
          <div
            v-for="(item, index) in stepItems"
            :key="item.key"
            class="relative flex min-w-[120px] flex-1 flex-col justify-center rounded-2xl border p-3 pl-4 transition-all duration-300"
            :class="[
              currentStepIndex === index ? 'border-susBlue bg-susBlue-soft/50 ring-1 ring-susBlue/20' : '',
              currentStepIndex > index ? 'border-emerald-200 bg-emerald-50/50' : '',
              currentStepIndex < index ? 'border-slate-100 bg-slate-50/50 opacity-70' : ''
            ]"
          >
            <div class="flex items-center gap-2">
              <span 
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                :class="[
                  currentStepIndex === index ? 'bg-susBlue text-white' : '',
                  currentStepIndex > index ? 'bg-emerald-500 text-white' : '',
                  currentStepIndex < index ? 'bg-slate-200 text-slate-500' : ''
                ]"
              >
                <svg v-if="currentStepIndex > index" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <span v-else>{{ index + 1 }}</span>
              </span>
              <p class="text-xs font-bold uppercase tracking-wider" 
                :class="currentStepIndex === index ? 'text-susBlue-dark' : (currentStepIndex > index ? 'text-emerald-700' : 'text-slate-500')">
                {{ item.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="feedback.message"
      role="alert"
      aria-live="polite"
      class="flex items-start gap-3 rounded-2xl border p-4 text-sm transition-all animate-in fade-in slide-in-from-top-2"
      :class="feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'"
    >
      <svg v-if="feedback.type === 'error'" class="mt-0.5 h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <svg v-else class="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p class="font-medium leading-relaxed">{{ feedback.message }}</p>
    </div>

    <BaseCard v-if="step === 'unit'" title="Escolha uma unidade" subtitle="Selecione a unidade onde deseja ser atendido." class="rounded-[28px] border-slate-100 shadow-xl shadow-slate-200/40">
      <div class="space-y-6">
        
        <div v-if="loading.units" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-susBlue border-r-transparent"></div>
          <p class="mt-4 text-sm font-medium text-slate-500">Buscando unidades de saúde próximas...</p>
        </div>
        
        <div v-else-if="!orderedUnits.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <svg class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
          <p class="mt-4 text-sm font-medium text-slate-600">Nenhuma unidade disponível no momento.</p>
        </div>
        
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <button
            v-for="unit in orderedUnits.slice(0, 6)"
            :key="unit.id"
            type="button"
            class="group relative flex w-full flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-susBlue/20"
            :class="String(unit.id) === String(selectedUnitId) ? 'border-susBlue bg-susBlue-soft/30 shadow-md ring-1 ring-susBlue' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-susBlue/40 hover:shadow-lg hover:shadow-slate-200/50'"
            @click="handleSelectUnit(unit)"
          >
            <div class="flex items-start gap-4">
              <div v-if="unit.image_url" class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-transform group-hover:scale-105">
                <img :src="unit.image_url" :alt="`Foto da unidade ${unit.name}`" class="h-full w-full object-cover" />
              </div>
              <div v-else class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              
              <div class="flex-1">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-bold text-slate-900 line-clamp-2">{{ unit.name }}</h3>
                </div>
                <p class="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-2">{{ unit.address }}</p>
                <p class="mt-2 text-xs font-semibold text-emerald-700">{{ unit.todayHoursLabel }}</p>
              </div>
            </div>
            
            <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {{ unit.regionLabel }}
              </span>
              <div class="text-right text-xs">
                <span class="block text-slate-500">Próxima vaga:</span>
                <span class="font-bold text-slate-900">{{ unit.nextSlotLabel }}</span>
              </div>
            </div>
          </button>
        </div>

        <div v-if="selectedUnit" class="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Dados da unidade</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">{{ selectedUnit.name }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ selectedUnit.address }}</p>
              <p class="mt-2 inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                CEP {{ formatCep(selectedUnit.cep) }}
              </p>
            </div>
            <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Horario de hoje</p>
              <p class="mt-2 text-sm font-semibold text-emerald-700">{{ selectedUnit.todayHoursLabel }}</p>
            </div>
          </div>

          <div v-if="selectedUnitOperatingHours.length" class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <div v-for="hour in selectedUnitOperatingHours" :key="hour.weekday" class="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ getWeekdayLabel(hour.weekday) }}</p>
              <p class="mt-1 text-sm font-medium text-slate-700">{{ formatOperatingHourRange(hour) }}</p>
            </div>
          </div>
          <div v-else class="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
            Horarios de funcionamento ainda nao informados pela unidade.
          </div>
        </div>

        <div class="flex justify-end border-t border-slate-100 pt-6">
          <BaseButton size="lg" class="rounded-xl px-8 shadow-lg shadow-susBlue/20 transition-transform active:scale-95" :disabled="!selectedUnit" @click="goToStep('specialty')">
            Confirmar Unidade
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else-if="step === 'specialty'" title="Escolha o tipo de atendimento" subtitle="Selecione a especialidade para ver os horários." class="rounded-[28px] border-slate-100 shadow-xl shadow-slate-200/40">
      <div class="space-y-6">
        
        <div class="flex items-center gap-4 rounded-2xl border border-susBlue/20 bg-susBlue-soft/30 p-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-susBlue shadow-sm">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Unidade escolhida</p>
            <p class="text-base font-bold text-slate-900">{{ selectedUnit?.name || 'Nenhuma unidade selecionada' }}</p>
          </div>
        </div>

        <div v-if="!specialtyOptions.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <p class="text-sm font-medium text-slate-600">Nenhuma especialidade cadastrada para esta unidade ainda.</p>
        </div>
        
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <button
            v-for="specialty in specialtyOptions"
            :key="specialty.id"
            type="button"
            class="group flex min-h-[6rem] flex-col justify-center rounded-2xl border p-5 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-susGreen/20"
            :class="String(specialty.id) === String(selectedSpecialtyId) ? 'border-susGreen bg-susGreen-soft/50 shadow-md ring-1 ring-susGreen' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-susGreen/40 hover:shadow-lg hover:shadow-slate-200/50'"
            @click="handleSelectSpecialty(specialty)"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-susGreen group-hover:text-white" :class="{ 'bg-susGreen text-white': String(specialty.id) === String(selectedSpecialtyId) }">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </span>
              <p class="text-lg font-bold text-slate-900">{{ specialty.name }}</p>
            </div>
            <p class="mt-3 text-sm text-slate-500">Toque para ver os horários disponíveis.</p>
          </button>
        </div>

        <div class="flex items-center justify-between border-t border-slate-100 pt-6">
          <BaseButton variant="ghost" size="lg" class="rounded-xl text-slate-600 hover:bg-slate-100" @click="goToStep('unit')">Voltar</BaseButton>
          <BaseButton size="lg" class="rounded-xl px-8 shadow-lg shadow-susBlue/20 transition-transform active:scale-95" :disabled="!selectedSpecialty" @click="goToStep('schedule')">Ver Horários</BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else-if="step === 'schedule'" title="Escolha data e horário" subtitle="Veja os horários livres e confirme seu atendimento." class="rounded-[28px] border-slate-100 shadow-xl shadow-slate-200/40">
      <div class="space-y-6">
        
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <p class="text-sm font-semibold text-slate-900 line-clamp-1">{{ selectedUnit?.name }}</p>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            <p class="text-sm font-semibold text-slate-900 line-clamp-1">{{ selectedSpecialty?.name || 'Especialidade' }}</p>
          </div>
        </div>

        <div v-if="loading.schedules" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-susBlue border-r-transparent"></div>
          <p class="mt-4 text-sm font-medium text-slate-500">Buscando agenda dos profissionais...</p>
        </div>
        
        <div v-else-if="!displaySchedules.length" class="space-y-4">
          <div class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 py-10 px-4 text-center">
            <svg class="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p class="mt-3 text-sm font-semibold text-amber-800">Não há horários disponíveis no momento.</p>
            <p class="mt-1 text-sm text-amber-700">Mas não se preocupe, você pode entrar na fila de espera.</p>
          </div>
          <BaseButton block size="lg" class="rounded-xl border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 shadow-none" :disabled="!selectedUnit || !selectedSpecialty" @click="handleJoinWaitlist">
            <span class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Entrar na fila de espera
            </span>
          </BaseButton>
        </div>
        
        <div v-else class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="schedule in displaySchedules.slice(0, 8)"
            :key="schedule.id"
            type="button"
            class="group flex w-full flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-susBlue/20"
            :class="String(schedule.id) === String(selectedScheduleId) ? 'border-susBlue bg-susBlue-soft/30 shadow-md ring-1 ring-susBlue' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-susBlue/40 hover:shadow-lg hover:shadow-slate-200/50'"
            @click="selectedScheduleId = String(schedule.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors group-hover:bg-susBlue group-hover:text-white" :class="{ 'bg-susBlue text-white': String(schedule.id) === String(selectedScheduleId) }">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900">{{ formatDateTime(schedule.starts_at) }}</h3>
                  <p class="mt-0.5 text-sm font-medium text-slate-500">{{ schedule.doctor?.full_name || 'Profissional da unidade' }}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 border-t border-slate-100 pt-3">
              <StatusBadge status="disponivel" />
            </div>
          </button>
        </div>

        <div class="flex items-center justify-between border-t border-slate-100 pt-6">
          <BaseButton variant="ghost" size="lg" class="rounded-xl text-slate-600 hover:bg-slate-100" @click="goToStep('specialty')">Voltar</BaseButton>
          <BaseButton
            size="lg"
            variant="success"
            class="rounded-xl px-8 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
            :loading="loading.booking"
            :disabled="!selectedScheduleId || !user"
            @click="handleCreateOrRescheduleAppointment"
          >
            Confirmar Agendamento
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard v-else title="" subtitle="" class="overflow-hidden rounded-[28px] border-slate-100 shadow-xl shadow-slate-200/40">
      <div class="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
        
        <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <div class="absolute h-full w-full animate-ping rounded-full bg-emerald-100 opacity-75"></div>
          <div class="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <svg class="h-8 w-8 animate-[spin_0.5s_ease-out]" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <h2 class="mt-8 text-3xl font-bold tracking-tight text-slate-900">Agendamento concluído!</h2>
        <p class="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
          {{ successMessage }}
        </p>
        
        <div class="mt-8 flex w-full max-w-sm flex-col gap-3">
          <BaseButton size="lg" class="w-full rounded-xl py-4 text-base shadow-lg shadow-susBlue/20" @click="showAppointments = true">
            Ver meus agendamentos
          </BaseButton>
          <BaseButton variant="ghost" size="lg" class="w-full rounded-xl py-4 text-base text-slate-600 hover:bg-slate-100" @click="resetFlow">
            Fazer novo agendamento
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <div v-if="showAppointments" class="animate-in fade-in slide-in-from-bottom-4">
      <BaseCard title="Meus agendamentos" subtitle="Aqui você acompanha as consultas já marcadas." class="rounded-[28px] border-slate-100 shadow-xl shadow-slate-200/40">
        
        <div v-if="loading.appointments" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-susBlue border-r-transparent"></div>
          <p class="mt-4 text-sm font-medium text-slate-500">Carregando seus agendamentos...</p>
        </div>
        
        <div v-else-if="!myAppointments.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
          <svg class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          <p class="mt-4 text-sm font-medium text-slate-600">Nenhuma consulta agendada ainda.</p>
        </div>
        
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <article
            v-for="appointment in myAppointments"
            :key="appointment.id"
            class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-bold text-slate-900 line-clamp-1">{{ appointment.schedule?.unit?.name || 'Unidade não informada' }}</h3>
                <StatusBadge :status="appointment.status" />
              </div>
              <p class="mt-2 text-sm font-medium text-susBlue-dark">{{ appointment.schedule?.specialty?.name || 'Especialidade não informada' }}</p>
            </div>
            
            <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-slate-700">
              <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ formatDateTime(appointment.schedule?.starts_at) }}
            </div>
          </article>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useAuth } from '@/composables/useAuth'
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
  loadWaitlistEntries,
  pushNotifications,
} from '@/services/patientExperience'
import {
  buildUnitAddress,
  formatCep,
  formatDateTime,
  formatOperatingHourRange,
  formatTodayOperatingHours,
  getWeekdayLabel,
  sortOperatingHours,
} from '@/utils/formatters'

const stepItems = [
  { key: 'unit', label: 'Unidade' },
  { key: 'specialty', label: 'Tipo de médico' },
  { key: 'schedule', label: 'Horário' },
  { key: 'success', label: 'Concluído' },
]

const { user, profile } = useAuth()

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

const loading = reactive({
  units: true,
  schedules: false,
  booking: false,
  appointments: false,
})

const feedback = reactive({
  type: '',
  message: '',
})

const specialtyOptions = computed(() => specialties.value)

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
const selectedUnitOperatingHours = computed(() => sortOperatingHours(selectedUnit.value?.operating_hours ?? []))

const successMessage = computed(() => {
  if (!successAppointment.value) {
    return 'Agora você pode voltar para o início ou acompanhar seus agendamentos.'
  }

  const unitName = successAppointment.value.schedule?.unit?.name || selectedUnit.value?.name || 'a unidade'
  const specialtyName =
    successAppointment.value.schedule?.specialty?.name || selectedSpecialty.value?.name || 'o atendimento'
  const startsAt =
    successAppointment.value.schedule?.starts_at || selectedSchedule.value?.starts_at || null

  return `${specialtyName} em ${unitName} no dia ${formatDateTime(startsAt)}.`
})

const currentStepIndex = computed(() => stepItems.findIndex((item) => item.key === step.value))

const orderedUnits = computed(() =>
  [...units.value]
    .map((unit) => {
      const schedules = unitSchedulesById.value[String(unit.id)] ?? []
      const nextSlotAt = schedules[0]?.starts_at ?? null

      return {
        ...unit,
        address: unit.address_label || buildUnitAddress(unit) || 'Endereço indisponível',
        regionLabel: [unit.city, unit.state].filter(Boolean).join(' / ') || 'Rede SUS',
        todayHoursLabel: formatTodayOperatingHours(unit.operating_hours),
        weeklyHours: sortOperatingHours(unit.operating_hours),
        nextSlotAt,
        nextSlotLabel: selectedSpecialty.value
          ? nextSlotAt
            ? formatDateTime(nextSlotAt)
            : 'Sem vaga'
          : 'Selecione a especialidade',
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR')),
)

onMounted(async () => {
  await loadBootstrapData()
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

    if (!selectedUnitId.value && unitsData.length) {
      selectedUnitId.value = String(unitsData[0].id)
    }
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.units = false
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

  setFeedback('success', 'Você entrou na fila de espera. Vamos avisar quando surgir vaga.')
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
    return 'Não foi possível concluir essa ação. Tente outro horário.'
  }

  if (message.includes('row-level security')) {
    return 'Seu projeto Supabase precisa de permissões liberadas para essa etapa.'
  }

  return message || 'Não foi possível concluir a operação agora.'
}
</script>
