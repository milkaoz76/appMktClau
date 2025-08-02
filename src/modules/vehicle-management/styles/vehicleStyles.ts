/**
 * Estilos para el módulo de gestión de vehículos
 * Estilos compartidos entre componentes mobile y web
 */
import { StyleSheet, ViewStyle, Platform } from 'react-native';

// Helper para sombras compatibles
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

export const vehicleStyles = StyleSheet.create({
  // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Barra de progreso
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },

  // Pasos del formulario
  stepContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    ...createShadow(2),
  },

  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  stepIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dbeafe',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 8,
    textAlign: 'center',
  },

  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Selección de marca
  brandSelectedContainer: {
    marginBottom: 24,
  },

  brandSelectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#16a34a',
    borderRadius: 12,
    padding: 16,
  },

  brandSelectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  brandSelectedText: {
    marginLeft: 12,
  },

  brandSelectedLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },

  brandSelectedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },

  changeBrandButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  changeBrandButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
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

  // Lista de marcas
  brandsList: {
    maxHeight: 300,
    marginBottom: 16,
  },

  brandListItem: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },

  brandListItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  noResultsContainer: {
    alignItems: 'center',
    padding: 24,
  },

  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },

  noResultsSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // Cuadrícula de marcas
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  brandGridItem: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  brandGridItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  // Formulario
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },

  formInput: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },

  formInputError: {
    borderColor: '#ef4444',
  },

  // Resumen
  summaryContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

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
    flexDirection: 'row',
  },

  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },

  // Textos de error
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  // Lista de vehículos
  vehicleList: {
    padding: 16,
  },

  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...createShadow(2),
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
    marginBottom: 4,
  },

  vehicleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  vehicleMileageText: {
    fontSize: 12,
    color: '#6b7280',
  },

  vehicleActionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  vehicleActionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Estados vacíos
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Estilos faltantes para componentes web
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },

  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButtonActive: {
    backgroundColor: '#dbeafe',
  },

  filtersContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  sortButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },

  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  sortButtonTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },

  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  clearButtonText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    ...createShadow(1),
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },

  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Estilos para componentes de vehículos
  vehicleBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },

  vehicleModel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },

  vehicleYear: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },

  vehicleMileage: {
    fontSize: 12,
    color: '#6b7280',
  },

  vehicleActions: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Estilos adicionales para formularios
  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },

  textInputError: {
    borderColor: '#ef4444',
  },

  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  // Estilos para navegación de pasos
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  progressStepActive: {
    backgroundColor: '#2563eb',
  },

  progressStepCompleted: {
    backgroundColor: '#16a34a',
  },

  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  progressStepTextActive: {
    color: '#ffffff',
  },

  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  progressLabelActive: {
    color: '#2563eb',
    fontWeight: '500',
  },

  // Estilos para secciones
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },

  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    marginBottom: 8,
    alignItems: 'center',
  },

  brandButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },

  brandButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  brandButtonTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default vehicleStyles;