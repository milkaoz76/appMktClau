/**
 * Ejemplo de uso del sistema de navegación adaptativa
 * Demuestra cómo implementar la navegación en una aplicación
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  NavigationContainer,
  Router,
  Route,
  Switch,
  useRouter,
  useNavigation,
  defaultNavigationConfig,
  defaultRouterConfig
} from './index';

/**
 * Componente de ejemplo para la página de inicio
 */
const HomeScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { state } = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.subtitle}>Bienvenido a AutoConnect</Text>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Ruta actual: {state.currentRoute}</Text>
        <Text style={styles.infoText}>Módulo activo: {state.currentModule}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigate('/vehicles')}
        >
          <Text style={styles.buttonText}>Ir a Vehículos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigate('/maintenance')}
        >
          <Text style={styles.buttonText}>Ir a Mantenimiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Componente de ejemplo para la página de vehículos
 */
const VehiclesScreen: React.FC = () => {
  const { navigate, goBack, canGoBack } = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Vehículos</Text>
      <Text style={styles.subtitle}>Gestiona tu flota de vehículos</Text>
      
      <View style={styles.actions}>
        {canGoBack() && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={goBack}
          >
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigate('/maintenance')}
        >
          <Text style={styles.buttonText}>Ver Mantenimiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Componente de ejemplo para la página de mantenimiento
 */
const MaintenanceScreen: React.FC = () => {
  const { navigate, goBack, canGoBack } = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mantenimiento</Text>
      <Text style={styles.subtitle}>Centro de mantenimiento vehicular</Text>
      
      <View style={styles.actions}>
        {canGoBack() && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={goBack}
          >
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigate('/maintenance/plan')}
        >
          <Text style={styles.buttonText}>Ver Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Componente de ejemplo para el plan de mantenimiento
 */
const MaintenancePlanScreen: React.FC = () => {
  const { goBack, canGoBack } = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Plan de Mantenimiento</Text>
      <Text style={styles.subtitle}>Planifica las mantenciones de tus vehículos</Text>
      
      <View style={styles.actions}>
        {canGoBack() && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={goBack}
          >
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Configuración de rutas personalizada para el ejemplo
 */
const exampleRouterConfig = {
  ...defaultRouterConfig,
  routes: {
    ...defaultRouterConfig.routes,
    shared: [
      {
        path: '/',
        component: HomeScreen,
        exact: true,
        meta: {
          title: 'Inicio',
          breadcrumb: 'Inicio'
        }
      },
      {
        path: '/vehicles',
        component: VehiclesScreen,
        meta: {
          title: 'Vehículos',
          breadcrumb: 'Vehículos'
        }
      },
      {
        path: '/maintenance',
        component: MaintenanceScreen,
        exact: true,
        meta: {
          title: 'Mantenimiento',
          breadcrumb: 'Mantenimiento'
        }
      },
      {
        path: '/maintenance/plan',
        component: MaintenancePlanScreen,
        meta: {
          title: 'Plan de Mantenimiento',
          breadcrumb: 'Plan'
        }
      }
    ]
  }
};

/**
 * Componente principal del ejemplo
 */
export const NavigationExample: React.FC = () => {
  return (
    <NavigationContainer
      config={defaultNavigationConfig}
      initialRoute="/"
      onRouteChange={(route) => {
        console.log('Route changed to:', route);
      }}
    >
      <Router config={exampleRouterConfig}>
        <Switch>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/vehicles" component={VehiclesScreen} />
          <Route path="/maintenance/plan" component={MaintenancePlanScreen} />
          <Route path="/maintenance" component={MaintenanceScreen} />
        </Switch>
      </Router>
    </NavigationContainer>
  );
};

/**
 * Estilos para el ejemplo
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center'
  },
  info: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    alignSelf: 'stretch'
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb'
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default NavigationExample;