/**
 * VehicleDebugger - Componente para debuggear problemas con vehículos
 * Herramientas de desarrollo para verificar el estado de los vehículos
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVehicle } from '@/modules/vehicle-management';
import { useStorageTransaction } from '../../shared/hooks/useStorageData';

export const VehicleDebugger: React.FC = () => {
  const { vehicles, getVehicleCount, deleteVehicle, refreshVehicles, loading, error } = useVehicle();
  const { clearAllData, isTransacting } = useStorageTransaction();
  const [storageVehicles, setStorageVehicles] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [storageStats, setStorageStats] = useState<any>(null);

  // Actualizar información cada segundo
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const saved = await AsyncStorage.getItem('vehicles');
        const parsedVehicles = saved ? JSON.parse(saved) : [];
        setStorageVehicles(parsedVehicles);
        setLastUpdate(new Date().toLocaleTimeString());
        
        // Get basic storage stats
        const keys = ['vehicles', 'maintenanceHistory', 'userPlan', 'onboarding_completed'];
        const keyStats = await Promise.all(
          keys.map(async (key) => {
            try {
              const data = await AsyncStorage.getItem(key);
              return {
                key,
                size: data ? new Blob([data]).size : 0
              };
            } catch {
              return { key, size: 0 };
            }
          })
        );
        
        const totalSize = keyStats.reduce((sum, stat) => sum + stat.size, 0);
        setStorageStats({
          totalKeys: keyStats.filter(stat => stat.size > 0).length,
          totalSize,
          keys: keyStats.filter(stat => stat.size > 0)
        });
      } catch (error) {
        console.error('Error reading storage:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShowState = () => {
    const contextCount = getVehicleCount();
    const contextVehicles = vehicles;
    const storageCount = storageVehicles.length;

    Alert.alert(
      '🔍 Estado de Vehículos',
      `📊 Contexto: ${contextCount} vehículos\n` +
      `💾 Storage: ${storageCount} vehículos\n` +
      `🕐 Última actualización: ${lastUpdate}\n\n` +
      `Contexto IDs: [${contextVehicles.map(v => v.id).join(', ')}]\n` +
      `Storage IDs: [${storageVehicles.map(v => v.id).join(', ')}]`
    );
  };

  const handleForceRefresh = async () => {
    try {
      await refreshVehicles();
      const saved = await AsyncStorage.getItem('vehicles');
      const parsedVehicles = saved ? JSON.parse(saved) : [];
      setStorageVehicles(parsedVehicles);
      setLastUpdate(new Date().toLocaleTimeString());
      Alert.alert('✅ Actualizado', 'Estado refrescado manualmente');
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo actualizar el estado');
    }
  };

  const handleTestDelete = async () => {
    console.log('🧪 handleTestDelete called');
    
    if (vehicles.length === 0) {
      Alert.alert('⚠️ Sin Vehículos', 'No hay vehículos para eliminar');
      return;
    }

    const firstVehicle = vehicles[0];
    
    Alert.alert(
      '🗑️ Prueba de Eliminación',
      `¿Eliminar ${firstVehicle.brand} ${firstVehicle.model}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVehicle(firstVehicle.id);
              await refreshVehicles();
              Alert.alert('✅ Eliminado', 'Vehículo eliminado exitosamente');
            } catch (error) {
              Alert.alert('❌ Error', `Falló la eliminación: ${error instanceof Error ? error.message : error}`);
            }
          }
        }
      ]
    );
  };

  const handleClearStorage = async () => {
    console.log('🧹 handleClearStorage called');
    
    Alert.alert(
      '🧹 Limpiar Storage',
      '¿Eliminar todos los vehículos del storage?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel'
        },
        {
          text: 'Limpiar Vehículos',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🧹 Starting vehicles clear process');
              
              // Eliminar todos los vehículos usando el contexto
              const currentVehicles = [...vehicles];
              
              for (const vehicle of currentVehicles) {
                await deleteVehicle(vehicle.id);
              }
              
              // Forzar refresco
              await refreshVehicles();
              
              Alert.alert('✅ Limpiado', 'Todos los vehículos eliminados');
            } catch (error) {
              console.error('🧹 Clear failed:', error);
              Alert.alert('❌ Error', `No se pudo limpiar: ${error instanceof Error ? error.message : error}`);
            }
          }
        }
      ]
    );
  };

  const handleForceSync = async () => {
    Alert.alert(
      '🔄 Forzar Sincronización',
      '¿Refrescar el contexto desde el storage?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sincronizar',
          onPress: async () => {
            try {
              await refreshVehicles();
              Alert.alert('✅ Sincronizado', 'Contexto actualizado');
            } catch (error) {
              Alert.alert('❌ Error', `No se pudo sincronizar: ${error instanceof Error ? error.message : error}`);
            }
          }
        }
      ]
    );
  };

  const handleDiagnoseSync = async () => {
    console.log('🔍 Starting sync diagnosis...');
    
    try {
      // 1. Verificar AsyncStorage directamente
      const rawStorage = await AsyncStorage.getItem('vehicles');
      const parsedVehicles = rawStorage ? JSON.parse(rawStorage) : [];
      console.log('🔍 Storage vehicles:', parsedVehicles);
      
      // 2. Verificar contexto
      console.log('🔍 Context vehicles:', vehicles);
      console.log('🔍 Context vehicle count:', getVehicleCount());
      console.log('🔍 Context loading:', loading);
      console.log('🔍 Context error:', error);
      
      // 3. Verificar si refreshVehicles funciona
      console.log('🔍 Calling refreshVehicles...');
      await refreshVehicles();
      console.log('🔍 refreshVehicles completed');
      
      // 4. Get storage stats
      console.log('🔍 Storage stats:', storageStats);
      
      // 5. Mostrar diagnóstico
      const diagnosis = `
🔍 DIAGNÓSTICO AVANZADO DE SINCRONIZACIÓN:

📊 Storage (StorageManager):
• Vehículos: ${parsedVehicles.length}
• IDs: [${parsedVehicles.map((v: any) => v.id).join(', ')}]

🧠 Contexto:
• Vehículos: ${vehicles.length}
• IDs: [${vehicles.map(v => v.id).join(', ')}]
• Loading: ${loading ? '⏳' : '✅'}
• Error: ${error || 'Ninguno'}

📈 Estadísticas de Storage:
• Total de claves: ${storageStats?.totalKeys || 0}
• Tamaño total: ${storageStats ? (storageStats.totalSize / 1024).toFixed(2) : 0} KB

🔄 Estado:
• Sincronizado: ${parsedVehicles.length === vehicles.length ? '✅' : '❌'}
• Última actualización: ${lastUpdate}

💡 Recomendación:
${parsedVehicles.length !== vehicles.length ? 
  'Hay desincronización. El nuevo sistema debería resolver esto automáticamente.' : 
  'Todo está sincronizado correctamente con el nuevo sistema de storage.'}
      `;
      
      Alert.alert('🔍 Diagnóstico Completo', diagnosis);
      
    } catch (error) {
      console.error('🔍 Error during diagnosis:', error);
      Alert.alert('❌ Error', `Error en diagnóstico: ${error}`);
    }
  };

  const contextCount = getVehicleCount();
  const storageCount = storageVehicles.length;
  const isOutOfSync = contextCount !== storageCount;

  return (
    <View style={[styles.container, isOutOfSync && styles.containerError]}>
      <View style={styles.header}>
        <Ionicons name="bug" size={20} color="#ef4444" />
        <Text style={styles.title}>🐛 Vehicle Debugger</Text>
        {isOutOfSync && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>⚠️ DESINCRONIZADO</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description}>
        Herramientas para debuggear problemas con la eliminación de vehículos
      </Text>

      {/* Estado actual */}
      <View style={[styles.statusContainer, isOutOfSync && styles.statusContainerError]}>
        <Text style={styles.statusTitle}>📊 Estado Actual:</Text>
        <Text style={[styles.statusText, contextCount !== storageCount && styles.statusTextError]}>
          Contexto: {contextCount} vehículos
        </Text>
        <Text style={[styles.statusText, contextCount !== storageCount && styles.statusTextError]}>
          Storage: {storageCount} vehículos
        </Text>
        <Text style={styles.statusText}>
          Última actualización: {lastUpdate}
        </Text>
        {isOutOfSync && (
          <Text style={styles.errorMessage}>
            ⚠️ PROBLEMA: El contexto y storage no están sincronizados!
          </Text>
        )}
      </View>

      {/* Lista de vehículos */}
      <ScrollView style={styles.vehiclesList}>
        <Text style={styles.sectionTitle}>🚗 Vehículos en Contexto:</Text>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleItem}>
            <Text style={styles.vehicleText}>
              ID: {vehicle.id} - {vehicle.brand} {vehicle.model}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>💾 Vehículos en Storage:</Text>
        {storageVehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleItem}>
            <Text style={styles.vehicleText}>
              ID: {vehicle.id} - {vehicle.brand} {vehicle.model}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleShowState}
          style={[styles.button, styles.infoButton]}
        >
          <Ionicons name="information-circle" size={16} color="#3b82f6" />
          <Text style={styles.infoButtonText}>📊 Ver Estado</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleForceRefresh}
          style={[styles.button, styles.primaryButton]}
        >
          <Ionicons name="refresh" size={16} color="#ffffff" />
          <Text style={styles.primaryButtonText}>🔄 Refrescar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleTestDelete}
          style={[styles.button, styles.warningButton]}
        >
          <Ionicons name="trash" size={16} color="#ffffff" />
          <Text style={styles.warningButtonText}>🧪 Probar Eliminar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleForceSync}
          style={[styles.button, styles.syncButton]}
        >
          <Ionicons name="sync" size={16} color="#ffffff" />
          <Text style={styles.syncButtonText}>🔄 Sincronizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDiagnoseSync}
          style={[styles.button, styles.diagnosticButton]}
        >
          <Ionicons name="medical" size={16} color="#ffffff" />
          <Text style={styles.diagnosticButtonText}>🔍 Diagnosticar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleClearStorage}
          style={[styles.button, styles.dangerButton]}
        >
          <Ionicons name="nuclear" size={16} color="#ffffff" />
          <Text style={styles.dangerButtonText}>🧹 Limpiar Vehículos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            Alert.alert(
              '⚠️ Limpiar TODO',
              '¿Eliminar TODOS los datos de la aplicación? Esto incluye vehículos, configuraciones, onboarding, etc.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar TODO',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await clearAllData();
                      Alert.alert('✅ Completado', 'Todos los datos han sido eliminados');
                    } catch (error) {
                      Alert.alert('❌ Error', `No se pudo limpiar: ${error}`);
                    }
                  }
                }
              ]
            );
          }}
          style={[styles.button, styles.destructiveButton]}
          disabled={isTransacting}
        >
          <Ionicons name="warning" size={16} color="#ffffff" />
          <Text style={styles.destructiveButtonText}>
            {isTransacting ? '⏳ Limpiando...' : '💥 Limpiar TODO'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  containerError: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#dc2626',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  statusContainerError: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  alertBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  alertText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600' as const,
  },
  statusTextError: {
    color: '#dc2626',
    fontWeight: '600' as const,
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600' as const,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#c2410c',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#9a3412',
    marginBottom: 4,
  },
  vehiclesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#dc2626',
    marginTop: 8,
    marginBottom: 8,
  },
  vehicleItem: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  vehicleText: {
    fontSize: 12,
    color: '#7f1d1d',
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -4,
  },
  button: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    margin: 4,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  infoButton: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  infoButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  warningButton: {
    backgroundColor: '#f59e0b',
  },
  warningButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  dangerButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  syncButton: {
    backgroundColor: '#8b5cf6',
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  diagnosticButton: {
    backgroundColor: '#06b6d4',
  },
  diagnosticButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  destructiveButton: {
    backgroundColor: '#dc2626',
  },
  destructiveButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
};

export default VehicleDebugger;