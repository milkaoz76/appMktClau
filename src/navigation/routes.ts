/**
 * Configuración de rutas por defecto para la aplicación
 * Define las rutas disponibles para mobile y web
 */
import React from 'react';
import { AdaptiveRouteConfig, RouterConfig } from '../shared/types/route';
import { AdaptiveNavigationConfig } from '../shared/types/navigation';
import { VehicleModule } from '../modules/vehicle-management';
import { HomeScreen } from '../components/Home';
import { PlaceholderScreen } from '../components/Placeholder';

// Componentes placeholder
const MaintenanceScreen = () => React.createElement(PlaceholderScreen, {
  title: "Mantenimiento",
  description: "El módulo de mantenimiento estará disponible próximamente. Aquí podrás gestionar el plan de mantenimiento de tus vehículos.",
  icon: "build-outline"
});

const MarketplaceScreen = () => React.createElement(PlaceholderScreen, {
  title: "Marketplace",
  description: "El marketplace estará disponible próximamente. Aquí podrás comprar y vender vehículos.",
  icon: "storefront-outline"
});

const ProfileScreen = () => React.createElement(PlaceholderScreen, {
  title: "Perfil",
  description: "La sección de perfil estará disponible próximamente. Aquí podrás gestionar tu cuenta y configuraciones.",
  icon: "person-outline"
});

const MaintenancePlanScreen = () => React.createElement(PlaceholderScreen, {
  title: "Plan de Mantenimiento",
  description: "La planificación de mantenciones estará disponible próximamente.",
  icon: "calendar-outline"
});

const MaintenanceHistoryScreen = () => React.createElement(PlaceholderScreen, {
  title: "Historial de Mantenciones",
  description: "El historial completo de mantenciones estará disponible próximamente.",
  icon: "time-outline"
});

const MaintenanceRemindersScreen = () => React.createElement(PlaceholderScreen, {
  title: "Recordatorios",
  description: "Los recordatorios de mantenimiento estarán disponibles próximamente.",
  icon: "notifications-outline"
});

/**
 * Configuración de rutas adaptativas
 */
export const defaultRoutes: AdaptiveRouteConfig = {
  // Rutas compartidas entre mobile y web
  shared: [
    {
      path: '/',
      component: HomeScreen,
      exact: true,
      meta: {
        title: 'Inicio',
        description: 'Página principal de AutoConnect',
        breadcrumb: 'Inicio'
      }
    },
    {
      path: '/vehicles',
      component: VehicleModule,
      meta: {
        title: 'Vehículos',
        description: 'Gestión de vehículos',
        breadcrumb: 'Vehículos'
      }
    },
    {
      path: '/vehicles/register',
      component: VehicleModule,
      meta: {
        title: 'Registrar Vehículo',
        description: 'Formulario de registro de nuevo vehículo',
        breadcrumb: 'Registrar'
      }
    },
    {
      path: '/vehicles/:id',
      component: VehicleModule,
      meta: {
        title: 'Detalle del Vehículo',
        description: 'Información detallada del vehículo',
        breadcrumb: (params: any) => `Vehículo ${params.id}`
      }
    },
    {
      path: '/vehicles/:id/edit',
      component: VehicleModule,
      meta: {
        title: 'Editar Vehículo',
        description: 'Formulario de edición de vehículo',
        breadcrumb: 'Editar'
      }
    },
    {
      path: '/maintenance',
      component: MaintenanceScreen,
      meta: {
        title: 'Mantenimiento',
        description: 'Centro de mantenimiento',
        breadcrumb: 'Mantenimiento'
      }
    },
    {
      path: '/marketplace',
      component: MarketplaceScreen,
      meta: {
        title: 'Marketplace',
        description: 'Compra y venta de vehículos',
        breadcrumb: 'Marketplace'
      }
    },
    {
      path: '/profile',
      component: ProfileScreen,
      meta: {
        title: 'Perfil',
        description: 'Perfil de usuario',
        breadcrumb: 'Perfil'
      }
    }
  ],

  // Rutas específicas para mobile
  mobile: [
    // Rutas adicionales específicas para mobile si es necesario
  ],

  // Rutas específicas para web
  web: [
    // Subrutas de mantenimiento (más detalladas en web)
    {
      path: '/maintenance/plan',
      component: MaintenancePlanScreen,
      meta: {
        title: 'Plan de Mantenimiento',
        description: 'Planificación de mantenciones',
        breadcrumb: 'Plan'
      }
    },
    {
      path: '/maintenance/history',
      component: MaintenanceHistoryScreen,
      meta: {
        title: 'Historial de Mantenciones',
        description: 'Historial completo de mantenciones',
        breadcrumb: 'Historial'
      }
    },
    {
      path: '/maintenance/reminders',
      component: MaintenanceRemindersScreen,
      meta: {
        title: 'Recordatorios',
        description: 'Recordatorios de mantenimiento',
        breadcrumb: 'Recordatorios'
      }
    }
  ]
};

