/**
 * WebContent - Área de contenido principal para navegación web
 * Maneja el renderizado del contenido basado en la ruta actual
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { navigationLogger } from '../../shared/utils/logger';

/**
 * Props para WebContent
 */
export interface WebContentProps {
  currentRoute: string;
  onRouteChange?: (route: string) => void;
  children?: React.ReactNode;
}

/**
 * Componente de pantalla por defecto
 */
const DefaultScreen: React.FC<{ route: string }> = ({ route }) => {
  const getRouteInfo = (route: string) => {
    const routeMap: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'Inicio',
        description: 'Bienvenido a AutoConnect. Aquí encontrarás un resumen de tus vehículos y actividades recientes.'
      },
      '/vehicles': {
        title: 'Vehículos',
        description: 'Gestiona tu flota de vehículos. Agrega, edita y consulta información de tus automóviles.'
      },
      '/maintenance': {
        title: 'Mantenimiento',
        description: 'Centro de mantenimiento vehicular. Programa y da seguimiento a las mantenciones de tus vehículos.'
      },
      '/maintenance/plan': {
        title: 'Plan de Mantenimiento',
        description: 'Planifica las mantenciones futuras basadas en kilometraje y tiempo.'
      },
      '/maintenance/history': {
        title: 'Historial de Mantenciones',
        description: 'Consulta el historial completo de mantenciones realizadas.'
      },
      '/maintenance/reminders': {
        title: 'Recordatorios',
        description: 'Configura recordatorios para mantenciones próximas.'
      },
      '/marketplace': {
        title: 'Marketplace',
        description: 'Compra y vende vehículos. Encuentra las mejores ofertas del mercado automotriz.'
      },
      '/profile': {
        title: 'Perfil',
        description: 'Gestiona tu perfil de usuario y configuraciones de la aplicación.'
      }
    };

    return routeMap[route] || {
      title: 'Página no encontrada',
      description: `La ruta "${route}" no está disponible actualmente.`
    };
  };

  const { title, description } = getRouteInfo(route);

  return (
    <View style={styles.defaultScreen}>
      <View style={styles.defaultContent}>
        <Text style={styles.defaultTitle}>{title}</Text>
        <Text style={styles.defaultDescription}>{description}</Text>
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            🚧 Esta sección estará disponible próximamente
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Componente principal WebContent
 */
export const WebContent: React.FC<WebContentProps> = ({
  currentRoute,
  onRouteChange,
  children
}) => {
  // Log de cambios de ruta
  useMemo(() => {
    navigationLogger.debug('WebContent route changed', {
      currentRoute,
      hasChildren: !!children
    });
  }, [currentRoute, children]);

  // Renderizar contenido
  const renderContent = () => {
    // Si hay children (contenido personalizado), renderizarlo
    if (children) {
      return children;
    }

    // Renderizar pantalla por defecto basada en la ruta
    return <DefaultScreen route={currentRoute} />;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {renderContent()}
    </ScrollView>
  );
};

/**
 * Estilos para WebContent
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  contentContainer: {
    flexGrow: 1,
    padding: 24
  },
  defaultScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400
  },
  defaultContent: {
    alignItems: 'center',
    maxWidth: 600,
    paddingHorizontal: 20
  },
  defaultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center'
  },
  defaultDescription: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32
  },
  comingSoon: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b'
  },
  comingSoonText: {
    fontSize: 16,
    color: '#92400e',
    fontWeight: '500',
    textAlign: 'center'
  }
});

export default WebContent;