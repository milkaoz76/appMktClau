/**
 * Punto de entrada principal para todos los recursos compartidos
 * Exporta hooks, componentes, tipos y utilidades
 */

// Hooks
export * from './hooks/useResponsive';

// Componentes
export * from './components/AdaptiveLayout';

// Utilities
export * from './utils/logger';

// Tipos
export * from './types';

// Re-exportaciones organizadas por categoría
export type {
  // Tipos de responsividad
  ResponsiveValues,
  Breakpoint,
  
  // Tipos de componentes
  BaseComponentProps,
  RenderableComponent,
  AdaptiveConfig,
  
  // Tipos de navegación
  NavigationItem,
  NavigationConfig,
  NavigationState,
  
  // Tipos de módulos
  ModuleConfig,
  Module,
  ModuleProps,
  
  // Tipos de rutas
  RouteConfig,
  RouteMeta,
  CurrentRoute
} from './types';

// Constantes útiles
export { BREAKPOINTS as breakpoints } from './hooks/useResponsive';