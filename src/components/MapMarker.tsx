
import { Construction } from '@/types/construction';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MarkerOptions {
  map: any;
  construction: Construction;
  onMarkerClick?: (construction: Construction) => void;
  mapboxgl: any;
}

/**
 * Creates a custom Mapbox marker for a construction
 * @param options Options for creating the marker
 * @returns The created Mapbox marker
 */
export const createMapMarker = ({ 
  map, 
  construction, 
  onMarkerClick,
  mapboxgl 
}: MarkerOptions): any => {
  const { latitude, longitude, status } = construction;
  
  if (!latitude || !longitude) {
    throw new Error('Invalid coordinates for marker');
  }

  // Create custom marker element
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '32px';
  el.style.height = '32px';
  el.style.borderRadius = '50%';
  el.style.background = status === 'approved' ? '#10b981' : '#f59e0b';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.color = 'white';
  el.style.fontWeight = 'bold';
  el.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  el.style.cursor = 'pointer';
  el.style.border = '2px solid white';
  el.innerHTML = `<span>${construction.constructionArea}</span>`;
  
  // Create the marker
  const marker = new mapboxgl.Marker(el)
    .setLngLat([longitude, latitude])
    .addTo(map);
    
  // Add click event listener
  el.addEventListener('click', () => {
    if (onMarkerClick) {
      onMarkerClick(construction);
    }
    
    // Create popup content
    const popupContent = `
      <div class="font-medium">${construction.address}</div>
      <div class="text-sm text-gray-600">
        ${construction.companyName}
      </div>
      <div class="text-sm mt-2">
        <span class="font-medium">Status:</span> 
        <span class="${status === 'approved' ? 'text-green-600' : 'text-amber-600'}">
          ${status === 'approved' ? 'Aprovada' : 'Em aprovação'}
        </span>
      </div>
    `;
    
    new mapboxgl.Popup({ offset: 25 })
      .setLngLat([longitude, latitude])
      .setHTML(popupContent)
      .addTo(map);
  });
  
  return marker;
};
