# 📋 Manual Test Cases - Navigation & UX

## 🎯 Test Execution Instructions

### Prerequisites
1. Clear browser cache and localStorage
2. Open browser developer tools (F12)
3. Navigate to Console tab for logs
4. Open application at `http://localhost:19006`

### Test Environment Setup
```bash
# Start the application
npm start
# or
npx expo start --web
```

### Load Debug Utilities (Optional)
```javascript
// In browser console, load debug utilities
const script = document.createElement('script');
script.src = './tests/debug-navigation-utils.js';
document.head.appendChild(script);

// Or copy-paste the content of debug-navigation-utils.js
// Then use: navDebug.showMenu()
```

---

## 🧪 CRITICAL NAVIGATION TESTS

### Test Case 1: Fresh App Load (First Time User)
**Objective**: Verify app loads correctly for new users

**Preconditions**:
- Clear localStorage: `localStorage.clear()`
- Refresh page

**Steps**:
1. Load application URL
2. Wait for app to fully load (2-3 seconds)

**Expected Results**:
- ✅ App loads without errors
- ✅ Shows onboarding screen with "Bienvenido a AutoConnect"
- ✅ Progress indicators show 4 dots (1 active, 3 inactive)
- ✅ "Saltar" button visible in top right
- ✅ Navigation buttons at bottom

**Console Logs to Verify**:
```
🎯 Verificando estado de onboarding inicial...
📊 Estado AsyncStorage: {hasCompletedOnboarding: null, hasSkippedOnboarding: null}
📱 Primera visita detectada, mostrando onboarding
🔍 Renderizando componente principal...
📱 Renderizando OnboardingScreen
```

---

### Test Case 2: AsyncStorage Conflict Resolution
**Objective**: Verify app handles conflicting AsyncStorage states correctly

**Preconditions**:
```javascript
localStorage.setItem('onboarding_completed', 'true');
localStorage.setItem('onboarding_skipped', 'true');
```

**Steps**:
1. Set both conflicting states in localStorage
2. Refresh page
3. Wait for app to load

**Expected Results**:
- ✅ App resolves conflict automatically
- ✅ Shows FirstRegistration screen (AutoTrack)
- ✅ `onboarding_skipped` is removed from localStorage
- ✅ Only `onboarding_completed: 'true'` remains

**Console Logs to Verify**:
```
🔧 Conflicto detectado: ambos estados son true, resolviendo...
✅ Conflicto resuelto: removido onboarding_skipped
✅ Usuario ya completó el onboarding - navegando a FirstRegistration
🚀 Renderizando FirstRegistration
```

---

### Test Case 3: Complete Onboarding Flow
**Objective**: Verify full onboarding navigation works correctly

**Preconditions**:
- Clear localStorage: `localStorage.clear()`
- Refresh page

**Steps**:
1. Wait for onboarding to load
2. Click "Siguiente" button 3 times (navigate through slides)
3. On 4th slide, click "Comenzar ahora"
4. Verify navigation to FirstRegistration

**Expected Results**:
- ✅ Each "Siguiente" click advances to next slide
- ✅ Progress indicators update correctly
- ✅ Last slide shows "Comenzar ahora" instead of "Siguiente"
- ✅ "Comenzar ahora" navigates to FirstRegistration
- ✅ AsyncStorage shows `onboarding_completed: 'true'`

**Console Logs to Verify**:
```
➡️ Navegando desde slide 0 de 3
📄 Cambiando a slide 1
...
🎉 Última diapositiva alcanzada - completando onboarding
🎯 Iniciando proceso de completar onboarding...
✅ Onboarding completado - navegando a FirstRegistration
```

---

### Test Case 4: Skip Onboarding Flow
**Objective**: Verify skip functionality works correctly

**Preconditions**:
- Clear localStorage: `localStorage.clear()`
- Refresh page

**Steps**:
1. Wait for onboarding to load
2. Click "Saltar" button in top right
3. Verify navigation to FirstRegistration

**Expected Results**:
- ✅ "Saltar" button immediately navigates to FirstRegistration
- ✅ AsyncStorage shows `onboarding_skipped: 'true'`
- ✅ Shows AutoTrack welcome screen

**Console Logs to Verify**:
```
⏭️ Usuario omitió el onboarding - navegando a FirstRegistration
🚀 Renderizando FirstRegistration
🏠 WelcomeScreen renderizada
```

