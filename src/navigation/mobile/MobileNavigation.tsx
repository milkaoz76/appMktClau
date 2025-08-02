/**
 * MobileNavigation - Navegación específica para dispositivos móviles
 * Implementa Bottom Tabs con Stack Navigation
 */
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '../NavigationContext';
import { navigationLogger } from '../../shared/utils/logger';
import { BottomTabs } from './BottomTabs';
import { MobileStackNavigator } from './MobileStackNavigator';
import { TabConfig } from '../../shared/types/navigation';

/**
 * Props para MobileNavigation
 */
export interface MobileNavigationProps {
  config: any; // Configuración mobile específica
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
  routerConfig?: any;
}

/**
 * Configuración por defecto de tabs para mobile
 */
const defaultTabs: TabConfig[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: 'home',
    component: () => null, // Se definirá cuando tengamos los módulos
    badge: undefined
  },
  {
    id: 'vehicles',
    label: 'Vehículos',
    icon: 'car',
    component: () => null,
    badge: undefined
  },
  {
    id: 'maintenance',
    label: 'Mantenimiento',
    icon: 'build',
    component: () => null,
    badge: 2 // Ejemplo de badge
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: 'storefront',
    component: () => null,
    badge: undefined
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: 'person',
    component: () => null,
    badge: undefined
  }
];

/**
 * Componente principal de navegación mobile
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  config,
  onRouteChange,
  children,
  routerConfig
}) => {
  const { state, navigate, setState } = useNavigation();
  
  // Usar tabs de configuración o por defecto
  const tabs = useMemo(() => {
    return config?.tabs || defaultTabs;
  }, [config?.tabs]);

  // Obtener tab activo basado en la ruta actual
  const activeTab = useMemo(() => {
    // Intentar determinar el tab activo basado en la ruta actual
    const currentPath = state.currentRoute;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0] || 'home';
    
    // Buscar el tab que corresponde a la ruta
    const tabFromRoute = tabs.find(tab => tab.id === firstSegment);
    
    // Si no se encuentra, usar el tab activo del estado o el primero
    return tabFromRoute || tabs.find(tab => tab.id === state.activeTab) || tabs[0];
  }, [tabs, state.activeTab, state.currentRoute]);

  // Sincronizar tab activo con la ruta
  useMemo(() => {
    const currentPath = state.currentRoute;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSegment = pathSegments[0] || 'home';
    
    // Si el tab activo no coincide con la ruta, actualizarlo
    if (state.activeTab !== firstSegment && tabs.find(tab => tab.id === firstSegment)) {
      setState({ activeTab: firstSegment });
    }
  }, [state.currentRoute, state.activeTab, tabs, setState]);

  // Log de inicialización
  useMemo(() => {
    navigationLogger.info('MobileNavigation initialized', {
      activeTab: activeTab?.id || 'unknown',
      tabsCount: tabs.length,
      currentRoute: state.currentRoute
    });
  }, [activeTab?.id, tabs.length, state.currentRoute]);

  // Manejar cambio de tab
  const handleTabChange = useCallback((tabId: string) => {
    navigationLogger.info('Tab changed', { from: state.activeTab, to: tabId });
    
    // Actualizar estado de navegación
    setState({
      activeTab: tabId,
      currentModule: tabId
    });

    // Navegar a la ruta del tab
    const tabPath = `/${tabId}`;
    navigate(tabPath);
    
    // Notificar cambio de ruta
    if (onRouteChange) {
      onRouteChange(tabPath);
    }
  }, [state.activeTab, setState, navigate, onRouteChange]);

  return (
    <View style={styles.container}>
      {/* Área de contenido principal */}
      <View style={styles.content}>
        <MobileStackNavigator
          activeTab={activeTab || tabs[0]}
          onRouteChange={onRouteChange}
          routerConfig={routerConfig}
        >
          {children}
        </MobileStackNavigator>
      </View>

      {/* Bottom Tabs */}
      <BottomTabs
        tabs={tabs}
        activeTab={activeTab?.id || 'home'}
        onTabChange={handleTabChange}
      />
    </View>
  );
};

/**
 * Estilos para MobileNavigation
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1
  }
});

export default MobileNavigation;