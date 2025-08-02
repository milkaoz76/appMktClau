/**
 * Configuración del módulo de gestión de vehículos
 * Define la configuración, rutas y metadatos del módulo
 */
import { ModuleConfig } from '../../../shared/types/module';
import { VehicleModuleConfig } from '../types';

/**
 * Configuración específica del módulo de vehículos
 */
export const vehicleModuleSettings: VehicleModuleConfig = {
  maxVehicles: {
    free: 2,
    premium: 999
  },
  features: {
    export: true,
    import: true,
    backup: true,
    analytics: true,
    sharing: false // Deshabilitado por ahora
  },
  validation: {
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    maxMileage: 9999999
  },
  ui: {
    defaultView: 'grid',
    showWelcomeMessage: true,
    enableAnimations: true
  }
};

/**
 * Configuración del módulo para el sistema de módulos
 */
export const vehicleModuleConfig: ModuleConfig = {
  name: 'vehicle-management',
  displayName: 'Gestión de Vehículos',
  description: 'Módulo para gestionar vehículos, registro, edición y seguimiento',
  version: '1.0.0',
  icon: 'car',
  color: '#2563eb',
  
  // Rutas del módulo
  routes: {
    shared: [
      {
        path: '/vehicles',
        component: () => import('../screens/shared/VehicleListScreen').then(m => ({ default: m.VehicleListScreen })),
        exact: true,
        meta: {
          title: 'Mis Vehículos',
          description: 'Lista de vehículos registrados',
          breadcrumb: 'Vehículos',
          requiresAuth: false
        }
      },
      {
        path: '/vehicles/register',
        component: () => import('../screens/shared/VehicleRegistrationScreen').then(m => ({ default: m.VehicleRegistrationScreen })),
        exact: true,
        meta: {
          title: 'Registrar Vehículo',
          description: 'Formulario de registro de nuevo vehículo',
          breadcrumb: 'Registrar',
          requiresAuth: false
        }
      },
      {
        path: '/vehicles/:id',
        component: () => import('../screens/shared/VehicleDetailScreen').then(m => ({ default: m.VehicleDetailScreen })),
        exact: true,
        meta: {
          title: 'Detalle del Vehículo',
          description: 'Información detallada del vehículo',
          breadcrumb: (params: any) => `Vehículo ${params.id}`,
          requiresAuth: false
        }
      },
      {
        path: '/vehicles/:id/edit',
        component: () => import('../screens/shared/VehicleRegistrationScreen').then(m => ({ default: m.VehicleRegistrationScreen })),
        exact: true,
        meta: {
          title: 'Editar Vehículo',
          description: 'Formulario de edición de vehículo',
          breadcrumb: 'Editar',
          requiresAuth: false
        }
      }
    ],
    mobile: [
      // Rutas específicas para mobile si es necesario
    ],
    web: [
      // Rutas específicas para web si es necesario
    ]
  },

  // Items de navegación
  navigation: [
    {
      id: 'vehicles-list',
      label: 'Mis Vehículos',
      icon: 'car',
      path: '/vehicles'
    },
    {
      id: 'vehicles-register',
      label: 'Registrar Vehículo',
      icon: 'add-circle',
      path: '/vehicles/register'
    }
  ],

  // Permisos (para futuras funcionalidades)
  permissions: [
    'vehicles:read',
    'vehicles:write',
    'vehicles:delete'
  ],

  // Feature flags
  features: [
    {
      key: 'vehicle-export',
      enabled: true,
      description: 'Permitir exportar datos de vehículos'
    },
    {
      key: 'vehicle-import',
      enabled: true,
      description: 'Permitir importar datos de vehículos'
    },
    {
      key: 'vehicle-sharing',
      enabled: false,
      description: 'Permitir compartir vehículos entre usuarios'
    }
  ],

  // Dependencias de otros módulos
  dependencies: [
    // Por ahora no depende de otros módulos
  ],

  // Metadatos del módulo
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date(),
    dependencies: [],
    features: [
      {
        key: 'vehicle-management',
        enabled: true,
        description: 'Gestión completa de vehículos'
      }
    ]
  }
};

/**
 * Función para obtener la configuración del módulo con overrides
 */
export const getVehicleModuleConfig = (overrides?: Partial<VehicleModuleConfig>): VehicleModuleConfig => {
  return {
    ...vehicleModuleSettings,
    ...overrides
  };
};

/**
 * Función para verificar si una feature está habilitada
 */
export const isFeatureEnabled = (featureKey: string): boolean => {
  const feature = vehicleModuleConfig.features?.find(f => f.key === featureKey);
  return feature?.enabled ?? false;
};

/**
 * Función para obtener el límite de vehículos según el plan
 */
export const getVehicleLimit = (plan: 'free' | 'premium'): number => {
  return vehicleModuleSettings.maxVehicles[plan];
};

/**
 * Función para validar año de vehículo
 */
export const isValidYear = (year: number): boolean => {
  return year >= vehicleModuleSettings.validation.minYear && 
         year <= vehicleModuleSettings.validation.maxYear;
};

/**
 * Función para validar kilometraje
 */
export const isValidMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage <= vehicleModuleSettings.validation.maxMileage;
};

export default vehicleModuleConfig;