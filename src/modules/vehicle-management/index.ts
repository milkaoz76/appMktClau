/**
 * Exports principales del módulo de gestión de vehículos
 */

// Módulo principal
export { VehicleModule, useVehicleModule } from './VehicleModule';
export type { VehicleModuleProps } from './VehicleModule';

// Contexto
export { VehicleProvider, useVehicle } from './context/VehicleContext';

// Pantallas
export { VehicleListScreen } from './screens/shared/VehicleListScreen';
export { VehicleRegistrationScreen } from './screens/shared/VehicleRegistrationScreen';
export { VehicleDetailScreen } from './screens/shared/VehicleDetailScreen';

// Navegación
export { VehicleNavigator } from './navigation/VehicleNavigator';
export { VehicleWebRouter } from './navigation/VehicleWebRouter';

// Componentes
export * from './components/mobile';
export * from './components/web';

// Tipos
export * from './types';

// Configuración
export { vehicleModuleConfig, getVehicleModuleConfig, isFeatureEnabled } from './config';