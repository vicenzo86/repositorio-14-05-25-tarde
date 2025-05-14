
import React, { useMemo } from 'react';
import useMapbox from '../hooks/useMapbox';
import { Construction } from '../types/Construction';
import { isMobileDevice } from '../utils/webGLDetection';

const MapFallbackView = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-4">
    <p className="text-center mb-4">
      O mapa não pode ser exibido. Seu dispositivo pode não suportar WebGL ou você está usando um dispositivo móvel.
    </p>
    <p className="text-center">
      Por favor, tente acessar em um computador ou use a visualização em lista.
    </p>
  </div>
);

interface MapProps {
  constructions: Construction[];
}

const Map: React.FC<MapProps> = ({ constructions }) => {
  // Memoize a verificação de dispositivo móvel
  const isMobile = useMemo(() => isMobileDevice(), []);
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const { mapContainer, mapboxSupported, checkedSupport } = useMapbox(constructions, mapboxToken);

  // Renderização condicional otimizada
  if (checkedSupport && !mapboxSupported) {
    return <MapFallbackView />;
  }

  return (
    <div className="h-[70vh] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default React.memo(Map);
