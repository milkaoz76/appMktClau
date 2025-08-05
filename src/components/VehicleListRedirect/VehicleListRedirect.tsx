/**
 * VehicleListRedirect - Componente que redirige automáticamente al listado de vehículos
 * Se usa después de completar el registro de vehículo
 */
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '../../navigation/NavigationContext';
import { useVehicle } from '../../modules/vehicle-management';
import { useAppInitialization } from '../../shared/hooks/useAppInitialization';

export const VehicleListRedirect: React.FC = () => {
  const { navigate } = useNavigation();
  const { refreshVehicles } = useVehicle();
  const { finishRedirect } = useAppInitialization();
  
  // Usar refs para evitar dependencias cambiantes
  const navigateRef = useRef(navigate);
  const refreshVehiclesRef = useRef(refreshVehicles);
  const finishRedirectRef = useRef(finishRedirect);
  
  // Actualizar refs cuando cambien las funciones
  navigateRef.current = navigate;
  refreshVehiclesRef.current = refreshVehicles;
  finishRedirectRef.current = finishRedirect;

  useEffect(() => {
    let isMounted = true;
    let hasExecuted = false;
    
    const redirectToVehicles = async () => {
      // Evitar ejecuciones múltiples
      if (hasExecuted || !isMounted) {
        console.log('🚫 VehicleListRedirect: Evitando ejecución duplicada');
        return;
      }
      
      hasExecuted = true;
      
      try {
        // Primero desactivar el estado de redirección para evitar bucles
        console.log('🔄 VehicleListRedirect: Finalizando estado de redirección...');
        finishRedirectRef.current();
        
        // Pequeña pausa para asegurar que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        
        // Refrescar la lista de vehículos desde AsyncStorage
        console.log('🔄 VehicleListRedirect: Refrescando lista de vehículos...');
        await refreshVehiclesRef.current();
        console.log('✅ VehicleListRedirect: Lista de vehículos refrescada');
        
        if (!isMounted) return;
        
        // Luego navegar al listado
        console.log('🎯 VehicleListRedirect: Navegando a /vehicles');
        navigateRef.current('/vehicles');
        console.log('✅ VehicleListRedirect: Navegación completada');
        
      } catch (error) {
        console.error('❌ VehicleListRedirect: Error durante redirección:', error);
        // Finalizar redirección y navegar de todas formas
        if (isMounted) {
          finishRedirectRef.current();
          navigateRef.current('/vehicles');
        }
      }
    };

    // Ejecutar inmediatamente para evitar bucles
    redirectToVehicles();
    
    return () => {
      isMounted = false;
    };
  }, []); // ✅ Array vacío - solo ejecutar una vez al montar

  return (
    <LinearGradient
      colors={['#dbeafe', '#e0e7ff']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <ActivityIndicator size="large" color="#2563eb" />
    </LinearGradient>
  );
};

export default VehicleListRedirect;