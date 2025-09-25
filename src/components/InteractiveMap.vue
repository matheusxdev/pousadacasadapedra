<template>
  <div class="interactive-map">
    <div class="map-header">
      <div class="map-search">
        <Icon name="heroicons:magnifying-glass" class="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar em Búzios..." 
          v-model="searchQuery"
          @keyup.enter="searchLocation"
          class="search-input"
        />
      </div>
      <button class="map-menu-btn" @click="toggleMenu">
        <Icon name="heroicons:ellipsis-vertical" />
      </button>
    </div>
    
    <div class="map-container" ref="mapContainer"></div>
    
    <div class="map-overlay">
      <div class="map-info">
        <h3>Explore Búzios</h3>
        <p>Descubra as melhores praias e pontos turísticos</p>
        <button class="map-cta-btn" @click="openFullMap">
          <span>Ver no Maps</span>
          <Icon name="heroicons:arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Leaflet imports
let L: any = null
let map: any = null
let markers: any[] = []

const mapContainer = ref<HTMLElement>()
const searchQuery = ref('')
const menuOpen = ref(false)

// Búzios coordinates and points of interest
const buziosCenter = [-22.7512, -41.8812]
const pointsOfInterest = [
  {
    id: 'geriba',
    name: 'Praia de Geribá',
    position: [-22.7489, -41.8756],
    type: 'beach',
    icon: '🏖️',
    description: 'Uma das praias mais famosas de Búzios'
  },
  {
    id: 'centro',
    name: 'Centro de Búzios',
    position: [-22.7512, -41.8812],
    type: 'center',
    icon: '🏛️',
    description: 'Centro histórico com lojas e restaurantes'
  },
  {
    id: 'ferradura',
    name: 'Praia da Ferradura',
    position: [-22.7534, -41.8789],
    type: 'beach',
    icon: '🌊',
    description: 'Praia em formato de ferradura'
  },
  {
    id: 'joao-fernandes',
    name: 'Praia de João Fernandes',
    position: [-22.7478, -41.8734],
    type: 'beach',
    icon: '🏄',
    description: 'Praia ideal para esportes aquáticos'
  },
  {
    id: 'casa-da-pedra',
    name: 'Grupo Caminué',
    position: [-22.7512, -41.8812],
    type: 'accommodation',
    icon: '🏨',
    description: 'Nossa pousada no centro de Búzios'
  }
]

onMounted(async () => {
  try {
    // Dynamically import Leaflet
    L = await import('leaflet')
    
    // Import Leaflet CSS via link tag
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
      document.head.appendChild(link)
    }
    
    // Fix for Leaflet default markers
    delete (L as any).Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
    
    // Wait for DOM to be ready
    await nextTick()
    
    // Initialize map
    initMap()
  } catch (error) {
    console.error('Error loading Leaflet:', error)
    // Fallback to static map
    showStaticMap()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

const initMap = () => {
  if (!mapContainer.value || !L) return
  
  try {
    // Initialize map
    map = L.map(mapContainer.value, {
      center: buziosCenter,
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: false
    })
    
    // Add tile layer with better configuration
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      tileSize: 256,
      zoomOffset: 0,
      updateWhenIdle: true,
      keepBuffer: 2,
      updateWhenZooming: false
    })
    
    tileLayer.addTo(map)
    
    // Add custom markers
    addMarkers()
    
    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }
    
    console.log('Map initialized successfully')
  } catch (error) {
    console.error('Error initializing map:', error)
    showStaticMap()
  }
}

