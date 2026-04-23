const WAITLIST_STORAGE_KEY = 'sistema-sus-waitlist'
const NOTIFICATION_STORAGE_KEY = 'sistema-sus-notifications'

export function estimateArrivalMinutes(distanceKm = 0) {
  const km = Number(distanceKm)

  if (!Number.isFinite(km) || km === Number.POSITIVE_INFINITY) {
    return null
  }

  return Math.max(5, Math.round(km * 4 + 6))
}

export function formatArrivalLabel(minutes) {
  if (!Number.isFinite(Number(minutes))) {
    return 'Tempo indisponivel'
  }

  if (Number(minutes) < 60) {
    return `~${Math.round(minutes)} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainder = Math.round(minutes % 60)

  return remainder ? `~${hours}h ${remainder}min` : `~${hours}h`
}

export function loadWaitlistEntries() {
  return readStorageList(WAITLIST_STORAGE_KEY)
}

export function addWaitlistEntry(entry) {
  const current = loadWaitlistEntries()
  const next = [
    {
      id: createLocalId('wait'),
      createdAt: new Date().toISOString(),
      status: 'fila',
      ...entry,
    },
    ...current,
  ]

  writeStorageList(WAITLIST_STORAGE_KEY, next)
  return next[0]
}

export function removeWaitlistEntry(entryId) {
  const next = loadWaitlistEntries().filter((entry) => String(entry.id) !== String(entryId))
  writeStorageList(WAITLIST_STORAGE_KEY, next)
  return next
}

export function loadNotifications() {
  return readStorageList(NOTIFICATION_STORAGE_KEY)
}

export function pushNotifications(items) {
  const current = loadNotifications()
  const next = [...items, ...current].slice(0, 50)
  writeStorageList(NOTIFICATION_STORAGE_KEY, next)
  return next
}

export function createAppointmentNotifications({ appointment, patientName, unitName, specialtyName, doctorName }) {
  const startsAt = new Date(appointment?.schedule?.starts_at ?? appointment?.starts_at)

  if (Number.isNaN(startsAt.getTime())) {
    return []
  }

  const oneDayBefore = new Date(startsAt.getTime() - 24 * 60 * 60 * 1000)
  const twoHoursBefore = new Date(startsAt.getTime() - 2 * 60 * 60 * 1000)

  return [
    {
      id: createLocalId('notif'),
      kind: 'confirmacao',
      title: 'Consulta confirmada',
      message: `${patientName || 'Seu atendimento'} esta marcado em ${unitName} com ${doctorName}.`,
      scheduledFor: new Date().toISOString(),
      appointmentId: appointment.id,
      status: 'enviada',
    },
    {
      id: createLocalId('notif'),
      kind: 'lembrete-1d',
      title: 'Lembrete de 1 dia',
      message: `Lembrar ${patientName || 'o paciente'} sobre a consulta de ${specialtyName} em ${unitName}.`,
      scheduledFor: oneDayBefore.toISOString(),
      appointmentId: appointment.id,
      status: oneDayBefore.getTime() <= Date.now() ? 'pronta' : 'agendada',
    },
    {
      id: createLocalId('notif'),
      kind: 'lembrete-2h',
      title: 'Lembrete de 2 horas',
      message: `Ultimo aviso para ${patientName || 'o paciente'} antes da consulta em ${unitName}.`,
      scheduledFor: twoHoursBefore.toISOString(),
      appointmentId: appointment.id,
      status: twoHoursBefore.getTime() <= Date.now() ? 'pronta' : 'agendada',
    },
  ]
}

export function formatNotificationSchedule(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Agora'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function readStorageList(key) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorageList(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function createLocalId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
