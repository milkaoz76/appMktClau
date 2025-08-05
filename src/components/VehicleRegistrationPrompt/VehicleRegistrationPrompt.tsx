/**
 * VehicleRegistrationPrompt - Pantalla que se muestra después del onboarding
 * Invita al usuario a registrar su primer vehículo
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface VehicleRegistrationPromptProps {
  onRegisterVehicle: () => void;
  onSkipForNow: () => void;
}

export const VehicleRegistrationPrompt: React.FC<VehicleRegistrationPromptProps> = ({
  onRegisterVehicle,
  onSkipForNow
}) => {
  return (
    <LinearGradient
      colors={['#dbeafe', '#ffffff', '#e0e7ff']}
      style={{ flex: 1 }}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
      }}>
        {/* Icono principal */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
          shadowColor: '#2563eb',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8
        }}>
          <Ionicons name="car-outline" size={60} color="#2563eb" />
        </View>

        {/* Título */}
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: 12
        }}>
          ¡Perfecto!
        </Text>

        {/* Subtítulo */}
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#2563eb',
          textAlign: 'center',
          marginBottom: 20
        }}>
          Ahora registra tu primer vehículo
        </Text>

        {/* Descripción */}
        <Text style={{
          fontSize: 16,
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 40
        }}>
          Solo necesitas algunos datos básicos de tu auto para comenzar a usar todas las funciones de AutoConnect
        </Text>

        {/* Lista de beneficios */}
        <View style={{
          alignSelf: 'stretch',
          marginBottom: 40
        }}>
          {[
            'Seguimiento de mantenciones',
            'Recordatorios automáticos',
            'Historial completo del vehículo'
          ].map((benefit, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
              <Text style={{
                fontSize: 16,
                color: '#374151'
              }}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Botones */}
        <View style={{
          alignSelf: 'stretch',
          gap: 12
        }}>
          {/* Botón principal */}
          <TouchableOpacity
            onPress={onRegisterVehicle}
            style={{
              backgroundColor: '#2563eb',
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2563eb',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8
            }}>
              Registrar mi primer vehículo
            </Text>
          </TouchableOpacity>

          {/* Botón secundario */}
          <TouchableOpacity
            onPress={onSkipForNow}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: '#6b7280',
              fontSize: 16,
              fontWeight: '500'
            }}>
              Lo haré más tarde
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};