/**
 * VehicleRegistrationMobile - Componente de registro de vehículos para mobile
 * Versión mobile del formulario de registro con navegación por pasos
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleFormData, VehicleFormErrors } from '../../types';
import { vehicleStyles as styles } from '../../styles/vehicleStyles';

/**
 * Props para VehicleRegistrationMobile
 */
export interface VehicleRegistrationMobileProps {
  currentStep: number;
  formData: VehicleFormData;
  errors: VehicleFormErrors;
  loading: boolean;
  popularBrands: string[];
  brandSearch: string;
  filteredBrands: string[];
  currentYear: number;
  isStepValid: boolean;
  onStepChange: (step: number) => void;
  onFormDataChange: (data: VehicleFormData) => void;
  onBrandChange?: (brand: string) => void;
  onModelChange?: (model: string) => void;
  onYearChange?: (year: string) => void;
  onMileageChange?: (mileage: string) => void;
  onBrandSearch: (search: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

/**
 * Componente de registro mobile
 */
export const VehicleRegistrationMobile: React.FC<VehicleRegistrationMobileProps> = ({
  currentStep,
  formData,
  errors,
  loading,
  popularBrands,
  brandSearch,
  filteredBrands,
  currentYear,
  isStepValid,
  onFormDataChange,
  onBrandChange,
  onModelChange,
  onYearChange,
  onMileageChange,
  onBrandSearch,
  onNext,
  onPrevious,
  onCancel
}) => {
  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Ionicons name="car-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.stepTitle}>Selecciona la marca</Text>
              <Text style={styles.stepSubtitle}>¿Cuál es la marca de tu vehículo?</Text>
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
                      onFormDataChange({ ...formData, brand: '' });
                      onBrandSearch('');
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
                      onChangeText={onBrandSearch}
                      placeholder="Buscar marca..."
                      placeholderTextColor="#9ca3af"
                    />
                    {brandSearch.length > 0 && (
                      <TouchableOpacity
                        onPress={() => onBrandSearch('')}
                        style={styles.searchClearButton}
                      >
                        <Ionicons name="close-circle" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Lista de marcas */}
                {brandSearch.length > 0 ? (
                  // Resultados de búsqueda
                  <ScrollView style={styles.brandsList} showsVerticalScrollIndicator={false}>
                    {filteredBrands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        onPress={() => {
                          if (onBrandChange) {
                            onBrandChange(brand);
                          } else {
                            onFormDataChange({ ...formData, brand });
                          }
                          onBrandSearch('');
                        }}
                        style={styles.brandListItem}
                      >
                        <Text style={styles.brandListItemText}>{brand}</Text>
                      </TouchableOpacity>
                    ))}

                    {filteredBrands.length === 0 && (
                      <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No se encontraron marcas</Text>
                        <Text style={styles.noResultsSubtext}>Intenta con otro término de búsqueda</Text>
                      </View>
                    )}
                  </ScrollView>
                ) : (
                  // Marcas populares en cuadrícula
                  <View style={styles.brandsGrid}>
                    {popularBrands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        onPress={() => onFormDataChange({ ...formData, brand })}
                        style={styles.brandGridItem}
                      >
                        <Text style={styles.brandGridItemText}>{brand}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
            
            {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
          </View>
        );

      case 2:
        return (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Ionicons name="document-text-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.stepTitle}>Detalles del vehículo</Text>
              <Text style={styles.stepSubtitle}>Ingresa el modelo y año</Text>
            </View>

            <View>
              <Text style={styles.formLabel}>Modelo</Text>
              <TextInput
                style={[styles.formInput, errors.model ? styles.formInputError : null]}
                value={formData.model}
                onChangeText={onModelChange || ((text) => onFormDataChange({ ...formData, model: text }))}
                placeholder="Ej: Corolla, Focus, Civic..."
              />
              {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}

              <Text style={styles.formLabel}>Año</Text>
              <TextInput
                style={[styles.formInput, errors.year ? styles.formInputError : null]}
                value={formData.year}
                onChangeText={onYearChange || ((text) => onFormDataChange({ ...formData, year: text }))}
                placeholder={`Ej: ${currentYear - 5}`}
                keyboardType="numeric"
              />
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Ionicons name="speedometer-outline" size={32} color="#2563eb" />
              </View>
              <Text style={styles.stepTitle}>Kilometraje actual</Text>
              <Text style={styles.stepSubtitle}>¿Cuántos kilómetros tiene actualmente?</Text>
            </View>

            <View>
              <Text style={styles.formLabel}>Kilometraje</Text>
              <TextInput
                style={[styles.formInput, errors.mileage ? styles.formInputError : null]}
                value={formData.mileage}
                onChangeText={onMileageChange || ((text) => onFormDataChange({ ...formData, mileage: text }))}
                placeholder="Ej: 150000"
                keyboardType="numeric"
              />
              {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#16a34a" />
              </View>
              <Text style={styles.stepTitle}>Confirmar registro</Text>
              <Text style={styles.stepSubtitle}>Revisa los datos antes de continuar</Text>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Marca:</Text>
                <Text style={styles.summaryValue}>{formData.brand}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Modelo:</Text>
                <Text style={styles.summaryValue}>{formData.model}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Año:</Text>
                <Text style={styles.summaryValue}>{formData.year}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Kilometraje:</Text>
                <Text style={styles.summaryValue}>
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Vehículo</Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / 4) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Paso {currentStep} de 4
        </Text>
      </View>

      {/* Contenido del paso */}
      <View style={styles.stepContainer}>
        {renderStep()}

        {/* Botones de navegación */}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={onPrevious}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Ionicons name="chevron-back" size={16} color="#374151" />
              <Text style={[styles.secondaryButtonText, { marginLeft: 4 }]}>Anterior</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={onNext}
            disabled={!isStepValid || loading}
            style={[
              styles.primaryButton,
              { flex: 1, marginLeft: currentStep > 1 ? 12 : 0 },
              (!isStepValid || loading) && styles.primaryButtonDisabled
            ]}
          >
            {loading ? (
              <Text style={styles.primaryButtonText}>Registrando...</Text>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  {currentStep === 4 ? 'Registrar' : 'Siguiente'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default VehicleRegistrationMobile;