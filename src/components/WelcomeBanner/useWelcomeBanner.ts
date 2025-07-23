/**
 * Hook personalizado para la lógica de negocio del WelcomeBanner
 * Maneja todo el estado, navegación y eventos del componente de bienvenida
 */
import { useState, useEffect } from 'react';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export interface SlideData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export interface UseWelcomeBannerReturn {
  // Estado del onboarding
  currentSlide: number;
  showOnboarding: boolean;
  isCompleted: boolean;
  showWelcomeBanner: boolean;
  showFirstRegistration: boolean;
  slides: SlideData[];
  
  // Acciones de navegación
  nextSlide: () => void;
  prevSlide: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  
  // Acciones del banner
  dismissWelcomeBanner: () => void;
  
  // Acciones de la pantalla de registro
  handleVehicleRegistration: () => void;
  handleLaterRegistration: () => void;
  
  // Control de navegación
  setShowFirstRegistration: (show: boolean) => void;
  
  // Funciones de testing y debugging
  clearAllData: () => Promise<void>;
  forceShowOnboarding: () => Promise<void>;
}

export const useWelcomeBanner = (): UseWelcomeBannerReturn => {
  // Estado principal del componente
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const [showFirstRegistration, setShowFirstRegistration] = useState<boolean>(false);

  /**
   * Configuración de las diapositivas del onboarding
   * Cada slide contiene icono, título, subtítulo y descripción
   * ⚠️ CORREGIDO: Usando 'size' en lugar de 'className' para React Native
   */
  const slides: SlideData[] = [
    {
      icon: React.createElement(Ionicons, { name: 'car-outline', size: 80, color: '#3b82f6' }),
      title: "Bienvenido a AutoConnect",
      subtitle: "Tu marketplace automotriz inteligente",
      description: "Gestiona, mantén y conecta con tu vehículo de manera simple y eficiente. Todo en un solo lugar."
    },
    {
      icon: React.createElement(Ionicons, { name: 'shield-checkmark-outline', size: 80, color: '#10b981' }),
      title: "Registra tu vehículo",
      subtitle: "Protege tu inversión",
      description: "Mantén un registro completo de tu auto: documentos, seguros, y toda la información importante al alcance de tu mano."
    },
    {
      icon: React.createElement(Ionicons, { name: 'calendar-outline', size: 80, color: '#8b5cf6' }),
      title: "Plan de mantención inteligente",
      subtitle: "Nunca olvides un servicio",
      description: "Recibe recordatorios personalizados para revisiones técnicas, cambios de aceite y mantenciones programadas."
    },
    {
      icon: React.createElement(Ionicons, { name: 'document-text-outline', size: 80, color: '#f59e0b' }),
      title: "Historial completo",
      subtitle: "Aumenta el valor de tu auto",
      description: "Un historial detallado de mantenciones incrementa el valor de reventa y genera confianza en futuros compradores."
    }
  ];

  /**
   * Efecto para verificar si es la primera visita del usuario
   * MODIFICADO: Siempre muestra onboarding en primera carga para testing
   * Consulta AsyncStorage para verificar el estado del onboarding
   */
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si el componente se desmonta
    
    const resolveOnboardingState = async () => {
      try {
        console.log('🎯 Verificando estado de onboarding inicial...');
        
        const hasCompletedOnboarding = await AsyncStorage.getItem('onboarding_completed');
        const hasSkippedOnboarding = await AsyncStorage.getItem('onboarding_skipped');
        const forceOnboarding = await AsyncStorage.getItem('force_onboarding');
        
        console.log('📊 Estado AsyncStorage:', { hasCompletedOnboarding, hasSkippedOnboarding, forceOnboarding });
        
        // CORREGIR CONFLICTO: Si ambos estados existen, priorizar 'completed'
        if (hasCompletedOnboarding === 'true' && hasSkippedOnboarding === 'true') {
          console.log('🔧 Conflicto detectado: ambos estados son true, resolviendo...');
          await AsyncStorage.removeItem('onboarding_skipped');
          console.log('✅ Conflicto resuelto: removido onboarding_skipped');
        }
        
        // Solo actualizar estado si el componente sigue montado
        if (!isMounted) return;
        
        // NUEVA LÓGICA: Forzar onboarding si está configurado o es primera visita
        if (forceOnboarding === 'true' || (!hasCompletedOnboarding && !hasSkippedOnboarding)) {
          console.log('📱 Mostrando onboarding (primera visita o forzado)');
          setShowOnboarding(true);
          setShowFirstRegistration(false);
          setIsCompleted(false);
          setShowWelcomeBanner(false);
          // Limpiar flag de forzar onboarding
          if (forceOnboarding === 'true') {
            await AsyncStorage.removeItem('force_onboarding');
          }
        } else if (hasCompletedOnboarding === 'true') {
          setShowOnboarding(false);
          setIsCompleted(true);
          setShowFirstRegistration(true);
          setShowWelcomeBanner(false);
          console.log('✅ Usuario ya completó el onboarding - navegando a FirstRegistration');
        } else if (hasSkippedOnboarding === 'true') {
          setShowOnboarding(false);
          setShowFirstRegistration(true);
          setShowWelcomeBanner(true);
          console.log('⏭️ Usuario había omitido el onboarding - navegando a FirstRegistration con banner');
        }
      } catch (error) {
        console.error('❌ Error al verificar estado del onboarding:', error);
        // En caso de error, usar estado por defecto (mostrar onboarding)
        if (isMounted) {
          setShowOnboarding(true);
          setShowFirstRegistration(false);
          setIsCompleted(false);
          setShowWelcomeBanner(false);
        }
      }
    };

    resolveOnboardingState();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Navega a la siguiente diapositiva o completa el onboarding
   */
  const nextSlide = (): void => {
    console.log(`➡️ Navegando desde slide ${currentSlide} de ${slides.length - 1}`);
    
    if (currentSlide < slides.length - 1) {
      const nextSlideIndex = currentSlide + 1;
      setCurrentSlide(nextSlideIndex);
      console.log(`📄 Cambiando a slide ${nextSlideIndex}`);
    } else {
      console.log('🎉 Última diapositiva alcanzada - completando onboarding');
      completeOnboarding();
    }
  };

  /**
   * Navega a la diapositiva anterior
   */
  const prevSlide = (): void => {
    if (currentSlide > 0) {
      console.log(`⬅️ Retrocediendo a slide ${currentSlide - 1}`);
      setCurrentSlide(currentSlide - 1);
    }
  };

  /**
   * Omite el onboarding y navega directamente a FirstRegistration
   */
  const skipOnboarding = async (): Promise<void> => {
    try {
      console.log('⏭️ Usuario omitió el onboarding - navegando a FirstRegistration');
      await AsyncStorage.setItem('onboarding_skipped', 'true');
      setShowOnboarding(false);
      setShowWelcomeBanner(false);
      setShowFirstRegistration(true);
    } catch (error) {
      console.error('❌ Error al guardar estado de onboarding omitido:', error);
    }
  };

  /**
   * Completa el onboarding y procede al registro de vehículo
   */
  const completeOnboarding = async (): Promise<void> => {
    try {
      console.log('🎯 Iniciando proceso de completar onboarding...');
      await AsyncStorage.setItem('onboarding_completed', 'true');
      await AsyncStorage.removeItem('onboarding_skipped'); // Limpiar estado de omitido
      
      console.log('💾 Estados guardados en AsyncStorage');
      console.log('🔄 Actualizando estados del componente...');
      
      setIsCompleted(true);
      setShowOnboarding(false);
      setShowFirstRegistration(true);
      
      console.log('✅ Onboarding completado - navegando a FirstRegistration');
    } catch (error) {
      console.error('❌ Error al guardar estado de onboarding completado:', error);
    }
  };

  /**
   * Reinicia el onboarding desde el principio
   */
  const restartOnboarding = (): void => {
    console.log('🔄 Reiniciando onboarding desde el inicio');
    setCurrentSlide(0);
    setShowOnboarding(true);
    setShowWelcomeBanner(false);
    setShowFirstRegistration(false);
  };

  /**
   * Cierra el banner de bienvenida
   */
  const dismissWelcomeBanner = async (): Promise<void> => {
    try {
      console.log('❌ Banner de bienvenida cerrado por el usuario');
      await AsyncStorage.setItem('welcome_banner_dismissed', 'true');
      setShowWelcomeBanner(false);
    } catch (error) {
      console.error('❌ Error al guardar estado del banner:', error);
    }
  };

  /**
   * Maneja el registro de vehículo desde la pantalla final
   */
  const handleVehicleRegistration = (): void => {
    console.log('🚗 Usuario inició registro de vehículo');
    // Navegar a FirstRegistration
    setShowFirstRegistration(true);
    setShowOnboarding(false);
    setIsCompleted(false);
  };

  /**
   * Maneja cuando el usuario prefiere registrar más tarde
   */
  const handleLaterRegistration = (): void => {
    console.log('⏰ Usuario pospuso el registro de vehículo');
    setIsCompleted(false);
  };

  /**
   * Limpia todo el AsyncStorage y resetea la aplicación al estado inicial
   * NUEVA FUNCIÓN: Para testing y debugging
   */
  const clearAllData = async (): Promise<void> => {
    try {
      console.log('🧹 Limpiando todos los datos de AsyncStorage...');
      
      const keysToRemove = [
        'onboarding_completed',
        'onboarding_skipped', 
        'welcome_banner_dismissed',
        'force_onboarding',
        'vehicles',
        'maintenanceHistory',
        'userPlan'
      ];
      
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
      
      // Resetear todos los estados al inicial
      setCurrentSlide(0);
      setShowOnboarding(true);
      setIsCompleted(false);
      setShowWelcomeBanner(false);
      setShowFirstRegistration(false);
      
      console.log('✅ Todos los datos limpiados - aplicación reseteada');
    } catch (error) {
      console.error('❌ Error al limpiar datos:', error);
    }
  };

  /**
   * Fuerza mostrar el onboarding en la próxima carga
   * NUEVA FUNCIÓN: Para testing
   */
  const forceShowOnboarding = async (): Promise<void> => {
    try {
      console.log('🔄 Configurando para mostrar onboarding en próxima carga...');
      await AsyncStorage.setItem('force_onboarding', 'true');
      
      // Resetear estado actual
      setCurrentSlide(0);
      setShowOnboarding(true);
      setIsCompleted(false);
      setShowWelcomeBanner(false);
      setShowFirstRegistration(false);
      
      console.log('✅ Onboarding será mostrado en próxima carga');
    } catch (error) {
      console.error('❌ Error al configurar onboarding forzado:', error);
    }
  };

  return {
    // Estado
    currentSlide,
    showOnboarding,
    isCompleted,
    showWelcomeBanner,
    showFirstRegistration,
    slides,
    
    // Acciones de navegación
    nextSlide,
    prevSlide,
    skipOnboarding,
    completeOnboarding,
    restartOnboarding,
    
    // Acciones del banner
    dismissWelcomeBanner,
    
    // Acciones de registro
    handleVehicleRegistration,
    handleLaterRegistration,
    
    // Control de navegación
    setShowFirstRegistration,
    
    // Funciones de testing y debugging
    clearAllData,
    forceShowOnboarding,
  };
};