---

### Test Case 5: Register Vehicle Button Functionality
**Objective**: Verify the main registration button works

**Preconditions**:
```javascript
localStorage.setItem('onboarding_completed', 'true');
```
- Refresh page

**Steps**:
1. Wait for FirstRegistration to load
2. Verify "Registrar mi primer vehículo" button is visible
3. Click the button
4. Verify navigation to registration screen

**Expected Results**:
- ✅ Button is visible and clickable
- ✅ Button click triggers navigation
- ✅ Shows "Pantalla de Registro" screen
- ✅ "¡Funciona! El botón navegó correctamente." message appears

**Console Logs to Verify**:
```
🚗 Botón "Registrar mi primer vehículo" presionado
🔄 Cambiando currentScreen de "welcome" a "register"
✅ Navegación a pantalla de registro iniciada
🖥️ Renderizando pantalla: register
📝 Renderizando pantalla de registro
```

---

### Test Case 6: Back Navigation
**Objective**: Verify back navigation works correctly

**Preconditions**:
- Complete Test Case 5 first (be on register screen)

**Steps**:
1. From registration screen, click "Volver a Welcome"
2. Verify navigation back to welcome screen

**Expected Results**:
- ✅ "Volver a Welcome" button works
- ✅ Returns to AutoTrack welcome screen
- ✅ "Registrar mi primer vehículo" button visible again

**Console Logs to Verify**:
```
🖥️ Renderizando pantalla: welcome
🏠 Renderizando WelcomeScreen
```

---

### Test Case 7: Return User Experience
**Objective**: Verify returning users skip onboarding

**Preconditions**:
```javascript
localStorage.setItem('onboarding_completed', 'true');
```

**Steps**:
1. Refresh page
2. Wait for app to load

**Expected Results**:
- ✅ Skips onboarding completely
- ✅ Goes directly to FirstRegistration
- ✅ Shows AutoTrack welcome screen

**Console Logs to Verify**:
```
✅ Usuario ya completó el onboarding - navegando a FirstRegistration
🚀 Renderizando FirstRegistration
```

---

## 🔧 ERROR HANDLING TESTS

### Test Case 8: Corrupted AsyncStorage
**Objective**: Verify app handles corrupted data gracefully

**Preconditions**:
```javascript
localStorage.setItem('vehicles', 'invalid-json-data');
localStorage.setItem('onboarding_completed', 'true');
```

**Steps**:
1. Refresh page
2. Wait for app to load

**Expected Results**:
- ✅ App doesn't crash
- ✅ Loads with default values
- ✅ Shows FirstRegistration normally

**Console Logs to Verify**:
```
❌ Error al cargar datos persistidos: [error details]
✅ Carga de datos persistidos completada
```

---

### Test Case 9: Multiple Rapid Button Clicks
**Objective**: Verify app handles rapid clicking without issues

**Preconditions**:
- Be on FirstRegistration welcome screen

**Steps**:
1. Rapidly click "Registrar mi primer vehículo" 5-10 times
2. Wait for navigation to complete

**Expected Results**:
- ✅ App doesn't crash or freeze
- ✅ Navigates to register screen only once
- ✅ No duplicate navigation attempts

---

### Test Case 10: No AsyncStorage Support
**Objective**: Verify app works without localStorage

**Preconditions**:
```javascript
// Temporarily disable localStorage
const originalLocalStorage = localStorage;
delete window.localStorage;
```

**Steps**:
1. Refresh page
2. Wait for app to load
3. Restore localStorage: `window.localStorage = originalLocalStorage;`

**Expected Results**:
- ✅ App loads with default state
- ✅ Shows onboarding (first-time experience)
- ✅ No crashes or errors

---

## 🎨 STYLE AND UX TESTS

### Test Case 11: No Deprecation Warnings
**Objective**: Verify no style deprecation warnings appear

**Steps**:
1. Open browser console
2. Clear console logs
3. Refresh page
4. Wait for full app load
5. Navigate through different screens

**Expected Results**:
- ✅ No "shadow*" deprecation warnings
- ✅ No "pointerEvents" deprecation warnings
- ✅ All styles render correctly

**Console Warnings to Avoid**:
```
❌ "shadow*" style props are deprecated. Use "boxShadow"
❌ props.pointerEvents is deprecated. Use style.pointerEvents
```

---

