/**
 * Reset App State Utility
 * Utility script to reset the application to different states for testing
 */

class AppStateManager {
  constructor() {
    this.storageKeys = [
      'onboarding_completed',
      'onboarding_skipped',
      'welcome_banner_dismissed',
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
      reset: '🔄'
    }[type] || 'ℹ️';
    
    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  // Clear all app data
  clearAll() {
    if (typeof localStorage === 'undefined') {
      this.log('localStorage not available', 'error');
      return false;
    }

    this.storageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    this.log('All app data cleared', 'reset');
    return true;
  }

  // Set app to first-time user state
  setFirstTimeUser() {
    this.clearAll();
    this.log('App reset to first-time user state', 'success');
    this.log('Expected behavior: Show onboarding', 'info');
  }

  // Set app to completed onboarding state
  setCompletedOnboarding() {
    this.clearAll();
    localStorage.setItem('onboarding_completed', 'true');
    this.log('App set to completed onboarding state', 'success');
    this.log('Expected behavior: Show FirstRegistration directly', 'info');
  }

  // Set app to skipped onboarding state
  setSkippedOnboarding() {
    this.clearAll();
    localStorage.setItem('onboarding_skipped', 'true');
    this.log('App set to skipped onboarding state', 'success');
    this.log('Expected behavior: Show FirstRegistration directly', 'info');
  }

  // Create conflicting states for testing
  setConflictingStates() {
    this.clearAll();
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_skipped', 'true');
    this.log('App set to conflicting states', 'warning');
    this.log('Expected behavior: Resolve to completed state, remove skipped', 'info');
  }

  // Set corrupted data for error testing
  setCorruptedData() {
    this.clearAll();
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('vehicles', 'invalid-json-data');
    localStorage.setItem('maintenanceHistory', '{broken-json}');
    this.log('App set with corrupted data', 'warning');
    this.log('Expected behavior: Handle errors gracefully, use defaults', 'info');
  }

  // Set app with sample vehicle data
  setSampleVehicleData() {
    this.clearAll();
    localStorage.setItem('onboarding_completed', 'true');
    
    const sampleVehicles = [
      {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 45000,
        image: 'bg-blue-500'
      },
      {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        year: 2019,
        mileage: 52000,
        image: 'bg-red-500'
      }
    ];
    
    const sampleHistory = {
      '1': {
        'oil_10k': {
          completed: true,
          date: '2024-01-15T10:00:00.000Z',
          mileage: 10000
        },
        'oil_20k': {
          completed: true,
          date: '2024-06-15T10:00:00.000Z',
          mileage: 20000
        }
      }
    };
    
    localStorage.setItem('vehicles', JSON.stringify(sampleVehicles));
    localStorage.setItem('maintenanceHistory', JSON.stringify(sampleHistory));
    localStorage.setItem('userPlan', 'free');
    
    this.log('App set with sample vehicle data', 'success');
    this.log('Expected behavior: Show dashboard with 2 vehicles', 'info');
  }

  // Get current app state
  getCurrentState() {
    if (typeof localStorage === 'undefined') {
      this.log('localStorage not available', 'error');
      return null;
    }

    const state = {};
    this.storageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        state[key] = value;
      }
    });

    this.log('Current app state:', 'info');
    console.table(state);
    return state;
  }

  // Reload page after state change
  reloadApp() {
    if (typeof window !== 'undefined' && window.location) {
      this.log('Reloading application...', 'reset');
      window.location.reload();
    } else {
      this.log('Manual page reload required', 'info');
    }
  }

  // Quick test scenarios
  runTestScenario(scenario) {
    this.log(`Running test scenario: ${scenario}`, 'reset');
    
    switch (scenario) {
      case 'fresh-install':
        this.setFirstTimeUser();
        break;
        
      case 'returning-user':
        this.setCompletedOnboarding();
        break;
        
      case 'skipped-user':
        this.setSkippedOnboarding();
        break;
        
      case 'conflict-test':
        this.setConflictingStates();
        break;
        
      case 'error-test':
        this.setCorruptedData();
        break;
        
      case 'with-data':
        this.setSampleVehicleData();
        break;
        
      default:
        this.log(`Unknown scenario: ${scenario}`, 'error');
        this.log('Available scenarios: fresh-install, returning-user, skipped-user, conflict-test, error-test, with-data', 'info');
        return;
    }
    
    setTimeout(() => this.reloadApp(), 1000);
  }

  // Interactive menu for browser console
  showMenu() {
    console.log(`
🔄 APP STATE MANAGER - TESTING UTILITY
=====================================

Available Commands:
• appState.setFirstTimeUser()     - Reset to first-time user
• appState.setCompletedOnboarding() - Set as returning user  
• appState.setSkippedOnboarding()  - Set as user who skipped
• appState.setConflictingStates()  - Create conflicting states
• appState.setCorruptedData()      - Set corrupted data for testing
• appState.setSampleVehicleData()  - Add sample vehicles
• appState.getCurrentState()       - Show current state
• appState.clearAll()              - Clear all data
• appState.reloadApp()             - Reload the application

Quick Test Scenarios:
• appState.runTestScenario('fresh-install')
• appState.runTestScenario('returning-user')
• appState.runTestScenario('skipped-user')
• appState.runTestScenario('conflict-test')
• appState.runTestScenario('error-test')
• appState.runTestScenario('with-data')

Current State:
`);
    this.getCurrentState();
  }
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.appState = new AppStateManager();
  window.appState.showMenu();
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppStateManager;
}

console.log('🔄 App State Manager loaded. Type appState.showMenu() for options.');