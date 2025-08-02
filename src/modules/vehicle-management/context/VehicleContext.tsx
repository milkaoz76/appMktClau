/**
 * VehicleContext - Contexto específico del módulo de vehículos
 * Maneja el estado y lógica de negocio de los vehículos
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, VehicleFormData, VehicleFilter, VehicleSort } from '../types';
import { createLogger } from '../../../shared/utils/logger';

// Logger específico del módulo
const vehicleLogger = createLogger('Vehicle');

/**
 * Estado del contexto de vehículos
 */
interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  filter: VehicleFilter;
  sort: VehicleSort;
}

/**
 * Acciones del contexto de vehículos
 */
interface VehicleActions {
  // CRUD operations
  addVehicle: (vehicleData: VehicleFormData) => Promise<Vehicle>;
  updateVehicle: (id: number, vehicleData: Partial<VehicleFormData>) => Promise<Vehicle>;
  deleteVehicle: (id: number) => Promise<void>;
  getVehicle: (id: number) => Vehicle | undefined;
  
  // Selection
  selectVehicle: (vehicle: Vehicle | null) => void;
  
  // Filtering and sorting
  setFilter: (filter: Partial<VehicleFilter>) => void;
  setSort: (sort: VehicleSort) => void;
  clearFilter: () => void;
  
  // Utility
  refreshVehicles: () => Promise<void>;
  canAddVehicle: () => boolean;
  getVehicleCount: () => number;
}

/**
 * Valor completo del contexto
 */
interface VehicleContextValue extends VehicleState, VehicleActions {}

/**
 * Props para el provider
 */
interface VehicleProviderProps {
  children: React.ReactNode;
  userPlan?: 'free' | 'premium';
}

// Crear el contexto
const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

/**
 * Estado inicial
 */
const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,
  filter: {
    brand: '',
    year: null,
    search: ''
  },
  sort: {
    field: 'brand',
    direction: 'asc'
  }
};

/**
 * Provider del contexto de vehículos
 */
