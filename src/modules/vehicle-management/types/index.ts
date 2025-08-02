/**
 * Tipos específicos del módulo de gestión de vehículos
 */

/**
 * Interfaz principal del vehículo
 */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  // Campos opcionales para futuras funcionalidades
  color?: string;
  vin?: string;
  licensePlate?: string;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'manual' | 'automatic';
  notes?: string;
}

/**
 * Datos del formulario de vehículo
 */
export interface VehicleFormData {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color?: string;
  vin?: string;
  licensePlate?: string;
  fuelType?: Vehicle['fuelType'];
  transmission?: Vehicle['transmission'];
  notes?: string;
}

/**
 * Errores de validación del formulario
 */
export interface VehicleFormErrors {
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
  color?: string;
  vin?: string;
  licensePlate?: string;
  fuelType?: string;
  transmission?: string;
  notes?: string;
}

/**
 * Filtros para la lista de vehículos
 */
export interface VehicleFilter {
  brand: string;
  year: number | null;
  search: string;
  fuelType?: Vehicle['fuelType'];
  transmission?: Vehicle['transmission'];
}

/**
 * Ordenamiento para la lista de vehículos
 */
export interface VehicleSort {
  field: keyof Vehicle;
  direction: 'asc' | 'desc';
}

/**
 * Estadísticas de vehículos
 */
export interface VehicleStats {
  total: number;
  byBrand: Record<string, number>;
  byYear: Record<number, number>;
  averageMileage: number;
  newestYear: number;
  oldestYear: number;
}

/**
 * Configuración de vista de lista
 */
export interface VehicleListConfig {
  view: 'grid' | 'list';
  itemsPerPage: number;
  showImages: boolean;
  showStats: boolean;
}

/**
 * Acción de vehículo (para menús contextuales)
 */
export interface VehicleAction {
  id: string;
  label: string;
  icon: string;
  action: (vehicle: Vehicle) => void;
  visible?: (vehicle: Vehicle) => boolean;
  disabled?: (vehicle: Vehicle) => boolean;
}

/**
 * Evento de vehículo (para logging y analytics)
 */
export interface VehicleEvent {
  type: 'created' | 'updated' | 'deleted' | 'selected' | 'viewed';
  vehicleId: number;
  timestamp: Date;
  data?: any;
  userId?: string;
}

/**
 * Configuración de exportación
 */
export interface VehicleExportConfig {
  format: 'json' | 'csv' | 'pdf';
  fields: (keyof Vehicle)[];
  includeStats: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * Resultado de importación
 */
export interface VehicleImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  vehicles: Vehicle[];
}

/**
 * Configuración de backup
 */
export interface VehicleBackupConfig {
  autoBackup: boolean;
  backupInterval: number; // en días
  maxBackups: number;
  includeImages: boolean;
}

/**
 * Información de backup
 */
export interface VehicleBackup {
  id: string;
  date: Date;
  vehicleCount: number;
  size: number; // en bytes
  version: string;
}

/**
 * Configuración del módulo de vehículos
 */
export interface VehicleModuleConfig {
  maxVehicles: {
    free: number;
    premium: number;
  };
  features: {
    export: boolean;
    import: boolean;
    backup: boolean;
    analytics: boolean;
    sharing: boolean;
  };
  validation: {
    minYear: number;
    maxYear: number;
    maxMileage: number;
  };
  ui: {
    defaultView: 'grid' | 'list';
    showWelcomeMessage: boolean;
    enableAnimations: boolean;
  };
}