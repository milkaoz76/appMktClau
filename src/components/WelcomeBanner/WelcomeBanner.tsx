/**
 * Componente WelcomeBanner - Componente de presentación puro
 * Maneja la interfaz de usuario del onboarding y banner de bienvenida
 * Compatible con Expo Web, Android e iOS
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWelcomeBanner } from './useWelcomeBanner';
import { welcomeBannerStyles as styles } from './welcomeBanner.styles';
import FirstRegistration from '../FirstRegistration';

/**
 * Componente del banner de bienvenida persistente
 * Se muestra cuando el usuario omite el onboarding
 */
interface WelcomeBannerComponentProps {
  restartOnboarding: () => void;
  dismissWelcomeBanner: () => void;
}

const WelcomeBannerComponent: React.FC<WelcomeBannerComponentProps> = ({ 
  restartOnboarding, 
  dismissWelcomeBanner 
}) => {

  return (
    <LinearGradient
      colors={['#eff6ff', '#e0e7ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.bannerContainer}
    >
      <View style={styles.bannerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="car-outline" size={20} color="#2563eb" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>
              ¡Bienvenido a AutoConnect!
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              ¿Te gustaría conocer cómo funciona la plataforma?
            </Text>
          </View>
        </View>
        <View style={styles.bannerActions}>
          <TouchableOpacity onPress={restartOnboarding}>
            <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
              Ver tutorial
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={dismissWelcomeBanner}
            style={{ marginLeft: 8 }}
          >
            <Ionicons name="close" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * Pantalla final de registro de vehículo
 * Se muestra después de completar el onboarding
 */
interface RegistrationScreenProps {
  handleVehicleRegistration: () => void;
  handleLaterRegistration: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ 
  handleVehicleRegistration, 
  handleLaterRegistration 
}) => {

  return (
    <LinearGradient
      colors={['#dbeafe', '#ffffff', '#e0e7ff']}
      style={styles.registrationContainer}
    >
      <View style={styles.registrationCard}>
        {/* Header con gradiente */}
        <LinearGradient
          colors={['#2563eb', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.registrationHeader}
        >
          <View style={styles.registrationIconWrapper}>
            <Ionicons name="car-outline" size={40} color="#ffffff" />
          </View>
          <Text style={styles.registrationHeaderTitle}>¡Perfecto!</Text>
          <Text style={styles.registrationHeaderSubtitle}>
            Ahora registra tu primer vehículo
          </Text>
        </LinearGradient>
        
        {/* Cuerpo del contenido */}
        <View style={styles.registrationBody}>
          <View style={styles.registrationIntro}>
            <Text style={styles.registrationIntroTitle}>Comenzar es fácil</Text>
            <Text style={styles.registrationIntroDescription}>
              Solo necesitas algunos datos básicos de tu auto para empezar
            </Text>
          </View>
          
          {/* Lista de requisitos */}
          <View style={styles.registrationChecklist}>
            <View style={styles.checklistItem}>
              <View style={styles.checklistDot}>
                <View style={{ width: 8, height: 8, backgroundColor: '#10b981', borderRadius: 4 }} />
              </View>
              <Text style={styles.checklistText}>Marca, modelo y año</Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={styles.checklistDot}>
                <View style={{ width: 8, height: 8, backgroundColor: '#10b981', borderRadius: 4 }} />
              </View>
              <Text style={styles.checklistText}>Patente y kilometraje</Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={styles.checklistDot}>
                <View style={{ width: 8, height: 8, backgroundColor: '#10b981', borderRadius: 4 }} />
              </View>
              <Text style={styles.checklistText}>Fecha de la última revisión técnica</Text>
            </View>
          </View>
          
          {/* Botones de acción */}
          <View style={styles.registrationButtons}>
            <TouchableOpacity 
              onPress={handleVehicleRegistration}
            >
              <LinearGradient
                colors={['#2563eb', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.primaryButtonText}>Registrar mi primer vehículo</Text>
                <View style={{ marginLeft: 8 }}>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </View>
              </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleLaterRegistration}
            >
              <Text style={styles.secondaryButtonText}>Lo haré más tarde</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * Pantalla principal del onboarding
 * Muestra las diapositivas de introducción paso a paso
 */
interface OnboardingScreenProps {
  currentSlide: number;
  slides: any[];
  nextSlide: () => void;
  prevSlide: () => void;
  skipOnboarding: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  currentSlide, 
  slides, 
  nextSlide, 
  prevSlide, 
  skipOnboarding 
}) => {

  return (
    <LinearGradient
      colors={['#dbeafe', '#ffffff', '#e0e7ff']}
      style={styles.onboardingContainer}
    >
      {/* Header con indicadores de progreso */}
      <View style={styles.header}>
        <View style={styles.progressIndicators}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentSlide && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={skipOnboarding}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={styles.mainContent}>
        <View style={styles.contentContainer}>
          {/* Icono de la diapositiva actual */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              {slides[currentSlide].icon}
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>
            {slides[currentSlide].title}
          </Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            {slides[currentSlide].subtitle}
          </Text>

          {/* Descripción */}
          <Text style={styles.description}>
            {slides[currentSlide].description}
          </Text>

          {/* Navegación */}
          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={prevSlide}
              disabled={currentSlide === 0}
              style={[
                styles.navButton,
                currentSlide === 0 && styles.navButtonDisabled
              ]}
            >
              <Ionicons name="chevron-back" size={24} color={currentSlide === 0 ? "#9ca3af" : "#6b7280"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextSlide}
            >
              <LinearGradient
                colors={['#2563eb', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButton}
              >
              <View style={styles.nextButtonContent}>
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>
                  {currentSlide === slides.length - 1 ? 'Comenzar ahora' : 'Siguiente'}
                </Text>
                <View style={{ marginLeft: 8 }}>
                  <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                </View>
              </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {currentSlide + 1} de {slides.length}
        </Text>
      </View>
    </LinearGradient>
  );
};

/**
 * Pantalla principal de la aplicación
 * Se muestra cuando el onboarding está completo o fue omitido
 */
interface MainAppScreenProps {
  showWelcomeBanner: boolean;
  restartOnboarding: () => void;
  handleVehicleRegistration: () => void;
  dismissWelcomeBanner: () => void;
  clearAllData: () => Promise<void>;
  forceShowOnboarding: () => Promise<void>;
}

const MainAppScreen: React.FC<MainAppScreenProps> = ({ 
  showWelcomeBanner, 
  restartOnboarding, 
  handleVehicleRegistration,
  dismissWelcomeBanner,
  clearAllData,
  forceShowOnboarding
}) => {

  return (
    <ScrollView style={styles.mainAppContainer}>
      {/* Banner de bienvenida condicional */}
      {showWelcomeBanner && (
        <WelcomeBannerComponent 
          restartOnboarding={restartOnboarding}
          dismissWelcomeBanner={dismissWelcomeBanner}
        />
      )}
      
      {/* Contenido principal de la app */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>AutoConnect</Text>
        
        <View style={styles.appCard}>
          <View style={styles.appCardIcon}>
            <Ionicons name="car-outline" size={64} color="#9ca3af" />
          </View>
          <Text style={styles.appCardTitle}>¡Bienvenido!</Text>
          <Text style={styles.appCardDescription}>
            Tu marketplace automotriz está listo. Comienza registrando tu primer vehículo.
          </Text>
          
          <View style={styles.appCardButtons}>
            <TouchableOpacity
              onPress={restartOnboarding}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ver tutorial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVehicleRegistration}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonSecondaryText}>Registrar vehículo</Text>
            </TouchableOpacity>
          </View>
          
          {/* Botones de debugging - TEMPORAL */}
          <View style={{ marginTop: 20, padding: 16, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, textAlign: 'center' }}>
              🧪 Herramientas de Testing
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={clearAllData}
                style={{ 
                  backgroundColor: '#ef4444', 
                  paddingHorizontal: 12, 
                  paddingVertical: 8, 
                  borderRadius: 6,
                  flex: 1,
                  marginRight: 8
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', fontWeight: '500' }}>
                  🧹 Limpiar Todo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={forceShowOnboarding}
                style={{ 
                  backgroundColor: '#3b82f6', 
                  paddingHorizontal: 12, 
                  paddingVertical: 8, 
                  borderRadius: 6,
                  flex: 1,
                  marginLeft: 8
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center', fontWeight: '500' }}>
                  🔄 Forzar Onboarding
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Componente principal AutoMarketplaceOnboarding
 * Maneja el renderizado condicional según el estado del onboarding
 * ESTE ES EL EXPORT DEFAULT PRINCIPAL
 */
const AutoMarketplaceOnboarding: React.FC = () => {
  const { 
    isCompleted, 
    showOnboarding, 
    showFirstRegistration, 
    setShowFirstRegistration,
    currentSlide,
    slides,
    nextSlide,
    prevSlide,
    skipOnboarding,
    showWelcomeBanner,
    restartOnboarding,
    handleVehicleRegistration,
    handleLaterRegistration,
    dismissWelcomeBanner,
    clearAllData,
    forceShowOnboarding
  } = useWelcomeBanner();

  console.log('🎯 Estado del onboarding:', { isCompleted, showOnboarding, showFirstRegistration });
  console.log('🔍 Renderizando componente principal...');

  // Mostrar FirstRegistration si está activo
  if (showFirstRegistration) {
    console.log('🚀 Renderizando FirstRegistration con formulario directo');
    return (
      <FirstRegistration 
        onGoBack={() => setShowFirstRegistration(false)} 
        startWithForm={true} 
      />
    );
  }

  // Pantalla de registro si el onboarding fue completado (legacy)
  if (isCompleted && !showFirstRegistration) {
    console.log('📋 Renderizando RegistrationScreen (legacy)');
    return (
      <RegistrationScreen 
        handleVehicleRegistration={handleVehicleRegistration}
        handleLaterRegistration={handleLaterRegistration}
      />
    );
  }

  // Pantalla de onboarding si está activo
  if (showOnboarding) {
    console.log('📱 Renderizando OnboardingScreen');
    return (
      <OnboardingScreen 
        currentSlide={currentSlide}
        slides={slides}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        skipOnboarding={skipOnboarding}
      />
    );
  }

  // Pantalla principal de la app
  console.log('🏠 Renderizando MainAppScreen');
  return (
    <MainAppScreen 
      showWelcomeBanner={showWelcomeBanner}
      restartOnboarding={restartOnboarding}
      handleVehicleRegistration={handleVehicleRegistration}
      dismissWelcomeBanner={dismissWelcomeBanner}
      clearAllData={clearAllData}
      forceShowOnboarding={forceShowOnboarding}
    />
  );
};

// ⚠️ IMPORTANTE: Este es el export default que necesitas
export default AutoMarketplaceOnboarding;