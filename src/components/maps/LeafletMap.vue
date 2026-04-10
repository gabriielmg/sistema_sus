<template>
  <div class="glass-panel h-[420px] overflow-hidden p-3 lg:h-[560px]">
    <div ref="mapElement" class="h-full w-full" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ lat: -23.55052, lng: -46.633308, zoom: 11 }),
  },
  units: {
    type: Array,
    default: () => [],
  },
  selectedUnitId: {
    type: [Number, String],
    default: null,
  },
  searchLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select-unit'])

const mapElement = ref(null)
let mapInstance
let tileLayer
let searchMarker
let markerLayer

onMounted(() => {
  mapInstance = L.map(mapElement.value, {
    zoomControl: true,
    attributionControl: true,
  }).setView([props.center.lat, props.center.lng], props.center.zoom ?? 11)

  tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  })

  tileLayer.addTo(mapInstance)
  renderSearchMarker()
  renderUnits()

  setTimeout(() => {
    mapInstance.invalidateSize()
  }, 0)
})

onBeforeUnmount(() => {
  mapInstance?.remove()
})

watch(
  () => props.center,
  (nextCenter) => {
    if (!mapInstance || !nextCenter?.lat || !nextCenter?.lng) {
      return
    }

    mapInstance.flyTo([nextCenter.lat, nextCenter.lng], nextCenter.zoom ?? mapInstance.getZoom(), {
      animate: true,
      duration: 0.75,
    })

    renderSearchMarker()
  },
  { deep: true },
)

watch(
  () => [props.units, props.selectedUnitId],
  () => {
    renderUnits()
  },
  { deep: true },
)

function renderSearchMarker() {
  if (!mapInstance || !props.center?.lat || !props.center?.lng) {
    return
  }

  searchMarker?.remove()

  if (!props.searchLabel) {
    searchMarker = null
    return
  }

  searchMarker = L.circleMarker([props.center.lat, props.center.lng], {
    radius: 10,
    fillColor: '#0f9b6d',
    fillOpacity: 0.95,
    color: '#ffffff',
    weight: 3,
  }).addTo(mapInstance)

  if (props.searchLabel) {
    searchMarker.bindPopup(`<strong>CEP buscado</strong><br>${props.searchLabel}`)
  }
}

function renderUnits() {
  if (!mapInstance) {
    return
  }

  markerLayer?.remove()
  markerLayer = L.layerGroup()

  props.units
    .filter((unit) => Number.isFinite(Number(unit.latitude)) && Number.isFinite(Number(unit.longitude)))
    .forEach((unit) => {
      const isSelected = String(unit.id) === String(props.selectedUnitId)
      const marker = L.circleMarker([Number(unit.latitude), Number(unit.longitude)], {
        radius: isSelected ? 11 : 9,
        fillColor: isSelected ? '#1d5fd1' : '#0f9b6d',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 3,
      })

      marker.bindPopup(
        `<strong>${unit.name}</strong><br>${unit.address_label || [unit.street, unit.city, unit.state].filter(Boolean).join(', ')}`,
      )

      marker.on('click', () => {
        emit('select-unit', unit)
      })

      marker.addTo(markerLayer)
    })

  markerLayer.addTo(mapInstance)
}
</script>
