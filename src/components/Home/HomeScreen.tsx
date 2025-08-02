/**
 * HomeScreen - Pantalla temporal de inicio
 * Componente temporal hasta implementar el dashboard completo
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../../navigation/NavigationContext';
import { useVehicle } from '../../modules/vehicle-management';
import { AdaptiveLayout } from '../../shared/components/AdaptiveLayout';

/**
 * Componente de inicio mobile
 */
const HomeScreenMobile: React.FC = () => {
  const { navigate } = useNavigation();
  const { vehicles, getVehicleCount } = useVehicle();

  const vehicleCount = getVehicleCount();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
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
const HomeScreenWeb: React.FC = () => {
  return <HomeScreenMobile />;
};

/**
 * Pantalla principal de inicio
 */
export const HomeScreen: React.FC = () => {
  return (
    <AdaptiveLayout
      mobile={() => <HomeScreenMobile />}
      desktop={() => <HomeScreenWeb />}
    />
  );
};

export default HomeScreen;