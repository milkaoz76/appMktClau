/**
 * Tests para AdaptiveLayout component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdaptiveLayout, useAdaptiveLayout, withAdaptiveLayout, ConditionalRender } from '../AdaptiveLayout';

// Mock del hook useResponsive
jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: jest.fn()
}));

// Mock del logger
jest.mock('../../utils/logger', () => ({
  adaptiveLogger: {
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

import { useResponsive, ResponsiveValues } from '../../hooks/useResponsive';
const mockUseResponsive = useResponsive as jest.MockedFunction<typeof useResponsive>;

// Componentes de prueba
const MobileComponent = () => <div data-testid="mobile">Mobile Component</div>;
const TabletComponent = () => <div data-testid="tablet">Tablet Component</div>;
const DesktopComponent = () => <div data-testid="desktop">Desktop Component</div>;
const SharedComponent = () => <div data-testid="shared">Shared Component</div>;
const FallbackComponent = () => <div data-testid="fallback">Fallback Component</div>;

describe('AdaptiveLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado por breakpoint', () => {
    it('debe renderizar componente mobile en breakpoint mobile', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(
        <AdaptiveLayout
          mobile={MobileComponent}
          tablet={TabletComponent}
          desktop={DesktopComponent}
        />
      );

      expect(screen.getByTestId('mobile')).toBeInTheDocument();
      expect(screen.queryByTestId('tablet')).not.toBeInTheDocument();
      expect(screen.queryByTestId('desktop')).not.toBeInTheDocument();
    });

    it('debe renderizar componente tablet en breakpoint tablet', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 768,
        height: 1024,
        breakpoint: 'tablet'
      });

      render(
        <AdaptiveLayout
          mobile={MobileComponent}
          tablet={TabletComponent}
          desktop={DesktopComponent}
        />
      );

      expect(screen.getByTestId('tablet')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('desktop')).not.toBeInTheDocument();
    });

    it('debe renderizar componente desktop en breakpoint desktop', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1200,
        height: 800,
        breakpoint: 'desktop'
      });

      render(
        <AdaptiveLayout
          mobile={MobileComponent}
          tablet={TabletComponent}
          desktop={DesktopComponent}
        />
      );

      expect(screen.getByTestId('desktop')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tablet')).not.toBeInTheDocument();
    });
  });

  describe('Fallback logic', () => {
    it('debe usar componente shared si no hay específico para mobile', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(
        <AdaptiveLayout
          shared={SharedComponent}
          desktop={DesktopComponent}
        />
      );

      expect(screen.getByTestId('shared')).toBeInTheDocument();
    });

    it('debe usar desktop para tablet si no hay tablet específico', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        width: 768,
        height: 1024,
        breakpoint: 'tablet'
      });

      render(
        <AdaptiveLayout
          mobile={MobileComponent}
          desktop={DesktopComponent}
        />
      );

      expect(screen.getByTestId('desktop')).toBeInTheDocument();
    });

    it('debe usar fallback si no hay ningún componente apropiado', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(
        <AdaptiveLayout
          desktop={DesktopComponent}
          fallback={FallbackComponent}
        />
      );

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('debe usar fallback por defecto si no se proporciona ninguno', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(<AdaptiveLayout desktop={DesktopComponent} />);

      expect(screen.getByText('Componente no disponible para esta plataforma')).toBeInTheDocument();
    });
  });

  describe('Props y children', () => {
    it('debe pasar props al componente renderizado', () => {
      const ComponentWithProps = ({ title }: { title: string }) => (
        <div data-testid="with-props">{title}</div>
      );

      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(
        <AdaptiveLayout
          mobile={ComponentWithProps}
          componentProps={{ title: 'Test Title' }}
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('debe pasar children al componente renderizado', () => {
      const ComponentWithChildren = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="with-children">{children}</div>
      );

      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      render(
        <AdaptiveLayout mobile={ComponentWithChildren}>
          <span>Child Content</span>
        </AdaptiveLayout>
      );

      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('Selector personalizado', () => {
    it('debe usar selector personalizado cuando se proporciona', () => {
      mockUseResponsive.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
        height: 667,
        breakpoint: 'mobile'
      });

      const customSelector = (breakpoint: string, components: any) => {
        // Selector que siempre devuelve desktop, ignorando el breakpoint
        return components.desktop;
      };

      render(
        <AdaptiveLayout
          mobile={MobileComponent}
          desktop={DesktopComponent}
          selector={customSelector}
        />
      );

      // Aunque estamos en mobile, debe renderizar desktop por el selector personalizado
      expect(screen.getByTestId('desktop')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile')).not.toBeInTheDocument();
    });
  });
});

describe('useAdaptiveLayout hook', () => {
  const TestComponent = () => {
    const { renderAdaptive, breakpoint, isMobile } = useAdaptiveLayout();
    
    return (
      <div>
        <div data-testid="breakpoint">{breakpoint}</div>
        <div data-testid="is-mobile">{isMobile.toString()}</div>
        {renderAdaptive({
          mobile: MobileComponent,
          desktop: DesktopComponent
        })}
      </div>
    );
  };

  it('debe proporcionar información de breakpoint', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      width: 375,
      height: 667,
      breakpoint: 'mobile'
    });

    render(<TestComponent />);

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('mobile');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
  });

  it('debe renderizar componente apropiado con renderAdaptive', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      width: 375,
      height: 667,
      breakpoint: 'mobile'
    });

    render(<TestComponent />);

    expect(screen.getByTestId('mobile')).toBeInTheDocument();
  });
});

describe('withAdaptiveLayout HOC', () => {
  it('debe crear un componente adaptativo', () => {
    const AdaptiveButton = withAdaptiveLayout({
      mobile: MobileComponent,
      desktop: DesktopComponent
    });

    mockUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1200,
      height: 800,
      breakpoint: 'desktop'
    });

    render(<AdaptiveButton />);

    expect(screen.getByTestId('desktop')).toBeInTheDocument();
  });
});

describe('ConditionalRender', () => {
  it('debe renderizar children cuando la condición se cumple', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      width: 375,
      height: 667,
      breakpoint: 'mobile'
    });

    render(
      <ConditionalRender condition="mobile" fallback={FallbackComponent}>
        <div data-testid="conditional-content">Mobile Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('debe renderizar fallback cuando la condición no se cumple', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1200,
      height: 800,
      breakpoint: 'desktop'
    });

    render(
      <ConditionalRender condition="mobile" fallback={FallbackComponent}>
        <div data-testid="conditional-content">Mobile Content</div>
      </ConditionalRender>
    );

    expect(screen.queryByTestId('conditional-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('debe funcionar con condición de función', () => {
    mockUseResponsive.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      width: 375,
      height: 667,
      breakpoint: 'mobile'
    });

    const condition = (breakpoint: string) => breakpoint === 'mobile';

    render(
      <ConditionalRender condition={condition}>
        <div data-testid="conditional-content">Content</div>
      </ConditionalRender>
    );

    expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
  });
});