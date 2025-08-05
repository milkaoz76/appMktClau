/**
 * HomeScreen - Pantalla principal de inicio
 * Pantalla principal que se muestra después del onboarding
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../../navigation/NavigationContext';
import { useVehicle } from '../../modules/vehicle-management';
import { AdaptiveLayout } from '../../shared/components/AdaptiveLayout';
import { StorageService } from '../../shared/services/StorageService';

interface HomeScreenProps {
  showWelcomeBanner?: boolean;
  onDismissWelcomeBanner?: () => void;
}

/**
 * Banner de bienvenida opcional
 */
const WelcomeBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <LinearGradient
    colors={['#eff6ff', '#e0e7ff']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      }}>
        <Ionicons name="car-outline" size={20} color="#ffffff" />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: 4
        }}>
          ¡Bienvenido a AutoConnect!
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6b7280'
        }}>
          ¿Te gustaría conocer todas las funciones disponibles?
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={onDismiss}
        style={{
          padding: 8,
          borderRadius: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Ionicons name="close" size={16} color="#6b7280" />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

/**
 * Componente de inicio mobile
 */
const HomeScreenMobile: React.FC<HomeScreenProps> = ({ 
  showWelcomeBanner: propShowWelcomeBanner = false, 
  onDismissWelcomeBanner: propOnDismissWelcomeBanner 
}) => {
  const { navigate, state } = useNavigation();
  const { vehicles, getVehicleCount } = useVehicle();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const vehicleCount = getVehicleCount();

  // Verificar si debemos mostrar el banner basado en el estado guardado
  useEffect(() => {
    const checkBannerState = async () => {
      try {
        const onboardingState = await StorageService.getOnboardingState();
        const bannerDismissed = await StorageService.isWelcomeBannerDismissed();
        
        // Mostrar banner si el onboarding fue saltado y el banner no fue cerrado
        const shouldShow = onboardingState.skipped && !bannerDismissed;
        setShowWelcomeBanner(shouldShow);
      } catch (error) {
        console.error('Error checking banner state:', error);
        setShowWelcomeBanner(false);
      }
    };

    checkBannerState();
  }, []);

  // Función para cerrar el banner
  const handleDismissBanner = async () => {
    try {
      await StorageService.dismissWelcomeBanner();
      setShowWelcomeBanner(false);
    } catch (error) {
      console.error('Error dismissing banner:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Banner de bienvenida condicional */}
      {showWelcomeBanner && (
        <WelcomeBanner onDismiss={handleDismissBanner} />
      )}

      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
            ¡Bienvenido a AutoConnect!
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            Gestiona tus vehículos de manera inteligente
          </Text>
        </View>

        {/* Estadísticas rápidas */}
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
            Resumen
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#dbeafe',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="car" size={24} color="#2563eb" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
                {vehicleCount}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Vehículos</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="build" size={24} color="#16a34a" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>0</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Mantenciones</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#fef3c7',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                <Ionicons name="notifications" size={24} color="#d97706" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>0</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Recordatorios</Text>
            </View>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
            Acciones Rápidas
          </Text>
          
          <TouchableOpacity
            onPress={() => navigate('/vehicles/register')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f8fafc',
              borderRadius: 8,
              marginBottom: 12
            }}
          >
            <Ionicons name="add-circle" size={24} color="#2563eb" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#1f2937' }}>
              Registrar Vehículo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigate('/vehicles')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f8fafc',
              borderRadius: 8,
              marginBottom: 12
            }}
          >
            <Ionicons name="car" size={24} color="#2563eb" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#1f2937' }}>
              Ver Mis Vehículos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigate('/maintenance')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f8fafc',
              borderRadius: 8
            }}
          >
            <Ionicons name="build" size={24} color="#2563eb" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#1f2937' }}>
              Plan de Mantenimiento
            </Text>
          </TouchableOpacity>
        </View>

        {/* Vehículos recientes */}
        {vehicles.length > 0 && (
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
              Tus Vehículos
            </Text>
            
            {vehicles.slice(0, 3).map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                onPress={() => navigate(`/vehicles/${vehicle.id}`)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: '#f8fafc',
                  borderRadius: 8,
                  marginBottom: 8
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: vehicle.image,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Ionicons name="car" size={20} color="#ffffff" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937' }}>
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
            
            {vehicles.length > 3 && (
              <TouchableOpacity
                onPress={() => navigate('/vehicles')}
                style={{
                  alignItems: 'center',
                  padding: 12,
                  marginTop: 8
                }}
              >
                <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
                  Ver todos los vehículos ({vehicles.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

/**
 * Componente de inicio web (similar al mobile por ahora)
 */
const HomeScreenWeb: React.FC<HomeScreenProps> = (props) => {
  return <HomeScreenMobile {...props} />;
};

/**
 * Pantalla principal de inicio
 */
export const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  return (
    <AdaptiveLayout
      mobile={() => <HomeScreenMobile {...props} />}
      desktop={() => <HomeScreenWeb {...props} />}
    />
  );
};

export default HomeScreen;