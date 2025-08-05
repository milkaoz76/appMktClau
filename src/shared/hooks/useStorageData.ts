/**
 * useStorageData - Hook para manejo de datos de storage
 * Proporciona funcionalidades para limpiar y gestionar AsyncStorage
 */
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '../utils/logger';

const storageLogger = createLogger('StorageData');

export interface StorageTransaction {
  clearAllData: () => Promise<void>;
  isTransacting: boolean;
}

/**
 * Hook para transacciones de storage
 */
export const useStorageTransaction = (): StorageTransaction => {
  const [isTransacting, setIsTransacting] = useState(false);

  const clearAllData = useCallback(async () => {
    if (isTransacting) {
      storageLogger.warn('Transaction already in progress');
      return;
    }

    setIsTransacting(true);
    
    try {
      storageLogger.info('Starting clear all data operation');
      
      // Obtener todas las claves
      const keys = await AsyncStorage.getAllKeys();
      storageLogger.debug('Found keys to clear', { keys, count: keys.length });
      
      // Limpiar todas las claves
      await AsyncStorage.multiRemove(keys);
      
      storageLogger.info('All data cleared successfully', { clearedKeys: keys.length });
    } catch (error) {
      storageLogger.error('Error clearing all data', error);
      throw new Error('No se pudo limpiar todos los datos');
    } finally {
      setIsTransacting(false);
    }
  }, [isTransacting]);

  return {
    clearAllData,
    isTransacting
  };
};

/**
 * Hook para operaciones básicas de storage
 */
export const useStorageData = () => {
  const [loading, setLoading] = useState(false);

  const getItem = useCallback(async (key: string) => {
    try {
      setLoading(true);
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      storageLogger.error(`Error getting item ${key}`, error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const setItem = useCallback(async (key: string, value: any) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      storageLogger.debug(`Item ${key} saved successfully`);
    } catch (error) {
      storageLogger.error(`Error saving item ${key}`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(key);
      storageLogger.debug(`Item ${key} removed successfully`);
    } catch (error) {
      storageLogger.error(`Error removing item ${key}`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllKeys = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      storageLogger.error('Error getting all keys', error);
      return [];
    }
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
    getAllKeys,
    loading
  };
};

export default useStorageData;