import { useEffect, useRef, useState } from 'react';
import { Construction } from '@/types/construction';
import { toast } from '@/components/ui/use-toast';
import { createMapMarker } from '@/components/MapMarker';
import { checkWebGLSupport, isMobileDevice } from '@/utils/webGLDetection';

// Definição do tipo para o objeto global mapboxgl
declare global {
  interface Window {
    mapboxgl: any;
  }
}

// Default Mapbox token - public and valid
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoidmljZW56bzE5ODYiLCJhIjoiY21hOTJ1dDk3MW43ajJwcHdtancwbG9zbSJ9.TTMx21fG8mpx04i1h2hl-Q';

interface UseMapboxProps {
  constructions: Construction[];
  onMarkerClick?: (construction: Construction) => void;
  center?: [number, number];
  zoom?: number;
}

export const useMapbox = ({
  constructions,
  onMarkerClick,
  center = [-49.6401, -27.2423],
  zoom = 9
}: UseMapboxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any | null>(null);
  const markers = useRef<any[]>([]);
  const [mapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);
  const [renderAttempts, setRenderAttempts] = useState(0);
  const maxRenderAttempts = 2;

  // Check WebGL support and device type
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.mapboxgl) {
        console.error('Mapbox GL não está definido no window. Verifique se os scripts foram carregados.');
        setMapboxSupported(false);
        setMapError('Biblioteca do Mapbox não foi carregada corretamente.');
        return;
      }
      
      const isMobile = isMobileDevice();
      console.log("Device check:", { isMobile });
      
      const supportsWebGL = checkWebGLSupport();
      
      if (!supportsWebGL) {
        console.log("WebGL not supported, using fallback view");
        setMapboxSupported(false);
        setMapError(isMobile 
          ? "Seu dispositivo móvel não suporta mapas 3D. Usando visualização em lista." 
          : "Seu navegador não suporta WebGL, necessário para exibir o mapa.");
      }
      
      setCheckedSupport(true);
    } catch (error) {
      console.error("Erro ao verificar suporte:", error);
      setMapboxSupported(false);
      setMapError("Erro ao verificar compatibilidade do navegador.");
    }
  }, []);

  // Initialize map with retry logic
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !checkedSupport || !mapboxSupported || renderAttempts >= maxRenderAttempts) {
      console.log("Map initialization skipped:", { 
        hasContainer: !!mapContainer.current, 
        hasToken: !!mapboxToken, 
        checkedSupport, 
        mapboxSupported,
        renderAttempts,
        mapboxGlobal: typeof window !== 'undefined' ? !!window.mapboxgl : false
      });
      return;
    }

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      console.log("Initializing Mapbox with token:", mapboxToken);
      
      if (!window.mapboxgl) {
        throw new Error('Mapbox GL não está definido no objeto window. Verifique se os scripts foram carregados.');
      }
      
      window.mapboxgl.accessToken = mapboxToken;
      // Desabilitar Web Workers para teste no Vercel
      window.mapboxgl.workerCount = 0;
      
      const mapStyle = renderAttempts > 0 
        ? 'mapbox://styles/mapbox/light-v11' 
        : 'mapbox://styles/mapbox/streets-v12';
        
      const newMap = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
        attributionControl: true,
        preserveDrawingBuffer: true,
        antialias: false, 
        fadeDuration: 0,   
        maxZoom: 19,
        minZoom: 3,
        pitch: 0, 
        renderWorldCopies: true,
        maxParallelImageRequests: 4 // Ajustado para um valor um pouco maior, mas ainda conservador
      });

      newMap.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      
      newMap.on('load', () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
        setMapError(null);
        toast({
          title: "Mapa carregado",
          description: "O mapa foi carregado com sucesso!",
        });
      });

      newMap.on('error', (e: any) => {
        console.error('Mapbox error:', e);
        
        if (renderAttempts < maxRenderAttempts - 1) {
          console.log(`Retry attempt ${renderAttempts + 1} of ${maxRenderAttempts}`);
          setRenderAttempts(prev => prev + 1);
          return;
        }
        
        setMapError("Erro ao carregar o mapa. Usando visualização alternativa.");
        setMapboxSupported(false);
        toast({
          title: "Erro ao carregar o mapa",
          description: "Não foi possível carregar o mapa. Usando visualização alternativa.",
          variant: "destructive"
        });
      });

      map.current = newMap;
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      setMapError("Erro ao inicializar o mapa. Usando visualização alternativa.");
      setMapboxSupported(false);
      
      if (error instanceof Error) {
        console.error("Mapbox initialization error details:", {
          message: error.message,
          stack: error.stack
        });
      }
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, center, zoom, checkedSupport, mapboxSupported, renderAttempts]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !mapboxToken || !mapboxSupported || !window.mapboxgl) return;
    
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    constructions.forEach(construction => {
      try {
        if (!construction.latitude || !construction.longitude) return;
        
        const marker = createMapMarker({
          map: map.current!,
          construction,
          onMarkerClick,
          mapboxgl: window.mapboxgl
        });
        
        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [constructions, mapboxToken, onMarkerClick, mapLoaded, mapboxSupported]);

  return {
    mapContainer,
    mapboxSupported,
    mapError,
    mapLoaded
  };
};
