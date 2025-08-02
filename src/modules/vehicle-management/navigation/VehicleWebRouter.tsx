/**
 * VehicleWebRouter - Navegación interna del módulo de vehículos para web
 * Maneja el routing web dentro del módulo con soporte para URLs complejas
 */
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '../../../navigation/NavigationContext';
import { createLogger } from '../../../shared/utils/logger';
import { VehicleListScreen } from '../screens/shared/VehicleListScreen';
import { VehicleRegistrationScreen } from '../screens/shared/VehicleRegistrationScreen';
import { VehicleDetailScreen } from '../screens/shared/VehicleDetailScreen';

const vehicleLogger = createLogger('VehicleWebRouter');

/**
 * Props para VehicleWebRouter
 */
export interface VehicleWebRouterProps {
  initialRoute?: string;
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
}

/**
 * Router interno del módulo de vehículos para web
 */
export const VehicleWebRouter: React.FC<VehicleWebRouterProps> = ({
  initialRoute = '/vehicles',
  onRouteChange,
  children
}) => {
  const { state, navigate } = useNavigation();

  // Log de inicialización
  useMemo(() => {
    vehicleLogger.info('VehicleWebRouter initialized', {
      initialRoute,
      currentRoute: state.currentRoute
    });
  }, [initialRoute, state.currentRoute]);

  // Parsear parámetros de la URL
  const parseRoute = useCallback((route: string) => {
    const [path, queryString] = route.split('?');
    const segments = path.split('/').filter(Boolean);
    
    // Parsear query parameters
    const params: Record<string, string> = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }

    return { path, segments, params };
  }, []);

  // Determinar qué pantalla renderizar basado en la ruta
  const renderScreen = useCallback(() => {
    const route = state.currentRoute;
    const { path, segments, params } = parseRoute(route);
    
    vehicleLogger.debug('Rendering screen for route', { 
      route, 
      path, 
      segments, 
      params 
    });

    // Si hay children personalizados, renderizarlos
    if (children) {
      return children;
    }

    // Rutas del módulo de vehículos
    // /vehicles - Lista principal
    if (segments.length === 1 && segments[0] === 'vehicles') {
      return (
        <VehicleListScreen
          onAddVehicle={() => {
            navigate('/vehicles/register');
            if (onRouteChange) onRouteChange('/vehicles/register');
          }}
          onVehicleSelect={(vehicle) => {
            navigate(`/vehicles/${vehicle.id}`);
            if (onRouteChange) onRouteChange(`/vehicles/${vehicle.id}`);
          }}
        />
      );
    }

    // /vehicles/register - Registro de nuevo vehículo
    if (segments.length === 2 && segments[0] === 'vehicles' && segments[1] === 'register') {
      return (
        <VehicleRegistrationScreen
          onComplete={(vehicle) => {
            vehicleLogger.info('Vehicle registration completed', { vehicleId: vehicle.id });
            navigate('/vehicles');
            if (onRouteChange) onRouteChange('/vehicles');
          }}
          onCancel={() => {
            navigate('/vehicles');
            if (onRouteChange) onRouteChange('/vehicles');
          }}
        />
      );
    }

    // /vehicles/:id - Detalle de vehículo específico
    if (segments.length === 2 && segments[0] === 'vehicles' && /^\d+$/.test(segments[1])) {
      const vehicleId = parseInt(segments[1]);
      return (
        <VehicleDetailScreen
          vehicleId={vehicleId}
          onEdit={(vehicle) => {
            navigate(`/vehicles/${vehicle.id}/edit`);
            if (onRouteChange) onRouteChange(`/vehicles/${vehicle.id}/edit`);
          }}
          onDelete={() => {
            navigate('/vehicles');
            if (onRouteChange) onRouteChange('/vehicles');
          }}
        />
      );
    }

    // /vehicles/:id/edit - Edición de vehículo
    if (segments.length === 3 && 
        segments[0] === 'vehicles' && 
        /^\d+$/.test(segments[1]) && 
        segments[2] === 'edit') {
      const vehicleId = parseInt(segments[1]);
      return (
        <VehicleRegistrationScreen
          vehicleId={vehicleId}
          onComplete={(vehicle) => {
            vehicleLogger.info('Vehicle edit completed', { vehicleId: vehicle.id });
            navigate(`/vehicles/${vehicle.id}`);
            if (onRouteChange) onRouteChange(`/vehicles/${vehicle.id}`);
          }}
          onCancel={() => {
            navigate(`/vehicles/${vehicleId}`);
            if (onRouteChange) onRouteChange(`/vehicles/${vehicleId}`);
          }}
        />
      );
    }

    // /vehicles/:id/maintenance - Mantenimiento de vehículo específico
    if (segments.length === 3 && 
        segments[0] === 'vehicles' && 
        /^\d+$/.test(segments[1]) && 
        segments[2] === 'maintenance') {
      const vehicleId = parseInt(segments[1]);
      
      // Por ahora, redirigir a la sección de mantenimiento general
      // En el futuro, esto podría mostrar el mantenimiento específico del vehículo
      vehicleLogger.info('Redirecting to maintenance section', { vehicleId });
      navigate('/maintenance');
      if (onRouteChange) onRouteChange('/maintenance');
      
      return null;
    }

    // Rutas con filtros y búsqueda
    // /vehicles?search=toyota&year=2020
    if (segments.length === 1 && segments[0] === 'vehicles' && Object.keys(params).length > 0) {
      return (
        <VehicleListScreen
          initialFilter={{
            search: params.search || '',
            brand: params.brand || '',
            year: params.year ? parseInt(params.year) : null
          }}
          onAddVehicle={() => {
            navigate('/vehicles/register');
            if (onRouteChange) onRouteChange('/vehicles/register');
          }}
          onVehicleSelect={(vehicle) => {
            navigate(`/vehicles/${vehicle.id}`);
            if (onRouteChange) onRouteChange(`/vehicles/${vehicle.id}`);
          }}
        />
      );
    }

    // Ruta por defecto - lista de vehículos
    vehicleLogger.warn('Unknown route, defaulting to vehicle list', { route, segments });
    return (
      <VehicleListScreen
        onAddVehicle={() => {
          navigate('/vehicles/register');
          if (onRouteChange) onRouteChange('/vehicles/register');
        }}
        onVehicleSelect={(vehicle) => {
          navigate(`/vehicles/${vehicle.id}`);
          if (onRouteChange) onRouteChange(`/vehicles/${vehicle.id}`);
        }}
      />
    );
  }, [state.currentRoute, parseRoute, children, navigate, onRouteChange]);

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

/**
 * Estilos para VehicleWebRouter
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

export default VehicleWebRouter;