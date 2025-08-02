/**
 * MobileHeader - Header para navegación mobile
 * Proporciona navegación hacia atrás y título de pantalla
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Props para MobileHeader
 */
export interface MobileHeaderProps {
  title: string;
  canGoBack?: boolean;
  onGoBack?: () => void;
  badge?: number | string;
  rightActions?: React.ReactNode;
  backgroundColor?: string;
}

/**
 * Componente MobileHeader
 */
export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  canGoBack = false,
  onGoBack,
  badge,
  rightActions,
  backgroundColor = '#ffffff'
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        backgroundColor 
      }
    ]}>
      <View style={styles.header}>
        {/* Botón de regreso */}
        <View style={styles.leftSection}>
          {canGoBack && onGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onGoBack}
              activeOpacity={0.7}
              testID="header-back-button"
            >
              <Ionicons name="arrow-back" size={24} color="#2563eb" />
            </TouchableOpacity>
          )}
        </View>

        {/* Título */}
        <View style={styles.centerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {/* Badge opcional */}
            {badge && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Acciones del lado derecho */}
        <View style={styles.rightSection}>
          {rightActions}
        </View>
      </View>
    </View>
  );
};

/**
 * Estilos para MobileHeader
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }
    })
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start'
  },
  centerSection: {
    flex: 1,
    alignItems: 'center'
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end'
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center'
  },
  headerBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: 8
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default MobileHeader;