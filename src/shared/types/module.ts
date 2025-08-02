/**
 * Tipos para el sistema de módulos
 */
import React from 'react';
import { RouteConfig, AdaptiveRouteConfig } from './route';
import { NavigationItem } from './navigation';
import { FeatureFlag, ModuleMetadata, LoadingState } from './common';

/**
 * Configuración base de un módulo
 */
export interface ModuleConfig {
  name: string;
  displayName: string;
  description?: string;
  version: string;
  icon: string;
  color?: string;
  routes: AdaptiveRouteConfig;
  navigation?: NavigationItem[];
  permissions?: string[];
  features?: FeatureFlag[];
  dependencies?: string[];
  metadata?: ModuleMetadata;
}

/**
 * Interfaz que debe implementar cada módulo
 */
export interface Module {
  config: ModuleConfig;
  component: React.ComponentType<ModuleProps>;
  context?: React.Context<any>;
  services?: ModuleServices;
  hooks?: ModuleHooks;
}

/**
 * Props que recibe cada módulo
 */
export interface ModuleProps {
  config: ModuleConfig;
  navigation?: any;
  route?: any;
  children?: React.ReactNode;
}

/**
 * Servicios que puede exportar un módulo
 */
export interface ModuleServices {
  [serviceName: string]: any;
}

/**
 * Hooks que puede exportar un módulo
 */
export interface ModuleHooks {
  [hookName: string]: (...args: any[]) => any;
}

/**
 * Estado de un módulo en el registry
 */
export interface ModuleRegistryEntry {
  config: ModuleConfig;
  component: React.ComponentType<ModuleProps>;
  loaded: boolean;
  loading: boolean;
  error?: Error;
  instance?: Module;
  loadedAt?: Date;
}

/**
 * Registry de módulos
 */
export interface ModuleRegistry {
  [moduleName: string]: ModuleRegistryEntry;
}

/**
 * Configuración del sistema de módulos
 */
export interface ModuleSystemConfig {
  modules: ModuleConfig[];
  lazyLoading: boolean;
  preloadModules?: string[];
  errorBoundary?: React.ComponentType<ModuleErrorBoundaryProps>;
  loadingComponent?: React.ComponentType;
}

/**
 * Props para error boundary de módulos
 */
export interface ModuleErrorBoundaryProps {
  error: Error;
  moduleName: string;
  retry: () => void;
  fallback?: React.ComponentType;
}

/**
 * Contexto del sistema de módulos
 */
export interface ModuleSystemContextValue {
  registry: ModuleRegistry;
  loadModule: (moduleName: string) => Promise<Module>;
  unloadModule: (moduleName: string) => void;
  isModuleLoaded: (moduleName: string) => boolean;
  getModule: (moduleName: string) => ModuleRegistryEntry | undefined;
  getLoadedModules: () => string[];
  reloadModule: (moduleName: string) => Promise<Module>;
}

/**
 * Configuración de lazy loading para módulos
 */
export interface ModuleLazyConfig {
  loader: () => Promise<{ default: Module }>;
  loading?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
  timeout?: number;
}

/**
 * Información de carga de módulo
 */
export interface ModuleLoadingInfo {
  state: LoadingState;
  progress?: number;
  error?: Error;
  startTime?: Date;
  endTime?: Date;
}

/**
 * Evento de módulo
 */
export interface ModuleEvent {
  type: 'load' | 'unload' | 'error' | 'ready';
  moduleName: string;
  timestamp: Date;
  data?: any;
  error?: Error;
}

/**
 * Listener de eventos de módulo
 */
export type ModuleEventListener = (event: ModuleEvent) => void;

/**
 * Configuración de comunicación entre módulos
 */
export interface ModuleCommunicationConfig {
  events: {
    enabled: boolean;
    globalEvents?: string[];
  };
  services: {
    enabled: boolean;
    sharedServices?: string[];
  };
  state: {
    enabled: boolean;
    sharedState?: string[];
  };
}

/**
 * Interfaz para comunicación entre módulos
 */
export interface ModuleCommunication {
  emit: (event: string, data?: any) => void;
  on: (event: string, listener: (data: any) => void) => () => void;
  off: (event: string, listener?: (data: any) => void) => void;
  getService: <T = any>(moduleName: string, serviceName: string) => T | undefined;
  getSharedState: <T = any>(key: string) => T | undefined;
  setSharedState: <T = any>(key: string, value: T) => void;
}

/**
 * Factory para crear módulos
 */
export interface ModuleFactory {
  create: (config: ModuleConfig) => Module;
  createLazy: (config: ModuleConfig, lazyConfig: ModuleLazyConfig) => Module;
}

/**
 * Configuración de desarrollo para módulos
 */
export interface ModuleDevelopmentConfig {
  hotReload?: boolean;
  devTools?: boolean;
  logging?: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  performance?: {
    enabled: boolean;
    threshold: number;
  };
}