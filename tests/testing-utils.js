/**
 * Utilidades para Testing del Flujo de Navegación
 * Funciones helper para facilitar el testing manual y automatizado
 */

// Función para limpiar todos los datos de AsyncStorage
export const clearAllAppData = async () => {
  try {
    console.log('🧹 Limpiando todos los datos de la aplicación...');
    
    const keysToRemove = [
      'onboarding_completed',
      'onboarding_skipped', 
      'welcome_banner_dismissed',
      'force_onboarding',
      'vehicles',
      'maintenanceHistory',
      'userPlan'
    ];
    
    // En web, usar localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    console.log('✅ Datos limpiados exitosamente');
    console.log('🔄 Recarga la página para ver el estado inicial');
    
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar datos:', error);
    return false;
  }
};

// Función para forzar mostrar onboarding
export const forceShowOnboarding = async () => {
  try {
    console.log('🔄 Forzando mostrar onboarding...');
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('force_onboarding', 'true');
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('onboarding_skipped');
    }
    
    console.log('✅ Onboarding será mostrado en próxima recarga');
    console.log('🔄 Recarga la página para ver el onboarding');
    
    return true;
  } catch (error) {
    console.error('❌ Error al forzar onboarding:', error);
    return false;
  }
};

// Función para simular completar onboarding
export const simulateOnboardingCompleted = async () => {
  try {
    console.log('✅ Simulando onboarding completado...');
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.removeItem('onboarding_skipped');
      localStorage.removeItem('force_onboarding');
    }
    
    console.log('✅ Onboarding marcado como completado');
    console.log('🔄 Recarga la página para ver el estado post-onboarding');
    
    return true;
  } catch (error) {
    console.error('❌ Error al simular onboarding completado:', error);
    return false;
  }
};

// Función para simular onboarding omitido
export const simulateOnboardingSkipped = async () => {
  try {
    console.log('⏭️ Simulando onboarding omitido...');
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('onboarding_skipped', 'true');
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('force_onboarding');
    }
    
    console.log('✅ Onboarding marcado como omitido');
    console.log('🔄 Recarga la página para ver app principal con banner');
    
    return true;
  } catch (error) {
    console.error('❌ Error al simular onboarding omitido:', error);
    return false;
  }
};

// Función para verificar estado actual
export const checkCurrentState = () => {
  try {
    console.log('📊 Estado actual de la aplicación:');
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const state = {
        onboarding_completed: localStorage.getItem('onboarding_completed'),
        onboarding_skipped: localStorage.getItem('onboarding_skipped'),
        welcome_banner_dismissed: localStorage.getItem('welcome_banner_dismissed'),
        force_onboarding: localStorage.getItem('force_onboarding'),
        vehicles: localStorage.getItem('vehicles'),
        userPlan: localStorage.getItem('userPlan')
      };
      
      console.table(state);
      
      // Interpretación del estado
      if (state.force_onboarding === 'true') {
        console.log('🎯 Estado: Onboarding será forzado');
      } else if (state.onboarding_completed === 'true') {
        console.log('🎯 Estado: Onboarding completado - App principal');
      } else if (state.onboarding_skipped === 'true') {
        console.log('🎯 Estado: Onboarding omitido - App principal con banner');
      } else {
        console.log('🎯 Estado: Primera visita - Mostrar onboarding');
      }
      
      return state;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al verificar estado:', error);
    return null;
  }
};

// Función para crear vehículo de prueba
export const createTestVehicle = async () => {
  try {
    console.log('🚗 Creando vehículo de prueba...');
    
    const testVehicle = {
      id: Date.now(),
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 50000,
      image: 'bg-blue-500'
    };
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
      const updatedVehicles = [...existingVehicles, testVehicle];
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    }
    
    console.log('✅ Vehículo de prueba creado:', testVehicle);
    console.log('🔄 Recarga la página para ver el vehículo');
    
    return testVehicle;
  } catch (error) {
    console.error('❌ Error al crear vehículo de prueba:', error);
    return null;
  }
};

// Función para testing automatizado de navegación
export const testNavigationFlow = async () => {
  console.log('🧪 Iniciando test automatizado de navegación...');
  
  const results = {
    clearData: false,
    forceOnboarding: false,
    checkState: false,
    createVehicle: false
  };
  
  try {
    // Test 1: Limpiar datos
    results.clearData = await clearAllAppData();
    
    // Test 2: Forzar onboarding
    results.forceOnboarding = await forceShowOnboarding();
    
    // Test 3: Verificar estado
    const state = checkCurrentState();
    results.checkState = state !== null;
    
    // Test 4: Crear vehículo de prueba
    results.createVehicle = await createTestVehicle() !== null;
    
    console.log('📊 Resultados del test automatizado:');
    console.table(results);
    
    const allPassed = Object.values(results).every(result => result === true);
    console.log(allPassed ? '✅ Todos los tests pasaron' : '❌ Algunos tests fallaron');
    
    return results;
  } catch (error) {
    console.error('❌ Error en test automatizado:', error);
    return results;
  }
};

// Exportar funciones para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.testingUtils = {
    clearAllAppData,
    forceShowOnboarding,
    simulateOnboardingCompleted,
    simulateOnboardingSkipped,
    checkCurrentState,
    createTestVehicle,
    testNavigationFlow
  };
  
  console.log('🛠️ Testing Utils cargadas. Usa window.testingUtils en la consola');
  console.log('📋 Funciones disponibles:');
  console.log('  - clearAllAppData()');
  console.log('  - forceShowOnboarding()');
  console.log('  - simulateOnboardingCompleted()');
  console.log('  - simulateOnboardingSkipped()');
  console.log('  - checkCurrentState()');
  console.log('  - createTestVehicle()');
  console.log('  - testNavigationFlow()');
}