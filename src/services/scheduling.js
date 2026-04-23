import { assertSupabaseConfigured, supabase, TABLES } from '@/services/supabase'

const unitSelect = '*'

const specialtySelect = 'id, name, created_at'

const doctorSelect = `
  id,
  unit_id,
  specialty_id,
  full_name,
  crm,
  notes,
  is_active,
  created_at,
  updated_at,
  unit:units!doctors_unit_id_fkey(*),
  specialty:specialties!doctors_specialty_id_fkey(
    id,
    name
  )
`

const scheduleSelect = `
  id,
  unit_id,
  specialty_id,
  starts_at,
  is_available,
  status,
  created_at,
  unit:units!schedules_unit_id_fkey(*),
  specialty:specialties!schedules_specialty_id_fkey(
    id,
    name
  ),
  doctor:doctors!schedules_doctor_id_fkey(
    id,
    full_name,
    crm,
    notes,
    unit_id,
    specialty_id
  )
`

const appointmentSelect = `
  id,
  patient_id,
  schedule_id,
  status,
  created_at,
  updated_at,
  patient:profiles!appointments_patient_id_fkey(*),
  schedule:schedules!appointments_schedule_id_fkey(
    id,
    starts_at,
    is_available,
    status,
    unit:units!schedules_unit_id_fkey(*),
    specialty:specialties!schedules_specialty_id_fkey(
      id,
      name
    )
  )
`

export async function fetchUnits() {
  const { data, error } = await supabase
    .from(TABLES.units)
    .select(unitSelect)
    .order('name')

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createUnit(payload) {
  let { data, error } = await supabase
    .from(TABLES.units)
    .insert([payload])
    .select(unitSelect)
    .single()

  if (error && hasMissingColumnError(error)) {
    const retry = await supabase
      .from(TABLES.units)
      .insert([buildUnitPayloadWithoutOptionalColumns(payload)])
      .select(unitSelect)
      .single()

    data = retry.data
    error = retry.error
  }

  if (error) {
    throw error
  }

  return data
}

export async function uploadUnitImage(file) {
  assertSupabaseConfigured()

  if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
    throw new Error('Selecione uma imagem valida para a unidade.')
  }

  if (!String(file.type).startsWith('image/')) {
    throw new Error('Envie um arquivo de imagem para a foto da unidade.')
  }

  const fileExtension = String(file.name).split('.').pop()?.toLowerCase() || 'jpg'
  const fileName =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const filePath = `units/${fileName}.${fileExtension}`
  const contentType = String(file.type || 'image/jpeg').trim() || 'image/jpeg'

  const { error } = await supabase.storage
    .from('unit-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    })

  if (error) {
    const message = error.message || error.details || error.hint || 'Falha ao enviar a imagem da unidade.'
    throw new Error(message)
  }

  const { data } = supabase.storage.from('unit-images').getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}

export async function fetchSpecialties() {
  const { data, error } = await supabase
    .from(TABLES.specialties)
    .select(specialtySelect)
    .order('name')

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createSpecialty(name) {
  const { data, error } = await supabase
    .from(TABLES.specialties)
    .insert([{ name }])
    .select(specialtySelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fetchDoctors() {
  const { data, error } = await supabase
    .from(TABLES.doctors)
    .select(doctorSelect)
    .order('full_name', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createDoctor(payload) {
  const { data, error } = await supabase
    .from(TABLES.doctors)
    .insert([payload])
    .select(doctorSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateDoctor(doctorId, payload) {
  const { data, error } = await supabase
    .from(TABLES.doctors)
    .update(payload)
    .eq('id', doctorId)
    .select(doctorSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fetchSchedules() {
  const { data, error } = await supabase
    .from(TABLES.schedules)
    .select(scheduleSelect)
    .order('starts_at', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function fetchAvailableSchedulesByUnit(unitId) {
  let query = supabase
    .from(TABLES.schedules)
    .select(scheduleSelect)
    .eq('is_available', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  if (unitId) {
    query = query.eq('unit_id', unitId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data ?? []
}

export async function fetchAvailableSchedulesByUnitAndSpecialty(unitId, specialtyId) {
  let query = supabase
    .from(TABLES.schedules)
    .select(scheduleSelect)
    .eq('is_available', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  if (unitId) {
    query = query.eq('unit_id', unitId)
  }

  if (specialtyId) {
    query = query.eq('specialty_id', specialtyId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createSchedule(payload) {
  const { data, error } = await supabase
    .from(TABLES.schedules)
    .insert([
      {
        ...payload,
        is_available: true,
        status: 'disponivel',
      },
    ])
    .select(scheduleSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateSchedule(scheduleId, payload) {
  const { data, error } = await supabase
    .from(TABLES.schedules)
    .update(payload)
    .eq('id', scheduleId)
    .select(scheduleSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fetchAppointments() {
  const { data, error } = await supabase
    .from(TABLES.appointments)
    .select(appointmentSelect)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function fetchAppointmentsByPatient(patientId) {
  const { data, error } = await supabase
    .from(TABLES.appointments)
    .select(appointmentSelect)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createAppointment({ patientId, scheduleId }) {
  const { data, error } = await supabase
    .from(TABLES.appointments)
    .insert([
      {
        patient_id: patientId,
        schedule_id: scheduleId,
        status: 'pendente',
      },
    ])
    .select(appointmentSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateAppointmentStatus(appointmentId, status) {
  const { data, error } = await supabase
    .from(TABLES.appointments)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select(appointmentSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function cancelAppointment(appointmentId) {
  return updateAppointmentStatus(appointmentId, 'cancelado')
}

export async function rescheduleAppointment({ appointmentId, scheduleId }) {
  const { data, error } = await supabase
    .from(TABLES.appointments)
    .update({
      schedule_id: scheduleId,
      status: 'pendente',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select(appointmentSelect)
    .single()

  if (error) {
    throw error
  }

  return data
}

function hasMissingColumnError(error) {
  return error?.code === 'PGRST204' || error?.code === '42703'
}

function buildUnitPayloadWithoutOptionalColumns(payload = {}) {
  const fallbackPayload = {
    name: payload.name,
    cep: payload.cep,
    street: payload.street,
    neighborhood: payload.neighborhood,
    city: payload.city,
    state: payload.state,
  }

  if (payload.address_label) {
    fallbackPayload.address_label = payload.address_label
  }

  return fallbackPayload
}

