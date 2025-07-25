/**
 * Exportaciones organizadas del módulo FirstRegistration
 * Punto de entrada único para el componente y sus utilidades
 */

// Componente principal
export { default } from './FirstRegistration';

// Context y hook
export { 
  FirstRegistrationProvider, 
  useFirstRegistration
} from './FirstRegistrationContext';

// Tipos e interfaces
export type { 
  Vehicle,
  FormData,
  FormErrors,
  MaintenanceTask,
  MaintenanceHistory
} from './FirstRegistrationContext';