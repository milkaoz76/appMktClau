/**
 * Script de debugging para verificar el almacenamiento de vehículos
 * Ejecutar en la consola del navegador
 */

// Función para verificar AsyncStorage
async function checkAsyncStorage() {
  try {
    const vehicles = localStorage.getItem('vehicles');
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    const onboardingSkipped = localStorage.getItem('onboarding_skipped');
    
    console.log('📊 Estado de AsyncStorage:');
    console.log('🚗 Vehículos:', vehicles ? JSON.parse(vehicles) : 'No hay vehículos');
    console.log('✅ Onboarding completado:', onboardingCompleted);
    console.log('⏭️ Onboarding omitido:', onboardingSkipped);
    
    return {
      vehicles: vehicles ? JSON.parse(vehicles) : [],
      onboardingCompleted,
      onboardingSkipped
    };
  } catch (error) {
    console.error('❌ Error al leer AsyncStorage:', error);
    return null;
  }
}

// Función para limpiar AsyncStorage
function clearAsyncStorage() {
  try {
    localStorage.removeItem('vehicles');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_skipped');
    localStorage.removeItem('maintenanceHistory');
    localStorage.removeItem('userPlan');
    
    console.log('🧹 AsyncStorage limpiado');
    console.log('🔄 Recarga la página para ver el estado inicial');
  } catch (error) {
    console.error('❌ Error al limpiar AsyncStorage:', error);
  }
}

// Función para agregar vehículo de prueba
function addTestVehicle() {
  try {
    const testVehicle = {
      id: Date.now(),
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 50000,
      image: 'bg-blue-500'
    };
    
    const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const updatedVehicles = [...existingVehicles, testVehicle];
    
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    
    console.log('🚗 Vehículo de prueba agregado:', testVehicle);
    console.log('📋 Lista actualizada:', updatedVehicles);
    console.log('🔄 Recarga la página para ver los cambios');
    
    return testVehicle;
  } catch (error) {
    console.error('❌ Error al agregar vehículo de prueba:', error);
    return null;
  }
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  window.vehicleDebug = {
    checkAsyncStorage,
    clearAsyncStorage,
    addTestVehicle,
    debugVehicles: () => window.debugVehicles ? window.debugVehicles() : 'Hook no disponible'
  };
  
  console.log('🛠️ Funciones de debug cargadas:');
  console.log('  - vehicleDebug.checkAsyncStorage()');
  console.log('  - vehicleDebug.clearAsyncStorage()');
  console.log('  - vehicleDebug.addTestVehicle()');
  console.log('  - vehicleDebug.debugVehicles()');
}

// Auto-ejecutar verificación inicial
checkAsyncStorage();