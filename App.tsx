import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from './src/navigation/NavigationContainer';
import { Router } from './src/navigation/Router';
import { VehicleProvider } from './src/modules/vehicle-management';
import { defaultNavigationConfig, defaultRouterConfig } from './src/navigation/routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <VehicleProvider userPlan="free">
        <NavigationContainer 
          config={defaultNavigationConfig}
          routerConfig={defaultRouterConfig}
          initialRoute="/"
        />
      </VehicleProvider>
    </SafeAreaProvider>
  );
}