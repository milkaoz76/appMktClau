# 🔧 Especificaciones Técnicas - AutoConnect

## 🏗️ Arquitectura General

### 📱 Stack Tecnológico
```
┌─────────────────────────────────────┐
│           React Native              │
│              + Expo                 │
├─────────────────────────────────────┤
│           TypeScript                │
├─────────────────────────────────────┤
│    AsyncStorage    │   Ionicons     │
│  LinearGradient    │   Dimensions   │
├─────────────────────────────────────┤
│    iOS    │   Android   │    Web    │
└─────────────────────────────────────┘
```

### 🎯 Principios Arquitectónicos
1. **Separación de Responsabilidades**: Lógica, presentación y estilos separados
2. **Composición sobre Herencia**: Hooks personalizados y componentes reutilizables
3. **Tipado Fuerte**: TypeScript en toda la aplicación
4. **Inmutabilidad**: Estados manejados de forma inmutable
5. **Persistencia Local**: Sin dependencias de servidor

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── WelcomeBanner/
│   │   ├── WelcomeBanner.tsx          # Componente de presentación
│   │   ├── useWelcomeBanner.ts        # Hook con lógica de negocio
│   │   ├── welcomeBanner.styles.ts    # Estilos React Native
│   │   └── index.ts                   # Barrel export
│   └── FirstRegistration/
│       ├── FirstRegistration.tsx      # Componente de presentación
│       ├── useFirstRegistration.ts    # Hook con lógica de negocio
│       ├── firstRegistration.styles.ts # Estilos React Native
│       └── index.ts                   # Barrel export
├── App.tsx                            # Componente raíz
└── index.ts                          # Entry point
```

## 🧩 Componentes Principales

### 1. **WelcomeBanner** - Sistema de Onboarding

#### 1.1 Arquitectura del Componente
```typescript
// Separación clara de responsabilidades
WelcomeBanner.tsx           // Presentación pura
useWelcomeBanner.ts         // Lógica de negocio
welcomeBanner.styles.ts     // Estilos React Native
```

#### 1.2 Hook de Lógica de Negocio
```typescript
interface UseWelcomeBannerReturn {
  // Estados
  currentSlide: number;
  showOnboarding: boolean;
  isCompleted: boolean;
  showWelcomeBanner: boolean;
  showFirstRegistration: boolean;
  slides: SlideData[];
  
  // Acciones
  nextSlide: () => void;
  prevSlide: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  dismissWelcomeBanner: () => void;
  handleVehicleRegistration: () => void;
  handleLaterRegistration: () => void;
  setShowFirstRegistration: (show: boolean) => void;
}
```

#### 1.3 Gestión de Estado
```typescript
// Estados principales
const [currentSlide, setCurrentSlide] = useState<number>(0);
const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
const [isCompleted, setIsCompleted] = useState<boolean>(false);
const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
const [showFirstRegistration, setShowFirstRegistration] = useState<boolean>(false);
```

#### 1.4 Persistencia con AsyncStorage
```typescript
// Verificación de estado inicial
const hasCompletedOnboarding = await AsyncStorage.getItem('onboarding_completed');
const hasSkippedOnboarding = await AsyncStorage.getItem('onboarding_skipped');

// Guardado de estados
await AsyncStorage.setItem('onboarding_completed', 'true');
await AsyncStorage.setItem('onboarding_skipped', 'true');
```

### 2. **FirstRegistration** - Gestión de Vehículos

#### 2.1 Arquitectura del Componente
```typescript
// Estructura modular
FirstRegistration.tsx           // Componente principal + subcomponentes
useFirstRegistration.ts         // Hook con toda la lógica
firstRegistration.styles.ts     // Estilos organizados por secciones
```

#### 2.2 Tipos de Datos
```typescript
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
}

interface FormData {
  brand: string;
  model: string;
  year: string;
  mileage: string;
}

