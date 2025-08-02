/**
 * Tipos para configuración de rutas y routing
 */
import React from 'react';
import { AdaptiveConfig } from './common';

/**
 * Configuración base de una ruta
 */
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  guards?: string[];
  meta?: RouteMeta;
  children?: RouteConfig[];
}

/**
 * Metadatos de ruta
 */
export interface RouteMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  requiresAuth?: boolean;
  permissions?: string[];
  layout?: string;
  breadcrumb?: string | ((params: any) => string);
  hideInNavigation?: boolean;
}

/**
 * Configuración adaptativa de rutas
 */
export interface AdaptiveRouteConfig {
  mobile?: RouteConfig[];
  web?: RouteConfig[];
  shared: RouteConfig[];
}

/**
 * Parámetros de ruta
 */
export interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Estado de ruta
 */
export interface RouteState {
  [key: string]: any;
}

/**
 * Información de ruta actual
 */
export interface CurrentRoute {
  path: string;
  params: RouteParams;
  state?: RouteState;
  meta?: RouteMeta;
  query?: Record<string, string>;
  hash?: string;
}

/**
 * Configuración de router
 */
export interface RouterConfig {
  routes: AdaptiveRouteConfig;
  basePath?: string;
  fallbackRoute?: string;
  notFoundRoute?: string;
  guards?: string[];
  middleware?: RouterMiddleware[];
}

/**
 * Middleware de router
 */
export interface RouterMiddleware {
  name: string;
  execute: (route: CurrentRoute, next: () => void) => void | Promise<void>;
  priority?: number;
}

/**
 * Contexto de router
 */
export interface RouterContextValue {
  currentRoute: CurrentRoute;
  navigate: (path: string, options?: RouterNavigationOptions) => void;
  replace: (path: string, options?: RouterNavigationOptions) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  push: (path: string, options?: RouterNavigationOptions) => void;
  pop: () => void;
  reset: (path: string) => void;
  history: CurrentRoute[];
}

/**
 * Opciones de navegación para router
 */
export interface RouterNavigationOptions {
  replace?: boolean;
  state?: RouteState;
  params?: RouteParams;
  query?: Record<string, string>;
  hash?: string;
  animated?: boolean;
}

/**
 * Hook de router
 */
export interface UseRouterReturn {
  route: CurrentRoute;
  navigate: (path: string, options?: RouterNavigationOptions) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  params: RouteParams;
  query: Record<string, string>;
  state?: RouteState;
}

/**
 * Configuración de lazy loading
 */
export interface LazyRouteConfig extends Omit<RouteConfig, 'component'> {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  loading?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
}

/**
 * Información de carga de ruta
 */
export interface RouteLoadingState {
  loading: boolean;
  error?: Error;
  component?: React.ComponentType<any>;
}

/**
 * Configuración de transiciones entre rutas
 */
export interface RouteTransition {
  name: string;
  duration: number;
  easing?: string;
  from?: string; // Ruta de origen (opcional)
  to?: string;   // Ruta de destino (opcional)
}

/**
 * Configuración de animaciones de ruta
 */
export interface RouteAnimationConfig {
  transitions: RouteTransition[];
  defaultTransition: string;
  disabled?: boolean;
}