import { sanitizeCep } from '@/utils/formatters'

const VIACEP_URL = 'https://viacep.com.br/ws'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

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

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
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

export function haversineDistanceInKm(from, to) {
  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
    return Number.POSITIVE_INFINITY
  }

  const earthRadiusKm = 6371
  const latDelta = toRadians(to.lat - from.lat)
  const lngDelta = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

function toRadians(value) {
  return (value * Math.PI) / 180
}
