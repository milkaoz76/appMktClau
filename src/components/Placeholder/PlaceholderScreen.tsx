/**
 * PlaceholderScreen - Componente temporal para rutas no implementadas
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@/navigation/NavigationContext';

interface PlaceholderScreenProps {
  title: string;
  description: string;
  icon?: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  description,
  icon = 'construct-outline'
}) => {
  const { goBack, canGoBack } = useNavigation();

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f8fafc',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        <Ionicons name={icon as any} size={40} color="#6b7280" />
      </View>
      
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 12
      }}>
        {title}
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24
      }}>
        {description}
      </Text>
      
      {canGoBack() && (
        <TouchableOpacity
          onPress={goBack}
          style={{
            backgroundColor: '#2563eb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Ionicons name="arrow-back" size={16} color="#ffffff" />
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 8
          }}>
            Volver
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PlaceholderScreen;