/**
 * Componente FirstRegistration - Componente de presentación puro
 * Maneja la interfaz de usuario del registro de vehículos y gestión de mantenimiento
 * Compatible con Expo Web, Android e iOS
 * CORREGIDO: Implementación completa del formulario de registro
 * FIX: Eliminado key dinámico que causaba remontaje del componente
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FirstRegistrationProvider, useFirstRegistration } from './FirstRegistrationContext';
import { firstRegistrationStyles as styles } from './firstRegistration.styles';

interface FirstRegistrationProps {
  onGoBack?: () => void;
  startWithForm?: boolean; // Nueva prop para iniciar directamente en el formulario
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
  const { setCurrentScreen, vehicles } = useFirstRegistration();
  
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

          {/* Botón principal - Registrar vehículo */}
          <TouchableOpacity
            onPress={() => {
              console.log('� Botbón "Registrar vehículo" presionado');
              console.log('🔄 Cambiando currentScreen de "welcome" a "register"');
              setCurrentScreen('register');
              console.log('✅ Navegación a pantalla de registro iniciada');
            }}
            style={styles.primaryButton}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
              Registrar vehículo
            </Text>
          </TouchableOpacity>

          {/* Botón secundario - Ver listado de vehículos */}
          <TouchableOpacity
            onPress={() => {
              console.log('📋 Botón "Ver listado de vehículos" presionado');
              console.log('🔄 Cambiando currentScreen de "welcome" a "dashboard"');
              setCurrentScreen('dashboard');
              console.log('✅ Navegación a dashboard iniciada');
            }}
            style={[styles.secondaryButton, { marginTop: 12 }]}
          >
            <Ionicons name="list-outline" size={20} color="#374151" />
            <Text style={[styles.secondaryButtonText, { marginLeft: 8 }]}>
              Ver listado de vehículos
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
 * Pantalla de registro de vehículo - IMPLEMENTACIÓN COMPLETA
 */
