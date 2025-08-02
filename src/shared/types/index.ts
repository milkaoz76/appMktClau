/**
 * Tipos compartidos para toda la aplicación
 * Incluye interfaces para módulos, navegación, rutas y configuración
 */

// Re-exportar tipos de responsividad
export type { ResponsiveValues, Breakpoint } from '../hooks/useResponsive';

// Tipos base de la aplicación
export * from './module';
export * from './navigation';
export * from './route';
export * from './common';