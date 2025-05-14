
// Cache para os resultados de detecção
let webglSupportChecked = false;
let webglSupported = false;
let mobileDeviceChecked = false;
let isMobile = false;

// Verificar suporte a WebGL
export const checkWebGLSupport = (): boolean => {
  // Retornar resultado em cache se já verificado
  if (webglSupportChecked) {
    return webglSupported;
  }

  // Evitar execução em ambiente SSR
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    webglSupported = !!gl;
  } catch (e) {
    console.error('Erro ao verificar suporte a WebGL:', e);
    webglSupported = false;
  }

  webglSupportChecked = true;
  return webglSupported;
};

// Verificar se é dispositivo móvel
export const isMobileDevice = (): boolean => {
  // Retornar resultado em cache se já verificado
  if (mobileDeviceChecked) {
    return isMobile;
  }

  // Evitar execução em ambiente SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  try {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    isMobile = (
      /android/i.test(userAgent) ||
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad Pro
    );
  } catch (e) {
    console.error('Erro ao verificar dispositivo móvel:', e);
    isMobile = false;
  }

  mobileDeviceChecked = true;
  return isMobile;
};

// Resetar cache (para testes)
export const resetDetectionCache = (): void => {
  webglSupportChecked = false;
  mobileDeviceChecked = false;
};
