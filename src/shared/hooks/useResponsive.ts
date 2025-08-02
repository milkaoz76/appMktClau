/**
 * Hook useResponsive - Detecta breakpoints y proporciona información responsiva
 * Compatible con React Native y React Web
 * Detecta automáticamente cambios de tamaño de ventana/pantalla
 */
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { adaptiveLogger } from '../utils/logger';

// Definición de breakpoints estándar
export const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity }
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  breakpoint: Breakpoint;
}

/**
 * Hook que proporciona información sobre el tamaño de pantalla actual
 * y detecta automáticamente cambios de tamaño
 * 
 * @returns ResponsiveValues - Objeto con información de responsividad
 * 
 * @example
 * ```typescript
 * const { isMobile, isDesktop, width, breakpoint } = useResponsive();
 * 
 * if (isMobile) {
 *   return <MobileComponent />;
 * } else {
 *   return <DesktopComponent />;
 * }
 * ```
 */
export const useResponsive = (): ResponsiveValues => {
  // Estado inicial con dimensiones actuales - con manejo de errores
  const [dimensions, setDimensions] = useState(() => {
    try {
      const { width, height } = Dimensions.get('window');
      return { width, height };
    } catch (error) {
      adaptiveLogger.warn('Error getting initial dimensions, using defaults', error);
      // Valores por defecto para desktop si falla la detección
      return { width: 1024, height: 768 };
    }
  });

  // Función para determinar el breakpoint basado en el ancho
  const getBreakpoint = (width: number): Breakpoint => {
    if (width <= BREAKPOINTS.mobile.max) {
      return 'mobile';
    } else if (width <= BREAKPOINTS.tablet.max) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  // Efecto para escuchar cambios de dimensiones - con manejo de errores
  useEffect(() => {
    let subscription: any = null;
    
    try {
      subscription = Dimensions.addEventListener('change', ({ window }) => {
        try {
          setDimensions({
            width: window.width,
            height: window.height
          });
        } catch (error) {
          adaptiveLogger.warn('Error updating dimensions', error);
        }
      });
    } catch (error) {
      adaptiveLogger.warn('Error setting up dimension listener', error);
    }

    // Cleanup function
    return () => {
      try {
        // Para React Native 0.65+
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        }
        // Para versiones anteriores de React Native
        else if (typeof subscription === 'function') {
          subscription();
        }
      } catch (error) {
        adaptiveLogger.warn('Error cleaning up dimension listener', error);
      }
    };
  }, []);

  // Calcular valores derivados
  const { width, height } = dimensions;
  const breakpoint = getBreakpoint(width);
  
  const responsiveValues: ResponsiveValues = {
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    width,
    height,
    breakpoint
  };

  return responsiveValues;
};

/**
 * Hook auxiliar para obtener solo el breakpoint actual
 * Útil cuando solo necesitas saber el tipo de dispositivo
 * 
 * @returns Breakpoint - El breakpoint actual ('mobile' | 'tablet' | 'desktop')
 */
export const useBreakpoint = (): Breakpoint => {
  const { breakpoint } = useResponsive();
  return breakpoint;
};

/**
 * Hook auxiliar para verificar si estamos en un dispositivo móvil
 * Útil para renderizado condicional simple
 * 
 * @returns boolean - true si es móvil, false en caso contrario
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

/**
 * Hook auxiliar para verificar si estamos en desktop
 * Útil para funcionalidades específicas de desktop
 * 
 * @returns boolean - true si es desktop, false en caso contrario
 */
export const useIsDesktop = (): boolean => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};

/**
 * Función utilitaria para obtener el breakpoint de un ancho específico
 * Útil para cálculos estáticos o testing
 * 
 * @param width - Ancho en píxeles
 * @returns Breakpoint - El breakpoint correspondiente
 */
export const getBreakpointFromWidth = (width: number): Breakpoint => {
  if (width <= BREAKPOINTS.mobile.max) {
    return 'mobile';
  } else if (width <= BREAKPOINTS.tablet.max) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Exportar breakpoints para uso externo
export { BREAKPOINTS as breakpoints };