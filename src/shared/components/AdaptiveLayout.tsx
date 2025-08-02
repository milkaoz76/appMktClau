/**
 * AdaptiveLayout - Componente que renderiza diferentes versiones según la plataforma
 * Permite crear interfaces que se adaptan automáticamente a mobile, tablet y desktop
 */
import React, { Suspense, useMemo, useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { RenderableComponent, BaseComponentProps } from '../types/common';
import { adaptiveLogger } from '../utils/logger';

/**
 * Props para el componente AdaptiveLayout
 */
export interface AdaptiveLayoutProps extends BaseComponentProps {
  /** Componente específico para móvil */
  mobile?: RenderableComponent;
  /** Componente específico para tablet */
  tablet?: RenderableComponent;
  /** Componente específico para desktop */
  desktop?: RenderableComponent;
  /** Componente compartido entre todas las plataformas */
  shared?: RenderableComponent;
  /** Componente de fallback si no se encuentra una versión específica */
  fallback?: RenderableComponent;
  /** Componente de loading mientras se cargan componentes lazy */
  loading?: RenderableComponent;
  /** Props que se pasarán a todos los componentes */
  componentProps?: Record<string, any>;
  /** Función para determinar qué componente renderizar (override del comportamiento por defecto) */
  selector?: (breakpoint: string, components: AdaptiveComponents) => RenderableComponent;
}

/**
 * Interfaz interna para organizar los componentes
 */
interface AdaptiveComponents {
  mobile?: RenderableComponent;
  tablet?: RenderableComponent;
  desktop?: RenderableComponent;
  shared?: RenderableComponent;
  fallback?: RenderableComponent;
}

/**
 * Componente de loading por defecto - Compatible con React Native y Web
 */
const DefaultLoadingComponent: React.FC = () => (
  <View style={{ 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  }}>
    <Text>Cargando...</Text>
  </View>
);

/**
 * Componente de fallback por defecto - Compatible con React Native y Web
 */
const DefaultFallbackComponent: React.FC = () => (
  <View style={{ 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20
  }}>
    <Text style={{ color: '#666' }}>
      Componente no disponible para esta plataforma
    </Text>
  </View>
);

/**
 * Función para renderizar un componente de forma segura
 */
const renderComponent = (
  component: RenderableComponent, 
  props?: Record<string, any>
): React.ReactElement | null => {
  if (!component) {
    return null;
  }

  // Si es un elemento React ya renderizado
  if (React.isValidElement(component)) {
    return component;
  }

  // Si es un componente (función o clase)
  if (typeof component === 'function') {
    const Component = component as React.ComponentType<any>;
    return <Component {...props} />;
  }

  return null;
};

/**
 * Función para seleccionar el componente apropiado basado en el breakpoint
 */
const selectComponent = (
  breakpoint: string,
  components: AdaptiveComponents,
  selector?: AdaptiveLayoutProps['selector']
): RenderableComponent => {
  // Si hay un selector personalizado, usarlo
  if (selector) {
    return selector(breakpoint, components);
  }

  const { mobile, tablet, desktop, shared, fallback } = components;

  // Lógica de selección por defecto
  switch (breakpoint) {
    case 'mobile':
      return mobile || shared || fallback || (() => null);
    
    case 'tablet':
      return tablet || desktop || shared || fallback || (() => null);
    
    case 'desktop':
      return desktop || shared || fallback || (() => null);
    
    default:
      return shared || fallback || (() => null);
  }
};

/**
 * AdaptiveLayout - Componente principal
 * 
 * @example
 * ```tsx
 * // Uso básico con componentes específicos
 * <AdaptiveLayout
 *   mobile={MobileComponent}
 *   desktop={DesktopComponent}
 *   fallback={FallbackComponent}
 * />
 * 
 * // Uso con componente compartido
 * <AdaptiveLayout
 *   shared={SharedComponent}
 *   componentProps={{ title: "Mi Título" }}
 * />
 * 
 * // Uso con selector personalizado
 * <AdaptiveLayout
 *   mobile={MobileComponent}
 *   desktop={DesktopComponent}
 *   selector={(breakpoint, components) => {
 *     return breakpoint === 'mobile' ? components.mobile : components.desktop;
 *   }}
 * />
 * ```
 */
export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  mobile,
  tablet,
  desktop,
  shared,
  fallback = DefaultFallbackComponent,
  loading = DefaultLoadingComponent,
  componentProps = {},
  selector,
  children,
  testID,
  style,
  ...restProps
}) => {
  const { breakpoint } = useResponsive();

  // Validar que al menos un componente sea proporcionado
  if (!mobile && !tablet && !desktop && !shared && !fallback) {
    adaptiveLogger.warn('No components provided, using default fallback');
  }

  // Debug logging
  adaptiveLogger.debug(`Rendering for breakpoint: ${breakpoint}`, {
    hasComponents: { mobile: !!mobile, tablet: !!tablet, desktop: !!desktop, shared: !!shared }
  });

  // Organizar componentes - memoizado para evitar re-creación
  const components: AdaptiveComponents = useMemo(() => ({
    mobile,
    tablet,
    desktop,
    shared,
    fallback
  }), [mobile, tablet, desktop, shared, fallback]);

  // Seleccionar el componente apropiado - memoizado
  const selectedComponent = useMemo(() => 
    selectComponent(breakpoint, components, selector),
    [breakpoint, components, selector]
  );

  // Props combinadas que se pasarán al componente - memoizado
  const combinedProps = useMemo(() => ({
    ...componentProps,
    ...restProps,
    children,
    testID,
    style
  }), [componentProps, restProps, children, testID, style]);

  // Renderizar con Suspense para manejar lazy loading
  return (
    <Suspense fallback={renderComponent(loading, combinedProps)}>
      {renderComponent(selectedComponent, combinedProps)}
    </Suspense>
  );
};

