/**
 * Sidebar - Barra lateral de navegación para web
 * Implementa navegación colapsable con submenús
 */
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SidebarConfig, NavigationItem } from '../../shared/types/navigation';
import { navigationLogger } from '../../shared/utils/logger';

/**
 * Props para Sidebar
 */
export interface SidebarProps {
  config: SidebarConfig;
  collapsed: boolean;
  currentRoute: string;
  onNavigate: (path: string) => void;
  onToggle: () => void;
}

/**
 * Props para SidebarItem
 */
interface SidebarItemProps {
  item: NavigationItem;
  collapsed: boolean;
  isActive: boolean;
  hasSubmenu: boolean;
  isSubmenuOpen: boolean;
  onNavigate: (path: string) => void;
  onToggleSubmenu: (itemId: string) => void;
  level?: number;
}

/**
 * Componente individual de sidebar
 */
const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed,
  isActive,
  hasSubmenu,
  isSubmenuOpen,
  onNavigate,
  onToggleSubmenu,
  level = 0
}) => {
  const handlePress = useCallback(() => {
    if (hasSubmenu) {
      onToggleSubmenu(item.id);
    } else {
      onNavigate(item.path);
    }
  }, [hasSubmenu, onToggleSubmenu, item.id, onNavigate, item.path]);

  return (
    <View>
      {/* Item principal */}
      <TouchableOpacity
        style={[
          styles.sidebarItem,
          isActive && styles.sidebarItemActive,
          collapsed && styles.sidebarItemCollapsed,
          level > 0 && styles.sidebarItemSubmenu
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        testID={`sidebar-item-${item.id}`}
      >
        <View style={styles.sidebarItemContent}>
          {/* Ícono */}
          <View style={styles.sidebarItemIcon}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isActive ? '#2563eb' : '#6b7280'}
            />
            {/* Badge */}
            {item.badge && (
              <View style={styles.sidebarBadge}>
                <Text style={styles.sidebarBadgeText}>
                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                </Text>
              </View>
            )}
          </View>

          {/* Label (solo si no está colapsado) */}
          {!collapsed && (
            <>
              <Text style={[
                styles.sidebarItemLabel,
                isActive && styles.sidebarItemLabelActive
              ]}>
                {item.label}
              </Text>

              {/* Flecha para submenú */}
              {hasSubmenu && (
                <Ionicons
                  name={isSubmenuOpen ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={isActive ? '#2563eb' : '#9ca3af'}
                  style={styles.submenuArrow}
                />
              )}
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Submenú */}
      {hasSubmenu && !collapsed && isSubmenuOpen && item.submenu && (
        <View style={styles.submenu}>
          {item.submenu.map((subItem) => (
            <SidebarItem
              key={subItem.id}
              item={subItem}
              collapsed={false}
              isActive={subItem.path === item.path} // Comparar con ruta actual
              hasSubmenu={false}
              isSubmenuOpen={false}
              onNavigate={onNavigate}
              onToggleSubmenu={onToggleSubmenu}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * Componente principal Sidebar
 */
export const Sidebar: React.FC<SidebarProps> = ({
  config,
  collapsed,
  currentRoute,
  onNavigate,
  onToggle
}) => {
  // Estado para submenús abiertos
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Manejar toggle de submenú
  const handleToggleSubmenu = useCallback((itemId: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      
      navigationLogger.debug('Submenu toggled', { 
        itemId, 
        isOpen: newSet.has(itemId),
        openSubmenus: Array.from(newSet)
      });
      
      return newSet;
    });
  }, []);

  // Determinar ancho del sidebar
  const sidebarWidth = useMemo(() => {
    return collapsed ? config.width.collapsed : config.width.expanded;
  }, [collapsed, config.width]);

  // Log de cambios
  useMemo(() => {
    navigationLogger.debug('Sidebar rendered', {
      collapsed,
      currentRoute,
      itemsCount: config.items.length,
      openSubmenusCount: openSubmenus.size
    });
  }, [collapsed, currentRoute, config.items.length, openSubmenus.size]);

  return (
    <View style={[styles.container, { width: sidebarWidth }]}>
      {/* Header del sidebar */}
      <View style={styles.sidebarHeader}>
        {!collapsed && (
          <Text style={styles.sidebarTitle}>AutoConnect</Text>
        )}
        
        {/* Botón de toggle */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={onToggle}
          activeOpacity={0.7}
          testID="sidebar-toggle"
        >
          <Ionicons
            name={collapsed ? 'menu' : 'menu-outline'}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>

      {/* Items de navegación */}
      <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
        {config.items.map((item) => {
          const isActive = currentRoute === item.path || 
                          (item.submenu && item.submenu.some(sub => sub.path === currentRoute));
          const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
          const isSubmenuOpen = openSubmenus.has(item.id);

          return (
            <SidebarItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isActive={isActive}
              hasSubmenu={hasSubmenu}
              isSubmenuOpen={isSubmenuOpen}
              onNavigate={onNavigate}
              onToggleSubmenu={handleToggleSubmenu}
            />
          );
        })}
      </ScrollView>

      {/* Footer del sidebar */}
      {!collapsed && (
        <View style={styles.sidebarFooter}>
          <Text style={styles.sidebarFooterText}>
            v1.0.0
          </Text>
        </View>
      )}
    </View>
  );
};

/**
 * Estilos para Sidebar
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 64
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  toggleButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#f9fafb'
  },
  sidebarContent: {
    flex: 1,
    paddingVertical: 8
  },
  sidebarItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    overflow: 'hidden'
  },
  sidebarItemActive: {
    backgroundColor: '#dbeafe'
  },
  sidebarItemCollapsed: {
    alignItems: 'center'
  },
  sidebarItemSubmenu: {
    marginLeft: 16
  },
  sidebarItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minHeight: 44
  },
  sidebarItemIcon: {
    position: 'relative',
    width: 20,
    alignItems: 'center'
  },
  sidebarItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12
  },
  sidebarItemLabelActive: {
    color: '#2563eb',
    fontWeight: '600'
  },
  submenuArrow: {
    marginLeft: 8
  },
  sidebarBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  sidebarBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600'
  },
  submenu: {
    backgroundColor: '#f9fafb'
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center'
  },
  sidebarFooterText: {
    fontSize: 12,
    color: '#9ca3af'
  }
});

export default Sidebar;