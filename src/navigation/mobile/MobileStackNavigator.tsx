/**
 * MobileStackNavigator - Navegación por stack para mobile
 * Maneja la navegación interna dentro de cada tab
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '../NavigationContext';
import { TabConfig } from '../../shared/types/navigation';
import { navigationLogger } from '../../shared/utils/logger';
import { MobileHeader } from './MobileHeader';
import { RouteRenderer } from '../RouteRenderer';
import { RouterConfig } from '../../shared/types/route';

/**
 * Props para MobileStackNavigator
 */
export interface MobileStackNavigatorProps {
  activeTab: TabConfig;
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
  routerConfig?: RouterConfig;
}

/**
 * Componente de pantalla por defecto para tabs sin contenido
 */
const DefaultTabScreen: React.FC<{ tab: TabConfig }> = ({ tab }) => {
  return (
    <View style={styles.defaultScreen}>
      <View style={styles.defaultContent}>
        <Text style={styles.defaultTitle}>
          {tab.label}
        </Text>
        <Text style={styles.defaultSubtitle}>
          Esta sección estará disponible próximamente
        </Text>
      </View>
    </View>
  );
};

/**
 * MobileStackNavigator principal
 */
export const MobileStackNavigator: React.FC<MobileStackNavigatorProps> = ({
  activeTab,
  onRouteChange,
  children,
  routerConfig
}) => {
  const { state, goBack, canGoBack } = useNavigation();

  // Log de cambios de tab activo
  useMemo(() => {
    navigationLogger.debug('MobileStackNavigator tab changed', {
      activeTabId: activeTab.id,
      activeTabLabel: activeTab.label,
      currentRoute: state.currentRoute,
      canGoBack: canGoBack()
    });
  }, [activeTab.id, activeTab.label, state.currentRoute, canGoBack]);

  // Determinar si mostrar el header
  const showHeader = useMemo(() => {
    // Mostrar header si estamos en una ruta anidada o si se puede ir hacia atrás
    return state.currentRoute !== `/${activeTab.id}` || canGoBack();
  }, [state.currentRoute, activeTab.id, canGoBack]);

  // Renderizar el contenido del tab
  const renderTabContent = () => {
    // Si hay children (contenido personalizado), renderizarlo
    if (children) {
      return children;
    }

    // Si hay configuración de router, usar RouteRenderer
    if (routerConfig) {
      return <RouteRenderer config={routerConfig} />;
    }

    // Si el tab tiene un componente definido, renderizarlo
    if (activeTab.component) {
      const TabComponent = activeTab.component;
      return <TabComponent />;
    }

    // Renderizar pantalla por defecto
    return <DefaultTabScreen tab={activeTab} />;
  };

  return (
    <View style={styles.container}>
      {/* Header opcional */}
      {showHeader && (
        <MobileHeader
          title={activeTab.label}
          canGoBack={canGoBack()}
          onGoBack={goBack}
          badge={activeTab.badge}
        />
      )}

      {/* Contenido del tab */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

/**
 * Estilos para MobileStackNavigator
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1
  },
  defaultScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  defaultContent: {
    alignItems: 'center',
    maxWidth: 300
  },
  defaultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  defaultSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24
  }
});

export default MobileStackNavigator;