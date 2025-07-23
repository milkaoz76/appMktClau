/**
 * Componente FirstRegistration - Componente de presentación puro
 * Maneja la interfaz de usuario del registro de vehículos y gestión de mantenimiento
 * Compatible con Expo Web, Android e iOS
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFirstRegistration } from './useFirstRegistration';
import { firstRegistrationStyles as styles } from './firstRegistration.styles';

interface FirstRegistrationProps {
  onGoBack?: () => void;
}

/**
 * Modal para actualizar kilometraje
 */
const MileageModal: React.FC = () => {
  const { 
    showMileageModal, 
    setShowMileageModal, 
    selectedVehicle, 
    newMileage, 
    setNewMileage, 
    updateVehicleMileage 
  } = useFirstRegistration();

  if (!showMileageModal) return null;

  return (
    <Modal
      visible={showMileageModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMileageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Actualizar Kilometraje</Text>
            <TouchableOpacity
              onPress={() => setShowMileageModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalCurrentMileage}>
              Kilometraje actual: <Text style={{ fontWeight: '500' }}>
                {selectedVehicle?.mileage.toLocaleString()} km
              </Text>
            </Text>
            <Text style={styles.formLabel}>Nuevo kilometraje</Text>
            <TextInput
              style={styles.formInput}
              value={newMileage}
              onChangeText={setNewMileage}
              placeholder="Ej: 152000"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              onPress={() => setShowMileageModal(false)}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={updateVehicleMileage}
              disabled={!newMileage || parseInt(newMileage) < (selectedVehicle?.mileage || 0)}
              style={[
                styles.primaryButton, 
                { flex: 1 },
                (!newMileage || parseInt(newMileage) < (selectedVehicle?.mileage || 0)) && styles.primaryButtonDisabled
              ]}
            >
              <Ionicons name="save-outline" size={16} color="#ffffff" />
              <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Pantalla de bienvenida
 */
const WelcomeScreen: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  const { setCurrentScreen } = useFirstRegistration();
  
  console.log('🏠 WelcomeScreen renderizada, setCurrentScreen disponible:', !!setCurrentScreen);

  return (
    <LinearGradient
      colors={['#dbeafe', '#e0e7ff']}
      style={styles.welcomeContainer}
    >
      <View style={styles.welcomeContent}>
        {/* Header con botón de regreso */}
        <View style={[styles.flexRow, styles.spaceBetween, { paddingTop: 16, paddingHorizontal: 16 }]}>
          {onGoBack && (
            <TouchableOpacity onPress={onGoBack}>
              <Ionicons name="arrow-back" size={24} color="#2563eb" />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
        </View>
        
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeIconContainer}>
            <Ionicons name="car-outline" size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>AutoTrack</Text>
          <Text style={styles.bodyText}>Gestiona tus vehículos y mantenciones</Text>
        </View>

        <View style={styles.welcomeCard}>
          <View style={styles.alignCenter}>
            <Ionicons name="car-outline" size={64} color="#9ca3af" />
            <Text style={styles.subtitle}>¡Comienza registrando tu primer vehículo!</Text>
            <Text style={styles.bodyText}>
              Lleva un control completo de tus vehículos y sus mantenciones
            </Text>
          </View>

          <View style={styles.welcomeFeatures}>
            <View style={styles.welcomeFeature}>
              <View style={styles.welcomeFeatureIcon}>
                <Ionicons name="checkmark" size={20} color="#16a34a" />
              </View>
              <Text style={styles.smallText}>Registro rápido en 3 pasos</Text>
            </View>
            <View style={styles.welcomeFeature}>
              <View style={styles.welcomeFeatureIcon}>
                <Ionicons name="checkmark" size={20} color="#16a34a" />
              </View>
              <Text style={styles.smallText}>Seguimiento de mantenciones</Text>
            </View>
            <View style={styles.welcomeFeature}>
              <View style={styles.welcomeFeatureIcon}>
                <Ionicons name="checkmark" size={20} color="#16a34a" />
              </View>
              <Text style={styles.smallText}>Historial completo</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('🚗 Botón "Registrar mi primer vehículo" presionado');
              console.log('🔄 Cambiando currentScreen de "welcome" a "register"');
              setCurrentScreen('register');
              console.log('✅ Navegación a pantalla de registro iniciada');
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
              Registrar mi primer vehículo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomePlanInfo}>
          <Text style={[styles.smallText, { marginBottom: 8 }]}>Plan actual:</Text>
          <View style={styles.welcomePlanBadge}>
            <Ionicons name="person-outline" size={16} color="#6b7280" />
            <Text style={[styles.smallText, { marginLeft: 8 }]}>
              Gratuito (hasta 2 vehículos)
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * Componente principal FirstRegistration
 */
const FirstRegistration: React.FC<FirstRegistrationProps> = ({ onGoBack }) => {
  const { currentScreen, setCurrentScreen } = useFirstRegistration();

  console.log('🎯 Pantalla actual:', currentScreen);

  const renderScreen = () => {
    console.log('🖥️ Renderizando pantalla:', currentScreen);
    
    switch (currentScreen) {
      case 'welcome':
        console.log('🏠 Renderizando WelcomeScreen');
        return <WelcomeScreen onGoBack={onGoBack} />;
      case 'register':
        console.log('📝 Renderizando pantalla de registro');
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Pantalla de Registro</Text>
            <Text style={styles.bodyText}>¡Funciona! El botón navegó correctamente.</Text>
            <TouchableOpacity 
              onPress={() => setCurrentScreen('welcome')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Volver a Welcome</Text>
            </TouchableOpacity>
          </View>
        );
      case 'dashboard':
        console.log('📊 Renderizando Dashboard');
        return <Text style={styles.title}>Dashboard</Text>;
      case 'maintenance':
        console.log('🔧 Renderizando Mantenimiento');
        return <Text style={styles.title}>Mantenimiento</Text>;
      default:
        console.log('❓ Pantalla desconocida, mostrando Welcome por defecto');
        return <WelcomeScreen onGoBack={onGoBack} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <MileageModal />
    </View>
  );
};

export default FirstRegistration;