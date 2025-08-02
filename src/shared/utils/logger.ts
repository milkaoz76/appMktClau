/**
 * Sistema de logging opcional para debugging
 * Permite habilitar/deshabilitar logs en desarrollo
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig = { enabled: (typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development'), level: 'info' }) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): [string, ...any[]] {
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const timestamp = new Date().toISOString();
    return [`${prefix}[${level.toUpperCase()}][${timestamp}] ${message}`, ...args];
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.formatMessage('debug', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', message, ...args));
    }
  }

  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

// Instancia global del logger
export const logger = new Logger({ enabled: isDev, level: 'info', prefix: 'AutoConnect' });

// Logger específico para componentes adaptativos
export const adaptiveLogger = new Logger({ 
  enabled: isDev, 
  level: 'debug', 
  prefix: 'Adaptive' 
});

// Logger específico para navegación
export const navigationLogger = new Logger({ 
  enabled: isDev, 
  level: 'info', 
  prefix: 'Navigation' 
});

// Función para crear loggers personalizados
export const createLogger = (prefix: string, config?: Partial<LoggerConfig>): Logger => {
  return new Logger({ 
    enabled: isDev, 
    level: 'info', 
    prefix,
    ...config 
  });
};