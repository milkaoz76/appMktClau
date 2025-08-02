/**
 * VehicleRegistrationWeb - Componente de registro de vehículos para web
 * Versión optimizada para desktop con layout horizontal
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VehicleFormData, VehicleFormErrors } from '../../types';
import { vehicleStyles as styles } from '../../styles/vehicleStyles';
import { createLogger } from '../../../../shared/utils/logger';

const vehicleLogger = createLogger('VehicleRegistrationWeb');

/**
 * Props para VehicleRegistrationWeb
 */
export interface VehicleRegistrationWebProps {
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
  onBrandSearch: (search: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

/**
 * Componente de paso de selección de marca para web
 */
const BrandStepWeb: React.FC<{
  formData: VehicleFormData;
  errors: VehicleFormErrors;
  popularBrands: string[];
  brandSearch: string;
  filteredBrands: string[];
  onFormDataChange: (data: VehicleFormData) => void;
  onBrandSearch: (search: string) => void;
}> = ({ formData, errors, popularBrands, brandSearch, filteredBrands, onFormDataChange, onBrandSearch }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Selecciona la marca de tu vehículo</Text>
        <Text style={styles.stepSubtitle}>Elige de las marcas populares o busca una específica</Text>
      </View>

      {/* Búsqueda de marca */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Buscar marca</Text>
        <TextInput
          style={[styles.textInput, errors.brand ? styles.textInputError : null]}
          placeholder="Escribe para buscar..."
          value={brandSearch}
          onChangeText={onBrandSearch}
        />
        {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
      </View>

      {/* Marcas filtradas */}
      {filteredBrands.length > 0 && (
        <View style={styles.brandsGrid}>
          {filteredBrands.map((brand) => (
            <TouchableOpacity
              key={brand}
              onPress={() => {
                onFormDataChange({ ...formData, brand });
                onBrandSearch('');
              }}
              style={[
                styles.brandButton,
                formData.brand === brand && styles.brandButtonSelected
              ]}
            >
              <Text style={[
                styles.brandButtonText,
                formData.brand === brand && styles.brandButtonTextSelected
              ]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Marcas populares */}
      {filteredBrands.length === 0 && (
        <>
          <Text style={styles.sectionTitle}>Marcas populares</Text>
          <View style={styles.brandsGrid}>
            {popularBrands.map((brand) => (
              <TouchableOpacity
                key={brand}
                onPress={() => onFormDataChange({ ...formData, brand })}
                style={[
                  styles.brandButton,
                  formData.brand === brand && styles.brandButtonSelected
                ]}
              >
                <Text style={[
                  styles.brandButtonText,
                  formData.brand === brand && styles.brandButtonTextSelected
                ]}>
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

/**
 * Componente de paso de modelo y año para web
 */
const ModelYearStepWeb: React.FC<{
  formData: VehicleFormData;
  errors: VehicleFormErrors;
  currentYear: number;
  onFormDataChange: (data: VehicleFormData) => void;
}> = ({ formData, errors, currentYear, onFormDataChange }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Información del vehículo</Text>
        <Text style={styles.stepSubtitle}>Ingresa el modelo y año de tu {formData.brand}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={[styles.inputContainer, { flex: 2 }]}>
          <Text style={styles.inputLabel}>Modelo *</Text>
          <TextInput
            style={[styles.textInput, errors.model ? styles.textInputError : null]}
            placeholder="Ej: Corolla, Civic, Focus"
            value={formData.model}
            onChangeText={(model) => onFormDataChange({ ...formData, model })}
          />
          {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
        </View>

        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Año *</Text>
          <TextInput
            style={[styles.textInput, errors.year ? styles.textInputError : null]}
            placeholder={currentYear.toString()}
            value={formData.year}
            onChangeText={(year) => onFormDataChange({ ...formData, year })}
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
        </View>
      </View>
    </View>
  );
};

/**
 * Componente de paso de kilometraje para web
 */
const MileageStepWeb: React.FC<{
  formData: VehicleFormData;
  errors: VehicleFormErrors;
  onFormDataChange: (data: VehicleFormData) => void;
}> = ({ formData, errors, onFormDataChange }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Kilometraje actual</Text>
        <Text style={styles.stepSubtitle}>¿Cuántos kilómetros tiene tu {formData.brand} {formData.model}?</Text>
      </View>

      <View style={[styles.inputContainer, { maxWidth: 300 }]}>
        <Text style={styles.inputLabel}>Kilometraje actual *</Text>
        <TextInput
          style={[styles.textInput, errors.mileage ? styles.textInputError : null]}
          placeholder="Ej: 50000"
          value={formData.mileage}
          onChangeText={(mileage) => onFormDataChange({ ...formData, mileage })}
          keyboardType="numeric"
        />
        {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
        <Text style={styles.inputHint}>
          Ingresa el kilometraje actual según el odómetro
        </Text>
      </View>
    </View>
  );
};

/**
 * Componente de paso de confirmación para web
 */
const ConfirmationStepWeb: React.FC<{
  formData: VehicleFormData;
}> = ({ formData }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Confirmar información</Text>
        <Text style={styles.stepSubtitle}>Revisa que toda la información sea correcta</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.vehicleImage, { backgroundColor: '#2563eb', alignSelf: 'center', marginBottom: 16 }]}>
          <Ionicons name="car-outline" size={32} color="#ffffff" />
        </View>

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
          <Text style={styles.summaryValue}>{parseInt(formData.mileage).toLocaleString()} km</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Componente principal de registro de vehículos para web
 */
export const VehicleRegistrationWeb: React.FC<VehicleRegistrationWebProps> = ({
  currentStep,
  formData,
  errors,
  loading,
  popularBrands,
  brandSearch,
  filteredBrands,
  currentYear,
  isStepValid,
  onStepChange,
  onFormDataChange,
  onBrandSearch,
  onNext,
  onPrevious,
  onCancel,
  onSubmit
}) => {
  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BrandStepWeb
            formData={formData}
            errors={errors}
            popularBrands={popularBrands}
            brandSearch={brandSearch}
            filteredBrands={filteredBrands}
            onFormDataChange={onFormDataChange}
            onBrandSearch={onBrandSearch}
          />
        );
      case 2:
        return (
          <ModelYearStepWeb
            formData={formData}
            errors={errors}
            currentYear={currentYear}
            onFormDataChange={onFormDataChange}
          />
        );
      case 3:
        return (
          <MileageStepWeb
            formData={formData}
            errors={errors}
            onFormDataChange={onFormDataChange}
          />
        );
      case 4:
        return <ConfirmationStepWeb formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 24 }]}>
        <TouchableOpacity onPress={onPrevious}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Vehículo</Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Indicador de progreso */}
      <View style={[styles.progressContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={{ flex: 1, alignItems: 'center' }}>
              <View style={[
                styles.progressStep,
                step <= currentStep && styles.progressStepActive,
                step < currentStep && styles.progressStepCompleted
              ]}>
                {step < currentStep ? (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                ) : (
                  <Text style={[
                    styles.progressStepText,
                    step <= currentStep && styles.progressStepTextActive
                  ]}>
                    {step}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.progressLabel,
                step <= currentStep && styles.progressLabelActive
              ]}>
                {step === 1 && 'Marca'}
                {step === 2 && 'Modelo'}
                {step === 3 && 'Kilometraje'}
                {step === 4 && 'Confirmar'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contenido */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ maxWidth: 600, alignSelf: 'center', width: '100%' }}>
          {renderStep()}
        </View>
      </ScrollView>

      {/* Botones de navegación */}
      <View style={[styles.buttonContainer, { paddingHorizontal: 24, paddingVertical: 16 }]}>
        <TouchableOpacity
          onPress={onPrevious}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={currentStep === 4 ? onSubmit : onNext}
          style={[
            styles.primaryButton,
            (!isStepValid || loading) && styles.primaryButtonDisabled
          ]}
          disabled={!isStepValid || loading}
        >
          {loading ? (
            <Text style={styles.primaryButtonText}>Guardando...</Text>
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === 4 ? 'Registrar Vehículo' : 'Siguiente'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VehicleRegistrationWeb;