### Test Case 12: Visual Consistency
**Objective**: Verify visual elements render correctly

**Steps**:
1. Navigate through all screens
2. Check button styles and interactions
3. Verify gradients and shadows work

**Expected Results**:
- ✅ Buttons have proper shadows/gradients
- ✅ Icons display correctly
- ✅ Colors and spacing consistent
- ✅ Responsive layout works

---

## 🚀 PERFORMANCE TESTS

### Test Case 13: Load Time Performance
**Objective**: Verify app loads within acceptable time

**Steps**:
1. Clear cache and localStorage
2. Open browser performance tab
3. Refresh page and measure load time

**Expected Results**:
- ✅ Initial load < 3 seconds
- ✅ Navigation transitions < 300ms
- ✅ Button responses < 100ms

---

### Test Case 14: Memory Usage
**Objective**: Verify no memory leaks during navigation

**Steps**:
1. Open browser memory profiler
2. Navigate between screens multiple times
3. Force garbage collection
4. Check memory usage

**Expected Results**:
- ✅ Memory usage remains stable
- ✅ No significant memory leaks
- ✅ Garbage collection works properly

---

## 📱 CROSS-PLATFORM TESTS

### Test Case 15: Web Browser Compatibility
**Objective**: Verify app works across different browsers

**Browsers to Test**:
- Chrome/Chromium
- Safari
- Firefox
- Edge

**Steps**:
1. Test complete navigation flow in each browser
2. Verify localStorage works
3. Check style rendering

**Expected Results**:
- ✅ Consistent behavior across browsers
- ✅ No browser-specific errors
- ✅ Styles render correctly

---

## 📊 TEST EXECUTION CHECKLIST

### Before Testing
- [ ] Clear browser cache
- [ ] Clear localStorage
- [ ] Open developer tools
- [ ] Start application server

### During Testing
- [ ] Monitor console logs
- [ ] Check for error messages
- [ ] Verify expected behaviors
- [ ] Note any unexpected issues

### After Testing
- [ ] Document any failures
- [ ] Capture screenshots of issues
- [ ] Record console error logs
- [ ] Test on different devices/browsers

---

## 🐛 ISSUE REPORTING TEMPLATE

When reporting issues found during testing:

```markdown
**Test Case**: [Test Case Name]
**Browser**: [Browser and Version]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Console Logs**: [Relevant console output]
**Screenshots**: [If applicable]
**Severity**: [Critical/High/Medium/Low]
```

---

## ✅ SUCCESS CRITERIA

All tests pass when:
- ✅ No critical navigation failures
- ✅ No deprecation warnings in console
- ✅ All buttons function correctly
- ✅ AsyncStorage conflicts resolved automatically
- ✅ Performance meets benchmarks
- ✅ Cross-platform compatibility confirmed
- ✅ Error handling works gracefully
- ✅ User experience is smooth and intuitive

---

## 🐛 DEBUGGING UTILITIES

### Quick Reset Commands (Browser Console)

```javascript
// Load debug utilities first
navDebug.showMenu()

// Quick scenarios
navDebug.testScenario('fresh')     // Reset to first visit
navDebug.testScenario('completed') // Set as completed user
navDebug.testScenario('skipped')   // Set as skipped user
navDebug.testScenario('conflict')  // Create conflicting states
navDebug.testScenario('force')     // Force show onboarding

// Manual state management
navDebug.showCurrentState()        // Show current AsyncStorage
navDebug.resetToFirstVisit()       // Clean reset
navDebug.forceOnboarding()         // Force onboarding next load
```

### In-App Debug Buttons

La aplicación ahora incluye botones de debugging temporales en la pantalla principal:

- **🧹 Limpiar Todo**: Limpia AsyncStorage y resetea la app
- **🔄 Forzar Onboarding**: Configura para mostrar onboarding en próxima carga

### Testing Workflow Recomendado

1. **Cargar debug utilities**: `navDebug.showMenu()`
2. **Ver estado actual**: `navDebug.showCurrentState()`
3. **Ejecutar escenario**: `navDebug.testScenario('fresh')`
4. **Probar navegación**: Seguir casos de prueba manuales
5. **Repetir con diferentes escenarios**

---

*Manual Test Cases v1.1 - AutoConnect Navigation & UX*
*Last Updated: January 2025*
*Added: Debug utilities and in-app testing buttons*