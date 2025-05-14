
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Construction } from '@/types/construction';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import MapFallbackView from '@/components/MapFallbackView';
import { useMapbox } from '@/hooks/useMapbox';
import { isMobileDevice } from '@/utils/webGLDetection';

interface MapProps {
  constructions: Construction[];
  onMarkerClick?: (construction: Construction) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ 
  constructions, 
  onMarkerClick, 
  className,
  center = [-49.6401, -27.2423],
  zoom = 9
}) => {
  const {
    mapContainer,
    mapboxSupported,
    mapError,
    mapLoaded
  } = useMapbox({
    constructions,
    onMarkerClick,
    center,
    zoom
  });

  const isMobile = isMobileDevice();

  // Console log para debugging
  console.log('Map rendering status:', { mapboxSupported, mapError, isMobile });

  return (
    <div className={cn('relative w-full h-[500px] min-h-[500px] rounded-lg overflow-hidden', className)}>
      {!mapboxSupported ? (
        <MapFallbackView 
          constructions={constructions} 
          error={mapError} 
          onMarkerClick={onMarkerClick} 
        />
      ) : null}
      <div 
        ref={mapContainer} 
        className={`map-container h-[500px] ${!mapboxSupported ? 'hidden' : ''}`} 
        style={{ minHeight: '500px' }}
        data-is-mobile={isMobile ? "true" : "false"}
      />
      {mapError && mapboxSupported && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-sm">
          Erro no mapa. <Button variant="link" className="p-0 h-auto" onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      )}
    </div>
  );
};

export default Map;
