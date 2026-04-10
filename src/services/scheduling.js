import { supabase, TABLES } from '@/services/supabase'

const unitSelect =
  'id, name, cep, street, neighborhood, city, state, address_label, latitude, longitude, created_at'

const specialtySelect = 'id, name, created_at'

const scheduleSelect = `
  id,
  unit_id,
  specialty_id,
  starts_at,
  is_available,
  status,
  created_at,
  unit:units!schedules_unit_id_fkey(
    id,
    name,
    cep,
    street,
    neighborhood,
    city,
    state,
    address_label,
    latitude,
    longitude
  ),
  specialty:specialties!schedules_specialty_id_fkey(
    id,
    name
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
    unit:units!schedules_unit_id_fkey(
      id,
      name,
      cep,
      street,
      neighborhood,
      city,
      state,
      address_label,
      latitude,
      longitude
    ),
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
  const { data, error } = await supabase
    .from(TABLES.units)
    .insert([payload])
    .select(unitSelect)
    .single()

  if (error) {
    throw error
  }

  return data
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