/**
 * Configuración del router por defecto
 */
export const defaultRouterConfig: RouterConfig = {
  routes: defaultRoutes,
  basePath: '/',
  fallbackRoute: '/',
  notFoundRoute: '/404',
  guards: [],
  middleware: []
};

/**
 * Configuración de navegación adaptativa por defecto
 */
export const defaultNavigationConfig: AdaptiveNavigationConfig = {
  // Configuración para mobile
  mobile: {
    type: 'tabs',
    tabs: [
      {
        id: 'home',
        label: 'Inicio',
        icon: 'home',
        component: HomeScreen
      },
      {
        id: 'vehicles',
        label: 'Vehículos',
        icon: 'car',
        component: VehicleModule
      },
      {
        id: 'maintenance',
        label: 'Mantenimiento',
        icon: 'build',
        component: MaintenanceScreen,
        badge: 2
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: 'storefront',
        component: MarketplaceScreen
      },
      {
        id: 'profile',
        label: 'Perfil',
        icon: 'person',
        component: ProfileScreen
      }
    ]
  },

  // Configuración para web
  web: {
    type: 'sidebar',
    sidebar: {
      width: {
        expanded: 240,
        collapsed: 64
      },
      collapsible: true,
      defaultCollapsed: false,
      items: [
        {
          id: 'home',
          label: 'Inicio',
          icon: 'home',
          path: '/'
        },
        {
          id: 'vehicles',
          label: 'Vehículos',
          icon: 'car',
          path: '/vehicles'
        },
        {
          id: 'maintenance',
          label: 'Mantenimiento',
          icon: 'build',
          path: '/maintenance',
          submenu: [
            {
              id: 'maintenance-plan',
              label: 'Plan de Mantenimiento',
              icon: 'calendar',
              path: '/maintenance/plan'
            },
            {
              id: 'maintenance-history',
              label: 'Historial',
              icon: 'time',
              path: '/maintenance/history'
            },
            {
              id: 'maintenance-reminders',
              label: 'Recordatorios',
              icon: 'notifications',
              path: '/maintenance/reminders'
            }
          ]
        },
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: 'storefront',
          path: '/marketplace'
        },
        {
          id: 'profile',
          label: 'Perfil',
          icon: 'person',
          path: '/profile'
        }
      ]
    },
    topBar: {
      showBreadcrumbs: true,
      showSearch: true,
      showNotifications: true,
      showUserMenu: true,
      actions: []
    }
  },

  // Configuración compartida
  shared: {
    items: [
      {
        id: 'home',
        label: 'Inicio',
        icon: 'home',
        path: '/'
      },
      {
        id: 'vehicles',
        label: 'Vehículos',
        icon: 'car',
        path: '/vehicles'
      },
      {
        id: 'maintenance',
        label: 'Mantenimiento',
        icon: 'build',
        path: '/maintenance'
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: 'storefront',
        path: '/marketplace'
      },
      {
        id: 'profile',
        label: 'Perfil',
        icon: 'person',
        path: '/profile'
      }
    ],
    defaultRoute: '/',
    fallbackRoute: '/'
  }
};

/**
 * Función para crear configuración personalizada de navegación
 */
export const createNavigationConfig = (
  overrides: Partial<AdaptiveNavigationConfig>
): AdaptiveNavigationConfig => {
  return {
    ...defaultNavigationConfig,
    ...overrides,
    mobile: {
      ...defaultNavigationConfig.mobile,
      ...overrides.mobile
    },
    web: {
      ...defaultNavigationConfig.web,
      ...overrides.web
    },
    shared: {
      ...defaultNavigationConfig.shared,
      ...overrides.shared
    }
  };
};

/**
 * Función para crear configuración personalizada de router
 */
export const createRouterConfig = (
  overrides: Partial<RouterConfig>
): RouterConfig => {
  return {
    ...defaultRouterConfig,
    ...overrides,
    routes: {
      ...defaultRouterConfig.routes,
      ...overrides.routes
    }
  };
};