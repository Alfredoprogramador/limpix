import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ClientTabParamList, ClientStackParamList } from '../types';
import { COLORS } from '../constants/colors';

// Screens
import { HomeScreen } from '../screens/client/HomeScreen';
import { ProviderListScreen } from '../screens/client/ProviderListScreen';
import { ProviderProfileScreen } from '../screens/client/ProviderProfileScreen';
import { BookingScreen } from '../screens/client/BookingScreen';
import { HistoryScreen } from '../screens/client/HistoryScreen';
import { ReviewScreen } from '../screens/client/ReviewScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator<ClientStackParamList>();
const Tab = createBottomTabNavigator<ClientTabParamList>();

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { borderTopColor: COLORS.divider, paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Histórico"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📋</Text> }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export function ClientNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ClientTabs" component={ClientTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProviderList" component={ProviderListScreen} options={{ title: 'Prestadores' }} />
      <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: 'Perfil do Prestador' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Agendar Serviço' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Avaliar Serviço' }} />
    </Stack.Navigator>
  );
}
