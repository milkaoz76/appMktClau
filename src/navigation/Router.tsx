/**
 * Router - Sistema de rutas unificado para navegación adaptativa
 * Maneja el routing tanto para mobile como para web
 */
import React, { useMemo, useCallback, useEffect } from 'react';
import { useNavigation } from './NavigationContext';
import { navigationLogger } from '../shared/utils/logger';
import { 
  RouterConfig, 
  RouteConfig, 
  AdaptiveRouteConfig,
  CurrentRoute,
  RouterNavigationOptions
} from '../shared/types/route';

/**
 * Props para Router
 */
export interface RouterProps {
  config: RouterConfig;
  children?: React.ReactNode;
}

/**
 * Hook para usar el router
 */
export const useRouter = () => {
  const { state, navigate, goBack, canGoBack, reset } = useNavigation();

  // Parsear la ruta actual
  const currentRoute: CurrentRoute = useMemo(() => {
    const [path, queryString] = state.currentRoute.split('?');
    const [pathname, hash] = path.split('#');
    
    // Parsear parámetros de la URL
    const pathSegments = pathname.split('/').filter(Boolean);
    const params: Record<string, string> = {};
    
    // Parsear query parameters
    const query: Record<string, string> = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          query[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }

    return {
      path: pathname,
      params,
      query,
      hash: hash || undefined,
      meta: undefined // Se podría agregar metadata de la ruta
    };
  }, [state.currentRoute]);

  // Función de navegación con opciones
  const navigateWithOptions = useCallback((
    path: string, 
    options: RouterNavigationOptions = {}
  ) => {
    let finalPath = path;

    // Agregar query parameters
    if (options.query && Object.keys(options.query).length > 0) {
      const queryString = Object.entries(options.query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      finalPath += `?${queryString}`;
    }

    // Agregar hash
    if (options.hash) {
      finalPath += `#${options.hash}`;
    }

    navigationLogger.info('Router navigation', {
      from: state.currentRoute,
      to: finalPath,
      options
    });

    if (options.replace) {
      reset(finalPath);
    } else {
      navigate(finalPath, options.params);
    }
  }, [navigate, reset, state.currentRoute]);

  // Función para hacer push (igual que navigate)
  const push = useCallback((path: string, options: RouterNavigationOptions = {}) => {
    navigateWithOptions(path, { ...options, replace: false });
  }, [navigateWithOptions]);

  // Función para hacer replace
  const replace = useCallback((path: string, options: RouterNavigationOptions = {}) => {
    navigateWithOptions(path, { ...options, replace: true });
  }, [navigateWithOptions]);

  // Función para hacer pop (ir hacia atrás)
  const pop = useCallback(() => {
    if (canGoBack()) {
      goBack();
    }
  }, [goBack, canGoBack]);

  return {
    route: currentRoute,
    navigate: navigateWithOptions,
    replace,
    goBack,
    canGoBack,
    push,
    pop,
    reset,
    params: currentRoute.params,
    query: currentRoute.query,
    state: state
  };
};

/**
 * Componente de Route individual
 */
interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  children?: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ 
  path, 
  component: Component, 
  exact = false,
  children 
}) => {
  const { route } = useRouter();
  
  // Verificar si la ruta coincide
  const matches = useMemo(() => {
    if (exact) {
      return route.path === path;
    } else {
      return route.path.startsWith(path);
    }
  }, [route.path, path, exact]);

  if (!matches) {
    return null;
  }

  return <Component route={route}>{children}</Component>;
};

/**
 * Componente Switch para renderizar solo la primera ruta que coincida
 */
interface SwitchProps {
  children: React.ReactElement<RouteProps>[];
}

export const Switch: React.FC<SwitchProps> = ({ children }) => {
  const { route } = useRouter();

  // Encontrar la primera ruta que coincida
  const matchedRoute = useMemo(() => {
    return React.Children.toArray(children).find((child) => {
      if (React.isValidElement(child) && child.props.path) {
        const { path, exact = false } = child.props;
        if (exact) {
          return route.path === path;
        } else {
          return route.path.startsWith(path);
        }
      }
      return false;
    });
  }, [children, route.path]);

  return matchedRoute as React.ReactElement || null;
};

/**
 * Componente Redirect para redirecciones
 */
interface RedirectProps {
  from?: string;
  to: string;
  exact?: boolean;
}

export const Redirect: React.FC<RedirectProps> = ({ from, to, exact = false }) => {
  const { route, replace } = useRouter();

  useEffect(() => {
    const shouldRedirect = from 
      ? (exact ? route.path === from : route.path.startsWith(from))
      : true;

    if (shouldRedirect) {
      navigationLogger.info('Router redirect', { from: route.path, to });
      replace(to);
    }
  }, [route.path, from, to, exact, replace]);

  return null;
};

/**
 * Router principal
 */
export const Router: React.FC<RouterProps> = ({ config, children }) => {
  const { state } = useNavigation();

  // Log de inicialización del router
  useMemo(() => {
    navigationLogger.info('Router initialized', {
      basePath: config.basePath,
      fallbackRoute: config.fallbackRoute,
      currentRoute: state.currentRoute,
      routesCount: {
        shared: config.routes.shared.length,
        mobile: config.routes.mobile?.length || 0,
        web: config.routes.web?.length || 0
      }
    });
  }, [config, state.currentRoute]);

  return <>{children}</>;
};

/**
 * Hook para obtener información de la ruta actual
 */
export const useRouteInfo = () => {
  const { route } = useRouter();
  const { state } = useNavigation();

  return {
    ...route,
    breadcrumbs: state.breadcrumbs,
    currentModule: state.currentModule,
    history: state.history
  };
};

/**
 * Hook para navegación programática
 */
export const useNavigate = () => {
  const { navigate, replace, goBack, canGoBack, push, pop, reset } = useRouter();

  return {
    navigate,
    replace,
    goBack,
    canGoBack,
    push,
    pop,
    reset
  };
};

export default Router;