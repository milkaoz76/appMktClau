/**
 * WebNavigation - Navegación específica para web
 * Implementa Sidebar + TopBar con breadcrumbs
 */
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '../NavigationContext';
import { navigationLogger } from '../../shared/utils/logger';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { WebContent } from './WebContent';
import { SidebarConfig, TopBarConfig, NavigationItem } from '../../shared/types/navigation';

/**
 * Props para WebNavigation
 */
export interface WebNavigationProps {
  config: any; // Configuración web específica
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
}

/**
 * Configuración por defecto del sidebar
 */
const defaultSidebarConfig: SidebarConfig = {
  width: {
    expanded: 240,
    collapsed: 64
  },
  collapsible: true,
  defaultCollapsed: false,
  items: [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'home',
      path: '/'
    },
    {
      id: 'vehicles',
      label: 'Vehículos',
      icon: 'car',
      path: '/vehicles'
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento',
      icon: 'build',
      path: '/maintenance',
      submenu: [
        {
          id: 'maintenance-plan',
          label: 'Plan de Mantenimiento',
          icon: 'calendar',
          path: '/maintenance/plan'
        },
        {
          id: 'maintenance-history',
          label: 'Historial',
          icon: 'time',
          path: '/maintenance/history'
        },
        {
          id: 'maintenance-reminders',
          label: 'Recordatorios',
          icon: 'notifications',
          path: '/maintenance/reminders'
        }
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: 'storefront',
      path: '/marketplace'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: 'person',
      path: '/profile'
    }
  ]
};

/**
 * Configuración por defecto del top bar
 */
const defaultTopBarConfig: TopBarConfig = {
  showBreadcrumbs: true,
  showSearch: true,
  showNotifications: true,
  showUserMenu: true,
  actions: []
};

/**
 * Componente principal de navegación web
 */
export const WebNavigation: React.FC<WebNavigationProps> = ({
  config,
  onRouteChange,
  children
}) => {
  const { state, navigate, setState } = useNavigation();

  // Configuración del sidebar
  const sidebarConfig = useMemo(() => {
    return config?.sidebar || defaultSidebarConfig;
  }, [config?.sidebar]);

  // Configuración del top bar
  const topBarConfig = useMemo(() => {
    return config?.topBar || defaultTopBarConfig;
  }, [config?.topBar]);

  // Log de inicialización
  useMemo(() => {
    navigationLogger.info('WebNavigation initialized', {
      currentRoute: state.currentRoute,
      sidebarCollapsed: state.sidebarCollapsed,
      sidebarItemsCount: sidebarConfig.items.length
    });
  }, [state.currentRoute, state.sidebarCollapsed, sidebarConfig.items.length]);

  // Manejar navegación desde sidebar
  const handleSidebarNavigate = useCallback((path: string) => {
    navigationLogger.info('Sidebar navigation', { path, from: state.currentRoute });
    
    navigate(path);
    
    if (onRouteChange) {
      onRouteChange(path);
    }
  }, [navigate, state.currentRoute, onRouteChange]);

  // Manejar toggle del sidebar
  const handleToggleSidebar = useCallback(() => {
    const newCollapsed = !state.sidebarCollapsed;
    
    navigationLogger.debug('Sidebar toggled', { 
      from: state.sidebarCollapsed, 
      to: newCollapsed 
    });
    
    setState({
      sidebarCollapsed: newCollapsed
    });
  }, [state.sidebarCollapsed, setState]);

  // Calcular ancho del sidebar
  const sidebarWidth = useMemo(() => {
    return state.sidebarCollapsed 
      ? sidebarConfig.width.collapsed 
      : sidebarConfig.width.expanded;
  }, [state.sidebarCollapsed, sidebarConfig.width]);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        config={sidebarConfig}
        collapsed={state.sidebarCollapsed}
        currentRoute={state.currentRoute}
        onNavigate={handleSidebarNavigate}
        onToggle={handleToggleSidebar}
      />

      {/* Área principal */}
      <View style={[styles.mainArea, { marginLeft: sidebarWidth }]}>
        {/* Top Bar */}
        <TopBar
          config={topBarConfig}
          breadcrumbs={state.breadcrumbs}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={state.sidebarCollapsed}
        />

        {/* Contenido */}
        <WebContent
          currentRoute={state.currentRoute}
          onRouteChange={onRouteChange}
        >
          {children}
        </WebContent>
      </View>
    </View>
  );
};

/**
 * Estilos para WebNavigation
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb'
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

export default WebNavigation;