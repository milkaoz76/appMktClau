/**
 * RouteRenderer - Renderiza el componente correcto basado en la ruta actual
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from './NavigationContext';
import { RouterConfig, RouteConfig } from '../shared/types/route';
import { navigationLogger } from '../shared/utils/logger';

/**
 * Props para RouteRenderer
 */
export interface RouteRendererProps {
  config: RouterConfig;
}

/**
 * Componente de pantalla no encontrada
 */
const NotFoundScreen: React.FC = () => (
  <View style={styles.notFoundContainer}>
    <Text style={styles.notFoundTitle}>Página no encontrada</Text>
    <Text style={styles.notFoundSubtitle}>
      La ruta solicitada no existe o no está disponible.
    </Text>
  </View>
);

/**
 * RouteRenderer principal
 */
export const RouteRenderer: React.FC<RouteRendererProps> = ({ config }) => {
  const { state } = useNavigation();
  
  // Encontrar la ruta que coincide con la ruta actual
  const matchedRoute = useMemo(() => {
    const currentPath = state.currentRoute;
    
    // Buscar en rutas compartidas
    const sharedRoute = config.routes.shared.find(route => {
      if (route.exact) {
        return route.path === currentPath;
      } else {
        return currentPath.startsWith(route.path);
      }
    });
    
    if (sharedRoute) {
      return sharedRoute;
    }
    
    // Buscar en rutas específicas de mobile/web si es necesario
    // Por ahora solo usamos rutas compartidas
    
    return null;
  }, [state.currentRoute, config.routes]);

  // Log del renderizado
  useMemo(() => {
    navigationLogger.debug('RouteRenderer rendering', {
      currentRoute: state.currentRoute,
      matchedRoute: matchedRoute?.path,
      hasComponent: !!matchedRoute?.component
    });
  }, [state.currentRoute, matchedRoute]);

  // Renderizar el componente correspondiente
  if (!matchedRoute) {
    return <NotFoundScreen />;
  }

  const RouteComponent = matchedRoute.component;
  
  return (
    <View style={styles.container}>
      <RouteComponent />
    </View>
  );
};

/**
 * Estilos
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  notFoundSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24
  }
});

export default RouteRenderer;