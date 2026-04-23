<template>
  <div class="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">

    <AdminSidebar :items="menuItems" :active-key="activeSection" @select="activeSection = $event" />

    <div class="space-y-6 pb-12 sm:space-y-8">

      <!-- ═══════════════════════════════════════════════════════════
           HERO / STAT HEADER
      ════════════════════════════════════════════════════════════ -->
      <section class="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/30 sm:p-8">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-susBlue/5 blur-3xl"></div>

        <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div class="max-w-3xl">
            <div class="flex items-center gap-2">
              <span class="flex h-2 w-2 rounded-full bg-susBlue"></span>
              <p class="text-xs font-bold uppercase tracking-widest text-susBlue">Operação central</p>
            </div>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Controle os recursos da rede e acompanhe a fila em tempo real
            </h2>
            <p class="mt-4 text-base leading-relaxed text-slate-600">
              Cadastre unidades, amplie a oferta de especialidades, abra novos horários e trate os agendamentos direto no painel.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 shrink-0">
            <BaseButton variant="ghost" class="rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-slate-100 shadow-sm" @click="activeSection = 'units'">
              Nova unidade
            </BaseButton>
            <BaseButton variant="ghost" class="rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-slate-100 shadow-sm" @click="activeSection = 'schedules'">
              Abrir horário
            </BaseButton>
            <BaseButton variant="success" class="rounded-xl shadow-lg shadow-emerald-500/20" @click="activeSection = 'appointments'">
              Ver fila completa
            </BaseButton>
          </div>
        </div>

        <div class="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="card in statCards"
            :key="card.label"
            class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:shadow-slate-200/40"
          >
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ card.label }}</p>
            <h3 class="mt-2 text-4xl font-black text-slate-900">{{ card.value }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ card.description }}</p>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           FEEDBACK GLOBAL
      ════════════════════════════════════════════════════════════ -->
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

      <!-- ═══════════════════════════════════════════════════════════
           LOADING INICIAL
      ════════════════════════════════════════════════════════════ -->
      <div v-if="loading.initial" class="flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 bg-white py-16 px-4 text-center shadow-sm">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-susBlue"></div>
        <h3 class="mt-4 text-lg font-bold text-slate-900">Carregando painel...</h3>
        <p class="mt-2 text-sm font-medium text-slate-500">Buscando dados no Supabase.</p>
      </div>

      <template v-else>

        <!-- ═══════════════════════════════════════════════════════
             DASHBOARD
        ════════════════════════════════════════════════════════ -->
        <BaseCard
          v-if="activeSection === 'dashboard'"
          title="Resumo operacional"
          subtitle="Visão rápida do que precisa de atenção agora."
          class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20"
        >
          <div class="grid gap-6 xl:grid-cols-2">

            <div class="flex flex-col rounded-[24px] border border-slate-100 bg-slate-50/50 p-6">
              <div class="mb-5 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-900">Agendamentos recentes</h3>
                <BaseButton variant="ghost" size="sm" class="rounded-xl text-susBlue-dark hover:bg-susBlue-soft" @click="activeSection = 'appointments'">
                  Abrir fila
                </BaseButton>
              </div>

              <div v-if="!appointments.length" class="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-10 px-4 text-center">
                <svg class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <p class="mt-3 text-sm font-medium text-slate-500">Nenhum agendamento encontrado.</p>
              </div>

              <div v-else class="space-y-3">
                <article
                  v-for="appointment in appointments.slice(0, 5)"
                  :key="appointment.id"
                  class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 class="font-bold text-slate-900">
                        {{ appointment.patient?.full_name || appointment.patient?.email || 'Paciente sem nome' }}
                      </h4>
                      <p class="mt-1 text-sm font-medium text-slate-500">{{ appointment.schedule?.unit?.name || 'Unidade não informada' }}</p>
                      <p class="text-xs text-slate-400">{{ appointment.schedule?.specialty?.name || 'Especialidade não informada' }}</p>
                    </div>
                    <div class="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge :status="appointment.status" />
                      <span class="flex items-center gap-1 text-xs font-bold text-slate-600">
                        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {{ formatDateTime(appointment.schedule?.starts_at) }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div class="flex flex-col rounded-[24px] border border-slate-100 bg-slate-50/50 p-6">
              <div class="mb-5 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-900">Próximos horários</h3>
                <BaseButton variant="ghost" size="sm" class="rounded-xl text-susBlue-dark hover:bg-susBlue-soft" @click="activeSection = 'schedules'">
                  Gerenciar
                </BaseButton>
              </div>

              <div v-if="!upcomingSchedules.length" class="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-10 px-4 text-center">
                <svg class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p class="mt-3 text-sm font-medium text-slate-500">Ainda não existem horários futuros cadastrados.</p>
              </div>

              <div v-else class="space-y-3">
                <article
                  v-for="schedule in upcomingSchedules"
                  :key="schedule.id"
                  class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 class="font-bold text-slate-900">{{ schedule.unit?.name }}</h4>
                      <p class="mt-1 text-sm font-medium text-slate-500">{{ schedule.specialty?.name }}</p>
                      <p class="flex items-center gap-1 text-xs font-bold text-slate-600 mt-1">
                        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {{ formatDateTime(schedule.starts_at) }}
                      </p>
                    </div>
                    <StatusBadge :status="schedule.status" />
                  </div>
                </article>
              </div>
            </div>

          </div>
        </BaseCard>

        <!-- ═══════════════════════════════════════════════════════
             UNIDADES
        ════════════════════════════════════════════════════════ -->
        <div v-if="activeSection === 'units'" class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">

          <!-- Formulário de cadastro -->
          <BaseCard
            title="Cadastrar unidade"
            subtitle="Preencha os dados abaixo para registrar uma nova unidade de saúde."
            class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20 h-fit"
          >
            <!-- Sem permissão -->
            <div v-if="!isAdmin" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-6 text-center">
              <svg class="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <p class="text-sm font-medium text-amber-800">Apenas o administrador possui permissão para cadastrar novas unidades.</p>
            </div>

            <!-- Formulário -->
            <form v-else class="space-y-0" @submit.prevent="handleCreateUnit">

              <!-- ── Seção: Informações da unidade ── -->
              <div class="mb-6">
                <div class="mb-4 flex items-center gap-2">
                  <span class="flex h-6 w-6 items-center justify-center rounded-full bg-susBlue/10 text-susBlue">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                  </span>
                  <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600">Informações da unidade</h3>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="unit-name">Nome da unidade <span class="text-rose-500">*</span></label>
                  <input
                    id="unit-name"
                    v-model.trim="unitForm.name"
                    class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                    type="text"
                    placeholder="Ex.: UBS Centro"
                    required
                  />
                </div>
              </div>

              <!-- ── Seção: Endereço ── -->
              <div class="mb-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <div class="mb-4 flex items-center gap-2">
                  <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </span>
                  <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600">Endereço</h3>
                </div>

                <div class="space-y-4">
                  <!-- CEP com indicador de status -->
                  <div class="space-y-1.5">
                    <label class="block text-sm font-bold text-slate-700" for="unit-cep">CEP <span class="text-rose-500">*</span></label>
                    <div class="relative">
                      <input
                        id="unit-cep"
                        :value="unitForm.cep"
                        class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                        type="text"
                        maxlength="9"
                        placeholder="00000-000"
                        @input="handleUnitCepInput($event.target.value)"
                      />
                      <!-- Spinner de busca -->
                      <div v-if="isCepLookupLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
                        <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-susBlue"></div>
                      </div>
                      <!-- Check de sucesso -->
                      <div v-else-if="isAddressAutoFilled" class="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <p
                      class="flex items-center gap-1.5 text-xs transition-colors"
                      :class="isAddressAutoFilled ? 'text-emerald-600 font-medium' : 'text-slate-500'"
                    >
                      <svg v-if="isAddressAutoFilled" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {{ cepLookupMessage }}
                    </p>
                  </div>

                  <!-- Rua + Número -->
                  <div class="grid gap-4 sm:grid-cols-[1fr_140px]">
                    <div class="space-y-1.5">
                      <label class="block text-sm font-bold text-slate-700" for="unit-street">Logradouro</label>
                      <div class="relative">
                        <input
                          id="unit-street"
                          v-model.trim="unitForm.street"
                          :readonly="isAddressAutoFilled && !!unitForm.street"
                          class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                          :class="isAddressAutoFilled && !!unitForm.street ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''"
                          type="text"
                          placeholder="Rua, avenida ou travessa"
                        />
                        <span v-if="isAddressAutoFilled && !!unitForm.street" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                      </div>
                    </div>
                    <div class="space-y-1.5">
                      <label class="block text-sm font-bold text-slate-700" for="unit-number">Número <span class="text-rose-500">*</span></label>
                      <input
                        id="unit-number"
                        v-model.trim="unitForm.residenceNumber"
                        class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                        type="text"
                        placeholder="Ex.: 120"
                        required
                      />
                    </div>
                  </div>

                  <!-- Bairro -->
                  <div class="space-y-1.5">
                    <label class="block text-sm font-bold text-slate-700" for="unit-neighborhood">Bairro</label>
                    <div class="relative">
                      <input
                        id="unit-neighborhood"
                        v-model.trim="unitForm.neighborhood"
                        :readonly="isAddressAutoFilled && !!unitForm.neighborhood"
                        class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                        :class="isAddressAutoFilled && !!unitForm.neighborhood ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''"
                        type="text"
                        placeholder="Bairro"
                      />
                      <span v-if="isAddressAutoFilled && !!unitForm.neighborhood" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                    </div>
                  </div>

                  <!-- Cidade + UF -->
                  <div class="grid gap-4 sm:grid-cols-[1fr_100px]">
                    <div class="space-y-1.5">
                      <label class="block text-sm font-bold text-slate-700" for="unit-city">Cidade <span class="text-rose-500">*</span></label>
                      <div class="relative">
                        <input
                          id="unit-city"
                          v-model.trim="unitForm.city"
                          :readonly="isAddressAutoFilled && !!unitForm.city"
                          class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                          :class="isAddressAutoFilled && !!unitForm.city ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''"
                          type="text"
                          placeholder="Cidade"
                          required
                        />
                        <span v-if="isAddressAutoFilled && !!unitForm.city" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                      </div>
                    </div>
                    <div class="space-y-1.5">
                      <label class="block text-sm font-bold text-slate-700" for="unit-state">UF <span class="text-rose-500">*</span></label>
                      <div class="relative">
                        <input
                          id="unit-state"
                          v-model.trim="unitForm.state"
                          :readonly="isAddressAutoFilled && !!unitForm.state"
                          class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                          :class="isAddressAutoFilled && !!unitForm.state ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''"
                          type="text"
                          maxlength="2"
                          placeholder="SP"
                          required
                        />
                        <span v-if="isAddressAutoFilled && !!unitForm.state" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Seção: Foto da unidade ── -->
              <div class="mb-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <div class="mb-4 flex items-center gap-2">
                  <span class="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  </span>
                  <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600">Foto da unidade</h3>
                  <span class="ml-auto rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">Opcional</span>
                </div>

                <!-- Preview ou drop area -->
                <div v-if="unitImagePreview" class="relative mb-3 overflow-hidden rounded-xl border border-slate-200 shadow-inner">
                  <img :src="unitImagePreview" alt="Preview da unidade" class="h-44 w-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <button
                    type="button"
                    class="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-white transition-colors"
                    @click="clearUnitImagePreview"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Remover
                  </button>
                </div>

                <label
                  v-else
                  for="unit-image"
                  class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition-all hover:border-susBlue/40 hover:bg-susBlue/5"
                >
                  <svg class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  <div>
                    <p class="text-sm font-semibold text-slate-600">Clique para fazer upload</p>
                    <p class="text-xs text-slate-400">Fachada ou recepção da unidade · JPG, PNG ou WEBP</p>
                  </div>
                </label>

                <input id="unit-image" type="file" class="sr-only" accept="image/*" @change="handleUnitImageChange" />
              </div>

              <!-- ── Ações ── -->
              <div class="pt-2">
                <BaseButton
                  type="submit"
                  block
                  size="lg"
                  class="rounded-xl shadow-lg shadow-susBlue/20"
                  :loading="loading.unit"
                  :disabled="!canSubmitUnitForm"
                >
                  Salvar unidade
                </BaseButton>
                <p class="mt-2 text-center text-xs text-slate-400">Campos marcados com <span class="text-rose-500 font-bold">*</span> são obrigatórios</p>
              </div>
            </form>
          </BaseCard>

          <!-- Lista de unidades -->
          <BaseCard
            title="Unidades cadastradas"
            subtitle="Edite dados, horários de funcionamento e remova unidades quando necessário."
            class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20"
          >
            <div v-if="!visibleUnits.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
              <svg class="h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
              <p class="text-sm font-medium text-slate-500">Nenhuma unidade cadastrada ainda.</p>
            </div>

            <div v-else class="space-y-4">
              <article
                v-for="unit in visibleUnits"
                :key="unit.id"
                class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div class="flex flex-col gap-4 p-4">
                  <!-- Cabeçalho da unidade -->
                  <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div class="flex items-start gap-4">
                      <!-- Foto da unidade -->
                      <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                        <img
                          v-if="getUnitImageUrl(unit)"
                          :src="getUnitImageUrl(unit)"
                          :alt="`Foto da unidade ${unit.name}`"
                          class="h-full w-full object-cover transition-transform group-hover:scale-105"
                          @error="handleRegisteredUnitImageError(unit.id)"
                        />
                        <div v-else class="flex h-full w-full items-center justify-center">
                          <svg class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                        </div>
                        <!-- Trocar foto hover -->
                        <label v-if="isAdmin" class="absolute inset-0 flex cursor-pointer items-end justify-center bg-slate-900/0 p-2 opacity-0 transition-all group-hover:bg-slate-900/45 group-hover:opacity-100">
                          <span class="rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                            {{ uploadingUnitImageId === unit.id ? 'Enviando...' : 'Trocar foto' }}
                          </span>
                          <input class="sr-only" type="file" accept="image/*" :disabled="uploadingUnitImageId === unit.id" @change="handleExistingUnitImageChange(unit, $event)" />
                        </label>
                      </div>

                      <!-- Info da unidade -->
                      <div class="min-w-0">
                        <h3 class="font-bold text-slate-900">{{ unit.name }}</h3>
                        <p class="mt-1 truncate text-sm text-slate-500">
                          {{ unit.address_label || buildUnitAddress(unit) || 'Endereço pendente' }}
                        </p>
                        <div class="mt-2 flex flex-wrap items-center gap-2">
                          <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold tracking-wider text-slate-500">
                            CEP {{ formatCep(unit.cep) }}
                          </span>
                          <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {{ getUnitOperatingHoursSummary(unit) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Ações -->
                    <div class="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 lg:border-0 lg:pt-0">
                      <span class="rounded-lg border border-susBlue/10 bg-susBlue-soft/50 px-3 py-1.5 text-xs font-bold text-susBlue-dark">
                        {{ [unit.city, unit.state].filter(Boolean).join(' / ') || 'Rede SUS' }}
                      </span>
                      <BaseButton
                        v-if="canManageUnit"
                        size="sm"
                        variant="ghost"
                        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        @click="editingUnitId === unit.id ? cancelUnitEdit() : startUnitEdit(unit)"
                      >
                        {{ editingUnitId === unit.id ? 'Fechar edição' : 'Editar' }}
                      </BaseButton>
                      <BaseButton
                        v-if="isAdmin"
                        size="sm"
                        variant="danger"
                        class="rounded-lg px-3 py-2 text-xs font-bold shadow-sm shadow-rose-500/20"
                        :loading="deletingUnitId === unit.id"
                        :disabled="deletingUnitId === unit.id"
                        @click="handleDeleteUnit(unit)"
                      >
                        Remover
                      </BaseButton>
                    </div>
                  </div>

                  <!-- Resumo compacto -->
                  <div class="grid gap-2 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Endereço completo</p>
                      <p class="mt-1 text-sm text-slate-700">{{ unit.address_label || buildUnitAddress(unit) || 'Não informado' }}</p>
                    </div>
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Funcionamento</p>
                      <p class="mt-1 text-sm text-slate-700">{{ getUnitOperatingHoursSummary(unit) }}</p>
                    </div>
                  </div>

                  <!-- ═══════════════════════════════════════════════
                       FORMULÁRIO DE EDIÇÃO (inline)
                  ════════════════════════════════════════════════ -->
                  <form
                    v-if="editingUnitId === unit.id && canManageUnit"
                    class="space-y-5 rounded-2xl border border-susBlue/20 bg-slate-50/70 p-5"
                    @submit.prevent="handleUpdateUnit"
                  >
                    <!-- Cabeçalho do form de edição -->
                    <div class="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <svg class="h-4 w-4 text-susBlue" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      <h4 class="text-sm font-bold text-slate-800">Editando: {{ unit.name }}</h4>
                    </div>

                    <!-- Nome + CEP -->
                    <div class="grid gap-4 md:grid-cols-2">
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-name-${unit.id}`">Nome da unidade <span class="text-rose-500">*</span></label>
                        <input
                          :id="`edit-unit-name-${unit.id}`"
                          v-model.trim="unitEditForm.name"
                          class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                          type="text"
                          required
                        />
                      </div>
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-cep-${unit.id}`">CEP <span class="text-rose-500">*</span></label>
                        <div class="relative">
                          <input
                            :id="`edit-unit-cep-${unit.id}`"
                            :value="unitEditForm.cep"
                            class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                            type="text"
                            maxlength="9"
                            placeholder="00000-000"
                            @input="handleUnitEditCepInput($event.target.value)"
                          />
                          <div v-if="isEditingUnitCepLookupLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
                            <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-susBlue"></div>
                          </div>
                          <div v-else-if="isEditingUnitAddressAutoFilled" class="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                        <p class="text-xs text-slate-500">{{ editingUnitCepLookupState }}</p>
                      </div>
                    </div>

                    <!-- Logradouro + Número -->
                    <div class="grid gap-4 md:grid-cols-[1fr_140px]">
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-street-${unit.id}`">Logradouro <span class="text-rose-500">*</span></label>
                        <div class="relative">
                          <input
                            :id="`edit-unit-street-${unit.id}`"
                            v-model.trim="unitEditForm.street"
                            :readonly="isEditingUnitAddressAutoFilled && !!unitEditForm.street"
                            class="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                            :class="isEditingUnitAddressAutoFilled && !!unitEditForm.street ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'bg-white'"
                            type="text"
                            required
                          />
                          <span v-if="isEditingUnitAddressAutoFilled && !!unitEditForm.street" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-number-${unit.id}`">Número <span class="text-rose-500">*</span></label>
                        <input
                          :id="`edit-unit-number-${unit.id}`"
                          v-model.trim="unitEditForm.residenceNumber"
                          class="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    <!-- Bairro + Cidade + UF -->
                    <div class="grid gap-4 md:grid-cols-[1fr_1fr_100px]">
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-neighborhood-${unit.id}`">Bairro</label>
                        <div class="relative">
                          <input
                            :id="`edit-unit-neighborhood-${unit.id}`"
                            v-model.trim="unitEditForm.neighborhood"
                            :readonly="isEditingUnitAddressAutoFilled && !!unitEditForm.neighborhood"
                            class="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                            :class="isEditingUnitAddressAutoFilled && !!unitEditForm.neighborhood ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'bg-white'"
                            type="text"
                          />
                          <span v-if="isEditingUnitAddressAutoFilled && !!unitEditForm.neighborhood" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-city-${unit.id}`">Cidade <span class="text-rose-500">*</span></label>
                        <div class="relative">
                          <input
                            :id="`edit-unit-city-${unit.id}`"
                            v-model.trim="unitEditForm.city"
                            :readonly="isEditingUnitAddressAutoFilled && !!unitEditForm.city"
                            class="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                            :class="isEditingUnitAddressAutoFilled && !!unitEditForm.city ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'bg-white'"
                            type="text"
                            required
                          />
                          <span v-if="isEditingUnitAddressAutoFilled && !!unitEditForm.city" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <label class="block text-sm font-bold text-slate-700" :for="`edit-unit-state-${unit.id}`">UF <span class="text-rose-500">*</span></label>
                        <div class="relative">
                          <input
                            :id="`edit-unit-state-${unit.id}`"
                            v-model.trim="unitEditForm.state"
                            :readonly="isEditingUnitAddressAutoFilled && !!unitEditForm.state"
                            class="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all"
                            :class="isEditingUnitAddressAutoFilled && !!unitEditForm.state ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'bg-white'"
                            type="text"
                            maxlength="2"
                            required
                          />
                          <span v-if="isEditingUnitAddressAutoFilled && !!unitEditForm.state" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Auto</span>
                        </div>
                      </div>
                    </div>

                    <!-- ═══ Horários de funcionamento — redesenhado ═══ -->
                    <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                      <!-- Header da seção de horários -->
                      <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                        <div class="flex items-center gap-2">
                          <svg class="h-4 w-4 text-susBlue" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p class="text-sm font-bold text-slate-800">Horários de funcionamento</p>
                        </div>
                        <p class="text-xs text-slate-500">Defina os dias e horários visíveis para o paciente</p>
                      </div>

                      <!-- Grade de dias da semana -->
                      <div class="divide-y divide-slate-50">
                        <div
                          v-for="hour in unitEditForm.operatingHours"
                          :key="hour.weekday"
                          class="flex flex-col gap-3 px-4 py-3 transition-colors sm:flex-row sm:items-center"
                          :class="hour.is_closed ? 'bg-slate-50/50 opacity-60' : 'bg-white hover:bg-slate-50/50'"
                        >
                          <!-- Dia da semana + toggle -->
                          <div class="flex w-full items-center justify-between sm:w-40 sm:shrink-0">
                            <span
                              class="text-sm font-semibold"
                              :class="hour.is_closed ? 'text-slate-400' : 'text-slate-800'"
                            >
                              {{ getWeekdayLabel(hour.weekday) }}
                            </span>
                            <!-- Toggle Aberto / Fechado -->
                            <label class="relative inline-flex cursor-pointer items-center gap-2">
                              <span class="text-xs font-medium" :class="hour.is_closed ? 'text-slate-400' : 'text-emerald-600'">
                                {{ hour.is_closed ? 'Fechado' : 'Aberto' }}
                              </span>
                              <div class="relative">
                                <input
                                  v-model="hour.is_closed"
                                  type="checkbox"
                                  class="sr-only peer"
                                />
                                <div
                                  class="h-5 w-9 rounded-full border-2 border-slate-200 bg-emerald-500 transition-colors peer-checked:border-slate-200 peer-checked:bg-slate-300 peer-focus:ring-2 peer-focus:ring-emerald-400/30"
                                ></div>
                                <div
                                  class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
                                ></div>
                              </div>
                            </label>
                          </div>

                          <!-- Horários de abertura e fechamento -->
                          <div
                            class="flex flex-1 items-center gap-2 transition-opacity"
                            :class="hour.is_closed ? 'pointer-events-none opacity-0' : 'opacity-100'"
                          >
                            <div class="relative flex-1">
                              <label class="sr-only" :for="`edit-opens-${unit.id}-${hour.weekday}`">Abre às</label>
                              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Abre</span>
                              <input
                                :id="`edit-opens-${unit.id}-${hour.weekday}`"
                                v-model="hour.opens_at"
                                :disabled="hour.is_closed"
                                class="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-12 pr-3 text-sm font-semibold text-slate-900 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                type="time"
                              />
                            </div>
                            <svg class="h-3.5 w-3.5 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                            <div class="relative flex-1">
                              <label class="sr-only" :for="`edit-closes-${unit.id}-${hour.weekday}`">Fecha às</label>
                              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Fecha</span>
                              <input
                                :id="`edit-closes-${unit.id}-${hour.weekday}`"
                                v-model="hour.closes_at"
                                :disabled="hour.is_closed"
                                class="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-14 pr-3 text-sm font-semibold text-slate-900 focus:border-susBlue focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                type="time"
                              />
                            </div>
                          </div>

                          <!-- Fechado label quando toggle está off -->
                          <div
                            v-if="hour.is_closed"
                            class="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 py-2.5 sm:justify-start sm:px-4"
                          >
                            <span class="text-xs font-medium text-slate-400">Unidade fechada neste dia</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Botões de ação da edição -->
                    <div class="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
                      <BaseButton
                        type="button"
                        variant="ghost"
                        class="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        @click="cancelUnitEdit"
                      >
                        Cancelar
                      </BaseButton>
                      <BaseButton
                        type="submit"
                        class="rounded-xl shadow-lg shadow-susBlue/20"
                        :loading="savingUnitEdit"
                        :disabled="!canSubmitUnitEditForm"
                      >
                        Salvar alterações
                      </BaseButton>
                    </div>
                  </form>
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             ESPECIALIDADES
        ════════════════════════════════════════════════════════ -->
        <div v-if="activeSection === 'specialties'" class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <BaseCard title="Nova especialidade" subtitle="Cadastre especialidades para alimentar os horários." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20 h-fit">
            <div v-if="isManager" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-6 text-center">
              <svg class="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <p class="text-sm font-medium text-amber-800">Esta conta é de gestor. Especialidades ficam sob controle do administrador.</p>
            </div>
            <form v-else class="space-y-5" @submit.prevent="handleCreateSpecialty">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="specialty-name">Nome da especialidade</label>
                <input id="specialty-name" v-model.trim="specialtyForm.name" type="text" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susGreen focus:bg-white focus:outline-none focus:ring-4 focus:ring-susGreen/10 transition-all" placeholder="Ex.: Clínica Geral, Pediatria" required />
              </div>
              <div class="pt-2">
                <BaseButton type="submit" block size="lg" class="rounded-xl shadow-lg shadow-susGreen/20" variant="success" :loading="loading.specialty" :disabled="!specialtyForm.name">
                  Salvar especialidade
                </BaseButton>
              </div>
            </form>
          </BaseCard>

          <BaseCard title="Especialidades cadastradas" subtitle="Lista usada pela equipe e pela jornada do paciente." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20">
            <div v-if="!specialties.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
              <svg class="h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              <p class="text-sm font-medium text-slate-500">Nenhuma especialidade cadastrada.</p>
            </div>
            <div v-else class="grid gap-4 sm:grid-cols-2">
              <div v-for="specialty in specialties" :key="specialty.id" class="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-susGreen/40">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-susGreen-soft text-susGreen-dark">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900">{{ specialty.name }}</p>
                    <p class="text-xs font-medium text-slate-400 mt-0.5">Criada em {{ formatDateTime(specialty.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             MÉDICOS
        ════════════════════════════════════════════════════════ -->
        <div v-if="activeSection === 'doctors'" class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <BaseCard title="Cadastrar Médicos" subtitle="Vincule o profissional a uma unidade e especialidade." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20 h-fit">
            <form class="space-y-5" @submit.prevent="handleCreateDoctor">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="doctor-name">Nome do Médico</label>
                <input id="doctor-name" v-model.trim="doctorForm.fullName" type="text" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all" placeholder="Ex.: Dra. Maria Silva" required />
              </div>
              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="doctor-crm">CRM / CRO / CRP</label>
                  <input id="doctor-crm" v-model.trim="doctorForm.crm" type="text" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all" placeholder="Ex.: CRM 123456" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="doctor-active">Status de atuação</label>
                  <select id="doctor-active" v-model="doctorForm.isActive" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer">
                    <option :value="true">Ativo na rede</option>
                    <option :value="false">Inativo/Afastado</option>
                  </select>
                </div>
              </div>
              <div class="grid gap-5 md:grid-cols-2 border-t border-slate-100 pt-5">
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="doctor-unit">Unidade</label>
                  <select id="doctor-unit" v-model="doctorForm.unitId" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer" required>
                    <option value="">Selecione uma unidade</option>
                    <option v-for="unit in visibleUnits" :key="unit.id" :value="String(unit.id)">{{ unit.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="doctor-specialty">Especialidade</label>
                  <select id="doctor-specialty" v-model="doctorForm.specialtyId" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer" required>
                    <option value="">Selecione a especialidade</option>
                    <option v-for="specialty in specialties" :key="specialty.id" :value="String(specialty.id)">{{ specialty.name }}</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="doctor-notes">Observações</label>
                <textarea id="doctor-notes" v-model.trim="doctorForm.notes" class="block w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all resize-y" placeholder="Ex.: Atende à tarde e realiza retorno em 15 dias."></textarea>
              </div>
              <div class="pt-2">
                <BaseButton type="submit" block size="lg" class="rounded-xl shadow-lg shadow-susBlue/20" :loading="loading.doctor" :disabled="!doctorForm.fullName || !doctorForm.crm || !doctorForm.unitId || !doctorForm.specialtyId">
                  Salvar Médico
                </BaseButton>
              </div>
            </form>
          </BaseCard>

          <BaseCard title="Médicos cadastrados" subtitle="Verifique quem está vinculado a cada unidade." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20">
            <div v-if="!visibleDoctors.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
              <svg class="h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              <p class="text-sm font-medium text-slate-500">Nenhum médico cadastrado.</p>
            </div>
            <div v-else class="space-y-4">
              <article v-for="doctor in visibleDoctors" :key="doctor.id" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div class="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-susBlue group-hover:text-white transition-colors">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-slate-900">{{ doctor.full_name }}</h3>
                      <p class="mt-0.5 text-sm font-medium text-slate-600">
                        {{ doctor.specialty?.name }} <span class="text-slate-300 mx-1">•</span> {{ doctor.unit?.name }}
                      </p>
                      <p class="mt-1 text-xs text-slate-400">{{ doctor.crm }} <span class="mx-1">•</span> {{ doctor.notes || 'Sem Observações' }}</p>
                    </div>
                  </div>
                  <div class="border-t border-slate-100 pt-3 lg:border-0 lg:pt-0 shrink-0">
                    <StatusBadge :status="doctor.is_active ? 'disponivel' : 'indisponivel'" />
                  </div>
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             HORÁRIOS
        ════════════════════════════════════════════════════════ -->
        <div v-if="activeSection === 'schedules'" class="grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <BaseCard title="Abrir horário" subtitle="Associe unidade, especialidade e data para abrir um novo slot de agendamento." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20 h-fit">
            <form class="space-y-5" @submit.prevent="handleCreateSchedule">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="schedule-unit">Unidade de Saúde</label>
                <select id="schedule-unit" v-model="scheduleForm.unitId" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer" required>
                  <option value="">Selecione uma unidade</option>
                  <option v-for="unit in visibleUnits" :key="unit.id" :value="String(unit.id)">{{ unit.name }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="schedule-specialty">Especialidade Clínica</label>
                <select id="schedule-specialty" v-model="scheduleForm.specialtyId" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer" required>
                  <option value="">Selecione a especialidade</option>
                  <option v-for="specialty in specialties" :key="specialty.id" :value="String(specialty.id)">{{ specialty.name }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-slate-700" for="schedule-doctor">Profissional (Opcional)</label>
                <select id="schedule-doctor" v-model="scheduleForm.doctorId" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all cursor-pointer">
                  <option value="">Agenda geral (Sem médico específico)</option>
                  <option v-for="doctor in doctorsForSelectedUnit" :key="doctor.id" :value="String(doctor.id)">{{ doctor.full_name }}</option>
                </select>
              </div>
              <div class="grid gap-5 md:grid-cols-2 border-t border-slate-100 pt-5">
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="schedule-date">Data do atendimento</label>
                  <input id="schedule-date" v-model="scheduleForm.date" type="date" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all" required />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-slate-700" for="schedule-time">Horário</label>
                  <input id="schedule-time" v-model="scheduleForm.time" type="time" class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-susBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-susBlue/10 transition-all" required />
                </div>
              </div>
              <div class="pt-2">
                <BaseButton type="submit" block size="lg" class="rounded-xl shadow-lg shadow-susBlue/20" :loading="loading.schedule" :disabled="!scheduleForm.unitId || !scheduleForm.specialtyId || !scheduleForm.date || !scheduleForm.time">
                  Criar horário disponível
                </BaseButton>
              </div>
            </form>
          </BaseCard>

          <BaseCard title="Horários futuros abertos" subtitle="Visualize os slots criados que estão aguardando marcação." class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20">
            <div v-if="!upcomingSchedules.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 px-4 text-center">
              <svg class="h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              <p class="text-sm font-medium text-slate-500">Nenhum horário futuro encontrado na base.</p>
            </div>
            <div v-else class="space-y-4">
              <article v-for="schedule in upcomingSchedules" :key="schedule.id" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div class="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex items-start gap-4">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-susBlue group-hover:text-white transition-colors">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-slate-900">{{ schedule.unit?.name }}</h3>
                      <p class="mt-0.5 text-sm font-medium text-slate-600">{{ schedule.specialty?.name }}</p>
                      <p class="mt-1 text-xs font-bold tracking-wide text-susBlue-dark">{{ formatDateTime(schedule.starts_at) }}</p>
                    </div>
                  </div>
                  <div class="border-t border-slate-100 pt-3 lg:border-0 lg:pt-0 shrink-0">
                    <StatusBadge :status="schedule.status" />
                  </div>
                </div>
              </article>
            </div>
          </BaseCard>
        </div>

        <!-- ═══════════════════════════════════════════════════════
             AGENDAMENTOS
        ════════════════════════════════════════════════════════ -->
        <BaseCard
          v-if="activeSection === 'appointments'"
          title="Fila central de agendamentos"
          subtitle="Confirme ou cancele as marcações diretamente pelo painel para gerenciar as vagas."
          class="rounded-[28px] border-slate-200/60 shadow-xl shadow-slate-200/20"
        >
          <div v-if="!appointments.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 px-4 text-center">
            <svg class="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75M8.25 21h3.75" /></svg>
            <p class="text-base font-bold text-slate-900">Nenhum agendamento na fila.</p>
            <p class="mt-1 text-sm text-slate-500">Quando os pacientes reservarem horários, eles aparecerão aqui.</p>
          </div>

          <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left">
              <thead class="bg-slate-50/80">
                <tr>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Paciente</th>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Unidade</th>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Especialidade</th>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Data/hora</th>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th scope="col" class="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Ações de Gestão</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-for="appointment in appointments" :key="appointment.id" class="transition-colors hover:bg-slate-50/70">
                  <td class="whitespace-nowrap px-5 py-4">
                    <p class="font-bold text-slate-900">{{ appointment.patient?.full_name || appointment.patient?.email || 'Paciente sem nome' }}</p>
                    <p class="text-xs font-medium text-slate-500 mt-0.5">{{ appointment.patient?.email }}</p>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{{ appointment.schedule?.unit?.name || '--' }}</td>
                  <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{{ appointment.schedule?.specialty?.name || '--' }}</td>
                  <td class="whitespace-nowrap px-5 py-4">
                    <span class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {{ formatDateTime(appointment.schedule?.starts_at) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4">
                    <StatusBadge :status="appointment.status" />
                  </td>
                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <BaseButton
                        size="sm"
                        variant="success"
                        class="rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm shadow-emerald-500/20"
                        :disabled="appointment.status === 'confirmado' || loading.appointments"
                        @click="handleUpdateAppointmentStatus(appointment, 'confirmado')"
                      >
                        Confirmar
                      </BaseButton>
                      <BaseButton
                        size="sm"
                        variant="danger"
                        class="rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm shadow-rose-500/20"
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
import {
  createDoctor,
  createSchedule,
  createSpecialty,
  createUnit,
  deleteUnit,
  fetchAppointments,
  fetchDoctors,
  fetchSchedules,
  fetchSpecialties,
  fetchUnits,
  replaceUnitOperatingHours,
  uploadUnitImage,
  updateUnit,
  updateDoctor,
  updateAppointmentStatus,
  updateSchedule,
} from '@/services/scheduling'
import {
  buildUnitAddress,
  createDefaultOperatingHours,
  formatCep,
  formatDateTime,
  formatOperatingHourRange,
  getWeekdayLabel,
  mergeOperatingHours,
  sanitizeCep,
  sortOperatingHours,
} from '@/utils/formatters'

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', description: 'Resumo do funcionamento da rede.', short: 'DS' },
  { key: 'units', label: 'Unidades', description: 'Cadastro e consulta das unidades.', short: 'UB' },
  { key: 'specialties', label: 'Especialidades', description: 'Gestão do catálogo clínico.', short: 'ES' },
  { key: 'doctors', label: 'Médicos', description: 'Cadastro de profissionais por unidade.', short: 'MD' },
  { key: 'schedules', label: 'Horários', description: 'Oferta de slots disponíveis.', short: 'HR' },
  { key: 'appointments', label: 'Agendamentos', description: 'Fila com status e ações.', short: 'AG' },
]

const activeSection = ref('dashboard')
const units = ref([])
const specialties = ref([])
const doctors = ref([])
const DEFAULT_CEP_LOOKUP_MESSAGE = 'Digite o CEP para buscar o endereço automaticamente.'
const INCOMPLETE_CEP_LOOKUP_MESSAGE = 'Informe os 8 dígitos do CEP para buscar o endereço.'

const schedules = ref([])
const appointments = ref([])
<<<<<<< HEAD
const cepLookupState = ref('Digite o CEP completo para preencher o endereco automaticamente.')
=======
const cepLookupState = ref(DEFAULT_CEP_LOOKUP_MESSAGE)
const isAddressAutoFilled = ref(false)
const isCepLookupLoading = ref(false)
const uploadingUnitImageId = ref(null)
const brokenUnitImageIds = ref({})
const editingUnitId = ref(null)
const deletingUnitId = ref(null)
const savingUnitEdit = ref(false)
const editingUnitCepLookupState = ref(DEFAULT_CEP_LOOKUP_MESSAGE)
const isEditingUnitAddressAutoFilled = ref(false)
const isEditingUnitCepLookupLoading = ref(false)
>>>>>>> 11e7f49e445133affafc7d97406b35641974568c
const unitImageFile = ref(null)
const unitImagePreview = ref('')
const { profile } = useAuth()
let cepLookupController = null
let editingCepLookupController = null

const unitForm = reactive({
  name: '',
  cep: '',
  street: '',
  residenceNumber: '',
  neighborhood: '',
  city: '',
  state: '',
})

const unitEditForm = reactive({
  id: '',
  name: '',
  cep: '',
  street: '',
  residenceNumber: '',
  neighborhood: '',
  city: '',
  state: '',
  operatingHours: createDefaultOperatingHours(),
})

const specialtyForm = reactive({ name: '' })

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

const feedback = reactive({ type: '', message: '' })

const upcomingSchedules = computed(() =>
  schedules.value
    .filter((schedule) => new Date(schedule.starts_at).getTime() >= Date.now())
    .slice(0, 8),
)

const isAdmin = computed(() => profile.value?.role === 'admin')
const isManager = computed(() => profile.value?.role === 'gestor')
const canManageUnit = computed(() => isAdmin.value || isManager.value)
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
  { label: 'Unidades', value: units.value.length, description: 'Locais cadastrados para a oferta de horários e atendimento.' },
  { label: 'Especialidades', value: specialties.value.length, description: 'Serviços clínicos disponíveis no catálogo da rede.' },
  { label: 'Horários livres', value: schedules.value.filter((schedule) => schedule.is_available).length, description: 'Slots atualmente liberados para nova reserva.' },
  { label: 'Pendências', value: appointments.value.filter((appointment) => appointment.status === 'pendente').length, description: 'Agendamentos aguardando tratamento pela equipe.' },
])

const doctorsForSelectedUnit = computed(() => {
  return visibleDoctors.value.filter((doctor) => {
    const matchesUnit = !scheduleForm.unitId || String(doctor.unit_id) === String(scheduleForm.unitId)
    const matchesSpecialty = !scheduleForm.specialtyId || String(doctor.specialty_id) === String(scheduleForm.specialtyId)
    return matchesUnit && matchesSpecialty
  })
})

const cepLookupMessage = computed(() => cepLookupState.value)
const canSubmitUnitForm = computed(() => {
  return (
    !!unitForm.name.trim() &&
    sanitizeCep(unitForm.cep).length === 8 &&
    !!unitForm.street.trim() &&
    !!unitForm.residenceNumber.trim() &&
    !!unitForm.city.trim() &&
    !!unitForm.state.trim() &&
    !isCepLookupLoading.value
  )
})
const canSubmitUnitEditForm = computed(() => {
  return (
    !!unitEditForm.id &&
    !!unitEditForm.name.trim() &&
    sanitizeCep(unitEditForm.cep).length === 8 &&
    !!unitEditForm.street.trim() &&
    !!unitEditForm.residenceNumber.trim() &&
    !!unitEditForm.city.trim() &&
    !!unitEditForm.state.trim() &&
    !isEditingUnitCepLookupLoading.value
  )
})

onMounted(async () => { await loadAdminData() })

onBeforeUnmount(() => {
  cancelCepLookup()
  cancelEditingCepLookup()
  if (unitImagePreview.value) { URL.revokeObjectURL(unitImagePreview.value) }
})

async function loadAdminData() {
  loading.initial = true
  resetFeedback()
  try {
    const [unitsData, specialtiesData, doctorsData, schedulesData, appointmentsData] = await Promise.all([
      fetchUnits(), fetchSpecialties(), fetchDoctors(), fetchSchedules(), fetchAppointments(),
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

async function handleUnitCepInput(value) {
  unitForm.cep = formatCep(value)
<<<<<<< HEAD
  const cep = sanitizeCep(value)

  if (cep.length === 8) {
    lookupCep(cep)
  } else {
    cepLookupState.value = 'Digite o CEP completo para preencher o endereco automaticamente.'
  }
}

async function lookupCep(cep) {
  cepLookupState.value = 'Buscando endereco para o CEP informado...'

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) {
      throw new Error('Erro ao consultar o CEP.')
    }

    const data = await response.json()

    if (data.erro) {
      throw new Error('CEP nao encontrado.')
    }

    unitForm.street = data.logradouro || ''
    unitForm.neighborhood = data.bairro || ''
    unitForm.city = data.localidade || ''
    unitForm.state = (data.uf || '').toUpperCase()
    cepLookupState.value = 'Endereco preenchido automaticamente.'
  } catch (error) {
    unitForm.street = unitForm.street || ''
    unitForm.neighborhood = unitForm.neighborhood || ''
    unitForm.city = unitForm.city || ''
    unitForm.state = unitForm.state || ''
    cepLookupState.value =
      String(error?.message || '').toLowerCase().includes('nao encontrado')
        ? 'CEP nao encontrado. Preencha o endereco manualmente.'
        : 'Nao foi possivel consultar o CEP. Preencha o endereco manualmente.'
=======
  clearUnitAddressFields()
  const cep = sanitizeCep(value)
  cancelCepLookup()
  if (!cep.length) { cepLookupState.value = DEFAULT_CEP_LOOKUP_MESSAGE; return }
  if (cep.length < 8) { cepLookupState.value = INCOMPLETE_CEP_LOOKUP_MESSAGE; return }
  await lookupAddressByCep(cep)
}

function cancelCepLookup() {
  if (cepLookupController) { cepLookupController.abort(); cepLookupController = null }
  isCepLookupLoading.value = false
}

function clearUnitAddressFields() {
  unitForm.street = ''
  unitForm.neighborhood = ''
  unitForm.city = ''
  unitForm.state = ''
  isAddressAutoFilled.value = false
}

function clearEditableUnitAddressFields() {
  unitEditForm.street = ''
  unitEditForm.neighborhood = ''
  unitEditForm.city = ''
  unitEditForm.state = ''
  isEditingUnitAddressAutoFilled.value = false
}

function cancelEditingCepLookup() {
  if (editingCepLookupController) { editingCepLookupController.abort(); editingCepLookupController = null }
  isEditingUnitCepLookupLoading.value = false
}

function buildAddressLabelFromForm(form) {
  return [
    [form.street, form.residenceNumber].filter(Boolean).join(', '),
    form.neighborhood, form.city, form.state, 'Brasil',
  ].filter(Boolean).join(', ')
}

function getInitialOperatingHours(hours = []) {
  return mergeOperatingHours(hours).map((entry) => ({
    weekday: Number(entry.weekday),
    opens_at: String(entry.opens_at ?? '').slice(0, 5) || '08:00',
    closes_at: String(entry.closes_at ?? '').slice(0, 5) || '17:00',
    is_closed: Boolean(entry.is_closed),
  }))
}

function getUnitOperatingHoursSummary(unit) {
  const hours = sortOperatingHours(unit?.operating_hours ?? [])
  if (!hours.length) return 'Horários de funcionamento não informados.'
  const openDays = hours.filter((entry) => !entry.is_closed)
  if (!openDays.length) return 'Unidade marcada como fechada em todos os dias.'
  const firstOpenDay = openDays[0]
  return `${getWeekdayLabel(firstOpenDay.weekday)}: ${formatOperatingHourRange(firstOpenDay)}`
}

async function handleUnitEditCepInput(value) {
  unitEditForm.cep = formatCep(value)
  clearEditableUnitAddressFields()
  const cep = sanitizeCep(value)
  cancelEditingCepLookup()
  if (!cep.length) { editingUnitCepLookupState.value = DEFAULT_CEP_LOOKUP_MESSAGE; return }
  if (cep.length < 8) { editingUnitCepLookupState.value = INCOMPLETE_CEP_LOOKUP_MESSAGE; return }
  await lookupEditableAddressByCep(cep)
}

async function lookupEditableAddressByCep(cep) {
  const controller = new AbortController()
  editingCepLookupController = controller
  isEditingUnitCepLookupLoading.value = true
  editingUnitCepLookupState.value = 'Buscando endereço pelo CEP...'
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal })
    if (!response.ok) throw new Error('Falha ao consultar CEP.')
    const data = await response.json()
    if (data.erro) { editingUnitCepLookupState.value = 'CEP não encontrado. Preencha o endereço manualmente.'; return }
    unitEditForm.street = String(data.logradouro ?? '').trim()
    unitEditForm.neighborhood = String(data.bairro ?? '').trim()
    unitEditForm.city = String(data.localidade ?? '').trim()
    unitEditForm.state = String(data.uf ?? '').trim().toUpperCase()
    isEditingUnitAddressAutoFilled.value = true
    editingUnitCepLookupState.value = 'Endereço preenchido automaticamente. Ajuste o número, se necessário.'
  } catch (error) {
    if (error?.name === 'AbortError') return
    editingUnitCepLookupState.value = 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.'
  } finally {
    if (editingCepLookupController === controller) { editingCepLookupController = null; isEditingUnitCepLookupLoading.value = false }
  }
}

async function lookupAddressByCep(cep) {
  const controller = new AbortController()
  cepLookupController = controller
  isCepLookupLoading.value = true
  cepLookupState.value = 'Buscando endereço pelo CEP...'
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal })
    if (!response.ok) throw new Error('Falha ao consultar CEP.')
    const data = await response.json()
    if (data.erro) { cepLookupState.value = 'CEP não encontrado. Preencha o endereço manualmente.'; return }
    unitForm.street = String(data.logradouro ?? '').trim()
    unitForm.neighborhood = String(data.bairro ?? '').trim()
    unitForm.city = String(data.localidade ?? '').trim()
    unitForm.state = String(data.uf ?? '').trim().toUpperCase()
    isAddressAutoFilled.value = true
    const missingFields = []
    if (!unitForm.street) missingFields.push('o endereço')
    if (!unitForm.neighborhood) missingFields.push('o bairro')
    if (!unitForm.city) missingFields.push('a cidade')
    if (!unitForm.state) missingFields.push('a UF')
    cepLookupState.value = missingFields.length
      ? `Endereço encontrado parcialmente. Complete ${missingFields.join(', ')} e informe o número.`
      : 'Endereço preenchido automaticamente. Agora informe apenas o número.'
  } catch (error) {
    if (error?.name === 'AbortError') return
    cepLookupState.value = 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.'
  } finally {
    if (cepLookupController === controller) { cepLookupController = null; isCepLookupLoading.value = false }
>>>>>>> 11e7f49e445133affafc7d97406b35641974568c
  }
}

function handleUnitImageChange(event) {
  const file = event.target?.files?.[0] ?? null
  unitImageFile.value = file
  if (unitImagePreview.value) { URL.revokeObjectURL(unitImagePreview.value); unitImagePreview.value = '' }
  if (file) unitImagePreview.value = URL.createObjectURL(file)
}

// Novo método auxiliar para limpar preview manualmente (sem alterar lógica de negócio)
function clearUnitImagePreview() {
  if (unitImagePreview.value) { URL.revokeObjectURL(unitImagePreview.value) }
  unitImagePreview.value = ''
  unitImageFile.value = null
  const input = document.getElementById('unit-image')
  if (input) input.value = ''
}

async function handleCreateUnit() {
  loading.unit = true
  resetFeedback()
  try {
    if (!isAdmin.value) throw new Error('Apenas o administrador pode cadastrar novas unidades.')
    if (!canSubmitUnitForm.value) throw new Error('Preencha o CEP, confirme o endereço e informe o número da unidade.')
    const addressLabel = [
      [unitForm.street, unitForm.residenceNumber].filter(Boolean).join(', '),
<<<<<<< HEAD
      unitForm.neighborhood,
      unitForm.city,
      unitForm.state,
      'Brasil',
    ]
      .filter(Boolean)
      .join(', ')

    let uploadedImage = null
    let uploadWarning = ''

    if (unitImageFile.value) {
      try {
        uploadedImage = await uploadUnitImage(unitImageFile.value)
      } catch (error) {
        const message = String(error?.message || error?.details || error?.hint || '')

        if (
          /bucket|storage|permission|upload|bucket_id/i.test(message)
        ) {
          uploadWarning = 'Imagem nao enviada. Verifique a configuracao de armazenamento do Supabase.'
          uploadedImage = null
        } else {
          throw error
        }
      }
    }

=======
      unitForm.neighborhood, unitForm.city, unitForm.state, 'Brasil',
    ].filter(Boolean).join(', ')
    const uploadedImage = unitImageFile.value ? await uploadUnitImage(unitImageFile.value) : null
>>>>>>> 11e7f49e445133affafc7d97406b35641974568c
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
    })
    units.value = await fetchUnits()
    resetUnitForm()
    setFeedback('success', uploadWarning ? `Unidade salva com sucesso. ${uploadWarning}` : 'Unidade salva com sucesso.')
    activeSection.value = 'units'
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.unit = false
  }
}

function getUnitImageUrl(unit) {
  if (!unit?.id || !unit?.image_url) return ''
  return brokenUnitImageIds.value[unit.id] ? '' : unit.image_url
}

function handleRegisteredUnitImageError(unitId) {
  if (!unitId) return
  brokenUnitImageIds.value = { ...brokenUnitImageIds.value, [unitId]: true }
}

async function handleExistingUnitImageChange(unit, event) {
  const file = event.target?.files?.[0] ?? null
  if (!file || !unit?.id) return
  uploadingUnitImageId.value = unit.id
  resetFeedback()
  try {
    const uploadedImage = await uploadUnitImage(file)
    await updateUnit(unit.id, { image_url: uploadedImage.publicUrl })
    brokenUnitImageIds.value = { ...brokenUnitImageIds.value, [unit.id]: false }
    units.value = await fetchUnits()
    setFeedback('success', 'Foto da unidade atualizada com sucesso.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    uploadingUnitImageId.value = null
    if (event.target) event.target.value = ''
  }
}

function startUnitEdit(unit) {
  editingUnitId.value = unit.id
  unitEditForm.id = String(unit.id)
  unitEditForm.name = unit.name ?? ''
  unitEditForm.cep = formatCep(unit.cep ?? '')
  unitEditForm.street = unit.street ?? ''
  unitEditForm.residenceNumber = unit.residence_number ?? ''
  unitEditForm.neighborhood = unit.neighborhood ?? ''
  unitEditForm.city = unit.city ?? ''
  unitEditForm.state = unit.state ?? ''
  unitEditForm.operatingHours = getInitialOperatingHours(unit.operating_hours)
  editingUnitCepLookupState.value = DEFAULT_CEP_LOOKUP_MESSAGE
  isEditingUnitAddressAutoFilled.value = false
  resetFeedback()
}

function cancelUnitEdit() {
  cancelEditingCepLookup()
  editingUnitId.value = null
  unitEditForm.id = ''
  unitEditForm.name = ''
  unitEditForm.cep = ''
  unitEditForm.street = ''
  unitEditForm.residenceNumber = ''
  unitEditForm.neighborhood = ''
  unitEditForm.city = ''
  unitEditForm.state = ''
  unitEditForm.operatingHours = createDefaultOperatingHours()
  editingUnitCepLookupState.value = DEFAULT_CEP_LOOKUP_MESSAGE
  isEditingUnitAddressAutoFilled.value = false
}

function validateOperatingHours(hours = []) {
  const invalidEntry = hours.find((entry) => {
    if (entry.is_closed) return false
    return !entry.opens_at || !entry.closes_at || entry.opens_at >= entry.closes_at
  })
  if (invalidEntry) throw new Error(`Revise o horário de ${getWeekdayLabel(invalidEntry.weekday)}.`)
}

async function handleUpdateUnit() {
  if (!canManageUnit.value || !editingUnitId.value) return
  savingUnitEdit.value = true
  resetFeedback()
  try {
    if (!canSubmitUnitEditForm.value) throw new Error('Preencha os dados da unidade antes de salvar as alterações.')
    validateOperatingHours(unitEditForm.operatingHours)
    await updateUnit(Number(editingUnitId.value), {
      name: unitEditForm.name.trim(),
      cep: sanitizeCep(unitEditForm.cep),
      street: unitEditForm.street.trim(),
      residence_number: unitEditForm.residenceNumber.trim(),
      neighborhood: unitEditForm.neighborhood.trim(),
      city: unitEditForm.city.trim(),
      state: unitEditForm.state.trim().toUpperCase(),
      address_label: buildAddressLabelFromForm(unitEditForm),
    })
    await replaceUnitOperatingHours(Number(editingUnitId.value), unitEditForm.operatingHours)
    units.value = await fetchUnits()
    cancelUnitEdit()
    setFeedback('success', 'Unidade atualizada com sucesso.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    savingUnitEdit.value = false
  }
}

async function handleDeleteUnit(unit) {
  if (!isAdmin.value || !unit?.id) return
  const confirmed = window.confirm(`Deseja remover a unidade "${unit.name}"? Horários, profissionais e agendamentos ligados a ela também serão afetados.`)
  if (!confirmed) return
  deletingUnitId.value = unit.id
  resetFeedback()
  try {
    await deleteUnit(unit.id)
    if (String(editingUnitId.value) === String(unit.id)) cancelUnitEdit()
    await loadAdminData()
    setFeedback('success', 'Unidade removida com sucesso.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    deletingUnitId.value = null
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
    setFeedback('success', 'Médico salvo com sucesso.')
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
    if (Number.isNaN(startsAt.getTime())) throw new Error('Informe uma data e hora válidas.')
    if (scheduleForm.doctorId && !doctorsForSelectedUnit.value.some((doctor) => String(doctor.id) === String(scheduleForm.doctorId))) {
      throw new Error('Selecione um Médico compatível com a unidade e especialidade.')
    }
    await createSchedule({
      unit_id: Number(scheduleForm.unitId),
      specialty_id: Number(scheduleForm.specialtyId),
      doctor_id: scheduleForm.doctorId ? Number(scheduleForm.doctorId) : null,
      starts_at: startsAt.toISOString(),
    })
    schedules.value = await fetchSchedules()
    resetScheduleForm()
    setFeedback('success', 'Horário criado com sucesso.')
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
    setFeedback('success', status === 'confirmado' ? 'Agendamento confirmado com sucesso.' : 'Agendamento cancelado e horário devolvido para a fila.')
  } catch (error) {
    setFeedback('error', mapDataError(error))
  } finally {
    loading.appointments = false
  }
}

function resetUnitForm() {
  cancelCepLookup()
  unitForm.name = ''
  unitForm.cep = ''
  unitForm.residenceNumber = ''
  clearUnitAddressFields()
  unitImageFile.value = null
  if (unitImagePreview.value) URL.revokeObjectURL(unitImagePreview.value)
  unitImagePreview.value = ''
<<<<<<< HEAD
  cepLookupState.value = 'Digite o CEP completo para preencher o endereco automaticamente.'
=======
  cepLookupState.value = DEFAULT_CEP_LOOKUP_MESSAGE
>>>>>>> 11e7f49e445133affafc7d97406b35641974568c
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

function setFeedback(type, message) { feedback.type = type; feedback.message = message }
function resetFeedback() { feedback.type = ''; feedback.message = '' }

function mapDataError(error) {
<<<<<<< HEAD
  const message =
    error?.message ||
    error?.details ||
    error?.hint ||
    String(error || '')

  if (message.toLowerCase().includes('duplicate')) {
    return 'Esse registro ja existe no banco de dados.'
  }

  if (message.toLowerCase().includes('imagem')) {
    return 'Nao foi possivel enviar a imagem da unidade. Tente novamente sem foto.'
  }

  if (/bucket|storage|permission/i.test(message.toLowerCase())) {
    return 'Erro no upload da imagem. Verifique a configuracao de armazenamento do Supabase.'
  }

  if (message.toLowerCase().includes('administrador')) {
    return message
  }

  if (message.toLowerCase().includes('permission denied')) {
    return 'Permissao negada no Supabase. Verifique se sua conta e perfil sao admin.'
  }

  if (message.toLowerCase().includes('nao foi possivel')) {
    return message
  }

  return 'Nao foi possivel concluir a operacao no Supabase.'
=======
  const message = error?.message ?? ''
  if (message.includes('duplicate')) return 'Esse registro já existe no banco de dados.'
  if (message.includes('imagem') || message.includes('administrador') || message.includes('Preencha o CEP') || message.includes('Revise o horário') || message.includes('alterações')) return message
  if (message.includes('row-level security')) return 'Seu projeto Supabase precisa liberar as permissões dessa operação.'
  if (message.includes('Não foi possível')) return message
  return 'Não foi possível concluir a operação no Supabase.'
>>>>>>> 11e7f49e445133affafc7d97406b35641974568c
}
</script>