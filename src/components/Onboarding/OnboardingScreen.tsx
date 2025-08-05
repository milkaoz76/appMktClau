/**
 * OnboardingScreen - Pantalla de onboarding mejorada
 * Componente dedicado para el flujo de introducción de la aplicación
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'car-outline',
    title: 'Bienvenido a AutoConnect',
    subtitle: 'Tu compañero automotriz inteligente',
    description: 'Gestiona todos tus vehículos, mantenciones y documentos en un solo lugar de manera simple y eficiente.',
    color: '#3b82f6'
  },
  {
    id: '2',
    icon: 'shield-checkmark-outline',
    title: 'Registra tus vehículos',
    subtitle: 'Mantén todo organizado',
    description: 'Guarda información completa de tus autos: documentos, seguros, historial de mantenciones y más.',
    color: '#10b981'
  },
  {
    id: '3',
    icon: 'calendar-outline',
    title: 'Nunca olvides una mantención',
    subtitle: 'Recordatorios inteligentes',
    description: 'Recibe notificaciones personalizadas para revisiones técnicas, cambios de aceite y servicios programados.',
    color: '#8b5cf6'
  },
  {
    id: '4',
    icon: 'trending-up-outline',
    title: 'Aumenta el valor de tu auto',
    subtitle: 'Historial completo y confiable',
    description: 'Un registro detallado de mantenciones incrementa el valor de reventa y genera confianza en compradores.',
    color: '#f59e0b'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0']}
      style={{ flex: 1 }}
    >
      {/* Header con indicadores y botón skip */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20
      }}>
        {/* Indicadores de progreso */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentSlide ? currentSlideData.color : '#cbd5e1',
                marginRight: 8,
                opacity: index === currentSlide ? 1 : 0.5
              }}
            />
          ))}
        </View>

        {/* Botón Skip */}
        <TouchableOpacity
          onPress={onSkip}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Text style={{
            color: '#64748b',
            fontSize: 14,
            fontWeight: '500'
          }}>
            Saltar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        {/* Icono */}
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
          shadowColor: currentSlideData.color,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8
        }}>
          <Ionicons 
            name={currentSlideData.icon as any} 
            size={60} 
            color={currentSlideData.color} 
          />
        </View>

        {/* Título */}
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: 12
        }}>
          {currentSlideData.title}
        </Text>

        {/* Subtítulo */}
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: currentSlideData.color,
          textAlign: 'center',
          marginBottom: 20
        }}>
          {currentSlideData.subtitle}
        </Text>

        {/* Descripción */}
        <Text style={{
          fontSize: 16,
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 40
        }}>
          {currentSlideData.description}
        </Text>
      </View>

      {/* Navegación inferior */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40
      }}>
        {/* Botón Anterior */}
        <TouchableOpacity
          onPress={prevSlide}
          disabled={currentSlide === 0}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: currentSlide === 0 ? '#f1f5f9' : 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: currentSlide === 0 ? 0.5 : 1
          }}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentSlide === 0 ? '#94a3b8' : '#475569'} 
          />
        </TouchableOpacity>

        {/* Contador de slides */}
        <Text style={{
          fontSize: 14,
          color: '#64748b',
          fontWeight: '500'
        }}>
          {currentSlide + 1} de {slides.length}
        </Text>

        {/* Botón Siguiente/Comenzar */}
        <TouchableOpacity
          onPress={nextSlide}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: currentSlideData.color,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: currentSlideData.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4
          }}
        >
          <Ionicons 
            name={currentSlide === slides.length - 1 ? "checkmark" : "chevron-forward"} 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};