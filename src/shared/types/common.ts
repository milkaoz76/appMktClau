/**
 * Tipos comunes utilizados en toda la aplicación
 */
import React from 'react';

/**
 * Tipo para componentes que pueden ser renderizados
 */
export type RenderableComponent<P = Record<string, any>> = 
  | React.ComponentType<P> 
  | React.ReactElement 
  | null;

/**
 * Tipo para props base que todos los componentes pueden recibir
 */
export interface BaseComponentProps {
  testID?: string;
  style?: any;
  children?: React.ReactNode;
}

/**
 * Tipo para configuración de plataforma
 */
export type Platform = 'mobile' | 'web';

/**
 * Tipo para configuración adaptativa
 */
export interface AdaptiveConfig<T = any> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  shared?: T;
  fallback?: T;
}

/**
 * Tipo para estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Tipo para errores de la aplicación
 */
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

/**
 * Tipo para configuración de features
 */
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
}

/**
 * Tipo para metadatos de módulos
 */
export interface ModuleMetadata {
  version: string;
  lastUpdated: Date;
  dependencies?: string[];
  features?: FeatureFlag[];
}

/**
 * Tipo para configuración de tema
 */
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

/**
 * Tipo para configuración de animaciones
 */
export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}