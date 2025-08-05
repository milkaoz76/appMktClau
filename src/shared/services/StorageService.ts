/**
 * StorageService - Servicio centralizado para manejo de persistencia local
 * Maneja el estado de onboarding y otras configuraciones de usuario
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingState {
  completed: boolean;
  skipped: boolean;
  firstLaunch: boolean;
}

export interface UserPreferences {
  welcomeBannerDismissed: boolean;
  lastAppVersion: string;
}

/**
 * Claves de almacenamiento
 */
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_LAUNCH: 'first_launch',
  WELCOME_BANNER_DISMISSED: 'welcome_banner_dismissed',
  VEHICLE_PROMPT_DISMISSED: 'vehicle_prompt_dismissed',
  APP_VERSION: 'app_version',
} as const;

/**
 * Servicio de almacenamiento local
 */
export class StorageService {
  /**
   * Verifica si es el primer lanzamiento de la aplicación
   */
  static async isFirstLaunch(): Promise<boolean> {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return firstLaunch === null; // Si no existe la clave, es primera vez
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true; // En caso de error, asumir primera vez
    }
  }

  /**
   * Marca que la aplicación ya fue lanzada
   */
  static async markAppLaunched(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    } catch (error) {
      console.error('Error marking app launched:', error);
    }
  }

  /**
   * Verifica si el onboarding fue completado
   */
  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Marca el onboarding como completado
   */
  static async markOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      await this.markAppLaunched(); // También marcar que la app fue lanzada
    } catch (error) {
      console.error('Error marking onboarding completed:', error);
    }
  }

  /**
   * Obtiene el estado completo del onboarding
   */
  static async getOnboardingState(): Promise<OnboardingState> {
    try {
      const [completed, firstLaunch] = await Promise.all([
        this.isOnboardingCompleted(),
        this.isFirstLaunch()
      ]);

      return {
        completed,
        skipped: !completed && !firstLaunch, // Si no es primera vez y no completó, entonces saltó
        firstLaunch
      };
    } catch (error) {
      console.error('Error getting onboarding state:', error);
      return {
        completed: false,
        skipped: false,
        firstLaunch: true
      };
    }
  }

  /**
   * Verifica si el banner de bienvenida fue cerrado
   */
  static async isWelcomeBannerDismissed(): Promise<boolean> {
    try {
      const dismissed = await AsyncStorage.getItem(STORAGE_KEYS.WELCOME_BANNER_DISMISSED);
      return dismissed === 'true';
    } catch (error) {
      console.error('Error checking welcome banner status:', error);
      return false;
    }
  }

  /**
   * Marca el banner de bienvenida como cerrado
   */
  static async dismissWelcomeBanner(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WELCOME_BANNER_DISMISSED, 'true');
    } catch (error) {
      console.error('Error dismissing welcome banner:', error);
    }
  }

  /**
   * Verifica si el prompt de registro de vehículo fue cerrado
   */
  static async isVehiclePromptDismissed(): Promise<boolean> {
    try {
      const dismissed = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLE_PROMPT_DISMISSED);
      return dismissed === 'true';
    } catch (error) {
      console.error('Error checking vehicle prompt status:', error);
      return false;
    }
  }

  /**
   * Marca el prompt de registro de vehículo como cerrado
   */
  static async dismissVehiclePrompt(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLE_PROMPT_DISMISSED, 'true');
    } catch (error) {
      console.error('Error dismissing vehicle prompt:', error);
    }
  }

  /**
   * Resetea todos los datos de onboarding (útil para testing)
   */
  static async resetOnboardingData(): Promise<void> {
    try {
      const keysToRemove = [
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        STORAGE_KEYS.FIRST_LAUNCH,
        STORAGE_KEYS.WELCOME_BANNER_DISMISSED,
        STORAGE_KEYS.VEHICLE_PROMPT_DISMISSED,
      ];
      
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
    } catch (error) {
      console.error('Error resetting onboarding data:', error);
    }
  }

  /**
   * Obtiene todas las preferencias del usuario
   */
  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const [welcomeBannerDismissed, appVersion] = await Promise.all([
        this.isWelcomeBannerDismissed(),
        AsyncStorage.getItem(STORAGE_KEYS.APP_VERSION)
      ]);

      return {
        welcomeBannerDismissed,
        lastAppVersion: appVersion || '1.0.0'
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        welcomeBannerDismissed: false,
        lastAppVersion: '1.0.0'
      };
    }
  }

  /**
   * Guarda la versión actual de la app
   */
  static async saveAppVersion(version: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_VERSION, version);
    } catch (error) {
      console.error('Error saving app version:', error);
    }
  }
}