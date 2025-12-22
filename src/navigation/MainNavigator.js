import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../context/AuthContext';

// Navigators & Screens
import TabNavigator from './TabNavigator';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import UserSettingsScreen from '../UserSettingsScreen';
import PersonalDataScreen from '../PersonalDataScreen';
import SecuritySettingsScreen from '../SecuritySettingsScreen';
import EmergencyContactsScreen from '../EmergencyContactsScreen';
import AdminDashboardScreen from '../AdminDashboardScreen';
import AdminLoginScreen from '../AdminLoginScreen';
import LevelsRewardsScreen from '../LevelsRewardsScreen';
import SafeRouteScreen from '../SafeRouteScreen';
import ReferralScreen from '../ReferralScreen';
import SafetyTipsScreen from '../SafetyTipsScreen';
import PremiumTipsScreen from '../PremiumTipsScreen';
import HelpCenterScreen from '../HelpCenterScreen';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen name="AdminLogin" component={AdminLoginScreen} />
        {/* AdminDashboard can be accessed from AdminLogin without auth if it's separate, or require auth. 
            For now, let's leave Admin flow accessible from Auth stack for simplicity */}
        <AuthStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    </AuthStack.Navigator>
);

const AppNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Settings" component={UserSettingsScreen} />
        <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
        <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
        <Stack.Screen name="LevelsRewards" component={LevelsRewardsScreen} />
        <Stack.Screen name="SafetyTips" component={SafetyTipsScreen} />
        <Stack.Screen name="PremiumTips" component={PremiumTipsScreen} />
        <Stack.Screen name="SafeRoute" component={SafeRouteScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    </Stack.Navigator>
);

const MainNavigator = () => {
    const { user, loading } = useAuth();
    const { colorScheme } = useColorScheme();
    const AppTheme = DarkTheme;

    if (loading) {
        return (
            <View className="flex-1 bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#dc2626" />
            </View>
        );
    }

    return (
        <NavigationContainer theme={AppTheme}>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default MainNavigator;
