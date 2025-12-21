import 'react-native-gesture-handler';
import './src/global.css';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const isWeb = Platform.OS === 'web';

  const AppContent = (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <MainNavigator />
    </SafeAreaProvider>
  );

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.mobileSimulator}>
          {AppContent}
        </View>
      </View>
    );
  }

  return AppContent;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#101622', // Match app dark theme background for the "desktop"
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  mobileSimulator: {
    width: '100%',
    maxWidth: 400,
    height: '100%',
    maxHeight: 850,
    backgroundColor: '#000',
    overflow: 'hidden',
    // On web, we can add a border to simulate a phone frame if we want, 
    // but just constraining width is usually enough for UX testing.
    // Let's make it look nice.
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
});
