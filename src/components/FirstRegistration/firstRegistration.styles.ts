/**
 * Estilos para el componente FirstRegistration
 * Mantiene todos los estilos organizados y compatibles con React Native
 * CORREGIDO: Maneja sombras de manera compatible con web
 */
import { StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

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
interface FirstRegistrationStyles {
  // Contenedores principales
  container: ViewStyle;
  welcomeContainer: ViewStyle;
  registerContainer: ViewStyle;
  dashboardContainer: ViewStyle;
  maintenanceContainer: ViewStyle;
  
  // Pantalla de bienvenida
  welcomeContent: ViewStyle;
  welcomeHeader: ViewStyle;
  welcomeIconContainer: ViewStyle;
  welcomeCard: ViewStyle;
  welcomeFeatures: ViewStyle;
  welcomeFeature: ViewStyle;
  welcomeFeatureIcon: ViewStyle;
  welcomePlanInfo: ViewStyle;
  welcomePlanBadge: ViewStyle;
  
  // Pantalla de registro
  registerHeader: ViewStyle;
  registerProgress: ViewStyle;
  registerProgressBar: ViewStyle;
  registerProgressFill: ViewStyle;
  registerCard: ViewStyle;
  registerStepHeader: ViewStyle;
  registerStepIcon: ViewStyle;
  
  // Formulario
  formGrid: ViewStyle;
  formBrandButton: ViewStyle;
  formBrandButtonActive: ViewStyle;
  formInput: ViewStyle;
  formInputError: ViewStyle;
  formLabel: ViewStyle;
  formError: ViewStyle;
  formSummary: ViewStyle;
  formSummaryItem: ViewStyle;
  
  // Búsqueda de marcas
  searchContainer: ViewStyle;
  searchInputContainer: ViewStyle;
  searchInput: ViewStyle;
  searchIcon: ViewStyle;
  searchClearButton: ViewStyle;
  searchResults: ViewStyle;
  searchResultItem: ViewStyle;
  searchResultItemActive: ViewStyle;
  sectionTitle: TextStyle;
  customBrandSection: ViewStyle;
  customBrandText: TextStyle;
  customBrandButton: ViewStyle;
  customBrandButtonText: TextStyle;
  
  // Botones
  primaryButton: ViewStyle;
  primaryButtonDisabled: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonText: TextStyle;
  buttonRow: ViewStyle;
  
  // Dashboard
  dashboardHeader: ViewStyle;
  dashboardTitle: TextStyle;
  dashboardSubtitle: TextStyle;
  dashboardPlanBadge: ViewStyle;
  dashboardPlanText: TextStyle;
  
  // Tarjetas de vehículos
  vehicleCard: ViewStyle;
  vehicleCardHeader: ViewStyle;
  vehicleImage: ViewStyle;
  vehicleInfo: ViewStyle;
  vehicleTitle: TextStyle;
  vehicleSubtitle: TextStyle;
  vehicleMileage: ViewStyle;
  vehicleActions: ViewStyle;
  vehicleActionButton: ViewStyle;
  
  // Plan status
  planStatusCard: ViewStyle;
  planStatusText: TextStyle;
  planStatusWarning: TextStyle;
  
  // Modal
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalCloseButton: ViewStyle;
  modalBody: ViewStyle;
  modalCurrentMileage: TextStyle;
  modalButtonRow: ViewStyle;
  
  // Mantenimiento
  maintenanceHeader: ViewStyle;
  maintenanceCurrentStatus: ViewStyle;
  maintenanceTimeline: ViewStyle;
  maintenanceMilestone: ViewStyle;
  maintenanceMilestoneHeader: ViewStyle;
  maintenanceMilestoneIcon: ViewStyle;
  maintenanceMilestoneInfo: ViewStyle;
  maintenanceMilestoneTitle: TextStyle;
  maintenanceMilestoneSubtitle: TextStyle;
  maintenanceMilestoneBadge: ViewStyle;
  maintenanceTasks: ViewStyle;
  maintenanceTask: ViewStyle;
  maintenanceTaskIcon: ViewStyle;
  maintenanceTaskInfo: ViewStyle;
  maintenanceTaskName: TextStyle;
  maintenanceTaskStatus: ViewStyle;
  maintenanceTaskButton: ViewStyle;
  
  // Estados de mantenimiento
  statusCompleted: ViewStyle;
  statusDue: ViewStyle;
  statusUpcoming: ViewStyle;
  statusPending: ViewStyle;
  
  // Textos generales
  title: TextStyle;
  subtitle: TextStyle;
  bodyText: TextStyle;
  smallText: TextStyle;
  errorText: TextStyle;
  
  // Utilidades
  flexRow: ViewStyle;
  flexColumn: ViewStyle;
  spaceBetween: ViewStyle;
  alignCenter: ViewStyle;
  justifyCenter: ViewStyle;
  marginBottom: ViewStyle;
  padding: ViewStyle;
}

export const firstRegistrationStyles = StyleSheet.create<FirstRegistrationStyles>({
  // Contenedores principales
  container: {
    flex: 1,
    minHeight: screenHeight,
  },
  
  welcomeContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#dbeafe',
    padding: 16,
  },
  
  registerContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  
  dashboardContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  
  maintenanceContainer: {
    flex: 1,
    minHeight: screenHeight,
    backgroundColor: '#f9fafb',
    padding: 16,
  },

  // Pantalla de bienvenida
  welcomeContent: {
    maxWidth: 384,
    width: '100%',
    alignSelf: 'center',
  },
  
  welcomeHeader: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  
  welcomeIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#2563eb',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    ...createShadow(10, '#000', 0.25, 20, { width: 0, height: 10 }),
    padding: 32,
    marginBottom: 24,
  },
  
  welcomeFeatures: {
    marginBottom: 32,
  },
  
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  welcomeFeatureIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  welcomePlanInfo: {
    alignItems: 'center',
  },
  
  welcomePlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...createShadow(1, '#000', 0.1, 2, { width: 0, height: 1 }),
  },

  // Pantalla de registro
  registerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
  },
  
  registerProgress: {
    marginBottom: 32,
  },
  
  registerProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  
  registerProgressFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  
  registerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    ...createShadow(2, '#000', 0.1, 4, { width: 0, height: 2 }),
    padding: 24,
  },
  
  registerStepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  registerStepIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dbeafe',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // Formulario
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  formBrandButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    alignItems: 'center',
  },
  
  formBrandButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  
  formInput: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  
  formInputError: {
    borderColor: '#ef4444',
  },
  
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  
  formError: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 16,
  },
  
  formSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  
  formSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  // Búsqueda de marcas
  searchContainer: {
    marginBottom: 24,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  
  searchIcon: {
    marginRight: 4,
  },
  
  searchClearButton: {
    padding: 4,
  },
  
  searchResults: {
    gap: 8,
  },
  
  searchResultItem: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  
  searchResultItemActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  
  customBrandSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
  },
  
  customBrandText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  customBrandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  
  customBrandButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },

  // Botones
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  primaryButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // Dashboard
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
  },
  
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  
  dashboardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  dashboardPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  
  dashboardPlanText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },

  // Tarjetas de vehículos
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
    marginBottom: 16,
  },
  
  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  vehicleImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  vehicleInfo: {
    flex: 1,
  },
  
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  vehicleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  vehicleMileage: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  
  vehicleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  vehicleActionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  // Plan status
  planStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
    marginBottom: 24,
  },
  
  planStatusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  planStatusWarning: {
    fontSize: 12,
    color: '#ea580c',
    marginTop: 4,
  },

  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 1000,
  },
  
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 384,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  modalCloseButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  
  modalBody: {
    marginBottom: 16,
  },
  
  modalCurrentMileage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // Mantenimiento
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
  },
  
  maintenanceCurrentStatus: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  maintenanceTimeline: {
    gap: 16,
  },
  
  maintenanceMilestone: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  
  maintenanceMilestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  maintenanceMilestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  maintenanceMilestoneInfo: {
    flex: 1,
  },
  
  maintenanceMilestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  maintenanceMilestoneSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  maintenanceMilestoneBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  
  maintenanceTasks: {
    gap: 8,
  },
  
  maintenanceTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  
  maintenanceTaskIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  maintenanceTaskInfo: {
    flex: 1,
  },
  
  maintenanceTaskName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  
  maintenanceTaskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  
  maintenanceTaskButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // Estados de mantenimiento
  statusCompleted: {
    backgroundColor: '#dcfce7',
    borderLeftColor: '#16a34a',
  },
  
  statusDue: {
    backgroundColor: '#fef2f2',
    borderLeftColor: '#ef4444',
  },
  
  statusUpcoming: {
    backgroundColor: '#fff7ed',
    borderLeftColor: '#f59e0b',
  },
  
  statusPending: {
    backgroundColor: '#f9fafb',
    borderLeftColor: '#d1d5db',
  },

  // Textos generales
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  bodyText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  
  smallText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },

  // Utilidades
  flexRow: {
    flexDirection: 'row',
  },
  
  flexColumn: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  alignCenter: {
    alignItems: 'center',
  },
  
  justifyCenter: {
    justifyContent: 'center',
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  padding: {
    padding: 16,
  },
});