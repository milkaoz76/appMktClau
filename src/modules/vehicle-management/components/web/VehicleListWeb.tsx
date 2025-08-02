/**
 * VehicleListWeb - Componente de lista de vehículos para web
 * Versión optimizada para desktop con layout de múltiples columnas
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle, VehicleFilter, VehicleSort } from '../../types';
import { vehicleStyles as styles } from '../../styles/vehicleStyles';
import { createLogger } from '../../../../shared/utils/logger';

const vehicleLogger = createLogger('VehicleListWeb');

/**
 * Props para VehicleListWeb
 */
export interface VehicleListWebProps {
  vehicles: Vehicle[];
  allVehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  filter: VehicleFilter;
  sort: VehicleSort;
  selectedVehicle: Vehicle | null;
  showFilters: boolean;
  vehicleStats: any;
  canAddVehicle: boolean;
  showAddButton: boolean;
  onVehicleSelect: (vehicle: Vehicle) => void;
  onAddVehicle: () => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onRefresh: () => void;
  onFilterChange: (filter: Partial<VehicleFilter>) => void;
  onSortChange: (sort: VehicleSort) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
}

/**
 * Componente de tarjeta de vehículo para web
 */
const VehicleCardWeb: React.FC<{
  vehicle: Vehicle;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ vehicle, onSelect, onDelete }) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.vehicleCard, { minHeight: 200, maxWidth: 300 }]}
    >
      <View style={[styles.vehicleImage, { backgroundColor: vehicle.image }]}>
        <Ionicons name="car-outline" size={24} color="#ffffff" />
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleBrand}>{vehicle.brand}</Text>
        <Text style={styles.vehicleModel}>{vehicle.model}</Text>
        <Text style={styles.vehicleYear}>Año {vehicle.year}</Text>
        <Text style={styles.vehicleMileage}>{vehicle.mileage.toLocaleString()} km</Text>
      </View>

      <View style={styles.vehicleActions}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Componente principal de lista de vehículos para web
 */
export const VehicleListWeb: React.FC<VehicleListWebProps> = ({
  vehicles,
  allVehicles,
  loading,
  error,
  refreshing,
  filter,
  sort,
  selectedVehicle,
  showFilters,
  vehicleStats,
  canAddVehicle,
  showAddButton,
  onVehicleSelect,
  onAddVehicle,
  onDeleteVehicle,
  onRefresh,
  onFilterChange,
  onSortChange,
  onClearFilters,
  onToggleFilters
}) => {
  const [searchText, setSearchText] = useState(filter.search);

  // Manejar búsqueda
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    onFilterChange({ search: text });
  }, [onFilterChange]);

  // Manejar cambio de ordenamiento
  const handleSortChange = useCallback((field: keyof Vehicle) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction: newDirection });
  }, [sort, onSortChange]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 24 }]}>
        <View>
          <Text style={styles.headerTitle}>Mis Vehículos</Text>
          <Text style={styles.headerSubtitle}>
            {vehicleStats.filtered} de {vehicleStats.total} vehículos
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={onToggleFilters}
            style={[styles.iconButton, showFilters && styles.iconButtonActive]}
          >
            <Ionicons name="filter-outline" size={20} color={showFilters ? "#2563eb" : "#6b7280"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onRefresh}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="refresh-outline" size={20} color="#6b7280" />
          </TouchableOpacity>

          {showAddButton && canAddVehicle && (
            <TouchableOpacity
              onPress={onAddVehicle}
              style={styles.primaryButton}
            >
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
                Agregar Vehículo
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      {showFilters && (
        <View style={[styles.filtersContainer, { paddingHorizontal: 24, paddingVertical: 16 }]}>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por marca o modelo..."
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>
            
            <TouchableOpacity
              onPress={() => handleSortChange('brand')}
              style={[styles.sortButton, sort.field === 'brand' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sort.field === 'brand' && styles.sortButtonTextActive]}>
                Marca {sort.field === 'brand' && (sort.direction === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSortChange('year')}
              style={[styles.sortButton, sort.field === 'year' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sort.field === 'year' && styles.sortButtonTextActive]}>
                Año {sort.field === 'year' && (sort.direction === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSortChange('mileage')}
              style={[styles.sortButton, sort.field === 'mileage' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sort.field === 'mileage' && styles.sortButtonTextActive]}>
                Km {sort.field === 'mileage' && (sort.direction === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClearFilters}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Contenido */}
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24 }}
        // refreshControl no disponible en web, usar onRefresh directamente
      >
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && vehicles.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando vehículos...</Text>
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="car-outline" size={48} color="#9ca3af" />
            </View>
            <Text style={styles.emptyStateTitle}>
              {filter.search || filter.brand ? 'No se encontraron vehículos' : 'No tienes vehículos registrados'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {filter.search || filter.brand 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Registra tu primer vehículo para comenzar'
              }
            </Text>
            {(!filter.search && !filter.brand && canAddVehicle) && (
              <TouchableOpacity
                onPress={onAddVehicle}
                style={styles.primaryButton}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
                  Registrar Vehículo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
            paddingVertical: 16
          }}>
            {vehicles.map((vehicle) => (
              <VehicleCardWeb
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={() => onVehicleSelect(vehicle)}
                onDelete={() => onDeleteVehicle(vehicle)}
              />
            ))}
          </View>
        )}

        {/* Estadísticas */}
        {vehicles.length > 0 && (
          <View style={[styles.statsContainer, { marginTop: 24, marginBottom: 24 }]}>
            <Text style={styles.statsTitle}>Estadísticas</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{vehicleStats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{vehicleStats.averageMileage.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Km promedio</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{vehicleStats.newestYear}</Text>
                <Text style={styles.statLabel}>Más nuevo</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{vehicleStats.oldestYear}</Text>
                <Text style={styles.statLabel}>Más antiguo</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default VehicleListWeb;