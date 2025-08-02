/**
 * VehicleListMobile - Lista de vehículos para mobile
 * Componente optimizado para dispositivos móviles
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle, VehicleFilter, VehicleSort } from '../../types';
import { vehicleStyles as styles } from '../../styles/vehicleStyles';

/**
 * Props para VehicleListMobile
 */
export interface VehicleListMobileProps {
  vehicles: Vehicle[];
  loading: boolean;
  refreshing: boolean;
  canAddVehicle: boolean;
  showAddButton: boolean;
  vehicleStats: {
    total: number;
    filtered: number;
    averageMileage: number;
  };
  onVehicleSelect: (vehicle: Vehicle) => void;
  onAddVehicle: () => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onRefresh: () => void;
}

/**
 * Componente de tarjeta de vehículo
 */
const VehicleCard: React.FC<{
  vehicle: Vehicle;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ vehicle, onSelect, onDelete }) => {
  return (
    <TouchableOpacity style={styles.vehicleCard} onPress={onSelect}>
      <View style={styles.vehicleCardHeader}>
        <View style={[styles.vehicleImage, { backgroundColor: vehicle.image }]}>
          <Ionicons name="car-outline" size={24} color="#ffffff" />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>{vehicle.brand} {vehicle.model}</Text>
          <Text style={styles.vehicleSubtitle}>Año {vehicle.year}</Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 }}>
        <Text style={styles.vehicleMileageText}>
          📊 {vehicle.mileage.toLocaleString()} km
        </Text>
      </View>

      <View style={styles.vehicleActions}>
        <TouchableOpacity style={styles.vehicleActionButton} onPress={onSelect}>
          <Text style={styles.vehicleActionButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Estado vacío
 */
const EmptyState: React.FC<{
  canAddVehicle: boolean;
  onAddVehicle: () => void;
}> = ({ canAddVehicle, onAddVehicle }) => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="car-outline" size={40} color="#9ca3af" />
      </View>
      <Text style={styles.emptyStateTitle}>No tienes vehículos registrados</Text>
      <Text style={styles.emptyStateSubtitle}>
        Comienza registrando tu primer vehículo para llevar un control completo
      </Text>
      
      {canAddVehicle && (
        <TouchableOpacity
          onPress={onAddVehicle}
          style={styles.primaryButton}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
            Registrar mi primer vehículo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Componente principal de lista mobile
 */
export const VehicleListMobile: React.FC<VehicleListMobileProps> = ({
  vehicles,
  loading,
  refreshing,
  canAddVehicle,
  showAddButton,
  vehicleStats,
  onVehicleSelect,
  onAddVehicle,
  onDeleteVehicle,
  onRefresh
}) => {
  // Si no hay vehículos, mostrar estado vacío
  if (vehicles.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <EmptyState 
          canAddVehicle={canAddVehicle}
          onAddVehicle={onAddVehicle}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mis Vehículos</Text>
          <Text style={styles.stepSubtitle}>
            {vehicleStats.filtered} de {vehicleStats.total} vehículo(s)
          </Text>
        </View>
        
        {showAddButton && canAddVehicle && (
          <TouchableOpacity onPress={onAddVehicle}>
            <Ionicons name="add-circle" size={28} color="#2563eb" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de vehículos */}
      <ScrollView
        style={styles.vehicleList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={() => onVehicleSelect(vehicle)}
            onDelete={() => onDeleteVehicle(vehicle)}
          />
        ))}

        {/* Botón flotante para agregar */}
        {showAddButton && canAddVehicle && vehicles.length > 0 && (
          <TouchableOpacity
            onPress={onAddVehicle}
            style={[styles.primaryButton, { marginTop: 16 }]}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
              Agregar otro vehículo
            </Text>
          </TouchableOpacity>
        )}

        {/* Mensaje de límite alcanzado */}
        {!canAddVehicle && (
          <View style={[styles.summaryContainer, { marginTop: 16 }]}>
            <Text style={styles.summaryLabel}>
              Has alcanzado el límite de vehículos en tu plan gratuito.
            </Text>
            <Text style={[styles.errorText, { fontSize: 12, marginTop: 4 }]}>
              Actualiza a Premium para agregar vehículos ilimitados.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default VehicleListMobile;