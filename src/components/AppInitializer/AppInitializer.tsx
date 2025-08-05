/**
 * AppInitializer - Componente que maneja la inicialización de la aplicación
 * Determina si mostrar onboarding o permitir navegación normal
 */
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppInitialization } from '../../shared/hooks/useAppInitialization';
import { OnboardingScreen } from '../Onboarding';
import { VehicleRegistrationPrompt } from '../VehicleRegistrationPrompt';
import FirstRegistration from '../FirstRegistration/FirstRegistration';
import { MainApp } from '../MainApp';
import { VehicleListRedirect } from '../VehicleListRedirect';

interface AppInitializerProps {
  // No necesita children ya que maneja MainApp internamente
}

/**
 * Pantalla de carga mientras se inicializa la app
 */
const LoadingScreen: React.FC = () => (
  <LinearGradient
    colors={['#dbeafe', '#e0e7ff']}
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <View style={{
      alignItems: 'center',
      padding: 40
    }}>
      {/* Logo/Icono */}
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <Ionicons name="car-outline" size={40} color="#ffffff" />
      </View>

      {/* Título */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8
      }}>
        AutoConnect
      </Text>

      {/* Subtítulo */}
      <Text style={{
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center'
      }}>
        Cargando tu experiencia automotriz...
      </Text>

      {/* Indicador de carga */}
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  </LinearGradient>
);

/**
 * Pantalla de error
 */
const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <LinearGradient
    colors={['#fef2f2', '#fee2e2']}
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40
    }}
  >
    <View style={{
      alignItems: 'center'
    }}>
      {/* Icono de error */}
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <Ionicons name="alert-circle-outline" size={40} color="#ffffff" />
      </View>

      {/* Título */}
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center'
      }}>
        Error al inicializar
      </Text>

      {/* Mensaje de error */}
      <Text style={{
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center'
      }}>
        {error}
      </Text>

      {/* Botón de reintentar */}
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: '#2563eb',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Ionicons name="refresh-outline" size={20} color="#ffffff" />
        <Text style={{
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 8
        }}>
          Reintentar
        </Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

/**
 * Componente principal AppInitializer
 */
export const AppInitializer: React.FC<AppInitializerProps> = () => {
  const {
    isLoading,
    shouldShowOnboarding,
    shouldShowVehiclePrompt,
    shouldShowVehicleRegistration,
    shouldRedirectToVehicles,
    error,
    completeOnboarding,
    skipOnboarding,
    dismissVehiclePrompt,
    showVehicleRegistration,
    completeVehicleRegistration,
    goBackToVehiclePrompt,
    finishRedirect,
    refresh
  } = useAppInitialization();

  // Mostrar pantalla de carga
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Mostrar pantalla de error
  if (error) {
    return <ErrorScreen error={error} onRetry={refresh} />;
  }

  // Mostrar onboarding en primera visita (pantalla completa, sin navegación)
  if (shouldShowOnboarding) {
    return (
      <View style={{ flex: 1 }}>
        <OnboardingScreen
          onComplete={() => {
            completeOnboarding();
          }}
          onSkip={() => {
            skipOnboarding();
          }}
        />
      </View>
    );
  }

  // Mostrar prompt de registro de vehículo después del onboarding
  if (shouldShowVehiclePrompt) {
    return (
      <View style={{ flex: 1 }}>
        <VehicleRegistrationPrompt
          onRegisterVehicle={() => {
            showVehicleRegistration();
          }}
          onSkipForNow={() => {
            dismissVehiclePrompt();
          }}
        />
      </View>
    );
  }

  // Mostrar formulario de registro de vehículo (pantalla completa)
  if (shouldShowVehicleRegistration) {
    return (
      <View style={{ flex: 1 }}>
        <FirstRegistration
          onGoBack={goBackToVehiclePrompt}
          startWithForm={true}
          onVehicleRegistered={() => {
            // Cuando se registra exitosamente, volver al home normal
            console.log('🎉 Vehículo registrado exitosamente - volviendo al home');
            completeVehicleRegistration();
          }}
        />
      </View>
    );
  }

  // Mostrar redirección al listado de vehículos (ELIMINADO - usar home normal)
  if (shouldRedirectToVehicles) {
    console.log('🎯 AppInitializer: Redirección solicitada, pero usando MainApp normal');
    // Inmediatamente desactivar la redirección y mostrar app normal
    finishRedirect();
    return <MainApp />;
  }

  // Renderizar la aplicación principal con navegación
  console.log('🏠 AppInitializer: Mostrando MainApp normal');
  return <MainApp />;
};

export default AppInitializer;