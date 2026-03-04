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
                    backgroundColor: 'rgba(15, 23, 42, 0.90)',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.05)',
                    height: 70 + androidBottomPadding,
                    paddingBottom: itemsPaddingBottom + (androidBottomPadding / 2),
                    paddingTop: 12,
                    position: 'absolute',
                    elevation: 0,
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
                        <View className="items-center justify-center -mt-6 bg-red-600 border-[6px] border-slate-900/60 rounded-full w-16 h-16 shadow-2xl shadow-red-600/50 backdrop-blur-md">
                            <Text className="text-xs font-black text-white tracking-widest uppercase">SOS</Text>
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
