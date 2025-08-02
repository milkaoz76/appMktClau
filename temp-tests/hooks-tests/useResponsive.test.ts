/**
 * Tests para useResponsive hook
 * Verifica el comportamiento en diferentes tamaños de pantalla
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { Dimensions } from 'react-native';
import { 
  useResponsive, 
  useBreakpoint, 
  useIsMobile, 
  useIsDesktop,
  getBreakpointFromWidth,
  BREAKPOINTS 
} from '../useResponsive';

// Mock de Dimensions para testing
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn()
  }
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

describe('useResponsive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Detección de breakpoints', () => {
    it('debe detectar mobile correctamente', () => {
      // Simular pantalla móvil (375px)
      mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(667);
    });

    it('debe detectar tablet correctamente', () => {
      // Simular pantalla tablet (768px)
      mockDimensions.get.mockReturnValue({ width: 768, height: 1024 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.width).toBe(768);
      expect(result.current.height).toBe(1024);
    });

    it('debe detectar desktop correctamente', () => {
      // Simular pantalla desktop (1200px)
      mockDimensions.get.mockReturnValue({ width: 1200, height: 800 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.breakpoint).toBe('desktop');
      expect(result.current.width).toBe(1200);
      expect(result.current.height).toBe(800);
    });
  });

  describe('Casos límite de breakpoints', () => {
    it('debe manejar el límite mobile-tablet (767px)', () => {
      mockDimensions.get.mockReturnValue({ width: 767, height: 1024 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());
      expect(result.current.breakpoint).toBe('mobile');
    });

    it('debe manejar el límite tablet-desktop (1023px)', () => {
      mockDimensions.get.mockReturnValue({ width: 1023, height: 768 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());
      expect(result.current.breakpoint).toBe('tablet');
    });

    it('debe manejar el inicio de desktop (1024px)', () => {
      mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });
      mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

      const { result } = renderHook(() => useResponsive());
      expect(result.current.breakpoint).toBe('desktop');
    });
  });

  describe('Cambios de dimensiones', () => {
    it('debe actualizar cuando cambian las dimensiones', () => {
      let dimensionListener: ((dimensions: any) => void) | null = null;
      
      // Mock inicial - mobile
      mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
      mockDimensions.addEventListener.mockImplementation((event, callback) => {
        dimensionListener = callback;
        return { remove: jest.fn() };
      });

      const { result } = renderHook(() => useResponsive());

      // Verificar estado inicial
      expect(result.current.isMobile).toBe(true);
      expect(result.current.width).toBe(375);

      // Simular cambio a desktop
      act(() => {
        if (dimensionListener) {
          dimensionListener({ window: { width: 1200, height: 800 } });
        }
      });

      // Verificar que se actualizó
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.width).toBe(1200);
      expect(result.current.height).toBe(800);
    });
  });

  describe('Cleanup de listeners', () => {
    it('debe limpiar el listener al desmontar (React Native 0.65+)', () => {
      const removeMock = jest.fn();
      mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
      mockDimensions.addEventListener.mockReturnValue({ remove: removeMock });

      const { unmount } = renderHook(() => useResponsive());

      unmount();

      expect(removeMock).toHaveBeenCalled();
    });

    it('debe limpiar el listener al desmontar (versiones anteriores)', () => {
      const listenerMock = jest.fn();
      mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
      mockDimensions.addEventListener.mockReturnValue(listenerMock);

      const { unmount } = renderHook(() => useResponsive());

      unmount();

      expect(listenerMock).toHaveBeenCalled();
    });
  });
});

describe('useBreakpoint', () => {
  it('debe retornar solo el breakpoint actual', () => {
    mockDimensions.get.mockReturnValue({ width: 768, height: 1024 });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe('tablet');
  });
});

describe('useIsMobile', () => {
  it('debe retornar true para mobile', () => {
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('debe retornar false para desktop', () => {
    mockDimensions.get.mockReturnValue({ width: 1200, height: 800 });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});

describe('useIsDesktop', () => {
  it('debe retornar true para desktop', () => {
    mockDimensions.get.mockReturnValue({ width: 1200, height: 800 });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
  });

  it('debe retornar false para mobile', () => {
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });
});

describe('getBreakpointFromWidth', () => {
  it('debe retornar mobile para anchos pequeños', () => {
    expect(getBreakpointFromWidth(320)).toBe('mobile');
    expect(getBreakpointFromWidth(767)).toBe('mobile');
  });

  it('debe retornar tablet para anchos medios', () => {
    expect(getBreakpointFromWidth(768)).toBe('tablet');
    expect(getBreakpointFromWidth(1023)).toBe('tablet');
  });

  it('debe retornar desktop para anchos grandes', () => {
    expect(getBreakpointFromWidth(1024)).toBe('desktop');
    expect(getBreakpointFromWidth(1920)).toBe('desktop');
  });
});

describe('BREAKPOINTS', () => {
  it('debe tener los breakpoints correctos definidos', () => {
    expect(BREAKPOINTS.mobile).toEqual({ min: 0, max: 767 });
    expect(BREAKPOINTS.tablet).toEqual({ min: 768, max: 1023 });
    expect(BREAKPOINTS.desktop).toEqual({ min: 1024, max: Infinity });
  });
});