/**
 * VehicleNavigator - Navegación interna del módulo de vehículos para mobile
 * Maneja la navegación por stack dentro del módulo
 */
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '../../../navigation/NavigationContext';
import { createLogger } from '../../../shared/utils/logger';
import { VehicleListScreen } from '../screens/shared/VehicleListScreen';
import { VehicleRegistrationScreen } from '../screens/shared/VehicleRegistrationScreen';
import { VehicleDetailScreen } from '../screens/shared/VehicleDetailScreen';

const vehicleLogger = createLogger('VehicleNavigator');

/**
 * Props para VehicleNavigator
 */
export interface VehicleNavigatorProps {
  initialRoute?: string;
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
}

/**
 * Navegador interno del módulo de vehículos para mobile
 */
export const VehicleNavigator: React.FC<VehicleNavigatorProps> = ({
  initialRoute = '/vehicles',
  onRouteChange,
  children
}) => {
  const { state, navigate } = useNavigation();

  // Log de inicialización
  useMemo(() => {
    vehicleLogger.info('VehicleNavigator initialized', {
      initialRoute,
      currentRoute: state.currentRoute
    });
  }, [initialRoute, state.currentRoute]);

  // Determinar qué pantalla renderizar basado en la ruta
  const renderScreen = useCallback(() => {
    const route = state.currentRoute;
    
    vehicleLogger.debug('Rendering screen for route', { route });

    // Si hay children personalizados, renderizarlos
    if (children) {
      return children;
    }

    // Rutas del módulo de vehículos
    if (route === '/vehicles' || route === '/vehicles/') {
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

    if (route === '/vehicles/register') {
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

    // Ruta de detalle de vehículo (ej: /vehicles/123)
    const vehicleDetailMatch = route.match(/^\/vehicles\/(\d+)$/);
    if (vehicleDetailMatch) {
      const vehicleId = parseInt(vehicleDetailMatch[1]);
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

    // Ruta de edición de vehículo (ej: /vehicles/123/edit)
    const vehicleEditMatch = route.match(/^\/vehicles\/(\d+)\/edit$/);
    if (vehicleEditMatch) {
      const vehicleId = parseInt(vehicleEditMatch[1]);
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

    // Ruta por defecto - lista de vehículos
    vehicleLogger.warn('Unknown route, defaulting to vehicle list', { route });
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
  }, [state.currentRoute, children, navigate, onRouteChange]);

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

/**
 * Estilos para VehicleNavigator
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

export default VehicleNavigator;