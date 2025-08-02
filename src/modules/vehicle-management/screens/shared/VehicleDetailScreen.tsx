/**
 * VehicleDetailScreen - Pantalla de detalle de vehículo
 * Muestra información completa de un vehículo específico
 */
import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../context/VehicleContext';
import { useNavigation } from '../../../../navigation/NavigationContext';
import { Vehicle } from '../../types';
import { AdaptiveLayout } from '../../../../shared/components/AdaptiveLayout';
import { createLogger } from '../../../../shared/utils/logger';
import { vehicleStyles as styles } from '../../styles/vehicleStyles';

const vehicleLogger = createLogger('VehicleDetail');

/**
 * Props para VehicleDetailScreen
 */
export interface VehicleDetailScreenProps {
  vehicleId: number;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: () => void;
}

/**
 * Componente de detalle mobile
 */
const VehicleDetailMobile: React.FC<{
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}> = ({ vehicle, onEdit, onDelete, onBack }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Vehículo</Text>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Información del vehículo */}
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={[styles.vehicleImage, { backgroundColor: vehicle.image }]}>
            <Ionicons name="car-outline" size={32} color="#ffffff" />
          </View>
          <Text style={styles.stepTitle}>{vehicle.brand} {vehicle.model}</Text>
          <Text style={styles.stepSubtitle}>Año {vehicle.year}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Marca:</Text>
            <Text style={styles.summaryValue}>{vehicle.brand}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Modelo:</Text>
            <Text style={styles.summaryValue}>{vehicle.model}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Año:</Text>
            <Text style={styles.summaryValue}>{vehicle.year}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Kilometraje:</Text>
            <Text style={styles.summaryValue}>{vehicle.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Registrado:</Text>
            <Text style={styles.summaryValue}>
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Última actualización:</Text>
            <Text style={styles.summaryValue}>
              {new Date(vehicle.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onEdit}
            style={[styles.primaryButton, { flex: 1 }]}
          >
            <Ionicons name="create-outline" size={16} color="#ffffff" />
            <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.secondaryButton, { flex: 1, backgroundColor: '#fef2f2', borderColor: '#ef4444' }]}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text style={[styles.secondaryButtonText, { marginLeft: 8, color: '#ef4444' }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

/**
 * Componente de detalle web (similar al mobile por ahora)
 */
const VehicleDetailWeb: React.FC<{
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}> = ({ vehicle, onEdit, onDelete, onBack }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Vehículo</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <View style={[styles.stepContainer, { maxWidth: 600, alignSelf: 'center' }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.vehicleImage, { width: 80, height: 80, borderRadius: 40 }, { backgroundColor: vehicle.image }]}>
              <Ionicons name="car-outline" size={40} color="#ffffff" />
            </View>
            <Text style={[styles.stepTitle, { fontSize: 24 }]}>{vehicle.brand} {vehicle.model}</Text>
            <Text style={[styles.stepSubtitle, { fontSize: 18 }]}>Año {vehicle.year}</Text>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Marca:</Text>
              <Text style={styles.summaryValue}>{vehicle.brand}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Modelo:</Text>
              <Text style={styles.summaryValue}>{vehicle.model}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Año:</Text>
              <Text style={styles.summaryValue}>{vehicle.year}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Kilometraje:</Text>
              <Text style={styles.summaryValue}>{vehicle.mileage.toLocaleString()} km</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Registrado:</Text>
              <Text style={styles.summaryValue}>
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Última actualización:</Text>
              <Text style={styles.summaryValue}>
                {new Date(vehicle.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.primaryButton, { flex: 1 }]}
            >
              <Ionicons name="create-outline" size={16} color="#ffffff" />
              <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>Editar Vehículo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.secondaryButton, { flex: 1, backgroundColor: '#fef2f2', borderColor: '#ef4444' }]}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text style={[styles.secondaryButtonText, { marginLeft: 8, color: '#ef4444' }]}>Eliminar Vehículo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Pantalla principal de detalle de vehículo
 */
export const VehicleDetailScreen: React.FC<VehicleDetailScreenProps> = ({
  vehicleId,
  onEdit,
  onDelete
}) => {
  const { getVehicle, deleteVehicle } = useVehicle();
  const { goBack, canGoBack } = useNavigation();

  // Obtener vehículo
  const vehicle = useMemo(() => {
    const foundVehicle = getVehicle(vehicleId);
    vehicleLogger.debug('Vehicle detail loaded', { vehicleId, found: !!foundVehicle });
    return foundVehicle;
  }, [vehicleId, getVehicle]);

  // Manejar edición
  const handleEdit = useCallback(() => {
    if (vehicle) {
      vehicleLogger.info('Edit vehicle requested', { vehicleId: vehicle.id });
      if (onEdit) {
        onEdit(vehicle);
      }
    }
  }, [vehicle, onEdit]);

  // Manejar eliminación
  const handleDelete = useCallback(() => {
    if (!vehicle) return;

    Alert.alert(
      'Eliminar Vehículo',
      `¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              vehicleLogger.info('Deleting vehicle', { vehicleId: vehicle.id });
              await deleteVehicle(vehicle.id);
              vehicleLogger.info('Vehicle deleted successfully', { vehicleId: vehicle.id });
              
              if (onDelete) {
                onDelete();
              } else if (canGoBack()) {
                goBack();
              }
            } catch (error) {
              vehicleLogger.error('Error deleting vehicle', error);
              Alert.alert('Error', 'No se pudo eliminar el vehículo');
            }
          }
        }
      ]
    );
  }, [vehicle, deleteVehicle, onDelete, canGoBack, goBack]);

  // Manejar regreso
  const handleBack = useCallback(() => {
    if (canGoBack()) {
      goBack();
    }
  }, [canGoBack, goBack]);

  // Si no se encuentra el vehículo
  if (!vehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehículo no encontrado</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="car-outline" size={40} color="#9ca3af" />
          </View>
          <Text style={styles.emptyStateTitle}>Vehículo no encontrado</Text>
          <Text style={styles.emptyStateSubtitle}>
            El vehículo que buscas no existe o ha sido eliminado.
          </Text>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Props compartidas
  const sharedProps = {
    vehicle,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onBack: handleBack
  };

  return (
    <AdaptiveLayout
      mobile={() => <VehicleDetailMobile {...sharedProps} />}
      desktop={() => <VehicleDetailWeb {...sharedProps} />}
    />
  );
};

export default VehicleDetailScreen;