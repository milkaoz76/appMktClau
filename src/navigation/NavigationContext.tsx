/**
 * NavigationContext - Contexto global para el estado de navegación
 * Maneja el estado compartido entre componentes de navegación
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useResponsive } from '../shared/hooks/useResponsive';
import { navigationLogger } from '../shared/utils/logger';
import { 
  NavigationContextValue, 
  NavigationState, 
  AdaptiveNavigationConfig,
  NavigationEvent,
  BreadcrumbItem
} from '../shared/types/navigation';
import { Platform } from '../shared/types/common';

/**
 * Props para el NavigationProvider
 */
interface NavigationProviderProps {
  config: AdaptiveNavigationConfig;
  initialRoute?: string;
  onRouteChange?: (route: string) => void;
  children: React.ReactNode;
}

/**
 * Contexto de navegación
 */
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

/**
 * Provider del contexto de navegación
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  config,
  initialRoute = '/',
  onRouteChange,
  children
}) => {
  const { breakpoint, isMobile } = useResponsive();
  
  // Estado de navegación
  const [navigationState, setNavigationState] = useState<NavigationState>(() => ({
    currentModule: 'home',
    currentRoute: initialRoute,
    history: [initialRoute],
    sidebarCollapsed: false,
    activeTab: 'home',
    breadcrumbs: [{ label: 'Inicio', path: initialRoute, active: true }]
  }));

  // Determinar plataforma actual
  const platform: Platform = useMemo(() => {
    return isMobile ? 'mobile' : 'web';
  }, [isMobile]);

  // Función para navegar a una ruta
  const navigate = useCallback((path: string, params?: any) => {
    navigationLogger.info('Navigating to route', { path, params, from: navigationState.currentRoute });
    
    setNavigationState(prev => {
      const newHistory = [...prev.history, path];
      const breadcrumbs = generateBreadcrumbs(path, config);
      
      return {
        ...prev,
        currentRoute: path,
        history: newHistory,
        breadcrumbs
      };
    });

    // Notificar cambio de ruta
    if (onRouteChange) {
      onRouteChange(path);
    }

    // Emitir evento de navegación
    const event: NavigationEvent = {
      type: 'navigate',
      from: navigationState.currentRoute,
      to: path,
      params,
      timestamp: new Date()
    };
    
    navigationLogger.debug('Navigation event emitted', event);
  }, [navigationState.currentRoute, onRouteChange, config]);

  // Función para ir hacia atrás
  const goBack = useCallback(() => {
    if (navigationState.history.length > 1) {
      const newHistory = navigationState.history.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      
      navigationLogger.info('Going back to route', { 
        from: navigationState.currentRoute, 
        to: previousRoute 
      });
      
      setNavigationState(prev => ({
        ...prev,
        currentRoute: previousRoute,
        history: newHistory,
        breadcrumbs: generateBreadcrumbs(previousRoute, config)
      }));

      if (onRouteChange) {
        onRouteChange(previousRoute);
      }
    }
  }, [navigationState.history, navigationState.currentRoute, onRouteChange, config]);

  // Función para verificar si se puede ir hacia atrás
  const canGoBack = useCallback(() => {
    return navigationState.history.length > 1;
  }, [navigationState.history.length]);

  // Función para resetear la navegación
  const reset = useCallback((path: string) => {
    navigationLogger.info('Resetting navigation to route', { path });
    
    setNavigationState(prev => ({
      ...prev,
      currentRoute: path,
      history: [path],
      breadcrumbs: generateBreadcrumbs(path, config)
    }));

    if (onRouteChange) {
      onRouteChange(path);
    }
  }, [onRouteChange, config]);

  // Función para actualizar el estado de navegación
  const setState = useCallback((newState: Partial<NavigationState>) => {
    navigationLogger.debug('Updating navigation state', newState);
    
    setNavigationState(prev => ({
      ...prev,
      ...newState
    }));
  }, []);

  // Valor del contexto
  const contextValue: NavigationContextValue = useMemo(() => ({
    state: navigationState,
    config,
    platform,
    navigate,
    goBack,
    canGoBack,
    reset,
    setState
  }), [navigationState, config, platform, navigate, goBack, canGoBack, reset, setState]);

  // Log de cambios de estado
  useEffect(() => {
    navigationLogger.debug('Navigation state updated', {
      currentRoute: navigationState.currentRoute,
      historyLength: navigationState.history.length,
      activeTab: navigationState.activeTab,
      sidebarCollapsed: navigationState.sidebarCollapsed
    });
  }, [navigationState]);

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook para usar el contexto de navegación
 */
export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};

/**
 * Función auxiliar para generar breadcrumbs basados en la ruta
 */
const generateBreadcrumbs = (path: string, config: AdaptiveNavigationConfig): BreadcrumbItem[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/', active: segments.length === 0 }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isActive = index === segments.length - 1;
    
    // Buscar el label en la configuración
    const navItem = findNavigationItem(currentPath, config);
    const label = navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      path: currentPath,
      active: isActive
    });
  });

  return breadcrumbs;
};

/**
 * Función auxiliar para encontrar un item de navegación por path
 */
const findNavigationItem = (path: string, config: AdaptiveNavigationConfig) => {
  const allItems = [
    ...config.shared.items,
    ...(config.mobile.tabs || []),
    ...(config.web.sidebar?.items || [])
  ];

  return allItems.find(item => item.path === path);
};

export default NavigationProvider;