const RegisterScreen: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  const { 
    currentStep, 
    setCurrentStep, 
    formData, 
    setFormData, 
    popularBrands,
    currentYear, 
    errors, 
    validateForm, 
    handleSubmit,
    setCurrentScreen,
    brandSearch,
    setBrandSearch,
    filteredBrands,
    handleBrandSearch
  } = useFirstRegistration();

  console.log('📝 RegisterScreen renderizada, step:', currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <View style={styles.registerStepHeader}>
              <View style={styles.registerStepIcon}>
                <Ionicons name="car-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.subtitle}>Selecciona la marca</Text>
              <Text style={styles.bodyText}>¿Cuál es la marca de tu vehículo?</Text>
            </View>

            {/* Estado de marca seleccionada */}
            {formData.brand ? (
              <View style={styles.brandSelectedContainer}>
                <View style={styles.brandSelectedContent}>
                  <View style={styles.brandSelectedInfo}>
                    <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                    <View style={styles.brandSelectedText}>
                      <Text style={styles.brandSelectedLabel}>Marca seleccionada:</Text>
                      <Text style={styles.brandSelectedValue}>{formData.brand}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setFormData({ ...formData, brand: '' });
                      setBrandSearch('');
                      handleBrandSearch('');
                    }}
                    style={styles.changeBrandButton}
                  >
                    <Text style={styles.changeBrandButtonText}>Cambiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {/* Campo de búsqueda */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      value={brandSearch}
                      onChangeText={handleBrandSearch}
                      placeholder="Buscar marca..."
                      placeholderTextColor="#9ca3af"
                    />
                    {brandSearch.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setBrandSearch('');
                          handleBrandSearch('');
                        }}
                        style={styles.searchClearButton}
                      >
                        <Ionicons name="close-circle" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Lista de marcas en 2 columnas o resultados de búsqueda */}
                {brandSearch.length > 0 ? (
                  // Resultados de búsqueda en lista vertical
                  <ScrollView style={styles.brandsList} showsVerticalScrollIndicator={false}>
                    {filteredBrands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        onPress={() => {
                          setFormData({ ...formData, brand });
                          setBrandSearch('');
                          handleBrandSearch('');
                        }}
                        style={styles.brandListItem}
                      >
                        <View style={styles.brandListItemContent}>
                          <Text style={styles.brandListItemText}>{brand}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}

                    {/* Mostrar mensaje si no hay resultados */}
                    {filteredBrands.length === 0 && (
                      <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No se encontraron marcas</Text>
                        <Text style={styles.noResultsSubtext}>Intenta con otro término de búsqueda</Text>
                      </View>
                    )}
                  </ScrollView>
                ) : (
                  // Marcas populares en cuadrícula de 2 columnas
                  <View style={styles.brandsGrid}>
                    {popularBrands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        onPress={() => setFormData({ ...formData, brand })}
                        style={styles.brandGridItem}
                      >
                        <Text style={styles.brandGridItemText}>{brand}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}


              </>
            )}
            
            {errors.brand && <Text style={styles.formError}>{errors.brand}</Text>}
          </View>
        );

      case 2:
        return (
          <View>
            <View style={styles.registerStepHeader}>
              <View style={styles.registerStepIcon}>
                <Ionicons name="document-text-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.subtitle}>Detalles del vehículo</Text>
              <Text style={styles.bodyText}>Ingresa el modelo y año</Text>
            </View>

            <View>
              <Text style={styles.formLabel}>Modelo</Text>
              <TextInput
                style={[styles.formInput, errors.model ? styles.formInputError : null]}
                value={formData.model}
                onChangeText={(text) => setFormData({ ...formData, model: text })}
                placeholder="Ej: Corolla, Focus, Civic..."
              />
              {errors.model && <Text style={styles.formError}>{errors.model}</Text>}

              <Text style={styles.formLabel}>Año</Text>
              <TextInput
                style={[styles.formInput, errors.year ? styles.formInputError : null]}
                value={formData.year}
                onChangeText={(text) => setFormData({ ...formData, year: text })}
                placeholder={`Ej: ${currentYear - 5}`}
                keyboardType="numeric"
              />
              {errors.year && <Text style={styles.formError}>{errors.year}</Text>}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <View style={styles.registerStepHeader}>
              <View style={styles.registerStepIcon}>
                <Ionicons name="speedometer-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.subtitle}>Kilometraje actual</Text>
              <Text style={styles.bodyText}>¿Cuántos kilómetros tiene actualmente?</Text>
            </View>

            <View>
              <Text style={styles.formLabel}>Kilometraje</Text>
              <TextInput
                style={[styles.formInput, errors.mileage ? styles.formInputError : null]}
                value={formData.mileage}
                onChangeText={(text) => setFormData({ ...formData, mileage: text })}
                placeholder="Ej: 150000"
                keyboardType="numeric"
              />
              {errors.mileage && <Text style={styles.formError}>{errors.mileage}</Text>}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <View style={styles.registerStepHeader}>
              <View style={styles.registerStepIcon}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#16a34a" />
              </View>
              <Text style={styles.subtitle}>Confirmar registro</Text>
              <Text style={styles.bodyText}>Revisa los datos antes de continuar</Text>
            </View>

            <View style={styles.formSummary}>
              <View style={styles.formSummaryItem}>
                <Text style={styles.smallText}>Marca:</Text>
                <Text style={[styles.smallText, { fontWeight: '600' }]}>{formData.brand}</Text>
              </View>
              <View style={styles.formSummaryItem}>
                <Text style={styles.smallText}>Modelo:</Text>
                <Text style={[styles.smallText, { fontWeight: '600' }]}>{formData.model}</Text>
              </View>
              <View style={styles.formSummaryItem}>
                <Text style={styles.smallText}>Año:</Text>
                <Text style={[styles.smallText, { fontWeight: '600' }]}>{formData.year}</Text>
              </View>
              <View style={styles.formSummaryItem}>
                <Text style={styles.smallText}>Kilometraje:</Text>
                <Text style={[styles.smallText, { fontWeight: '600' }]}>
                  {parseInt(formData.mileage || '0').toLocaleString()} km
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      console.log(`📍 Avanzando del paso ${currentStep} al ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('📝 Paso 4 completado - Enviando formulario...');
      console.log('📊 Datos del formulario:', formData);
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      console.log(`📍 Retrocediendo del paso ${currentStep} al ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.brand;
      case 2: return !!formData.model && !!formData.year;
      case 3: return !!formData.mileage;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <ScrollView style={styles.registerContainer}>
      {/* Header con navegación */}
      <View style={styles.registerHeader}>
        <TouchableOpacity onPress={() => {
          if (currentStep === 1) {
            onGoBack ? onGoBack() : setCurrentScreen('welcome');
          } else {
            handlePrevious();
          }
        }}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.dashboardTitle}>Registrar Vehículo</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Barra de progreso */}
      <View style={styles.registerProgress}>
        <View style={styles.registerProgressBar}>
          <View 
            style={[
              styles.registerProgressFill, 
              { width: `${(currentStep / 4) * 100}%` }
            ]} 
          />
        </View>
        <Text style={[styles.smallText, { textAlign: 'center', marginTop: 8 }]}>
          Paso {currentStep} de 4
        </Text>
      </View>

      {/* Contenido del paso */}
      <View style={styles.registerCard}>
        {renderStep()}

        {/* Botones de navegación */}
        <View style={styles.buttonRow}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Ionicons name="chevron-back" size={16} color="#374151" />
              <Text style={[styles.secondaryButtonText, { marginLeft: 4 }]}>Anterior</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleNext}
            disabled={!isStepValid()}
            style={[
              styles.primaryButton,
              { flex: 1, marginLeft: currentStep > 1 ? 12 : 0 },
              !isStepValid() && styles.primaryButtonDisabled
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === 4 ? 'Registrar' : 'Siguiente'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Pantalla de dashboard con vehículos registrados
 */
const DashboardScreen: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  const { 
    vehicles, 
    setCurrentScreen, 
    canAddVehicle, 
    deleteVehicle,
    setSelectedVehicle,
    setShowMileageModal
  } = useFirstRegistration();

  console.log('📊 DashboardScreen renderizado con vehículos:', vehicles);
  console.log('📈 Cantidad de vehículos en dashboard:', vehicles.length);

  return (
    <ScrollView style={styles.dashboardContainer}>
      {/* Header */}
      <View style={styles.dashboardHeader}>
        {onGoBack && (
          <TouchableOpacity onPress={onGoBack}>
            <Ionicons name="arrow-back" size={24} color="#2563eb" />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, marginLeft: onGoBack ? 16 : 0 }}>
          <Text style={styles.dashboardTitle}>Mis Vehículos</Text>
          <Text style={styles.dashboardSubtitle}>{vehicles.length} vehículo(s) registrado(s)</Text>
        </View>
      </View>

      {/* Lista de vehículos */}
      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={styles.vehicleCard}>
          <View style={styles.vehicleCardHeader}>
            <View style={[styles.vehicleImage, { backgroundColor: vehicle.image }]}>
              <Ionicons name="car-outline" size={24} color="#ffffff" />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>{vehicle.brand} {vehicle.model}</Text>
              <Text style={styles.vehicleSubtitle}>Año {vehicle.year}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteVehicle(vehicle.id)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.vehicleMileage}
            onPress={() => {
              setSelectedVehicle(vehicle);
              setShowMileageModal(true);
            }}
          >
            <Text style={styles.smallText}>
              📊 {vehicle.mileage.toLocaleString()} km
            </Text>
          </TouchableOpacity>

          <View style={styles.vehicleActions}>
            <TouchableOpacity 
              style={styles.vehicleActionButton}
              onPress={() => {
                setSelectedVehicle(vehicle);
                setCurrentScreen('maintenance');
              }}
            >
              <Text style={styles.primaryButtonText}>Ver Mantenciones</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botón para agregar vehículo */}
      {canAddVehicle() && (
        <TouchableOpacity
          onPress={() => setCurrentScreen('register')}
          style={[styles.primaryButton, { marginTop: 16 }]}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>Agregar otro vehículo</Text>
        </TouchableOpacity>
      )}

      {!canAddVehicle() && (
        <View style={[styles.planStatusCard, { marginTop: 16 }]}>
          <Text style={styles.planStatusText}>
            Has alcanzado el límite de vehículos en tu plan gratuito.
          </Text>
          <Text style={styles.planStatusWarning}>
            Actualiza a Premium para agregar vehículos ilimitados.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

/**
 * Componente principal FirstRegistration
 * CORREGIDO: Navegación completa implementada
 * FIX: Eliminado key dinámico que causaba remontaje del componente
 */
const FirstRegistration: React.FC<FirstRegistrationProps> = ({ onGoBack, startWithForm = false }) => {
  const { currentScreen, setCurrentScreen, currentStep, vehicles } = useFirstRegistration();

  // Si startWithForm es true, iniciar directamente en el formulario
  React.useEffect(() => {
    if (startWithForm && currentScreen === 'welcome') {
      console.log('🚀 Iniciando directamente en formulario de registro');
      setCurrentScreen('register');
    }
  }, [startWithForm, currentScreen, setCurrentScreen]);

  console.log('🎯 Pantalla actual en FirstRegistration:', currentScreen);

  const renderScreen = () => {
    console.log('🖥️ Renderizando pantalla:', currentScreen);
    console.log('📊 Estado actual - currentStep:', currentStep, 'vehicles:', vehicles.length);
    console.log('🔍 Tipo de currentScreen:', typeof currentScreen, 'Valor exacto:', JSON.stringify(currentScreen));
    
    switch (currentScreen) {
      case 'welcome':
        console.log('🏠 Renderizando WelcomeScreen');
        return <WelcomeScreen onGoBack={onGoBack} />;
      
      case 'register':
        console.log('📝 Renderizando RegisterScreen');
        return <RegisterScreen onGoBack={onGoBack} />;
      
      case 'dashboard':
        console.log('📊 Renderizando DashboardScreen');
        console.log('📋 Vehículos disponibles para dashboard:', vehicles.length);
        return <DashboardScreen onGoBack={onGoBack} />;
      
      case 'maintenance':
        console.log('🔧 Renderizando MantenanceScreen');
        return (
          <View style={[styles.container, styles.alignCenter, styles.justifyCenter]}>
            <Text style={styles.title}>Mantenimiento</Text>
            <Text style={styles.bodyText}>Pantalla de mantenimiento en desarrollo</Text>
            <TouchableOpacity 
              onPress={() => setCurrentScreen('dashboard')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Volver al Dashboard</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        console.log('❓ Pantalla desconocida, mostrando Welcome por defecto');
        console.log('❓ currentScreen recibido:', currentScreen, 'tipo:', typeof currentScreen);
        console.log('❓ Casos válidos: welcome, register, dashboard, maintenance');
        return <WelcomeScreen onGoBack={onGoBack} />;
    }
  };

  // FIX: Eliminado el key dinámico que causaba el remontaje del componente
  return (
    <View style={styles.container}>
      {renderScreen()}
      <MileageModal />
    </View>
  );
};

// Componente envuelto con Provider
const FirstRegistrationWithProvider: React.FC<FirstRegistrationProps> = (props) => {
  return (
    <FirstRegistrationProvider>
      <FirstRegistration {...props} />
    </FirstRegistrationProvider>
  );
};

export default FirstRegistrationWithProvider;