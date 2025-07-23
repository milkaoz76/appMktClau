/**
 * Utilidades de debugging para navegación
 * Script para cargar en la consola del navegador para facilitar el testing
 */

class NavigationDebugger {
  constructor() {
    this.storageKeys = [
      'onboarding_completed',
      'onboarding_skipped',
      'welcome_banner_dismissed',
      'force_onboarding',
      'vehicles',
      'maintenanceHistory',
      'userPlan'
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🐛'
    }[type] || 'ℹ️';
    
    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  // Mostrar estado actual del AsyncStorage
  async showCurrentState() {
    this.log('Estado actual del AsyncStorage:', 'debug');
    
    const state = {};
    for (const key of this.storageKeys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        state[key] = value;
      }
    }
    
    console.table(state);
    return state;
  }

  // Limpiar todo y resetear a primera visita
  async resetToFirstVisit() {
    this.log('Reseteando aplicación a primera visita...', 'debug');
    
    this.storageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    this.log('Aplicación reseteada - recarga la página', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Configurar como usuario que completó onboarding
  async setCompletedUser() {
    this.log('Configurando como usuario que completó onboarding...', 'debug');
    
    this.storageKeys.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('onboarding_completed', 'true');
    
    this.log('Usuario configurado como completado - recarga la página', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Configurar como usuario que saltó onboarding
  async setSkippedUser() {
    this.log('Configurando como usuario que saltó onboarding...', 'debug');
    
    this.storageKeys.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('onboarding_skipped', 'true');
    
    this.log('Usuario configurado como saltado - recarga la página', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Forzar mostrar onboarding
  async forceOnboarding() {
    this.log('Forzando mostrar onboarding...', 'debug');
    
    localStorage.setItem('force_onboarding', 'true');
    
    this.log('Onboarding será mostrado - recarga la página', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Crear estados conflictivos para testing
  async createConflictingStates() {
    this.log('Creando estados conflictivos...', 'warning');
    
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_skipped', 'true');
    
    this.log('Estados conflictivos creados - recarga la página', 'warning');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Ejecutar suite de pruebas de navegación
  async runNavigationTests() {
    if (typeof window.runNavigationTests === 'function') {
      this.log('Ejecutando suite de pruebas de navegación...', 'debug');
      return await window.runNavigationTests();
    } else {
      this.log('Suite de pruebas no disponible. Asegúrate de que navigation-test-suite.js esté cargado.', 'error');
    }
  }

  // Mostrar menú de opciones
  showMenu() {
    console.log(`
🐛 NAVIGATION DEBUGGER - HERRAMIENTAS DE TESTING
===============================================

Comandos disponibles:
• navDebug.showCurrentState()     - Mostrar estado actual
• navDebug.resetToFirstVisit()    - Resetear a primera visita
• navDebug.setCompletedUser()     - Configurar como usuario completado
• navDebug.setSkippedUser()       - Configurar como usuario que saltó
• navDebug.forceOnboarding()      - Forzar mostrar onboarding
• navDebug.createConflictingStates() - Crear estados conflictivos
• navDebug.runNavigationTests()   - Ejecutar pruebas de navegación

Escenarios de prueba rápidos:
• navDebug.testScenario('fresh')     - Primera visita
• navDebug.testScenario('completed') - Usuario completado
• navDebug.testScenario('skipped')   - Usuario que saltó
• navDebug.testScenario('conflict')  - Estados conflictivos

Estado actual:
`);
    this.showCurrentState();
  }

  // Ejecutar escenarios de prueba predefinidos
  async testScenario(scenario) {
    this.log(`Ejecutando escenario: ${scenario}`, 'debug');
    
    switch (scenario) {
      case 'fresh':
        await this.resetToFirstVisit();
        break;
      case 'completed':
        await this.setCompletedUser();
        break;
      case 'skipped':
        await this.setSkippedUser();
        break;
      case 'conflict':
        await this.createConflictingStates();
        break;
      case 'force':
        await this.forceOnboarding();
        break;
      default:
        this.log(`Escenario desconocido: ${scenario}`, 'error');
        this.log('Escenarios disponibles: fresh, completed, skipped, conflict, force', 'info');
    }
  }

  // Monitorear cambios en localStorage
  startMonitoring() {
    this.log('Iniciando monitoreo de localStorage...', 'debug');
    
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      if (this.storageKeys.includes(key)) {
        console.log(`🔄 localStorage.setItem: ${key} = ${value}`);
      }
      return originalSetItem.apply(this, arguments);
    }.bind(this);
    
    localStorage.removeItem = function(key) {
      if (this.storageKeys.includes(key)) {
        console.log(`🗑️ localStorage.removeItem: ${key}`);
      }
      return originalRemoveItem.apply(this, arguments);
    }.bind(this);
    
    this.log('Monitoreo activo - verás logs de cambios en localStorage', 'success');
  }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.navDebug = new NavigationDebugger();
  window.navDebug.showMenu();
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationDebugger;
}

console.log('🐛 Navigation Debugger cargado. Usa navDebug.showMenu() para ver opciones.');