import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // Importar diretamente do pacote npm
import "mapbox-gl/dist/mapbox-gl.css"; // Importar o CSS do Mapbox
import { Construction } from "@/types/construction";
import { toast } from "@/components/ui/use-toast";
import { createMapMarker } from "@/components/MapMarker";
import { checkWebGLSupport, isMobileDevice } from "@/utils/webGLDetection";

// Removido: declare global ... window.mapboxgl, pois agora importamos diretamente

const DEFAULT_MAPBOX_TOKEN = "pk.eyJ1IjoidmljZW56bzE5ODYiLCJhIjoiY21hOTJ1dDk3MW43ajJwcHdtancwbG9zbSJ9.TTMx21fG8mpx04i1h2hl-Q";

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
  zoom = 9,
}: UseMapboxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null); // Usar o tipo Map do mapboxgl
  const markers = useRef<mapboxgl.Marker[]>([]); // Usar o tipo Marker do mapboxgl
  const [mapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);
  const [renderAttempts, setRenderAttempts] = useState(0);
  const maxRenderAttempts = 2;

  // Effect to check WebGL support (Mapbox GL JS object is now available via import)
  useEffect(() => {
    try {
      const isMobile = isMobileDevice();
      console.log("Device check:", { isMobile });
      const supportsWebGL = checkWebGLSupport();
      if (!supportsWebGL) {
        console.log("WebGL not supported, using fallback view");
        setMapboxSupported(false);
        setMapError(
          isMobile
            ? "Seu dispositivo móvel não suporta mapas 3D. Usando visualização em lista."
            : "Seu navegador não suporta WebGL, necessário para exibir o mapa."
        );
      } else {
        setMapboxSupported(true);
      }
    } catch (error) {
      console.error("Erro ao verificar suporte WebGL:", error);
      setMapboxSupported(false);
      setMapError("Erro ao verificar compatibilidade do navegador.");
    }
    setCheckedSupport(true);
  }, []);

  // Initialize map
  useEffect(() => {
    // A verificação de mapboxScriptLoaded não é mais necessária da mesma forma, pois o import garante a disponibilidade
    if (!mapContainer.current || !mapboxToken || !checkedSupport || !mapboxSupported || renderAttempts >= maxRenderAttempts) {
      console.log("Map initialization skipped:", {
        hasContainer: !!mapContainer.current,
        hasToken: !!mapboxToken,
        checkedSupport,
        mapboxSupported,
        renderAttempts,
      });
      if (checkedSupport && !mapboxSupported && !mapError) {
        setMapError("Mapbox não é suportado neste navegador ou dispositivo.");
      }
      return;
    }

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      console.log("Initializing Mapbox with token:", mapboxToken);
      mapboxgl.accessToken = mapboxToken; // Usar o mapboxgl importado

      const mapStyle =
        renderAttempts > 0
          ? "mapbox://styles/mapbox/light-v11"
          : "mapbox://styles/mapbox/streets-v12";

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center as [number, number],
        zoom: zoom,
        attributionControl: true,
        preserveDrawingBuffer: true,
        antialias: false,
        fadeDuration: 0,
        maxZoom: 19,
        minZoom: 3,
        pitch: 0,
        renderWorldCopies: true,
        maxParallelImageRequests: 4,
      });

      newMap.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      newMap.on("load", () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
        setMapError(null);
        toast({
          title: "Mapa carregado",
          description: "O mapa foi carregado com sucesso!",
        });
      });

      newMap.on("error", (e: any) => {
        console.error("Mapbox error:", e);
        if (renderAttempts < maxRenderAttempts - 1) {
          console.log(`Retry attempt ${renderAttempts + 1} of ${maxRenderAttempts}`);
          setRenderAttempts((prev) => prev + 1);
          return;
        }
        setMapError("Erro ao carregar o mapa. Usando visualização alternativa.");
        setMapboxSupported(false);
        toast({
          title: "Erro ao carregar o mapa",
          description:
            "Não foi possível carregar o mapa. Usando visualização alternativa.",
          variant: "destructive",
        });
      });

      map.current = newMap;
    } catch (error) {
      console.error("Error initializing Mapbox map:", error);
      setMapError("Erro ao inicializar o mapa. Usando visualização alternativa.");
      setMapboxSupported(false);
      if (error instanceof Error) {
        console.error("Mapbox initialization error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
    }

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  // A dependência mapboxScriptLoaded foi removida, pois o import já lida com isso.
  }, [mapboxToken, center, zoom, checkedSupport, mapboxSupported, renderAttempts]); 

  // Add markers to map
  useEffect(() => {
    if (!map.current || !mapLoaded || !mapboxToken || !mapboxSupported) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    constructions.forEach((construction) => {
      try {
        if (!construction.latitude || !construction.longitude) return;
        const marker = createMapMarker({
          map: map.current!,
          construction,
          onMarkerClick,
          mapboxgl: mapboxgl, // Passar o mapboxgl importado
        });
        markers.current.push(marker);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
  // A dependência mapboxScriptLoaded foi removida.
  }, [constructions, mapboxToken, onMarkerClick, mapLoaded, mapboxSupported]); 

  return {
    mapContainer,
    mapboxSupported,
    mapError,
    mapLoaded,
  };
};
