/**
 * VehicleRegistrationScreen - Pantalla de registro de vehículos
 * Migrado desde FirstRegistration con mejoras de arquitectura modular
 */
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../context/VehicleContext';
import { useNavigation } from '../../../../navigation/NavigationContext';
import { Vehicle, VehicleFormData, VehicleFormErrors } from '../../types';
import { AdaptiveLayout } from '../../../../shared/components/AdaptiveLayout';
import { createLogger } from '../../../../shared/utils/logger';
import { VehicleRegistrationMobile } from '../../components/mobile/VehicleRegistrationMobile';
import { VehicleRegistrationWeb } from '../../components/web/VehicleRegistrationWeb';

const vehicleLogger = createLogger('VehicleRegistration');

/**
 * Props para VehicleRegistrationScreen
 */
export interface VehicleRegistrationScreenProps {
  vehicleId?: number;
  onComplete?: (vehicle: Vehicle) => void;
  onCancel?: () => void;
  initialData?: Partial<VehicleFormData>;
}

/**
 * Marcas populares ordenadas alfabéticamente
 */
const POPULAR_BRANDS = [
  'BMW', 'Chevrolet', 'Ford', 'Hyundai', 'Kia', 
  'Mazda', 'Nissan', 'Peugeot', 'Suzuki', 'Toyota'
];

/**
 * Pantalla principal de registro de vehículos
 */
export const VehicleRegistrationScreen: React.FC<VehicleRegistrationScreenProps> = ({
  vehicleId,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const { addVehicle, loading } = useVehicle();
  const { goBack, canGoBack } = useNavigation();

  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: initialData.brand || '',
    model: initialData.model || '',
    year: initialData.year || '',
    mileage: initialData.mileage || '',
    ...initialData
  });
  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [brandSearch, setBrandSearch] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  // Año actual para validación
  const currentYear = new Date().getFullYear();

  // Manejar búsqueda de marcas
  const handleBrandSearch = useCallback((searchText: string) => {
    setBrandSearch(searchText);
    
    if (searchText && searchText.trim().length > 0) {
      // Buscar en todas las marcas disponibles (se podría expandir con una lista más completa)
      const allBrands = [
        ...POPULAR_BRANDS,
        'Acura', 'Alfa Romeo', 'Aston Martin', 'Bentley', 'Buick', 'Cadillac',
        'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Ferrari',
        'Fiat', 'Genesis', 'GMC', 'Hummer', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep',
        'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati',
        'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Opel', 'Porsche',
        'Ram', 'Renault', 'Rolls-Royce', 'Saab', 'Seat', 'Skoda', 'Smart',
        'Subaru', 'Tesla', 'Volkswagen', 'Volvo'
      ];
      
      const filtered = allBrands.filter(brand =>
        brand.toLowerCase().includes(searchText.toLowerCase())
      ).slice(0, 10);
      
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
  }, []);

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    const newErrors: VehicleFormErrors = {};
    
    if (!formData.brand) newErrors.brand = 'Selecciona una marca';
    if (!formData.model) newErrors.model = 'Ingresa el modelo';
    if (!formData.year) {
      newErrors.year = 'Ingresa el año';
    } else if (parseInt(formData.year) < 1900 || parseInt(formData.year) > currentYear) {
      newErrors.year = `El año debe estar entre 1900 y ${currentYear}`;
    }
    if (!formData.mileage) {
      newErrors.mileage = 'Ingresa el kilometraje';
    } else if (parseInt(formData.mileage) < 0) {
      newErrors.mileage = 'El kilometraje no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentYear]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      vehicleLogger.warn('Form validation failed', { errors });
      return;
    }

    try {
      vehicleLogger.info('Submitting vehicle registration', { 
        brand: formData.brand, 
        model: formData.model 
      });

      const newVehicle = await addVehicle(formData);
      
      vehicleLogger.info('Vehicle registered successfully', { id: newVehicle.id });

      // Limpiar formulario
      setFormData({
        brand: '',
        model: '',
        year: '',
        mileage: ''
      });
      setCurrentStep(1);
      setErrors({});

      // Notificar completación
      if (onComplete) {
        onComplete(newVehicle);
      }
    } catch (error) {
      vehicleLogger.error('Error registering vehicle', error);
      setErrors({
        brand: error instanceof Error ? error.message : 'Error al registrar vehículo'
      });
    }
  }, [formData, validateForm, addVehicle, onComplete, errors]);

  // Manejar cancelación
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else if (canGoBack()) {
      goBack();
    }
  }, [onCancel, canGoBack, goBack]);

  // Manejar navegación entre pasos
  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      handleCancel();
    }
  }, [currentStep, handleCancel]);

  // Verificar si el paso actual es válido
  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: return !!formData.brand;
      case 2: return !!formData.model && !!formData.year;
      case 3: return !!formData.mileage;
      case 4: return true;
      default: return false;
    }
  }, [currentStep, formData]);

  // Funciones optimizadas para evitar pérdida de foco
  const handleFormDataChange = useCallback((newData: VehicleFormData) => {
    setFormData(newData);
  }, []);

  const handleBrandChange = useCallback((brand: string) => {
    setFormData(prev => ({ ...prev, brand }));
  }, []);

  const handleModelChange = useCallback((model: string) => {
    setFormData(prev => ({ ...prev, model }));
  }, []);

  const handleYearChange = useCallback((year: string) => {
    setFormData(prev => ({ ...prev, year }));
  }, []);

  const handleMileageChange = useCallback((mileage: string) => {
    setFormData(prev => ({ ...prev, mileage }));
  }, []);

  // Props compartidas para ambas versiones
  const sharedProps = useMemo(() => ({
    currentStep,
    formData,
    errors,
    loading,
    popularBrands: POPULAR_BRANDS,
    brandSearch,
    filteredBrands,
    currentYear,
    isStepValid: isStepValid(),
    onStepChange: setCurrentStep,
    onFormDataChange: handleFormDataChange,
    onBrandChange: handleBrandChange,
    onModelChange: handleModelChange,
    onYearChange: handleYearChange,
    onMileageChange: handleMileageChange,
    onBrandSearch: handleBrandSearch,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onCancel: handleCancel,
    onSubmit: handleSubmit
  }), [
    currentStep,
    formData,
    errors,
    loading,
    brandSearch,
    filteredBrands,
    currentYear,
    isStepValid(),
    handleFormDataChange,
    handleBrandChange,
    handleModelChange,
    handleYearChange,
    handleMileageChange,
    handleBrandSearch,
    handleNext,
    handlePrevious,
    handleCancel,
    handleSubmit
  ]);

  return (
    <AdaptiveLayout
      mobile={() => <VehicleRegistrationMobile {...sharedProps} />}
      desktop={() => <VehicleRegistrationWeb {...sharedProps} />}
    />
  );
};

export default VehicleRegistrationScreen;