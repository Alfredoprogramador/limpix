import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ProviderTabParamList } from '../types';
import { COLORS } from '../constants/colors';

// Screens
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { ProviderScheduleScreen } from '../screens/provider/ProviderScheduleScreen';
import { ProviderProfileEditScreen } from '../screens/provider/ProviderProfileEditScreen';

const Tab = createBottomTabNavigator<ProviderTabParamList>();

export function ProviderNavigator() {
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
        name="Dashboard"
        component={ProviderHomeScreen}
        options={{
          tabBarLabel: 'Painel',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={ProviderScheduleScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProviderProfileEditScreen}
        options={{
          tabBarLabel: 'Meu Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🛠️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
