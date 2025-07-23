/**
 * Estilos para el componente WelcomeBanner
 * Mantiene todos los estilos organizados y compatibles con React Native
 * CORREGIDO: Maneja sombras de manera compatible con web
 */
import { StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

// Helper function para sombras compatibles con web
const createShadow = (
  elevation: number,
  shadowColor: string = '#000',
  shadowOpacity: number = 0.1,
  shadowRadius: number = 4,
  shadowOffset: { width: number; height: number } = { width: 0, height: 2 }
): ViewStyle => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0,0,0,${shadowOpacity})`,
    } as ViewStyle;
  }
  
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

// Definición de tipos para mejor intellisense
interface WelcomeBannerStyles {
  // Contenedores principales
  container: ViewStyle;
  onboardingContainer: ViewStyle;
  registrationContainer: ViewStyle;
  mainAppContainer: ViewStyle;
  
  // Banner de bienvenida
  bannerContainer: ViewStyle;
  bannerContent: ViewStyle;
  bannerIconContainer: ViewStyle;
  bannerTextContainer: ViewStyle;
  bannerActions: ViewStyle;
  
  // Header del onboarding
  header: ViewStyle;
  progressIndicators: ViewStyle;
  progressDot: ViewStyle;
  progressDotActive: ViewStyle;
  skipButton: ViewStyle;
  skipButtonText: TextStyle;
  
  // Contenido principal del onboarding
  mainContent: ViewStyle;
  contentContainer: ViewStyle;
  iconContainer: ViewStyle;
  iconWrapper: ViewStyle;
  
  // Textos del onboarding
  title: TextStyle;
  subtitle: TextStyle;
  description: TextStyle;
  
  // Navegación
  navigation: ViewStyle;
  navButton: ViewStyle;
  navButtonDisabled: ViewStyle;
  nextButton: ViewStyle;
  nextButtonContent: ViewStyle;
  
  // Footer
  footer: ViewStyle;
  footerText: TextStyle;
  
  // Pantalla de registro
  registrationCard: ViewStyle;
  registrationHeader: ViewStyle;
  registrationIconWrapper: ViewStyle;
  registrationHeaderTitle: TextStyle;
  registrationHeaderSubtitle: TextStyle;
  
  registrationBody: ViewStyle;
  registrationIntro: ViewStyle;
  registrationIntroTitle: TextStyle;
  registrationIntroDescription: TextStyle;
  
  registrationChecklist: ViewStyle;
  checklistItem: ViewStyle;
  checklistDot: ViewStyle;
  checklistText: TextStyle;
  
  registrationButtons: ViewStyle;
  primaryButton: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonText: TextStyle;
  
  // App principal
  appHeader: ViewStyle;
  appTitle: TextStyle;
  appCard: ViewStyle;
  appCardIcon: ViewStyle;
  appCardTitle: TextStyle;
  appCardDescription: TextStyle;
  appCardButtons: ViewStyle;
  
  // Botones generales
  button: ViewStyle;
  buttonText: TextStyle;
  buttonSecondary: ViewStyle;
  buttonSecondaryText: TextStyle;
}

export const welcomeBannerStyles = StyleSheet.create<WelcomeBannerStyles>({
  // Contenedores principales
  container: {
    flex: 1,
    minHeight: screenHeight,
  },
  
  onboardingContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#dbeafe',
    position: 'relative',
  },
  
  registrationContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  
  mainAppContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#f9fafb',
  },

  // Banner de bienvenida
  bannerContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    ...createShadow(1, '#000', 0.05, 2, { width: 0, height: 1 }),
  },
  
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  bannerIconContainer: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 50,
  },
  
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Header del onboarding
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  
  progressIndicators: {
    flexDirection: 'row',
  },
  
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginRight: 8,
  },
  
  progressDotActive: {
    width: 32,
    backgroundColor: '#2563eb',
  },
  
  skipButton: {
    padding: 8,
  },
  
  skipButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16,
  },

  // Contenido principal del onboarding
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  
  contentContainer: {
    maxWidth: 384,
    width: '100%',
    alignItems: 'center',
  },
  
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 24,
    ...createShadow(4, '#000', 0.1, 8, { width: 0, height: 4 }),
  },

  // Textos del onboarding
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  description: {
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 48,
    textAlign: 'center',
    fontSize: 16,
  },

  // Navegación
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  
  navButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    color: '#6b7280',
    ...createShadow(2, '#000', 0.1, 4, { width: 0, height: 2 }),
  },
  
  navButtonDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  
  nextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    ...createShadow(4, '#000', 0.2, 8, { width: 0, height: 4 }),
  },
  
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Pantalla de registro
  registrationCard: {
    maxWidth: 448,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    ...createShadow(10, '#000', 0.25, 20, { width: 0, height: 10 }),
  },
  
  registrationHeader: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
  },
  
  registrationIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  registrationHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  
  registrationHeaderSubtitle: {
    color: '#bfdbfe',
    fontSize: 16,
  },
  
  registrationBody: {
    padding: 32,
  },
  
  registrationIntro: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  registrationIntroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  
  registrationIntroDescription: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 16,
  },
  
  registrationChecklist: {
    marginBottom: 32,
  },
  
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  checklistDot: {
    backgroundColor: '#dcfce7',
    padding: 4,
    borderRadius: 50,
    width: 8,
    height: 8,
  },
  
  checklistText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  
  registrationButtons: {
    // gap removed for React Native compatibility
  },
  
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    ...createShadow(4, '#000', 0.2, 8, { width: 0, height: 4 }),
  },
  
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  
  secondaryButton: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  secondaryButtonText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 16,
  },

  // App principal
  appHeader: {
    padding: 24,
    width: '100%',
  },
  
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 32,
  },
  
  appCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    ...createShadow(4, '#000', 0.1, 8, { width: 0, height: 4 }),
  },
  
  appCardIcon: {
    marginBottom: 16,
  },
  
  appCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  
  appCardDescription: {
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  
  appCardButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  // Botones generales
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginRight: 16,
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  
  buttonSecondaryText: {
    color: '#374151',
    fontSize: 16,
    textAlign: 'center',
  },
});