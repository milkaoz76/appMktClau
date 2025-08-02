/**
 * Punto de entrada principal para el sistema de navegación
 * Exporta todos los componentes, hooks y configuraciones de navegación
 */

// Componentes principales
export { default as NavigationContainer } from './NavigationContainer';
export type { NavigationContainerProps } from './NavigationContainer';

// Contexto y hooks
export { NavigationProvider, useNavigation } from './NavigationContext';

// Router y componentes de routing
export { 
  Router, 
  Route, 
  Switch, 
  Redirect,
  useRouter,
  useRouteInfo,
  useNavigate
} from './Router';
export type { RouterProps } from './Router';

// Navegación mobile
export { default as MobileNavigation } from './mobile/MobileNavigation';
export { default as BottomTabs } from './mobile/BottomTabs';
export { default as MobileStackNavigator } from './mobile/MobileStackNavigator';
export { default as MobileHeader } from './mobile/MobileHeader';

export type { 
  MobileNavigationProps 
} from './mobile/MobileNavigation';
export type { 
  BottomTabsProps 
} from './mobile/BottomTabs';
export type { 
  MobileStackNavigatorProps 
} from './mobile/MobileStackNavigator';
export type { 
  MobileHeaderProps 
} from './mobile/MobileHeader';

// Navegación web
export { default as WebNavigation } from './web/WebNavigation';
export { default as Sidebar } from './web/Sidebar';
export { default as TopBar } from './web/TopBar';
export { default as WebContent } from './web/WebContent';

export type { 
  WebNavigationProps 
} from './web/WebNavigation';
export type { 
  SidebarProps 
} from './web/Sidebar';
export type { 
  TopBarProps 
} from './web/TopBar';
export type { 
  WebContentProps 
} from './web/WebContent';

// Configuraciones y rutas
export {
  defaultRoutes,
  defaultRouterConfig,
  defaultNavigationConfig,
  createNavigationConfig,
  createRouterConfig
} from './routes';

// Re-exportar tipos importantes de shared
export type {
  NavigationItem,
  NavigationConfig,
  NavigationState,
  AdaptiveNavigationConfig,
  TabConfig,
  SidebarConfig,
  TopBarConfig,
  BreadcrumbItem,
  NavigationEvent
} from '../shared/types/navigation';

export type {
  RouteConfig,
  AdaptiveRouteConfig,
  RouterConfig,
  CurrentRoute,
  RouterNavigationOptions,
  RouteMeta
} from '../shared/types/route';