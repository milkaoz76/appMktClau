/**
 * Hook personalizado para la lógica de negocio del FirstRegistration
 * Maneja todo el estado, validaciones y eventos del componente de registro de vehículos
 */
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
}

export interface FormData {
  brand: string;
  model: string;
  year: string;
  mileage: string;
}

export interface FormErrors {
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export interface MaintenanceHistory {
  [vehicleId: string]: {
    [taskId: string]: {
      completed: boolean;
      date: string;
      mileage: number;
    };
  };
}

export interface UseFirstRegistrationReturn {
  // Estado principal
  currentScreen: string;
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  currentStep: number;
  formData: FormData;
  userPlan: string;
  errors: FormErrors;
  showMileageModal: boolean;
  newMileage: string;
  maintenanceHistory: MaintenanceHistory;
  
  // Datos estáticos
  popularBrands: string[];
  allBrands: string[];
  currentYear: number;
  maintenancePlan: { [key: string]: MaintenanceTask[] };
  
  // Estado de búsqueda de marcas
  brandSearch: string;
  showCustomBrandModal: boolean;
  customBrandName: string;
  filteredBrands: string[];
  
  // Acciones de navegación
  setCurrentScreen: (screen: string) => void;
  setCurrentStep: (step: number) => void;
  goBackToWelcomeBanner: () => void;
  
  // Acciones de formulario
  setFormData: (data: FormData) => void;
  validateForm: () => boolean;
  handleSubmit: () => void;
  
  // Acciones de búsqueda de marcas
  handleBrandSearch: (searchText: string) => void;
  handleCustomBrand: () => Promise<void>;
  setBrandSearch: (search: string) => void;
  setShowCustomBrandModal: (show: boolean) => void;
  setCustomBrandName: (name: string) => void;
  
  // Acciones de vehículos
  deleteVehicle: (id: number) => void;
  canAddVehicle: () => boolean;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  
  // Acciones de kilometraje
  setShowMileageModal: (show: boolean) => void;
  setNewMileage: (mileage: string) => void;
  updateVehicleMileage: () => void;
  
  // Acciones de mantenimiento
  getMaintenanceStatus: (vehicleId: number, mileage: number, taskId: string, milestone: string) => string;
  markTaskCompleted: (vehicleId: number, taskId: string) => void;
  
  // Utilidades
  getVehicleImage: (brand: string) => string;
}

export const useFirstRegistration = (): UseFirstRegistrationReturn => {
  // ID único para debuggear múltiples instancias
  const hookId = React.useRef(Math.random().toString(36).substr(2, 9));
  
  // Estado principal del componente
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Debug: Log del estado de vehículos cuando cambia
  React.useEffect(() => {
    console.log('🚗 Estado de vehículos actualizado:', vehicles);
    console.log('📊 Cantidad de vehículos:', vehicles.length);
  }, [vehicles]);

  // Debug: Log cuando cambia la pantalla actual
  React.useEffect(() => {
    console.log(`🔄 [${hookId.current}] Pantalla cambió a:`, currentScreen);
    if (currentScreen === 'dashboard') {
      console.log(`📊 [${hookId.current}] Forzando renderizado del dashboard...`);
    }
  }, [currentScreen]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    year: '',
    mileage: ''
  });
  const [userPlan, setUserPlan] = useState<string>('free'); // free or premium
  const [errors, setErrors] = useState<FormErrors>({});
  const [showMileageModal, setShowMileageModal] = useState<boolean>(false);
  const [newMileage, setNewMileage] = useState<string>('');
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistory>({});

  // Datos estáticos - Base de datos expandida de marcas
  const popularBrands = [
    'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'Honda', 
    'Hyundai', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi'
  ];

