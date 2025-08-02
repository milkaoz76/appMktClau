/**
 * VehicleListScreen - Pantalla principal de lista de vehículos
 * Muestra todos los vehículos registrados con opciones de filtrado y acciones
 */
import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../context/VehicleContext';
import { useNavigation } from '../../../../navigation/NavigationContext';
import { Vehicle, VehicleFilter, VehicleSort } from '../../types';
import { AdaptiveLayout } from '../../../../shared/components/AdaptiveLayout';
import { createLogger } from '../../../../shared/utils/logger';
import { VehicleListMobile } from '../../components/mobile/VehicleListMobile';
import { VehicleListWeb } from '../../components/web/VehicleListWeb';

const vehicleLogger = createLogger('VehicleList');

/**
 * Props para VehicleListScreen
 */
export interface VehicleListScreenProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onAddVehicle?: () => void;
  showAddButton?: boolean;
}

/**
 * Pantalla principal de lista de vehículos
 */
export const VehicleListScreen: React.FC<VehicleListScreenProps> = ({
  onVehicleSelect,
  onAddVehicle,
  showAddButton = true
}) => {
  const {
    vehicles,
    loading,
    error,
    filter,
    sort,
    selectedVehicle,
    canAddVehicle,
    getVehicleCount,
    selectVehicle,
    deleteVehicle,
    setFilter,
    setSort,
    clearFilter,
    refreshVehicles
  } = useVehicle();

  const { navigate } = useNavigation();

  // Estado local
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar y ordenar vehículos
  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles;

    // Aplicar filtros
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
      );
    }

    if (filter.brand) {
      filtered = filtered.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(filter.brand.toLowerCase())
      );
    }

    if (filter.year) {
      filtered = filtered.filter(vehicle => vehicle.year === filter.year);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sort.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [vehicles, filter, sort]);

  // Estadísticas de vehículos
  const vehicleStats = useMemo(() => {
    const total = vehicles.length;
    const byBrand = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.brand] = (acc[vehicle.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalMileage = vehicles.reduce((sum, vehicle) => sum + vehicle.mileage, 0);
    const averageMileage = total > 0 ? Math.round(totalMileage / total) : 0;
    
    const years = vehicles.map(v => v.year);
    const newestYear = years.length > 0 ? Math.max(...years) : 0;
    const oldestYear = years.length > 0 ? Math.min(...years) : 0;

    return {
      total,
      byBrand,
      averageMileage,
      newestYear,
      oldestYear,
      filtered: filteredAndSortedVehicles.length
    };
  }, [vehicles, filteredAndSortedVehicles]);

  // Log cuando cambian los vehículos
  React.useEffect(() => {
    vehicleLogger.debug('Vehicle list updated', {
      total: vehicleStats.total,
      filtered: vehicleStats.filtered,
      hasFilter: !!(filter.search || filter.brand || filter.year)
    });
  }, [vehicleStats, filter]);

  // Manejar selección de vehículo
  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    selectVehicle(vehicle);
    vehicleLogger.info('Vehicle selected', { id: vehicle.id, brand: vehicle.brand });
    
    if (onVehicleSelect) {
      onVehicleSelect(vehicle);
    } else {
      // Navegar a detalles del vehículo
      navigate(`/vehicles/${vehicle.id}`);
    }
  }, [selectVehicle, onVehicleSelect, navigate]);

  // Manejar agregar vehículo
  const handleAddVehicle = useCallback(() => {
    vehicleLogger.info('Add vehicle requested');
    
    if (onAddVehicle) {
      onAddVehicle();
    } else {
      navigate('/vehicles/register');
    }
  }, [onAddVehicle, navigate]);

  // Manejar eliminación de vehículo
  const handleDeleteVehicle = useCallback(async (vehicle: Vehicle) => {
    try {
      vehicleLogger.info('Deleting vehicle', { id: vehicle.id });
      await deleteVehicle(vehicle.id);
      vehicleLogger.info('Vehicle deleted successfully', { id: vehicle.id });
    } catch (error) {
      vehicleLogger.error('Error deleting vehicle', error);
    }
  }, [deleteVehicle]);

  // Manejar refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshVehicles();
      vehicleLogger.info('Vehicles refreshed');
    } catch (error) {
      vehicleLogger.error('Error refreshing vehicles', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshVehicles]);

  // Manejar cambio de filtro
  const handleFilterChange = useCallback((newFilter: Partial<VehicleFilter>) => {
    setFilter(newFilter);
    vehicleLogger.debug('Filter changed', newFilter);
  }, [setFilter]);

  // Manejar cambio de ordenamiento
  const handleSortChange = useCallback((newSort: VehicleSort) => {
    setSort(newSort);
    vehicleLogger.debug('Sort changed', newSort);
  }, [setSort]);

  // Limpiar filtros
  const handleClearFilters = useCallback(() => {
    clearFilter();
    setShowFilters(false);
    vehicleLogger.debug('Filters cleared');
  }, [clearFilter]);

  // Props compartidas para ambas versiones
  const sharedProps = {
    vehicles: filteredAndSortedVehicles,
    allVehicles: vehicles,
    loading,
    error,
    refreshing,
    filter,
    sort,
    selectedVehicle,
    showFilters,
    vehicleStats,
    canAddVehicle: canAddVehicle(),
    showAddButton,
    onVehicleSelect: handleVehicleSelect,
    onAddVehicle: handleAddVehicle,
    onDeleteVehicle: handleDeleteVehicle,
    onRefresh: handleRefresh,
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
    onClearFilters: handleClearFilters,
    onToggleFilters: () => setShowFilters(!showFilters)
  };

  return (
    <AdaptiveLayout
      mobile={() => <VehicleListMobile {...sharedProps} />}
      desktop={() => <VehicleListWeb {...sharedProps} />}
    />
  );
};

export default VehicleListScreen;