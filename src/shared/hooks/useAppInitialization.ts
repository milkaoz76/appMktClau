/**
 * Hook useAppInitialization - Maneja la lógica de inicialización de la aplicación
 * Determina si mostrar onboarding o ir directamente al home
 */
import { useState, useEffect } from 'react';
import { StorageService, OnboardingState } from '../services/StorageService';

export interface AppInitializationState {
  isLoading: boolean;
  shouldShowOnboarding: boolean;
  shouldShowWelcomeBanner: boolean;
  shouldShowVehiclePrompt: boolean;
  shouldShowVehicleRegistration: boolean;
  shouldRedirectToVehicles: boolean;
  onboardingState: OnboardingState;
  error: string | null;
}

export interface AppInitializationActions {
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  dismissWelcomeBanner: () => Promise<void>;
  dismissVehiclePrompt: () => Promise<void>;
  showVehicleRegistration: () => void;
  completeVehicleRegistration: () => void;
  goBackToVehiclePrompt: () => void;
  finishRedirect: () => void;
  resetApp: () => Promise<void>;
  forceShowOnboarding: () => Promise<void>;
}

export const useAppInitialization = () => {
  const [state, setState] = useState<AppInitializationState>({
    isLoading: true,
    shouldShowOnboarding: false,
    shouldShowWelcomeBanner: false,
    shouldShowVehiclePrompt: false,
    shouldShowVehicleRegistration: false,
    shouldRedirectToVehicles: false,
    onboardingState: {
      completed: false,
      skipped: false,
      firstLaunch: true
    },
    error: null
  });

  /**
   * Inicializa el estado de la aplicación
   */
  const initializeApp = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Obtener estado del onboarding
      const onboardingState = await StorageService.getOnboardingState();
      const welcomeBannerDismissed = await StorageService.isWelcomeBannerDismissed();

      console.log('🚀 App initialization:', {
        onboardingState,
        welcomeBannerDismissed
      });

      // Determinar qué mostrar basado en el estado
      let shouldShowOnboarding = false;
      let shouldShowWelcomeBanner = false;
      let shouldShowVehiclePrompt = false;

      if (onboardingState.firstLaunch) {
        // Primera vez: mostrar onboarding
        shouldShowOnboarding = true;
        console.log('📱 Primera vez - mostrando onboarding');
      } else if (onboardingState.completed) {
        // Onboarding completado: verificar si debe mostrar prompt de vehículo
        const vehiclePromptDismissed = await StorageService.isVehiclePromptDismissed();
        shouldShowVehiclePrompt = !vehiclePromptDismissed;
        console.log('✅ Onboarding completado - mostrar prompt vehículo:', shouldShowVehiclePrompt);
      } else if (onboardingState.skipped) {
        // Onboarding saltado: mostrar home con banner (si no fue cerrado)
        shouldShowOnboarding = false;
        shouldShowWelcomeBanner = !welcomeBannerDismissed;
        console.log('⏭️ Onboarding saltado - home con banner:', shouldShowWelcomeBanner);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        shouldShowOnboarding,
        shouldShowWelcomeBanner,
        shouldShowVehiclePrompt,
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false,
        onboardingState,
        error: null
      }));

    } catch (error) {
      console.error('Error initializing app:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al inicializar la aplicación',
        // En caso de error, mostrar onboarding por seguridad
        shouldShowOnboarding: true,
        shouldShowWelcomeBanner: false,
        shouldShowVehiclePrompt: false,
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false
      }));
    }
  };

  /**
   * Completa el onboarding y navega al home
   */
  const completeOnboarding = async () => {
    try {
      await StorageService.markOnboardingCompleted();
      console.log('✅ Onboarding completado');
      
      setState(prev => ({
        ...prev,
        shouldShowOnboarding: false,
        shouldShowWelcomeBanner: false,
        shouldShowVehiclePrompt: true, // Mostrar prompt de vehículo después de completar
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false,
        onboardingState: {
          ...prev.onboardingState,
          completed: true,
          firstLaunch: false
        }
      }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  /**
   * Salta el onboarding y navega al home con banner
   */
  const skipOnboarding = async () => {
    try {
      await StorageService.markAppLaunched();
      console.log('⏭️ Onboarding saltado');
      
      setState(prev => ({
        ...prev,
        shouldShowOnboarding: false,
        shouldShowWelcomeBanner: true,
        shouldShowVehiclePrompt: false,
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false,
        onboardingState: {
          ...prev.onboardingState,
          skipped: true,
          firstLaunch: false
        }
      }));
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  /**
   * Cierra el banner de bienvenida
   */
  const dismissWelcomeBanner = async () => {
    try {
      await StorageService.dismissWelcomeBanner();
      console.log('❌ Banner de bienvenida cerrado');
      
      setState(prev => ({
        ...prev,
        shouldShowWelcomeBanner: false
      }));
    } catch (error) {
      console.error('Error dismissing welcome banner:', error);
    }
  };

  /**
   * Cierra el prompt de registro de vehículo
   */
  const dismissVehiclePrompt = async () => {
    try {
      await StorageService.dismissVehiclePrompt();
      console.log('❌ Prompt de vehículo cerrado');
      
      setState(prev => ({
        ...prev,
        shouldShowVehiclePrompt: false
      }));
    } catch (error) {
      console.error('Error dismissing vehicle prompt:', error);
    }
  };

  /**
   * Muestra la pantalla de registro de vehículo
   */
  const showVehicleRegistration = () => {
    console.log('🚗 Mostrando registro de vehículo');
    setState(prev => ({
      ...prev,
      shouldShowVehiclePrompt: false,
      shouldShowVehicleRegistration: true
    }));
  };

  /**
   * Completa el registro de vehículo y va directamente al home
   */
  const completeVehicleRegistration = () => {
    console.log('✅ Registro de vehículo completado - volviendo al home normal');
    setState(prev => {
      console.log('🔄 Estado anterior:', {
        shouldShowVehicleRegistration: prev.shouldShowVehicleRegistration,
        shouldRedirectToVehicles: prev.shouldRedirectToVehicles
      });
      const newState = {
        ...prev,
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false // ✅ No usar redirección, ir directo al home
      };
      console.log('🔄 Nuevo estado:', {
        shouldShowVehicleRegistration: newState.shouldShowVehicleRegistration,
        shouldRedirectToVehicles: newState.shouldRedirectToVehicles
      });
      return newState;
    });
  };

  /**
   * Vuelve al prompt de vehículo desde el formulario
   */
  const goBackToVehiclePrompt = () => {
    console.log('⬅️ Volviendo al prompt de vehículo');
    setState(prev => ({
      ...prev,
      shouldShowVehicleRegistration: false,
      shouldShowVehiclePrompt: true
    }));
  };

  /**
   * Finaliza la redirección y muestra la app normal
   */
  const finishRedirect = () => {
    console.log('✅ Redirección completada - desactivando shouldRedirectToVehicles');
    setState(prev => {
      console.log('🔄 Estado anterior shouldRedirectToVehicles:', prev.shouldRedirectToVehicles);
      const newState = {
        ...prev,
        shouldRedirectToVehicles: false
      };
      console.log('🔄 Nuevo estado shouldRedirectToVehicles:', newState.shouldRedirectToVehicles);
      return newState;
    });
  };

  /**
   * Resetea la aplicación al estado inicial (para testing)
   */
  const resetApp = async () => {
    try {
      await StorageService.resetOnboardingData();
      console.log('🔄 App reseteada');
      
      // Reinicializar
      await initializeApp();
    } catch (error) {
      console.error('Error resetting app:', error);
    }
  };

  /**
   * Fuerza mostrar el onboarding
   */
  const forceShowOnboarding = async () => {
    try {
      await StorageService.resetOnboardingData();
      console.log('🔄 Forzando onboarding');
      
      setState(prev => ({
        ...prev,
        shouldShowOnboarding: true,
        shouldShowWelcomeBanner: false,
        shouldShowVehiclePrompt: false,
        shouldShowVehicleRegistration: false,
        shouldRedirectToVehicles: false,
        onboardingState: {
          completed: false,
          skipped: false,
          firstLaunch: true
        }
      }));
    } catch (error) {
      console.error('Error forcing onboarding:', error);
    }
  };

  // Inicializar al montar el componente
  useEffect(() => {
    initializeApp();
  }, []);

  const actions: AppInitializationActions = {
    completeOnboarding,
    skipOnboarding,
    dismissWelcomeBanner,
    dismissVehiclePrompt,
    showVehicleRegistration,
    completeVehicleRegistration,
    goBackToVehiclePrompt,
    finishRedirect,
    resetApp,
    forceShowOnboarding
  };

  return {
    ...state,
    ...actions,
    refresh: initializeApp
  };
};