import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

// Navigators & Screens
import TabNavigator from './TabNavigator';
import UserSettingsScreen from '../UserSettingsScreen';
import PersonalDataScreen from '../PersonalDataScreen';
import SecuritySettingsScreen from '../SecuritySettingsScreen';
import EmergencyContactsScreen from '../EmergencyContactsScreen';
import AdminDashboardScreen from '../AdminDashboardScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const { colorScheme } = useColorScheme();

    const AppTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <NavigationContainer theme={AppTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Main Tab Flow */}
                <Stack.Screen name="MainTabs" component={TabNavigator} />

                {/* Stack Screens (Pushed on top) */}
                <Stack.Screen name="Settings" component={UserSettingsScreen} />
                <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
                <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
                <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;
