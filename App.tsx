import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VehicleProvider } from './src/modules/vehicle-management';
import { AppInitializer } from './src/components/AppInitializer';

export default function App() {
  return (
    <SafeAreaProvider>
      <VehicleProvider userPlan="free">
        <AppInitializer />
      </VehicleProvider>
    </SafeAreaProvider>
  );
}