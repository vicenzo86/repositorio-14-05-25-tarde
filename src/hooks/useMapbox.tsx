
import { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Construction } from '../types/Construction';
import { checkWebGLSupport, isMobileDevice } from '../utils/webGLDetection';

const useMapbox = (constructions: Construction[], mapboxToken: string) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);
  const isInitializing = useRef(false);
  const lastConstructions = useRef([]);

  // Verificar suporte a WebGL apenas uma vez
  useEffect(() => {
    if (typeof window !== 'undefined' && !checkedSupport) {
      const supported = checkWebGLSupport() && !isMobileDevice();
      setMapboxSupported(supported);
      setCheckedSupport(true);
    }
  }, [checkedSupport]);

  // Inicializar o mapa apenas uma vez
  useEffect(() => {
    // Evitar inicialização em SSR ou se já estiver inicializando
    if (typeof window === 'undefined' || isInitializing.current) return;
    
    // Verificar pré-condições
    if (
      map.current || 
      !mapContainer.current || 
      !mapboxToken || 
      !checkedSupport || 
      !mapboxSupported
    ) {
      return;
    }

    isInitializing.current = true;

    const initializeMap = async () => {
      try {
        mapboxgl.accessToken = mapboxToken;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-46.6333, -23.5505], // São Paulo
          zoom: 10
        });

        newMap.on('load', () => {
          map.current = newMap;
          isInitializing.current = false;
        });

        newMap.on('error', (e) => {
          console.error('Erro no Mapbox:', e);
          isInitializing.current = false;
        });
      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        isInitializing.current = false;
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      isInitializing.current = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, checkedSupport, mapboxSupported]);

  // Remover todos os marcadores
  const removeAllMarkers = useCallback(() => {
    if (markers.current.length > 0) {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    }
  }, []);

  // Adicionar marcadores ao mapa
  const addMarkersToMap = useCallback(() => {
    if (!map.current || !constructions || constructions.length === 0) return;

    // Evitar atualizações desnecessárias
    if (JSON.stringify(lastConstructions.current) === JSON.stringify(constructions)) {
      return;
    }

    removeAllMarkers();

    constructions.forEach(construction => {
      if (!construction.latitude || !construction.longitude) return;

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = 'red';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([construction.longitude, construction.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${construction.name}</h3><p>${construction.address}</p>`)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });

    lastConstructions.current = [...constructions];

    // Ajustar o mapa para mostrar todos os marcadores
    if (markers.current.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      constructions.forEach(construction => {
        if (construction.latitude && construction.longitude) {
          bounds.extend([construction.longitude, construction.latitude]);
        }
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [constructions, removeAllMarkers]);

  // Adicionar marcadores quando o mapa estiver pronto e as construções mudarem
  useEffect(() => {
    if (map.current) {
      addMarkersToMap();
    }
  }, [map.current, constructions, addMarkersToMap]);

  return {
    mapContainer,
    mapboxSupported,
    checkedSupport
  };
};

export default useMapbox;