interface MaintenanceTask {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface MaintenanceHistory {
  [vehicleId: string]: {
    [taskId: string]: {
      completed: boolean;
      date: string;
      mileage: number;
    };
  };
}
```

#### 2.3 Plan de Mantenimiento
```typescript
const maintenancePlan: { [key: string]: MaintenanceTask[] } = {
  '10000': [
    { 
      id: 'oil_10k', 
      name: 'Cambio de aceite', 
      icon: React.createElement(Ionicons, { name: 'water-outline', size: 16, color: '#2563eb' }),
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    // ... más tareas
  ],
  // ... más hitos
};
```

## 🎨 Sistema de Estilos

### 1. **Arquitectura de Estilos**
```typescript
// Estructura organizada por secciones
interface WelcomeBannerStyles {
  // Contenedores principales
  container: ViewStyle;
  onboardingContainer: ViewStyle;
  
  // Componentes específicos
  bannerContainer: ViewStyle;
  progressIndicators: ViewStyle;
  
  // Textos
  title: TextStyle;
  subtitle: TextStyle;
  
  // Utilidades
  flexRow: ViewStyle;
  alignCenter: ViewStyle;
}
```

### 2. **Compatibilidad React Native**
```typescript
// ❌ Estilos web no compatibles
minHeight: '100vh'           // No funciona en RN
background: 'linear-gradient' // No funciona en RN
gap: 16                      // No funciona en RN
transition: 'all 0.3s'      // No funciona en RN

// ✅ Estilos React Native compatibles
minHeight: screenHeight      // Usando Dimensions
backgroundColor: '#color'    // Color sólido
marginRight: 16             // Espaciado manual
// Sin transiciones          // RN maneja animaciones diferente
```

### 3. **Responsive Design**
```typescript
import { Dimensions } from 'react-native';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Uso en estilos
container: {
  minHeight: screenHeight,
  width: screenWidth,
}
```

## 🔄 Gestión de Estado y Navegación

### 1. **Flujo de Estados**
```typescript
// Estado inicial (primera visita)
{
  showOnboarding: true,
  showFirstRegistration: false,
  isCompleted: false
}

// Después de "Saltar"
{
  showOnboarding: false,
  showFirstRegistration: true,
  isCompleted: false
}

// Después de "Comenzar ahora"
{
  showOnboarding: false,
  showFirstRegistration: true,
  isCompleted: true
}
```

### 2. **Navegación Condicional**
```typescript
const AutoMarketplaceOnboarding: React.FC = () => {
  const { isCompleted, showOnboarding, showFirstRegistration, setShowFirstRegistration } = useWelcomeBanner();

  // Prioridad de renderizado
  if (showFirstRegistration) {
    return <FirstRegistration onGoBack={() => setShowFirstRegistration(false)} />;
  }
  
  if (isCompleted && !showFirstRegistration) {
    return <RegistrationScreen />;
  }
  
  if (showOnboarding) {
    return <OnboardingScreen />;
  }
  
  return <MainAppScreen />;
};
```

## 💾 Persistencia de Datos

### 1. **AsyncStorage Schema**
```typescript
// Claves de almacenamiento
'onboarding_completed'     // 'true' | null
'onboarding_skipped'       // 'true' | null
'welcome_banner_dismissed' // 'true' | null
'vehicles'                 // JSON string de Vehicle[]
'maintenanceHistory'       // JSON string de MaintenanceHistory
'userPlan'                 // 'free' | 'premium'
```

### 2. **Operaciones de Persistencia**
```typescript
// Guardar datos
const saveVehicles = async (vehicles: Vehicle[]) => {
  await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
};

// Cargar datos
const loadVehicles = async (): Promise<Vehicle[]> => {
  const saved = await AsyncStorage.getItem('vehicles');
  return saved ? JSON.parse(saved) : [];
};

// Limpiar datos
const clearOnboardingState = async () => {
  await AsyncStorage.multiRemove([
    'onboarding_completed',
    'onboarding_skipped',
    'welcome_banner_dismissed'
  ]);
};
```

## 🎯 Validaciones y Tipos

### 1. **Validación de Formularios**
```typescript
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  
  // Validación de marca
  if (!formData.brand) newErrors.brand = 'Selecciona una marca';
  
  // Validación de modelo
  if (!formData.model) newErrors.model = 'Ingresa el modelo';
  
  // Validación de año
  if (!formData.year) {
    newErrors.year = 'Ingresa el año';
  } else if (parseInt(formData.year) < 1900 || parseInt(formData.year) > currentYear) {
    newErrors.year = `El año debe estar entre 1900 y ${currentYear}`;
  }
  
  // Validación de kilometraje
  if (!formData.mileage) {
    newErrors.mileage = 'Ingresa el kilometraje';
  } else if (parseInt(formData.mileage) < 0) {
    newErrors.mileage = 'El kilometraje no puede ser negativo';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 2. **TypeScript Interfaces**
```typescript
// Tipos estrictos para mejor desarrollo
export interface SlideData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export interface UseWelcomeBannerReturn {
  // Todos los tipos definidos explícitamente
  currentSlide: number;
  showOnboarding: boolean;
  // ... resto de propiedades tipadas
}
```

## 🎨 Componentes de UI

### 1. **Iconos Consistentes**
```typescript
// Uso de Ionicons para compatibilidad multiplataforma
import { Ionicons } from '@expo/vector-icons';

// Creación programática para hooks
const icon = React.createElement(Ionicons, { 
  name: 'car-outline', 
  size: 80, 
  color: '#3b82f6' 
});

// Uso directo en JSX
<Ionicons name="chevron-forward" size={20} color="#ffffff" />
```

### 2. **Gradientes**
```typescript
import { LinearGradient } from 'expo-linear-gradient';

// Gradiente horizontal
<LinearGradient
  colors={['#2563eb', '#4f46e5']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.gradientButton}
>
  <Text>Botón con Gradiente</Text>
</LinearGradient>
```

### 3. **Modales Nativos**
```typescript
import { Modal } from 'react-native';

<Modal
  visible={showModal}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Contenido del modal */}
    </View>
  </View>
</Modal>
```

## 🔧 Configuración del Proyecto

### 1. **package.json - Dependencias**
```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-native-async-storage/async-storage": "1.18.2",
    "expo": "~49.0.0",
    "expo-linear-gradient": "~12.3.0",
    "react": "18.2.0",
    "react-native": "0.72.10"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3",
    "eslint": "^8.44.0",
    "prettier": "^2.8.8"
  }
}
```

### 2. **tsconfig.json - TypeScript**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}
```

### 3. **app.json - Expo Configuration**
```json
{
  "expo": {
    "name": "mktCarClau",
    "slug": "mktCarClau",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "newArchEnabled": true
  }
}
```

## 🧪 Testing y Debugging

### 1. **Logs de Debug**
```typescript
// Sistema de logging consistente
console.log('🎯 Verificando estado de onboarding inicial...');
console.log('✅ Usuario ya completó el onboarding anteriormente');
console.log('❌ Error al verificar estado del onboarding:', error);
console.log('🚀 Renderizando FirstRegistration');
```

### 2. **Verificación de Tipos**
```bash
# Verificación sin compilación
npx tsc --noEmit

# Linting
npx eslint src --ext .ts,.tsx

# Formateo
npx prettier --write "**/*.{js,jsx,ts,tsx,json,md}"
```

## 🚀 Build y Deployment

### 1. **Comandos de Desarrollo**
```bash
# Desarrollo
npm start              # Expo con QR code
npm run android        # Android específico
npm run ios           # iOS específico
npm run web           # Web en localhost

# Verificaciones
npm run type-check    # TypeScript
npm run lint          # ESLint
npm run format        # Prettier
```

### 2. **Plataformas de Deploy**
- **iOS**: App Store (requiere Apple Developer Account)
- **Android**: Google Play Store
- **Web**: Netlify, Vercel, GitHub Pages

## 📊 Performance y Optimización

### 1. **Optimizaciones Implementadas**
- **Lazy Loading**: Componentes cargados bajo demanda
- **Memoización**: React.memo para componentes puros
- **AsyncStorage**: Operaciones asíncronas no bloqueantes
- **Tipado Estricto**: Prevención de errores en runtime

### 2. **Métricas de Performance**
- **Bundle Size**: Optimizado para Expo
- **Startup Time**: < 3 segundos en dispositivos promedio
- **Memory Usage**: Gestión eficiente de estado
- **Battery Impact**: Mínimo uso de recursos

---

*Especificaciones técnicas v1.0 - AutoConnect*
*Última actualización: Enero 2025*