const addMarkers = () => {
  if (!map || !L) return
  
  pointsOfInterest.forEach(point => {
    try {
      // Create custom icon
      const customIcon = L.divIcon({
        html: `<div class="custom-marker">${point.icon}</div>`,
        className: 'custom-marker-container',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
      
      // Add marker
      const marker = L.marker(point.position, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="marker-popup">
            <h4>${point.name}</h4>
            <p>${point.description}</p>
          </div>
        `)
      
      markers.push(marker)
    } catch (error) {
      console.error('Error adding marker:', error)
    }
  })
}

const searchLocation = () => {
  if (!searchQuery.value.trim() || !map) return
  
  // Simple search functionality
  const foundPoint = pointsOfInterest.find(point => 
    point.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  
  if (foundPoint) {
    map.setView(foundPoint.position, 16)
    // Open popup for the found point
    const marker = markers.find(m => 
      m.getLatLng().lat === foundPoint.position[0] && 
      m.getLatLng().lng === foundPoint.position[1]
    )
    if (marker) {
      marker.openPopup()
    }
  }
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  console.log('Menu toggled:', menuOpen.value)
}

const openFullMap = () => {
  window.open('https://www.google.com/maps?q=Búzios,+RJ,+Brasil', '_blank')
}

const showStaticMap = () => {
  if (!mapContainer.value) return
  
  mapContainer.value.innerHTML = `
    <div class="static-map-fallback">
      <div class="static-map-content">
        <h3>Mapa de Búzios</h3>
        <p>Centro de Búzios, RJ</p>
        <button onclick="window.open('https://www.google.com/maps?q=Búzios,+RJ,+Brasil', '_blank')" class="static-map-btn">
          Ver no Google Maps
        </button>
      </div>
    </div>
  `
}
</script>

<style scoped>
.interactive-map {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.map-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.map-search {
  flex: 1;
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #1E3A8A;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
  background: transparent;
}

.search-input::placeholder {
  color: #6b7280;
}

.map-menu-btn {
  width: 44px;
  height: 44px;
  background: #1E3A8A;
  border: none;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
}

.map-menu-btn:hover {
  background: #1e40af;
  transform: translateY(-1px);
}

.map-menu-btn svg {
  width: 20px;
  height: 20px;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8fafc;
}

/* Leaflet map styles */
:global(.leaflet-container) {
  background: #f8fafc !important;
  font-family: inherit !important;
}

:global(.leaflet-tile) {
  filter: none !important;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

:global(.leaflet-tile-container) {
  background: #f8fafc !important;
}

/* Fix for white squares */
:global(.leaflet-tile-pane) {
  background: #f8fafc !important;
}

:global(.leaflet-overlay-pane) {
  background: transparent !important;
}

/* Static map fallback */
.static-map-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.static-map-content {
  text-align: center;
  color: #1a1a1a;
  padding: 2rem;
}

.static-map-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.static-map-content p {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.static-map-btn {
  padding: 0.75rem 1.5rem;
  background: #1E3A8A;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.static-map-btn:hover {
  background: #1e40af;
  transform: translateY(-1px);
}

.map-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1.5rem;
  color: white;
  z-index: 1000;
}

.map-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.map-info p {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.map-cta-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.map-cta-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.map-cta-btn svg {
  width: 16px;
  height: 16px;
}

/* Custom marker styles */
:global(.custom-marker-container) {
  background: transparent !important;
  border: none !important;
}

:global(.custom-marker) {
  width: 30px;
  height: 30px;
  background: #1E3A8A;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

:global(.custom-marker:hover) {
  transform: scale(1.2);
  background: #1e40af;
}

:global(.marker-popup) {
  text-align: center;
}

:global(.marker-popup h4) {
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  font-size: 1rem;
}

:global(.marker-popup p) {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Custom zoom controls */
:global(.custom-zoom-control) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

:global(.zoom-btn) {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.zoom-btn:hover) {
  background: #f3f4f6;
  color: #1E3A8A;
}

:global(.zoom-btn:first-child) {
  border-bottom: 1px solid #e5e7eb;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive */
@media (max-width: 768px) {
  .interactive-map {
    height: 250px;
  }
  
  .map-header {
    padding: 0.75rem;
  }
  
  .map-overlay {
    padding: 1rem;
  }
  
  .map-info h3 {
    font-size: 1.125rem;
  }
  
  .map-info p {
    font-size: 0.75rem;
  }
  
  .map-cta-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .interactive-map {
    height: 200px;
  }
  
  .map-header {
    padding: 0.5rem;
  }
  
  .map-menu-btn {
    width: 36px;
    height: 36px;
  }
  
  .map-menu-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style>