/**
 * Hook para usar AdaptiveLayout de forma programática
 * Útil cuando necesitas lógica condicional más compleja
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { renderAdaptive } = useAdaptiveLayout();
 *   
 *   return renderAdaptive({
 *     mobile: <MobileView />,
 *     desktop: <DesktopView />
 *   });
 * };
 * ```
 */
export const useAdaptiveLayout = () => {
  const { breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  const renderAdaptive = (components: AdaptiveComponents) => {
    const selectedComponent = selectComponent(breakpoint, components);
    return renderComponent(selectedComponent);
  };

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    renderAdaptive
  };
};

/**
 * HOC para crear componentes adaptativos
 * Útil para envolver componentes existentes
 * 
 * @example
 * ```tsx
 * const AdaptiveButton = withAdaptiveLayout({
 *   mobile: MobileButton,
 *   desktop: DesktopButton
 * });
 * ```
 */
export const withAdaptiveLayout = (components: AdaptiveComponents) => {
  return (props: any) => (
    <AdaptiveLayout {...components} componentProps={props} />
  );
};

/**
 * Componente para renderizado condicional basado en breakpoint
 * Más simple que AdaptiveLayout para casos básicos
 * 
 * @example
 * ```tsx
 * <ConditionalRender
 *   condition="mobile"
 *   fallback={<DesktopComponent />}
 * >
 *   <MobileComponent />
 * </ConditionalRender>
 * ```
 */
export interface ConditionalRenderProps extends BaseComponentProps {
  condition: 'mobile' | 'tablet' | 'desktop' | ((breakpoint: string) => boolean);
  fallback?: RenderableComponent;
  children: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  condition,
  fallback,
  children,
  ...props
}) => {
  const { breakpoint } = useResponsive();

  const shouldRender = typeof condition === 'function' 
    ? condition(breakpoint)
    : breakpoint === condition;

  if (shouldRender) {
    return <>{children}</>;
  }

  return renderComponent(fallback || (() => null), props);
};

// Exportar tipos para uso externo
// Types are already exported above