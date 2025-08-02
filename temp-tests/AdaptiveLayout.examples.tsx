/**
 * Ejemplos de uso del componente AdaptiveLayout
 * Este archivo contiene ejemplos prácticos de cómo usar AdaptiveLayout
 */
import React from 'react';
import { AdaptiveLayout, useAdaptiveLayout, withAdaptiveLayout, ConditionalRender } from './AdaptiveLayout';

// Componentes de ejemplo para diferentes plataformas
const MobileHeader = ({ title }: { title: string }) => (
  <header style={{ 
    padding: '10px', 
    backgroundColor: '#2563eb', 
    color: 'white',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '18px', margin: 0 }}>{title}</h1>
  </header>
);

const DesktopHeader = ({ title }: { title: string }) => (
  <header style={{ 
    padding: '20px 40px', 
    backgroundColor: '#1e40af', 
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <h1 style={{ fontSize: '24px', margin: 0 }}>{title}</h1>
    <nav>
      <a href="#" style={{ color: 'white', marginLeft: '20px' }}>Inicio</a>
      <a href="#" style={{ color: 'white', marginLeft: '20px' }}>Vehículos</a>
      <a href="#" style={{ color: 'white', marginLeft: '20px' }}>Perfil</a>
    </nav>
  </header>
);

const MobileVehicleCard = ({ vehicle }: { vehicle: any }) => (
  <div style={{ 
    border: '1px solid #e5e7eb', 
    borderRadius: '8px', 
    padding: '15px',
    margin: '10px 0'
  }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{vehicle.brand} {vehicle.model}</h3>
    <p style={{ margin: '5px 0', fontSize: '14px', color: '#6b7280' }}>Año: {vehicle.year}</p>
    <p style={{ margin: '5px 0', fontSize: '14px', color: '#6b7280' }}>KM: {vehicle.mileage}</p>
    <button style={{ 
      width: '100%', 
      padding: '10px', 
      backgroundColor: '#2563eb', 
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      marginTop: '10px'
    }}>
      Ver Detalles
    </button>
  </div>
);

const DesktopVehicleCard = ({ vehicle }: { vehicle: any }) => (
  <div style={{ 
    border: '1px solid #e5e7eb', 
    borderRadius: '12px', 
    padding: '20px',
    margin: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <div>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{vehicle.brand} {vehicle.model}</h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Año: {vehicle.year}</span>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>KM: {vehicle.mileage}</span>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <button style={{ 
        padding: '8px 16px', 
        backgroundColor: '#f3f4f6', 
        border: '1px solid #d1d5db',
        borderRadius: '6px'
      }}>
        Editar
      </button>
      <button style={{ 
        padding: '8px 16px', 
        backgroundColor: '#2563eb', 
        color: 'white',
        border: 'none',
        borderRadius: '6px'
      }}>
        Ver Detalles
      </button>
    </div>
  </div>
);

// Ejemplo 1: Header adaptativo básico
export const AdaptiveHeaderExample = () => (
  <AdaptiveLayout
    mobile={MobileHeader}
    desktop={DesktopHeader}
    componentProps={{ title: 'AutoConnect' }}
  />
);

// Ejemplo 2: Lista de vehículos adaptativa
export const AdaptiveVehicleListExample = () => {
  const vehicles = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, mileage: '45,000 km' },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2019, mileage: '52,000 km' }
  ];

  return (
    <div>
      <AdaptiveHeaderExample />
      {vehicles.map(vehicle => (
        <AdaptiveLayout
          key={vehicle.id}
          mobile={MobileVehicleCard}
          desktop={DesktopVehicleCard}
          componentProps={{ vehicle }}
        />
      ))}
    </div>
  );
};

// Ejemplo 3: Usando el hook useAdaptiveLayout
export const HookBasedExample = () => {
  const { renderAdaptive, isMobile, breakpoint } = useAdaptiveLayout();

  const MobileLayout = () => (
    <div style={{ padding: '10px' }}>
      <h2>Vista Móvil</h2>
      <p>Breakpoint actual: {breakpoint}</p>
    </div>
  );

  const DesktopLayout = () => (
    <div style={{ padding: '40px', display: 'flex', gap: '20px' }}>
      <aside style={{ width: '200px', backgroundColor: '#f9fafb', padding: '20px' }}>
        <h3>Sidebar</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '5px 0' }}>Inicio</li>
          <li style={{ padding: '5px 0' }}>Vehículos</li>
          <li style={{ padding: '5px 0' }}>Mantenimiento</li>
        </ul>
      </aside>
      <main style={{ flex: 1 }}>
        <h2>Vista Desktop</h2>
        <p>Breakpoint actual: {breakpoint}</p>
      </main>
    </div>
  );

  return (
    <div>
      <p>Es móvil: {isMobile ? 'Sí' : 'No'}</p>
      {renderAdaptive({
        mobile: MobileLayout,
        desktop: DesktopLayout
      })}
    </div>
  );
};

