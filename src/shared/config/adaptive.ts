/**
 * Configuración global para el sistema adaptativo
 * Permite personalizar breakpoints y comportamientos
 */

export interface AdaptiveSystemConfig {
  breakpoints: {
    mobile: { min: number; max: number };
    tablet: { min: number; max: number };
    desktop: { min: number; max: number };
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  performance: {
    enableMemoization: boolean;
    debounceResize: number; // ms
  };
  fallbacks: {
    showWarnings: boolean;
    defaultToShared: boolean;
  };
}

// Configuración por defecto
export const defaultAdaptiveConfig: AdaptiveSystemConfig = {
  breakpoints: {
    mobile: { min: 0, max: 767 },
    tablet: { min: 768, max: 1023 },
    desktop: { min: 1024, max: Infinity }
  },
  logging: {
    enabled: __DEV__ || false,
    level: 'info'
  },
  performance: {
    enableMemoization: true,
    debounceResize: 100
  },
  fallbacks: {
    showWarnings: true,
    defaultToShared: true
  }
};

// Variable global para la configuración actual
let currentConfig: AdaptiveSystemConfig = { ...defaultAdaptiveConfig };

/**
 * Obtiene la configuración actual del sistema adaptativo
 */
export const getAdaptiveConfig = (): AdaptiveSystemConfig => {
  return currentConfig;
};

/**
 * Actualiza la configuración del sistema adaptativo
 */
export const setAdaptiveConfig = (config: Partial<AdaptiveSystemConfig>): void => {
  currentConfig = {
    ...currentConfig,
    ...config,
    breakpoints: { ...currentConfig.breakpoints, ...config.breakpoints },
    logging: { ...currentConfig.logging, ...config.logging },
    performance: { ...currentConfig.performance, ...config.performance },
    fallbacks: { ...currentConfig.fallbacks, ...config.fallbacks }
  };
};

/**
 * Resetea la configuración a los valores por defecto
 */
export const resetAdaptiveConfig = (): void => {
  currentConfig = { ...defaultAdaptiveConfig };
};