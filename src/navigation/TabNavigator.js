import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View, Text, Platform } from 'react-native';

// Screens
import SafetyMapScreen from '../SafetyMapScreen';
import IncidentReportScreen from '../IncidentReportScreen';
import CommunityFeedScreen from '../CommunityFeedScreen';
import PanicButtonScreen from '../PanicButtonScreen';
import UserProfileScreen from '../UserProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { colorScheme } = useColorScheme();
    const isDark = true; // Force Dark Mode for Premium App aesthetic

    // Extra padding for Android devices with soft nav bars
    const androidBottomPadding = Platform.OS === 'android' ? 16 : 0;
    const itemsPaddingBottom = Platform.OS === 'android' ? 12 : 8;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#101622' : '#f6f6f8',
                    borderTopColor: isDark ? '#1f2937' : '#e2e8f0',
                    height: 60 + androidBottomPadding, // Increase total height
                    paddingBottom: itemsPaddingBottom + (androidBottomPadding / 2), // Lift items up
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#dc2626',
                tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Mapa') {
                        iconName = 'map';
                    } else if (route.name === 'Reportar') {
                        iconName = 'add-alert';
                    } else if (route.name === 'SOS') {
                        iconName = 'sos';
                        // Special styling for SOS maybe?
                    } else if (route.name === 'Perfil') {
                        iconName = 'person';
                    }

                    return <MaterialIcons name={iconName} size={28} color={color} />;
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            })}
        >
            <Tab.Screen name="Mapa" component={SafetyMapScreen} />
            <Tab.Screen
                name="Comunidade"
                component={CommunityFeedScreen}
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="forum" size={24} color={color} />
                }}
            />
            <Tab.Screen name="Reportar" component={IncidentReportScreen} />
            <Tab.Screen
                name="SOS"
                component={PanicButtonScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className="items-center justify-center -mt-8 bg-red-600 border-4 border-slate-900 rounded-full w-14 h-14 shadow-lg top-1">
                            <Text className="text-xs font-bold text-white">SOS</Text>
                        </View>
                    ),
                    tabBarLabel: () => null // Hide label for the big button
                }}
            />
            <Tab.Screen name="Perfil" component={UserProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
