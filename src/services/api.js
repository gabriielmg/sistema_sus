import { sanitizeCep } from '@/utils/formatters'

const VIACEP_URL = import.meta.env.DEV ? '/api/viacep' : 'https://viacep.com.br/ws'
const NOMINATIM_BASE_URL = import.meta.env.DEV ? '/api/nominatim' : 'https://nominatim.openstreetmap.org'
const NOMINATIM_SEARCH_URL = `${NOMINATIM_BASE_URL}/search`
const NOMINATIM_REVERSE_URL = `${NOMINATIM_BASE_URL}/reverse`
const FALLBACK_LOCATION_LABEL = 'Sua localizacao atual'

export async function fetchAddressByCep(rawCep) {
  const cep = sanitizeCep(rawCep)

  if (cep.length !== 8) {
    throw new Error('Informe um CEP com 8 digitos.')
  }

  const response = await fetch(`${VIACEP_URL}/${cep}/json/`)
  const data = await response.json()

  if (!response.ok || data.erro) {
    throw new Error('Nao foi possivel localizar esse CEP.')
  }

  return data
}

export function buildAddressFromViaCep(address) {
  const parts = [
    address.logradouro,
    address.bairro,
    address.localidade,
    address.uf,
    'Brasil',
  ].filter(Boolean)

  return parts.join(', ')
}

export async function geocodeAddress(rawAddress) {
  if (!rawAddress) {
    return null
  }

  const params = new URLSearchParams({
    q: rawAddress,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'br',
    addressdetails: '1',
  })

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'pt-BR',
    },
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel converter o endereco em coordenadas.')
  }

  const results = await response.json()
  const first = results?.[0]

  if (!first) {
    return null
  }

  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
  }
}

export async function geocodeCep(rawCep) {
  const address = await fetchAddressByCep(rawCep)
  const fullAddress = buildAddressFromViaCep(address)
  const coordinates = await geocodeAddress(fullAddress)

  return {
    address,
    coordinates,
    label: fullAddress,
  }
}

export async function reverseGeocodeCoordinates({ lat, lng }) {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    return null
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    zoom: '16',
    addressdetails: '1',
  })

  const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'pt-BR',
    },
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return buildLocationLabel(result)
}

export async function getCurrentLocation() {
  const coordinates = await getCurrentCoordinates()
  let label = FALLBACK_LOCATION_LABEL

  try {
    label = (await reverseGeocodeCoordinates(coordinates)) || FALLBACK_LOCATION_LABEL
  } catch {
    label = FALLBACK_LOCATION_LABEL
  }

  return {
    coordinates,
    label,
  }
}

export function haversineDistanceInKm(from, to) {
  const fromLat = Number(from?.lat)
  const fromLng = Number(from?.lng)
  const toLat = Number(to?.lat)
  const toLng = Number(to?.lng)

  if (!Number.isFinite(fromLat) || !Number.isFinite(fromLng) || !Number.isFinite(toLat) || !Number.isFinite(toLng)) {
    return Number.POSITIVE_INFINITY
  }

  const earthRadiusKm = 6371
  const latDelta = toRadians(toLat - fromLat)
  const lngDelta = toRadians(toLng - fromLng)
  const fromLatRadians = toRadians(fromLat)
  const toLatRadians = toRadians(toLat)

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLatRadians) * Math.cos(toLatRadians) * Math.sin(lngDelta / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

function toRadians(value) {
  return (value * Math.PI) / 180
}

function getCurrentCoordinates() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocalizacao nao e suportada neste navegador.')
  }

  if (window.isSecureContext === false) {
    throw new Error('A localizacao automatica precisa que o sistema esteja em HTTPS ou localhost.')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(mapGeolocationError(error))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  })
}

function buildLocationLabel(result = {}) {
  const address = result.address ?? {}
  const parts = [
    address.road || address.pedestrian || address.footway,
    address.suburb || address.neighbourhood || address.city_district,
    address.city || address.town || address.village || address.municipality,
    address.state,
  ].filter(Boolean)

  return parts.join(', ') || result.display_name || null
}

function mapGeolocationError(error) {
  const code = Number(error?.code)

  if (code === 1) {
    return new Error('Permita o acesso a localizacao para encontrar as unidades mais proximas.')
  }

  if (code === 2) {
    return new Error('Nao foi possivel identificar sua localizacao agora.')
  }

  if (code === 3) {
    return new Error('A busca pela sua localizacao demorou mais do que o esperado. Tente novamente.')
  }

  return new Error('Nao foi possivel obter sua localizacao.')
}
