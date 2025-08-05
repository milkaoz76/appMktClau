/**
 * VehicleModule - Módulo principal de gestión de vehículos
 * Punto de entrada del módulo con navegación adaptativa
 */
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { VehicleProvider } from './context/VehicleContext';
import { VehicleNavigator } from './navigation/VehicleNavigator';
import { VehicleWebRouter } from './navigation/VehicleWebRouter';
import { AdaptiveLayout } from '../../shared/components/AdaptiveLayout';
import { useNavigation } from '../../navigation/NavigationContext';
import { ModuleProps, ModuleConfig } from '../../shared/types/module';
import { createLogger } from '../../shared/utils/logger';
import { vehicleModuleConfig } from './config';

const vehicleLogger = createLogger('VehicleModule');

/**
 * Props específicas para VehicleModule
 */
export interface VehicleModuleProps {
  /** Configuración del módulo (opcional) */
  config?: ModuleConfig;
  /** Ruta inicial del módulo */
  initialRoute?: string;
  /** Plan del usuario */
  userPlan?: 'free' | 'premium';
  /** Callback cuando cambia la ruta */
  onRouteChange?: (route: string) => void;
  /** Props adicionales */
  navigation?: object;
  route?: object;
  children?: React.ReactNode;
}

/**
 * Componente de navegación mobile del módulo
 */
const VehicleMobileNavigation: React.FC<{
  initialRoute: string;
  onRouteChange?: (route: string) => void;
}> = ({ initialRoute, onRouteChange }) => {
  return (
    <VehicleNavigator
      initialRoute={initialRoute}
      onRouteChange={onRouteChange}
    />
  );
};

/**
 * Componente de navegación web del módulo
 */
const VehicleWebNavigation: React.FC<{
  initialRoute: string;
  onRouteChange?: (route: string) => void;
}> = ({ initialRoute, onRouteChange }) => {
  return (
    <VehicleWebRouter
      initialRoute={initialRoute}
      onRouteChange={onRouteChange}
    />
  );
};

/**
 * Módulo principal de gestión de vehículos
 */
export const VehicleModule: React.FC<VehicleModuleProps> = ({
  initialRoute = '/vehicles',
  userPlan = 'free',
  onRouteChange,
  ...moduleProps
}) => {
  const { state } = useNavigation();

  // Log de inicialización del módulo
  useMemo(() => {
    vehicleLogger.info('VehicleModule initialized', {
      initialRoute,
      userPlan,
      currentRoute: state.currentRoute,
      moduleConfig: vehicleModuleConfig.name
    });
  }, [initialRoute, userPlan, state.currentRoute]);

  // Manejar cambios de ruta
  const handleRouteChange = (route: string) => {
    vehicleLogger.debug('Route changed in VehicleModule', { route });
    if (onRouteChange) {
      onRouteChange(route);
    }
  };

  // Props compartidas para navegación
  const navigationProps = {
    initialRoute,
    onRouteChange: handleRouteChange
  };

  return (
    <VehicleProvider userPlan={userPlan}>
      <View style={{ flex: 1 }}>
        <AdaptiveLayout
          mobile={() => <VehicleMobileNavigation {...navigationProps} />}
          desktop={() => <VehicleWebNavigation {...navigationProps} />}
        />
      </View>
    </VehicleProvider>
  );
};

/**
 * Hook para usar el módulo de vehículos
 */
export const useVehicleModule = () => {
  return {
    config: vehicleModuleConfig,
    name: vehicleModuleConfig.name,
    displayName: vehicleModuleConfig.displayName,
    version: vehicleModuleConfig.version,
    routes: vehicleModuleConfig.routes,
    navigation: vehicleModuleConfig.navigation
  };
};

export default VehicleModule;