  const allBrands = [
    'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac',
    'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Ferrari',
    'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu',
    'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus',
    'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan',
    'Opel', 'Peugeot', 'Porsche', 'Ram', 'Renault', 'Rolls-Royce', 'Saab', 'Seat',
    'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  // Estado para búsqueda de marcas
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [showCustomBrandModal, setShowCustomBrandModal] = useState<boolean>(false);
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  const currentYear = new Date().getFullYear();

  // Datos del plan de mantención con iconos de Ionicons
  const maintenancePlan: { [key: string]: MaintenanceTask[] } = {
    '10000': [
      { 
        id: 'oil_10k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'filter_10k', 
        name: 'Filtro de aire', 
        icon: React.createElement(Ionicons, { name: 'funnel-outline', size: 16, color: '#16a34a' }),
        color: 'text-green-600', 
        bg: 'bg-green-100' 
      },
    ],
    '20000': [
      { 
        id: 'oil_20k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'brake_fluid_20k', 
        name: 'Líquido de frenos', 
        icon: React.createElement(Ionicons, { name: 'disc-outline', size: 16, color: '#dc2626' }),
        color: 'text-red-600', 
        bg: 'bg-red-100' 
      },
      { 
        id: 'filter_20k', 
        name: 'Filtro de aire', 
        icon: React.createElement(Ionicons, { name: 'funnel-outline', size: 16, color: '#16a34a' }),
        color: 'text-green-600', 
        bg: 'bg-green-100' 
      },
    ],
    '30000': [
      { 
        id: 'oil_30k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'spark_plugs_30k', 
        name: 'Bujías', 
        icon: React.createElement(Ionicons, { name: 'flash-outline', size: 16, color: '#ca8a04' }),
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100' 
      },
      { 
        id: 'brake_pads_30k', 
        name: 'Pastillas de freno', 
        icon: React.createElement(Ionicons, { name: 'disc-outline', size: 16, color: '#dc2626' }),
        color: 'text-red-600', 
        bg: 'bg-red-100' 
      },
    ],
    '40000': [
      { 
        id: 'oil_40k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'filter_40k', 
        name: 'Filtro de aire', 
        icon: React.createElement(Ionicons, { name: 'funnel-outline', size: 16, color: '#16a34a' }),
        color: 'text-green-600', 
        bg: 'bg-green-100' 
      },
      { 
        id: 'coolant_40k', 
        name: 'Refrigerante', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#0891b2' }),
        color: 'text-cyan-600', 
        bg: 'bg-cyan-100' 
      },
    ],
    '50000': [
      { 
        id: 'oil_50k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'brake_fluid_50k', 
        name: 'Líquido de frenos', 
        icon: React.createElement(Ionicons, { name: 'disc-outline', size: 16, color: '#dc2626' }),
        color: 'text-red-600', 
        bg: 'bg-red-100' 
      },
      { 
        id: 'timing_belt_50k', 
        name: 'Correa de distribución', 
        icon: React.createElement(Ionicons, { name: 'settings-outline', size: 16, color: '#9333ea' }),
        color: 'text-purple-600', 
        bg: 'bg-purple-100' 
      },
    ],
    '60000': [
      { 
        id: 'oil_60k', 
        name: 'Cambio de aceite', 
        icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
        color: 'text-blue-600', 
        bg: 'bg-blue-100' 
      },
      { 
        id: 'transmission_60k', 
        name: 'Aceite transmisión', 
        icon: React.createElement(Ionicons, { name: 'construct-outline', size: 16, color: '#ea580c' }),
        color: 'text-orange-600', 
        bg: 'bg-orange-100' 
      },
      { 
        id: 'brake_pads_60k', 
        name: 'Pastillas de freno', 
        icon: React.createElement(Ionicons, { name: 'disc-outline', size: 16, color: '#dc2626' }),
        color: 'text-red-600', 
        bg: 'bg-red-100' 
      },
    ],
  };

  /**
   * Efecto para cargar datos persistidos al inicializar
   * CORREGIDO: Previene múltiples ejecuciones y maneja cleanup
   */
  useEffect(() => {
    let isMounted = true;
    let hasLoaded = false; // Prevenir múltiples cargas
    
    const loadPersistedData = async () => {
      // Prevenir múltiples ejecuciones
      if (hasLoaded || !isMounted) return;
      hasLoaded = true;
      
      try {
        console.log('🔄 Cargando datos persistidos...');
        
        const [savedVehicles, savedMaintenanceHistory, savedUserPlan] = await Promise.all([
          AsyncStorage.getItem('vehicles'),
          AsyncStorage.getItem('maintenanceHistory'),
          AsyncStorage.getItem('userPlan')
        ]);
        
        // Solo actualizar si el componente sigue montado
        if (!isMounted) return;
        
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles);
          setVehicles(parsedVehicles);
          console.log(`✅ Cargados ${parsedVehicles.length} vehículos`);
        }
        
        if (savedMaintenanceHistory) {
          setMaintenanceHistory(JSON.parse(savedMaintenanceHistory));
          console.log('✅ Historial de mantenimiento cargado');
        }
        
        if (savedUserPlan) {
          setUserPlan(savedUserPlan);
          console.log(`✅ Plan de usuario: ${savedUserPlan}`);
        }
        
        console.log('✅ Carga de datos persistidos completada');
      } catch (error) {
        console.error('❌ Error al cargar datos persistidos:', error);
        // En caso de error, usar valores por defecto
        if (isMounted) {
          setVehicles([]);
          setMaintenanceHistory({});
          setUserPlan('free');
        }
      }
    };

    loadPersistedData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Obtiene el estado de una tarea de mantenimiento
   */
  const getMaintenanceStatus = (vehicleId: number, mileage: number, taskId: string, milestone: string): string => {
    const history = maintenanceHistory[vehicleId.toString()] || {};
    if (history[taskId]) return 'completed';
    
    const currentMileage = parseInt(mileage.toString());
    const milestoneMileage = parseInt(milestone);
    
    if (currentMileage >= milestoneMileage) return 'due';
    if (currentMileage >= milestoneMileage - 2000) return 'upcoming';
    return 'pending';
  };

  /**
   * Marca una tarea como completada
   */
  const markTaskCompleted = async (vehicleId: number, taskId: string): Promise<void> => {
    try {
      const updatedHistory = {
        ...maintenanceHistory,
        [vehicleId.toString()]: {
          ...maintenanceHistory[vehicleId.toString()],
          [taskId]: {
            completed: true,
            date: new Date().toISOString(),
            mileage: selectedVehicle?.mileage || 0
          }
        }
      };
      
      setMaintenanceHistory(updatedHistory);
      await AsyncStorage.setItem('maintenanceHistory', JSON.stringify(updatedHistory));
      console.log(`✅ Tarea ${taskId} marcada como completada para vehículo ${vehicleId}`);
    } catch (error) {
      console.error('❌ Error al marcar tarea como completada:', error);
    }
  };

  /**
   * Actualiza el kilometraje de un vehículo
   */
  const updateVehicleMileage = async (): Promise<void> => {
    if (!newMileage || parseInt(newMileage) < 0 || !selectedVehicle) return;
    
    try {
      const updatedVehicles = vehicles.map(v => 
        v.id === selectedVehicle.id 
          ? { ...v, mileage: parseInt(newMileage) }
          : v
      );
      
      setVehicles(updatedVehicles);
      setSelectedVehicle({ ...selectedVehicle, mileage: parseInt(newMileage) });
      setNewMileage('');
      setShowMileageModal(false);
      
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      console.log(`✅ Kilometraje actualizado para vehículo ${selectedVehicle.id}: ${newMileage} km`);
    } catch (error) {
      console.error('❌ Error al actualizar kilometraje:', error);
    }
  };

  /**
   * Valida el formulario de registro
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
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
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (): Promise<void> => {
    console.log('🔍 Iniciando handleSubmit...');
    console.log('📝 Datos del formulario antes de validar:', formData);
    
    const isValid = validateForm();
    console.log('✅ Resultado de validación:', isValid);
    console.log('❌ Errores encontrados:', errors);
    
    if (isValid) {
      try {
        const newVehicle: Vehicle = {
          id: Date.now(),
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          image: getVehicleImage(formData.brand)
        };
        
        const updatedVehicles = [...vehicles, newVehicle];
        
        console.log('🚗 Vehículo creado:', newVehicle);
        console.log('📋 Lista actualizada de vehículos:', updatedVehicles);
        
        // PRIMERO navegar al dashboard
        console.log(`🎯 [${hookId.current}] Navegando a dashboard...`);
        setCurrentScreen('dashboard');
        
        // LUEGO limpiar el formulario
        setFormData({ brand: '', model: '', year: '', mileage: '' });
        setCurrentStep(1);
        setErrors({});
        
        // FINALMENTE actualizar vehículos y guardar
        setVehicles(updatedVehicles);
        await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        console.log(`✅ Vehículo registrado: ${newVehicle.brand} ${newVehicle.model}`);
        
        // Verificar que se guardó correctamente
        const savedVehicles = await AsyncStorage.getItem('vehicles');
        console.log('💾 Vehículos guardados en AsyncStorage:', savedVehicles);
      } catch (error) {
        console.error('❌ Error al registrar vehículo:', error);
      }
    } else {
      console.log('❌ Validación falló - no se puede registrar el vehículo');
      console.log('📋 Errores de validación:', errors);
      console.log('💡 Sugerencia: Verifica que todos los campos sean válidos');
      console.log('📅 Año válido: 1900 - ' + currentYear);
      console.log('🔢 Kilometraje: debe ser un número positivo');
    }
  };

  /**
   * Filtra marcas basado en la búsqueda
   */
  const handleBrandSearch = (searchText: string): void => {
    setBrandSearch(searchText);
    
    // Evitar loops - solo filtrar si hay texto
    if (searchText && searchText.trim().length > 0) {
      const filtered = allBrands.filter(brand =>
        brand.toLowerCase().includes(searchText.toLowerCase())
      ).slice(0, 10); // Limitar a 10 resultados
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
  };

  /**
   * Maneja la selección de marca personalizada
   */
  const handleCustomBrand = async (): Promise<void> => {
    if (customBrandName.trim()) {
      const trimmedName = customBrandName.trim();
      
      // Agregar a la lista de marcas si no existe
      if (!allBrands.includes(trimmedName)) {
        allBrands.push(trimmedName);
        allBrands.sort();
      }
      
      // Seleccionar la marca
      setFormData({ ...formData, brand: trimmedName });
      setCustomBrandName('');
      setShowCustomBrandModal(false);
      
      console.log(`✅ Marca personalizada agregada: ${trimmedName}`);
    }
  };

  /**
   * Obtiene la imagen/color del vehículo basado en la marca
   */
  const getVehicleImage = (brand: string): string => {
    const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return colors[brand.length % colors.length];
  };

  /**
   * Elimina un vehículo
   */
  const deleteVehicle = async (id: number): Promise<void> => {
    try {
      const updatedVehicles = vehicles.filter(v => v.id !== id);
      setVehicles(updatedVehicles);
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      console.log(`✅ Vehículo ${id} eliminado`);
    } catch (error) {
      console.error('❌ Error al eliminar vehículo:', error);
    }
  };

  /**
   * Verifica si se puede agregar un vehículo
   */
  const canAddVehicle = (): boolean => {
    return userPlan === 'premium' || vehicles.length < 2;
  };

  /**
   * Función para volver al WelcomeBanner
   * Esta función será llamada desde el contexto padre
   */
  const goBackToWelcomeBanner = (): void => {
    console.log('🔙 Regresando al WelcomeBanner');
    // Esta función será sobrescrita por el componente padre
  };

  // Función de debug para la consola
  if (typeof window !== 'undefined') {
    (window as any).debugVehicles = () => {
      console.log('🔍 DEBUG - Estado actual de vehículos:', vehicles);
      console.log('🔍 DEBUG - Pantalla actual:', currentScreen);
      console.log('🔍 DEBUG - Datos del formulario:', formData);
      return { vehicles, currentScreen, formData };
    };
  }

  return {
    // Estado
    currentScreen,
    vehicles,
    selectedVehicle,
    currentStep,
    formData,
    userPlan,
    errors,
    showMileageModal,
    newMileage,
    maintenanceHistory,
    
    // Datos estáticos
    popularBrands,
    allBrands,
    currentYear,
    maintenancePlan,
    
    // Estado de búsqueda de marcas
    brandSearch,
    showCustomBrandModal,
    customBrandName,
    filteredBrands,
    
    // Acciones de navegación
    setCurrentScreen,
    setCurrentStep,
    goBackToWelcomeBanner,
    
    // Acciones de formulario
    setFormData,
    validateForm,
    handleSubmit,
    
    // Acciones de búsqueda de marcas
    handleBrandSearch,
    handleCustomBrand,
    setBrandSearch,
    setShowCustomBrandModal,
    setCustomBrandName,
    
    // Acciones de vehículos
    deleteVehicle,
    canAddVehicle,
    setSelectedVehicle,
    
    // Acciones de kilometraje
    setShowMileageModal,
    setNewMileage,
    updateVehicleMileage,
    
    // Acciones de mantenimiento
    getMaintenanceStatus,
    markTaskCompleted,
    
    // Utilidades
    getVehicleImage,
  };
};