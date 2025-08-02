/**
 * Tipos para el sistema de navegación adaptativa
 */
import React from 'react';
import { Platform, AdaptiveConfig } from './common';

/**
 * Configuración de un elemento de navegación
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number | string;
  submenu?: NavigationItem[];
  permissions?: string[];
  visible?: boolean;
  disabled?: boolean;
}

/**
 * Configuración completa de navegación
 */
export interface NavigationConfig {
  items: NavigationItem[];
  defaultRoute: string;
  fallbackRoute?: string;
}

/**
 * Estado de navegación
 */
export interface NavigationState {
  currentModule: string;
  currentRoute: string;
  history: string[];
  sidebarCollapsed: boolean; // Web only
  activeTab: string; // Mobile only
  breadcrumbs: BreadcrumbItem[];
}

/**
 * Item de breadcrumb para navegación web
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

/**
 * Configuración de tabs para mobile
 */
export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
  badge?: number | string;
  initialParams?: Record<string, any>;
}

/**
 * Configuración de sidebar para web
 */
export interface SidebarConfig {
  width: {
    expanded: number;
    collapsed: number;
  };
  items: NavigationItem[];
  collapsible: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Configuración de top bar para web
 */
export interface TopBarConfig {
  showBreadcrumbs: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  actions?: TopBarAction[];
}

/**
 * Acción de top bar
 */
export interface TopBarAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
}

/**
 * Props para componentes de navegación
 */
export interface NavigationComponentProps {
  config: NavigationConfig;
  state: NavigationState;
  onNavigate: (path: string) => void;
  onStateChange: (state: Partial<NavigationState>) => void;
}

/**
 * Props específicas para navegación mobile
 */
export interface MobileNavigationProps extends NavigationComponentProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Props específicas para navegación web
 */
export interface WebNavigationProps extends NavigationComponentProps {
  sidebar: SidebarConfig;
  topBar: TopBarConfig;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

/**
 * Configuración adaptativa de navegación
 */
export interface AdaptiveNavigationConfig {
  mobile: {
    type: 'tabs' | 'drawer';
    tabs?: TabConfig[];
    drawer?: NavigationItem[];
  };
  web: {
    type: 'sidebar' | 'topnav';
    sidebar?: SidebarConfig;
    topBar?: TopBarConfig;
  };
  shared: NavigationConfig;
}

/**
 * Guard para protección de rutas
 */
export interface RouteGuard {
  name: string;
  canActivate: (route: string, params?: any) => boolean | Promise<boolean>;
  redirectTo?: string;
  onReject?: (route: string) => void;
}

/**
 * Configuración de guards
 */
export interface GuardConfig {
  guards: RouteGuard[];
  globalGuards?: string[]; // Nombres de guards que se aplican a todas las rutas
}

/**
 * Contexto de navegación
 */
export interface NavigationContextValue {
  state: NavigationState;
  config: AdaptiveNavigationConfig;
  platform: Platform;
  navigate: (path: string, params?: any) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: (path: string) => void;
  setState: (state: Partial<NavigationState>) => void;
}

/**
 * Opciones de navegación
 */
export interface NavigationOptions {
  replace?: boolean;
  params?: Record<string, any>;
  state?: any;
  animated?: boolean;
  gestureEnabled?: boolean;
}

/**
 * Evento de navegación
 */
export interface NavigationEvent {
  type: 'navigate' | 'back' | 'reset' | 'state_change';
  from?: string;
  to: string;
  params?: any;
  timestamp: Date;
}