// Ejemplo 4: HOC withAdaptiveLayout
const SimpleButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    style={{ 
      padding: '8px 16px', 
      backgroundColor: '#2563eb', 
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    {label}
  </button>
);

const MobileButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    style={{ 
      width: '100%',
      padding: '12px', 
      backgroundColor: '#2563eb', 
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px'
    }}
  >
    {label}
  </button>
);

const AdaptiveButton = withAdaptiveLayout({
  mobile: MobileButton,
  desktop: SimpleButton
});

export const HOCExample = () => (
  <div style={{ padding: '20px' }}>
    <h3>Botón Adaptativo</h3>
    <AdaptiveButton 
      label="Hacer clic" 
      onClick={() => alert('¡Botón presionado!')} 
    />
  </div>
);

// Ejemplo 5: ConditionalRender
export const ConditionalRenderExample = () => (
  <div style={{ padding: '20px' }}>
    <h3>Renderizado Condicional</h3>
    
    <ConditionalRender condition="mobile">
      <div style={{ 
        backgroundColor: '#dbeafe', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '10px'
      }}>
        <p>Este contenido solo se ve en móvil</p>
      </div>
    </ConditionalRender>

    <ConditionalRender 
      condition="desktop"
      fallback={<p style={{ color: '#6b7280' }}>Contenido no disponible en móvil</p>}
    >
      <div style={{ 
        backgroundColor: '#dcfce7', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '10px'
      }}>
        <p>Este contenido solo se ve en desktop</p>
        <p>Con más espacio para información detallada</p>
      </div>
    </ConditionalRender>

    <ConditionalRender 
      condition={(breakpoint) => breakpoint !== 'mobile'}
    >
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px'
      }}>
        <p>Este contenido se ve en tablet y desktop (no móvil)</p>
      </div>
    </ConditionalRender>
  </div>
);

// Ejemplo 6: Selector personalizado
export const CustomSelectorExample = () => {
  const customSelector = (breakpoint: string, components: any) => {
    // Lógica personalizada: usar mobile para tablet también
    if (breakpoint === 'tablet') {
      return components.mobile;
    }
    return components[breakpoint] || components.shared;
  };

  const MobileTabletView = () => (
    <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '8px' }}>
      <h4>Vista para Móvil y Tablet</h4>
      <p>Este componente se usa tanto en móvil como en tablet</p>
    </div>
  );

  const DesktopView = () => (
    <div style={{ backgroundColor: '#dcfce7', padding: '20px', borderRadius: '12px' }}>
      <h4>Vista para Desktop</h4>
      <p>Este componente solo se usa en desktop</p>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h3>Selector Personalizado</h3>
      <AdaptiveLayout
        mobile={MobileTabletView}
        desktop={DesktopView}
        selector={customSelector}
      />
    </div>
  );
};

// Ejemplo completo que combina varios conceptos
export const CompleteExample = () => (
  <div>
    <AdaptiveHeaderExample />
    <div style={{ padding: '20px' }}>
      <HookBasedExample />
      <HOCExample />
      <ConditionalRenderExample />
      <CustomSelectorExample />
    </div>
  </div>
);