/**
 * NavigationContainer - Contenedor principal de navegación adaptativa
 * Detecta la plataforma y renderiza la navegación apropiada (mobile o web)
 */
import React, { useMemo } from 'react';
import { useResponsive } from '../shared/hooks/useResponsive';
import { AdaptiveLayout } from '../shared/components/AdaptiveLayout';
import { navigationLogger } from '../shared/utils/logger';
import { NavigationProvider } from './NavigationContext';
import { MobileNavigation } from './mobile/MobileNavigation';
import { WebNavigation } from './web/WebNavigation';
import { NavigationConfig, AdaptiveNavigationConfig } from '../shared/types/navigation';

/**
 * Props para el NavigationContainer
 */
export interface NavigationContainerProps {
  /** Configuración de navegación adaptativa */
  config: AdaptiveNavigationConfig;
  /** Configuración del router */
  routerConfig?: any;
  /** Componente hijo que se renderizará dentro de la navegación */
  children?: React.ReactNode;
  /** Callback cuando cambia la ruta */
  onRouteChange?: (route: string) => void;
  /** Configuración inicial */
  initialRoute?: string;
}

/**
 * NavigationContainer principal
 * Maneja la lógica de navegación adaptativa y proporciona el contexto
 */
export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  config,
  routerConfig,
  children,
  onRouteChange,
  initialRoute = '/'
}) => {
  const { breakpoint, isMobile } = useResponsive();

  // Log de inicialización
  useMemo(() => {
    navigationLogger.info('NavigationContainer initialized', {
      breakpoint,
      isMobile,
      initialRoute,
      hasConfig: !!config
    });
  }, [breakpoint, isMobile, initialRoute, config]);

  // Configuración específica para mobile
  const mobileConfig = useMemo(() => ({
    ...config.shared,
    ...config.mobile
  }), [config.shared, config.mobile]);

  // Configuración específica para web
  const webConfig = useMemo(() => ({
    ...config.shared,
    ...config.web
  }), [config.shared, config.web]);

  return (
    <NavigationProvider
      config={config}
      initialRoute={initialRoute}
      onRouteChange={onRouteChange}
    >
      <AdaptiveLayout
        mobile={() => (
          <MobileNavigation 
            config={mobileConfig}
            routerConfig={routerConfig}
            onRouteChange={onRouteChange}
          >
            {children}
          </MobileNavigation>
        )}
        desktop={() => (
          <WebNavigation 
            config={webConfig}
            onRouteChange={onRouteChange}
          >
            {children}
          </WebNavigation>
        )}
        tablet={() => (
          // Para tablet, usar navegación mobile por defecto
          <MobileNavigation 
            config={mobileConfig}
            routerConfig={routerConfig}
            onRouteChange={onRouteChange}
          >
            {children}
          </MobileNavigation>
        )}
      />
    </NavigationProvider>
  );
};

/**
 * Hook para usar el NavigationContainer desde componentes hijos
 */
export const useNavigationContainer = () => {
  const { breakpoint } = useResponsive();
  
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop'
  };
};

export default NavigationContainer;