import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const PanicButtonScreen = ({ navigation }) => {
    // Animation for pulse effect would rely on reanimated useEffect
    // For simplicity in static code, we'll design the visual layout perfectly.

    return (
        <SafeAreaView className="flex-1 bg-background-dark items-center justify-center relative">
            <StatusBar style="light" />

            {/* Header Title (Centered) */}
            <View className="absolute top-10 w-full items-center">
                <Text className="text-white font-bold text-xl">SOS Premium</Text>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-10 left-5 p-2"
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Main SOS Button Container */}
            <View className="items-center justify-center">
                {/* Outer Rings (Simulating Pulse) */}
                <View className="w-[320px] h-[320px] rounded-full bg-red-900/20 absolute items-center justify-center" />
                <View className="w-[260px] h-[260px] rounded-full bg-red-800/30 absolute items-center justify-center" />

                {/* The Button */}
                <TouchableOpacity
                    className="w-[200px] h-[200px] rounded-full bg-red-600 items-center justify-center shadow-2xl shadow-red-600/50 active:scale-95 transition-transform"
                    activeOpacity={0.9}
                >
                    <Text className="text-white font-black text-6xl tracking-widest">SOS</Text>
                </TouchableOpacity>
            </View>

            {/* Instruction Text */}
            <View className="absolute bottom-20 px-10">
                <Text className="text-slate-400 text-center leading-6 text-base">
                    Pressione e segure para enviar um alerta de emergência para a central de monitoramento com sua localização atual.
                </Text>
            </View>

        </SafeAreaView>
    );
};

export default PanicButtonScreen;
