/**
 * MainApp - Componente que contiene la aplicación principal con navegación
 * Se renderiza solo cuando no hay onboarding activo
 */
import React from 'react';
import { NavigationContainer } from '../../navigation/NavigationContainer';
import { defaultNavigationConfig, defaultRouterConfig } from '../../navigation/routes';

interface MainAppProps {
  children?: React.ReactNode;
}

export const MainApp: React.FC<MainAppProps> = ({ children }) => {
  return (
    <NavigationContainer 
      config={defaultNavigationConfig}
      routerConfig={defaultRouterConfig}
      initialRoute="/"
    >
      {children}
    </NavigationContainer>
  );
};

export default MainApp;