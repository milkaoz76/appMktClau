/**
 * Hook personalizado para la lógica de negocio del WelcomeBanner
 * Maneja todo el estado, navegación y eventos del componente de bienvenida
 * CORREGIDO: Flujo de navegación arreglado
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
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);  // CORREGIDO: Iniciar siempre con onboarding
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const [showFirstRegistration, setShowFirstRegistration] = useState<boolean>(false);

  /**
   * Configuración de las diapositivas del onboarding
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
   * CORREGIDO: Lógica de navegación inicial arreglada
   */
  useEffect(() => {
    let isMounted = true;
    
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
        
        // NUEVA LÓGICA CORREGIDA
        if (forceOnboarding === 'true' || (!hasCompletedOnboarding && !hasSkippedOnboarding)) {
          // Primera visita o forzar onboarding - MOSTRAR ONBOARDING
          console.log('📱 Mostrando onboarding (primera visita o forzado)');
          setShowOnboarding(true);
          setShowFirstRegistration(false);
          setIsCompleted(false);
          setShowWelcomeBanner(false);
          
          if (forceOnboarding === 'true') {
            await AsyncStorage.removeItem('force_onboarding');
          }
        } else if (hasCompletedOnboarding === 'true') {
          // Usuario completó onboarding - MOSTRAR APP PRINCIPAL
          console.log('✅ Usuario ya completó el onboarding - mostrando app principal');
          setShowOnboarding(false);
          setIsCompleted(true);
          setShowFirstRegistration(false);
          setShowWelcomeBanner(false);
        } else if (hasSkippedOnboarding === 'true') {
          // Usuario omitió onboarding - MOSTRAR APP PRINCIPAL CON BANNER
          console.log('⏭️ Usuario había omitido el onboarding - mostrando app principal con banner');
          setShowOnboarding(false);
          setIsCompleted(false);
          setShowFirstRegistration(false);
          setShowWelcomeBanner(true);
        }
      } catch (error) {
        // Error manejado silenciosamente para evitar interrumpir la experiencia del usuario
        // En caso de error, mostrar onboarding por defecto
        if (isMounted) {
          setShowOnboarding(true);
          setShowFirstRegistration(false);
          setIsCompleted(false);
          setShowWelcomeBanner(false);
        }
      }
    };

    resolveOnboardingState();
    
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
   * Omite el onboarding y navega a la app principal
   * CORREGIDO: Navega a app principal, no a FirstRegistration
   */
  const skipOnboarding = async (): Promise<void> => {
    try {
      console.log('⏭️ Usuario omitió el onboarding - navegando a app principal');
      await AsyncStorage.setItem('onboarding_skipped', 'true');
      setShowOnboarding(false);
      setShowWelcomeBanner(true);  // CORREGIDO: Mostrar banner en app principal
      setShowFirstRegistration(false);  // CORREGIDO: No navegar directo a FirstRegistration
      setIsCompleted(false);
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  /**
   * Completa el onboarding y procede a la app principal
   * CORREGIDO: Navega a app principal, no directo a FirstRegistration
   */
  const completeOnboarding = async (): Promise<void> => {
    try {
      console.log('🎯 Iniciando proceso de completar onboarding...');
      await AsyncStorage.setItem('onboarding_completed', 'true');
      await AsyncStorage.removeItem('onboarding_skipped');
      
      console.log('💾 Estados guardados en AsyncStorage');
      console.log('🔄 Actualizando estados del componente...');
      
      setIsCompleted(true);
      setShowOnboarding(false);
      setShowFirstRegistration(false);  // CORREGIDO: No navegar directo a FirstRegistration
      setShowWelcomeBanner(false);
      
      console.log('✅ Onboarding completado - navegando a app principal');
    } catch (error) {
      // Error manejado silenciosamente
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
    setIsCompleted(false);
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
      // Error manejado silenciosamente
    }
  };

  /**
   * Maneja el registro de vehículo - NAVEGA A FirstRegistration
   * CORREGIDO: Esta función sí debe navegar a FirstRegistration
   */
  const handleVehicleRegistration = (): void => {
    console.log('🚗 Usuario inició registro de vehículo - navegando a FirstRegistration');
    setShowFirstRegistration(true);
    setShowOnboarding(false);
    setIsCompleted(false);
    setShowWelcomeBanner(false);
  };

  /**
   * Maneja cuando el usuario prefiere registrar más tarde
   */
  const handleLaterRegistration = (): void => {
    console.log('⏰ Usuario pospuso el registro de vehículo');
    setIsCompleted(false);
    setShowFirstRegistration(false);
    setShowWelcomeBanner(true);
  };

  /**
   * Limpia todo el AsyncStorage y resetea la aplicación al estado inicial
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
      // Error manejado silenciosamente
    }
  };

  /**
   * Fuerza mostrar el onboarding en la próxima carga
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
      // Error manejado silenciosamente
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