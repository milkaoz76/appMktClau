/**
 * Comprehensive Navigation & UX Test Suite
 * Tests all critical navigation flows and button functionality
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:19006',
  timeout: 10000,
  retries: 3
};

// Test utilities
class NavigationTester {
  constructor() {
    this.results = [];
    this.currentTest = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    
    if (this.currentTest) {
      this.currentTest.logs.push(logEntry);
    }
  }

  startTest(testName) {
    this.currentTest = {
      name: testName,
      startTime: Date.now(),
      logs: [],
      status: 'running'
    };
    this.log(`Starting test: ${testName}`, 'test');
  }

  endTest(passed, error = null) {
    if (!this.currentTest) return;
    
    this.currentTest.endTime = Date.now();
    this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
    this.currentTest.status = passed ? 'passed' : 'failed';
    this.currentTest.error = error;
    
    this.results.push(this.currentTest);
    this.log(`Test ${passed ? 'PASSED' : 'FAILED'}: ${this.currentTest.name} (${this.currentTest.duration}ms)`, passed ? 'pass' : 'fail');
    
    if (error) {
      this.log(`Error: ${error.message}`, 'error');
    }
    
    this.currentTest = null;
  }

  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        this.log(`Found element: ${selector}`);
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Element not found: ${selector}`);
  }

  async clickElement(selector) {
    const element = await this.waitForElement(selector);
    element.click();
    this.log(`Clicked element: ${selector}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for navigation
  }

  async verifyText(selector, expectedText) {
    const element = await this.waitForElement(selector);
    const actualText = element.textContent.trim();
    if (actualText.includes(expectedText)) {
      this.log(`Text verified: "${expectedText}" found in "${actualText}"`);
      return true;
    }
    throw new Error(`Text mismatch. Expected: "${expectedText}", Found: "${actualText}"`);
  }

  async clearAsyncStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
      this.log('AsyncStorage cleared');
    }
  }

  async setAsyncStorageItem(key, value) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      this.log(`AsyncStorage set: ${key} = ${value}`);
    }
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;
    
    console.log('\n' + '='.repeat(60));
    console.log('NAVIGATION & UX TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} (${Math.round(passed/total*100)}%)`);
    console.log(`Failed: ${failed} (${Math.round(failed/total*100)}%)`);
    console.log('='.repeat(60));
    
    this.results.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error.message}`);
      }
    });
    
    console.log('='.repeat(60));
    return { total, passed, failed, results: this.results };
  }
}

// Test Suite Implementation
class NavigationTestSuite {
  constructor() {
    this.tester = new NavigationTester();
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Navigation & UX Test Suite');
    console.log('Testing URL:', TEST_CONFIG.baseUrl);
    
    try {
      // Critical Navigation Tests
      await this.testInitialAppLoad();
      await this.testAsyncStorageConflictResolution();
      await this.testOnboardingNavigation();
      await this.testSkipOnboardingNavigation();
      await this.testFirstRegistrationNavigation();
      await this.testButtonFunctionality();
      await this.testBackNavigation();
      
      // Edge Case Tests
      await this.testCorruptedAsyncStorage();
      await this.testMultipleRapidClicks();
      await this.testNavigationWithoutAsyncStorage();
      
      // Performance Tests
      await this.testNavigationPerformance();
      await this.testMemoryLeaks();
      
      // Cross-Platform Tests (Web specific)
      await this.testWebCompatibility();
      await this.testStyleWarnings();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
    
    return this.tester.generateReport();
  }

  async testInitialAppLoad() {
    this.tester.startTest('Initial App Load');
    try {
      await this.tester.clearAsyncStorage();
      
      // Reload page to simulate fresh start
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Should show onboarding on first load
      await this.tester.verifyText('div', 'Bienvenido a AutoConnect');
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testAsyncStorageConflictResolution() {
    this.tester.startTest('AsyncStorage Conflict Resolution');
    try {
      // Set conflicting states
      await this.tester.setAsyncStorageItem('onboarding_completed', 'true');
      await this.tester.setAsyncStorageItem('onboarding_skipped', 'true');
      
      // Reload to trigger conflict resolution
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Should resolve to FirstRegistration (completed takes priority)
      await this.tester.verifyText('div', 'AutoTrack');
      
      // Verify skipped state was removed
      const skippedState = window.localStorage.getItem('onboarding_skipped');
      if (skippedState !== null) {
        throw new Error('onboarding_skipped should have been removed');
      }
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testOnboardingNavigation() {
    this.tester.startTest('Complete Onboarding Navigation');
    try {
      await this.tester.clearAsyncStorage();
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Navigate through onboarding slides
      for (let i = 0; i < 3; i++) {
        await this.tester.clickElement('button:contains("Siguiente")');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Click "Comenzar ahora" on last slide
      await this.tester.clickElement('button:contains("Comenzar ahora")');
      
      // Should navigate to FirstRegistration
      await this.tester.verifyText('div', 'AutoTrack');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testSkipOnboardingNavigation() {
    this.tester.startTest('Skip Onboarding Navigation');
    try {
      await this.tester.clearAsyncStorage();
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Click "Saltar" button
      await this.tester.clickElement('button:contains("Saltar")');
      
      // Should navigate to FirstRegistration
      await this.tester.verifyText('div', 'AutoTrack');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testFirstRegistrationNavigation() {
    this.tester.startTest('FirstRegistration Screen Navigation');
    try {
      // Ensure we're in FirstRegistration
      await this.tester.setAsyncStorageItem('onboarding_completed', 'true');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Should show welcome screen
      await this.tester.verifyText('div', 'AutoTrack');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testButtonFunctionality() {
    this.tester.startTest('Register Vehicle Button Functionality');
    try {
      // Ensure we're in FirstRegistration welcome screen
      await this.tester.setAsyncStorageItem('onboarding_completed', 'true');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Click "Registrar mi primer vehículo" button
      await this.tester.clickElement('button:contains("Registrar mi primer vehículo")');
      
      // Should navigate to register screen
      await this.tester.verifyText('div', 'Pantalla de Registro');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testBackNavigation() {
    this.tester.startTest('Back Navigation Functionality');
    try {
      // Navigate to register screen first
      await this.testButtonFunctionality();
      
      // Click back button
      await this.tester.clickElement('button:contains("Volver a Welcome")');
      
      // Should return to welcome screen
      await this.tester.verifyText('div', 'AutoTrack');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testCorruptedAsyncStorage() {
    this.tester.startTest('Corrupted AsyncStorage Handling');
    try {
      // Set invalid JSON data
      await this.tester.setAsyncStorageItem('vehicles', 'invalid-json');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // App should still load without crashing
      await this.tester.verifyText('div', 'AutoConnect');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testMultipleRapidClicks() {
    this.tester.startTest('Multiple Rapid Button Clicks');
    try {
      await this.tester.setAsyncStorageItem('onboarding_completed', 'true');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Rapidly click the register button multiple times
      const button = await this.tester.waitForElement('button:contains("Registrar mi primer vehículo")');
      for (let i = 0; i < 5; i++) {
        button.click();
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Should still navigate correctly (not crash)
      await this.tester.verifyText('div', 'Pantalla de Registro');
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testNavigationWithoutAsyncStorage() {
    this.tester.startTest('Navigation Without AsyncStorage');
    try {
      // Disable localStorage to simulate AsyncStorage failure
      const originalLocalStorage = window.localStorage;
      delete window.localStorage;
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Should fallback to default state (onboarding)
      await this.tester.verifyText('div', 'Bienvenido a AutoConnect');
      
      // Restore localStorage
      window.localStorage = originalLocalStorage;
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testNavigationPerformance() {
    this.tester.startTest('Navigation Performance');
    try {
      await this.tester.setAsyncStorageItem('onboarding_completed', 'true');
      
      const startTime = performance.now();
      
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await this.tester.waitForElement('button:contains("Registrar mi primer vehículo")');
      
      const loadTime = performance.now() - startTime;
      
      if (loadTime > 3000) {
        throw new Error(`Load time too slow: ${loadTime}ms`);
      }
      
      this.tester.log(`Load time: ${loadTime}ms`);
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testMemoryLeaks() {
    this.tester.startTest('Memory Leak Detection');
    try {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      // Perform multiple navigation cycles
      for (let i = 0; i < 5; i++) {
        await this.tester.clearAsyncStorage();
        if (typeof window !== 'undefined') {
          window.location.reload();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      this.tester.log(`Memory increase: ${memoryIncrease} bytes`);
      
      // Allow for some memory increase but flag excessive growth
      if (memoryIncrease > 10 * 1024 * 1024) { // 10MB threshold
        throw new Error(`Potential memory leak detected: ${memoryIncrease} bytes`);
      }
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testWebCompatibility() {
    this.tester.startTest('Web Platform Compatibility');
    try {
      // Test that web-specific features work
      if (typeof window === 'undefined') {
        throw new Error('Not running in web environment');
      }
      
      // Test localStorage (AsyncStorage equivalent)
      window.localStorage.setItem('test', 'value');
      const value = window.localStorage.getItem('test');
      if (value !== 'value') {
        throw new Error('localStorage not working');
      }
      
      // Test CSS box-shadow support
      const testElement = document.createElement('div');
      testElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      if (!testElement.style.boxShadow) {
        throw new Error('boxShadow not supported');
      }
      
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }

  async testStyleWarnings() {
    this.tester.startTest('Style Deprecation Warnings');
    try {
      // Monitor console for deprecation warnings
      const originalWarn = console.warn;
      const warnings = [];
      
      console.warn = (...args) => {
        warnings.push(args.join(' '));
        originalWarn.apply(console, args);
      };
      
      // Trigger app load
      if (typeof window !== 'undefined') {
        window.location.reload();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Restore console.warn
      console.warn = originalWarn;
      
      // Check for specific deprecation warnings
      const shadowWarnings = warnings.filter(w => w.includes('shadow') && w.includes('deprecated'));
      const pointerWarnings = warnings.filter(w => w.includes('pointerEvents') && w.includes('deprecated'));
      
      if (shadowWarnings.length > 0) {
        throw new Error(`Shadow deprecation warnings found: ${shadowWarnings.length}`);
      }
      
      if (pointerWarnings.length > 0) {
        throw new Error(`PointerEvents deprecation warnings found: ${pointerWarnings.length}`);
      }
      
      this.tester.log(`Total warnings checked: ${warnings.length}`);
      this.tester.endTest(true);
    } catch (error) {
      this.tester.endTest(false, error);
    }
  }
}

// Export for use in browser console or test runner
if (typeof window !== 'undefined') {
  window.NavigationTestSuite = NavigationTestSuite;
  window.runNavigationTests = async () => {
    const suite = new NavigationTestSuite();
    return await suite.runAllTests();
  };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NavigationTestSuite, NavigationTester };
}

console.log('🧪 Navigation Test Suite loaded. Run window.runNavigationTests() in browser console to execute.');