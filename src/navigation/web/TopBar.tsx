/**
 * TopBar - Barra superior para navegación web
 * Incluye breadcrumbs, búsqueda, notificaciones y menú de usuario
 */
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBarConfig, BreadcrumbItem } from '../../shared/types/navigation';
import { navigationLogger } from '../../shared/utils/logger';

/**
 * Props para TopBar
 */
export interface TopBarProps {
  config: TopBarConfig;
  breadcrumbs: BreadcrumbItem[];
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/**
 * Componente de breadcrumbs
 */
interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, onNavigate }) => {
  return (
    <View style={styles.breadcrumbs}>
      {breadcrumbs.map((crumb, index) => (
        <View key={index} style={styles.breadcrumbItem}>
          {index > 0 && (
            <Ionicons 
              name="chevron-forward" 
              size={14} 
              color="#9ca3af" 
              style={styles.breadcrumbSeparator}
            />
          )}
          
          {crumb.path && !crumb.active && onNavigate ? (
            <TouchableOpacity
              onPress={() => onNavigate(crumb.path!)}
              activeOpacity={0.7}
            >
              <Text style={styles.breadcrumbLink}>{crumb.label}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[
              styles.breadcrumbText,
              crumb.active && styles.breadcrumbTextActive
            ]}>
              {crumb.label}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

/**
 * Componente de búsqueda
 */
interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#9ca3af"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => handleSearch('')}
          style={styles.searchClear}
        >
          <Ionicons name="close" size={16} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Componente principal TopBar
 */
export const TopBar: React.FC<TopBarProps> = ({
  config,
  breadcrumbs,
  onToggleSidebar,
  sidebarCollapsed
}) => {
  // Estado para notificaciones
  const [notificationCount] = useState(3); // Ejemplo

  // Log de renderizado
  useMemo(() => {
    navigationLogger.debug('TopBar rendered', {
      breadcrumbsCount: breadcrumbs.length,
      showBreadcrumbs: config.showBreadcrumbs,
      showSearch: config.showSearch,
      sidebarCollapsed
    });
  }, [breadcrumbs.length, config.showBreadcrumbs, config.showSearch, sidebarCollapsed]);

  // Manejar búsqueda
  const handleSearch = useCallback((query: string) => {
    navigationLogger.info('Search performed', { query });
    // Aquí se implementaría la lógica de búsqueda
  }, []);

  // Manejar notificaciones
  const handleNotifications = useCallback(() => {
    navigationLogger.info('Notifications clicked');
    // Aquí se implementaría la lógica de notificaciones
  }, []);

  // Manejar menú de usuario
  const handleUserMenu = useCallback(() => {
    navigationLogger.info('User menu clicked');
    // Aquí se implementaría la lógica del menú de usuario
  }, []);

  return (
    <View style={styles.container}>
      {/* Sección izquierda */}
      <View style={styles.leftSection}>
        {/* Botón de toggle del sidebar */}
        <TouchableOpacity
          style={styles.sidebarToggle}
          onPress={onToggleSidebar}
          activeOpacity={0.7}
          testID="topbar-sidebar-toggle"
        >
          <Ionicons
            name={sidebarCollapsed ? 'menu' : 'menu-outline'}
            size={20}
            color="#6b7280"
          />
        </TouchableOpacity>

        {/* Breadcrumbs */}
        {config.showBreadcrumbs && (
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        )}
      </View>

      {/* Sección central */}
      <View style={styles.centerSection}>
        {config.showSearch && (
          <SearchBar onSearch={handleSearch} />
        )}
      </View>

      {/* Sección derecha */}
      <View style={styles.rightSection}>
        {/* Acciones personalizadas */}
        {config.actions?.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onClick}
            activeOpacity={0.7}
            disabled={action.disabled}
          >
            <Ionicons
              name={action.icon as any}
              size={20}
              color={action.disabled ? '#d1d5db' : '#6b7280'}
            />
          </TouchableOpacity>
        ))}

        {/* Notificaciones */}
        {config.showNotifications && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNotifications}
            activeOpacity={0.7}
            testID="topbar-notifications"
          >
            <View style={styles.notificationContainer}>
              <Ionicons name="notifications-outline" size={20} color="#6b7280" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Menú de usuario */}
        {config.showUserMenu && (
          <TouchableOpacity
            style={styles.userMenu}
            onPress={handleUserMenu}
            activeOpacity={0.7}
            testID="topbar-user-menu"
          >
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={16} color="#ffffff" />
            </View>
            <Ionicons name="chevron-down" size={14} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Estilos para TopBar
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  centerSection: {
    flex: 1,
    alignItems: 'center'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end'
  },
  sidebarToggle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginRight: 16
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  breadcrumbSeparator: {
    marginHorizontal: 8
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#9ca3af'
  },
  breadcrumbTextActive: {
    color: '#1f2937',
    fontWeight: '500'
  },
  breadcrumbLink: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    minWidth: 300,
    maxWidth: 400
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    outlineStyle: 'none' // Para web
  },
  searchClear: {
    marginLeft: 8,
    padding: 2
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft: 8
  },
  notificationContainer: {
    position: 'relative'
  },
  notificationBadge: {
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
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600'
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  }
});

export default TopBar;