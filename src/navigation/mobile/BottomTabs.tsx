/**
 * BottomTabs - Componente de pestañas inferiores para navegación mobile
 * Implementa el patrón de navegación por tabs en la parte inferior
 */
import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabConfig } from '../../shared/types/navigation';
import { navigationLogger } from '../../shared/utils/logger';

/**
 * Props para BottomTabs
 */
export interface BottomTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Componente individual de tab
 */
interface TabItemProps {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`tab-${tab.id}`}
    >
      <View style={styles.tabIconContainer}>
        <Ionicons
          name={tab.icon as any}
          size={24}
          color={isActive ? '#2563eb' : '#6b7280'}
        />
        {/* Badge de notificación */}
        {tab.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Componente principal BottomTabs
 */
export const BottomTabs: React.FC<BottomTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const insets = useSafeAreaInsets();

  // Calcular altura del tab bar con safe area
  const tabBarHeight = useMemo(() => {
    const baseHeight = 60;
    const safeAreaBottom = insets.bottom;
    return baseHeight + safeAreaBottom;
  }, [insets.bottom]);

  // Log cuando cambia el tab activo
  useMemo(() => {
    navigationLogger.debug('BottomTabs rendered', {
      activeTab,
      tabsCount: tabs.length,
      tabBarHeight
    });
  }, [activeTab, tabs.length, tabBarHeight]);

  return (
    <View style={[styles.container, { height: tabBarHeight, paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTab}
            onPress={() => {
              navigationLogger.debug('Tab pressed', { tabId: tab.id, wasActive: tab.id === activeTab });
              onTabChange(tab.id);
            }}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * Estilos para BottomTabs
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      }
    })
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minHeight: 44 // Mínimo para accesibilidad
  },
  tabItemActive: {
    backgroundColor: '#dbeafe'
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: 4
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center'
  },
  tabLabelActive: {
    color: '#2563eb',
    fontWeight: '600'
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default BottomTabs;