export const VehicleProvider: React.FC<VehicleProviderProps> = ({
  children,
  userPlan = 'free'
}) => {
  const [state, setState] = useState<VehicleState>(initialState);

  // Cargar vehículos al inicializar
  useEffect(() => {
    loadVehicles();
  }, []);

  // Función para cargar vehículos desde storage
  const loadVehicles = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const savedVehicles = await AsyncStorage.getItem('vehicles');
      const vehicles: Vehicle[] = savedVehicles ? JSON.parse(savedVehicles) : [];
      
      vehicleLogger.info('Vehicles loaded from storage', { count: vehicles.length });
      
      setState(prev => ({
        ...prev,
        vehicles,
        loading: false
      }));
    } catch (error) {
      vehicleLogger.error('Error loading vehicles', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar vehículos'
      }));
    }
  }, []);

  // Función para guardar vehículos en storage
  const saveVehicles = useCallback(async (vehicles: Vehicle[]) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
      vehicleLogger.debug('Vehicles saved to storage', { count: vehicles.length });
    } catch (error) {
      vehicleLogger.error('Error saving vehicles', error);
      throw new Error('Error al guardar vehículos');
    }
  }, []);

  // Agregar vehículo
  const addVehicle = useCallback(async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    try {
      // Verificar límite de plan
      if (userPlan === 'free' && state.vehicles.length >= 2) {
        throw new Error('Has alcanzado el límite de vehículos en tu plan gratuito');
      }

      const newVehicle: Vehicle = {
        id: Date.now(),
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        mileage: parseInt(vehicleData.mileage),
        image: getVehicleImage(vehicleData.brand),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedVehicles = [...state.vehicles, newVehicle];
      
      await saveVehicles(updatedVehicles);
      
      setState(prev => ({
        ...prev,
        vehicles: updatedVehicles
      }));

      vehicleLogger.info('Vehicle added', { 
        id: newVehicle.id, 
        brand: newVehicle.brand, 
        model: newVehicle.model 
      });

      return newVehicle;
    } catch (error) {
      vehicleLogger.error('Error adding vehicle', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al agregar vehículo'
      }));
      throw error;
    }
  }, [state.vehicles, userPlan, saveVehicles]);

  // Actualizar vehículo
  const updateVehicle = useCallback(async (
    id: number, 
    vehicleData: Partial<VehicleFormData>
  ): Promise<Vehicle> => {
    try {
      const vehicleIndex = state.vehicles.findIndex(v => v.id === id);
      if (vehicleIndex === -1) {
        throw new Error('Vehículo no encontrado');
      }

      const updatedVehicle: Vehicle = {
        ...state.vehicles[vehicleIndex],
        ...vehicleData,
        year: vehicleData.year ? parseInt(vehicleData.year) : state.vehicles[vehicleIndex].year,
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : state.vehicles[vehicleIndex].mileage,
        updatedAt: new Date()
      };

      const updatedVehicles = [...state.vehicles];
      updatedVehicles[vehicleIndex] = updatedVehicle;

      await saveVehicles(updatedVehicles);

      setState(prev => ({
        ...prev,
        vehicles: updatedVehicles,
        selectedVehicle: prev.selectedVehicle?.id === id ? updatedVehicle : prev.selectedVehicle
      }));

      vehicleLogger.info('Vehicle updated', { id, changes: Object.keys(vehicleData) });

      return updatedVehicle;
    } catch (error) {
      vehicleLogger.error('Error updating vehicle', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar vehículo'
      }));
      throw error;
    }
  }, [state.vehicles, saveVehicles]);

  // Eliminar vehículo
  const deleteVehicle = useCallback(async (id: number): Promise<void> => {
    try {
      const updatedVehicles = state.vehicles.filter(v => v.id !== id);
      
      await saveVehicles(updatedVehicles);
      
      setState(prev => ({
        ...prev,
        vehicles: updatedVehicles,
        selectedVehicle: prev.selectedVehicle?.id === id ? null : prev.selectedVehicle
      }));

      vehicleLogger.info('Vehicle deleted', { id });
    } catch (error) {
      vehicleLogger.error('Error deleting vehicle', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al eliminar vehículo'
      }));
      throw error;
    }
  }, [state.vehicles, saveVehicles]);

  // Obtener vehículo por ID
  const getVehicle = useCallback((id: number): Vehicle | undefined => {
    return state.vehicles.find(v => v.id === id);
  }, [state.vehicles]);

  // Seleccionar vehículo
  const selectVehicle = useCallback((vehicle: Vehicle | null) => {
    setState(prev => ({ ...prev, selectedVehicle: vehicle }));
    vehicleLogger.debug('Vehicle selected', { id: vehicle?.id });
  }, []);

  // Establecer filtro
  const setFilter = useCallback((filter: Partial<VehicleFilter>) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...filter }
    }));
  }, []);

  // Establecer ordenamiento
  const setSort = useCallback((sort: VehicleSort) => {
    setState(prev => ({ ...prev, sort }));
  }, []);

  // Limpiar filtro
  const clearFilter = useCallback(() => {
    setState(prev => ({
      ...prev,
      filter: initialState.filter
    }));
  }, []);

  // Refrescar vehículos
  const refreshVehicles = useCallback(async () => {
    await loadVehicles();
  }, [loadVehicles]);

  // Verificar si se puede agregar vehículo
  const canAddVehicle = useCallback((): boolean => {
    return userPlan === 'premium' || state.vehicles.length < 2;
  }, [userPlan, state.vehicles.length]);

  // Obtener cantidad de vehículos
  const getVehicleCount = useCallback((): number => {
    return state.vehicles.length;
  }, [state.vehicles.length]);

  // Valor del contexto
  const contextValue: VehicleContextValue = useMemo(() => ({
    ...state,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    selectVehicle,
    setFilter,
    setSort,
    clearFilter,
    refreshVehicles,
    canAddVehicle,
    getVehicleCount
  }), [
    state,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    selectVehicle,
    setFilter,
    setSort,
    clearFilter,
    refreshVehicles,
    canAddVehicle,
    getVehicleCount
  ]);

  return (
    <VehicleContext.Provider value={contextValue}>
      {children}
    </VehicleContext.Provider>
  );
};

/**
 * Hook para usar el contexto de vehículos
 */
export const useVehicle = (): VehicleContextValue => {
  const context = useContext(VehicleContext);
  
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  
  return context;
};

/**
 * Función auxiliar para obtener imagen del vehículo
 */
const getVehicleImage = (brand: string): string => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'];
  return colors[brand.length % colors.length];
};

export default VehicleProvider;