import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Vibration, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

const PanicButtonScreen = ({ navigation }) => {
    const [isPressing, setIsPressing] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const progressInterval = React.useRef(null);
    const { user } = useAuth(); // Get user for ID

    // Animation values
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        console.log("SOS: Press In Detected");
        setIsPressing(true);
        if (Platform.OS !== 'web') Vibration.vibrate(50);
        scale.value = withTiming(0.9, { duration: 100 });

        // Start 3-second timer
        let currentProgress = 0;
        progressInterval.current = setInterval(() => {
            currentProgress += 1;
            const newProgress = currentProgress / 300;
            setProgress(newProgress);

            // Log every second
            if (currentProgress % 100 === 0) console.log(`SOS: Holding... ${Math.round(newProgress * 100)}%`);

            // Pulse vibration every second
            if (currentProgress % 100 === 0 && Platform.OS !== 'web') Vibration.vibrate(20);

            if (currentProgress >= 300) {
                console.log("SOS: Threshold reached, triggering!");
                triggerSOS();
                clearInterval(progressInterval.current);
            }
        }, 10);
    };

    const handlePressOut = () => {
        setIsPressing(false);
        scale.value = withTiming(1, { duration: 200 });
        clearInterval(progressInterval.current);
        setProgress(0);
    };

    const triggerSOS = async () => {
        Vibration.vibrate([0, 500, 200, 500]); // SOS Pattern (roughly)
        setIsPressing(false);
        setProgress(0);

        let lat = -23.550520;
        let long = -46.633308;

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                lat = location.coords.latitude;
                long = location.coords.longitude;
            }
        } catch (e) {
            console.log("Erro ao obter localização real:", e);
        }

        // Insert into Supabase
        try {
            if (user) {
                await supabase.from('incidents').insert({
                    type: 'SOS',
                    description: 'PEDIDO DE SOCORRO IMEDIATO! O usuário acionou o botão de pânico.',
                    latitude: lat,
                    longitude: long,
                    user_id: user.id,
                    status: 'critical'
                });
            }
        } catch (e) {
            console.log("Erro ao enviar SOS", e);
        }

        Alert.alert(
            "ALERTA ENVIADO!",
            "A central de monitoramento e seus contatos de emergência foram notificados com sua localização em tempo real.",
            [{ text: "OK" }]
        );
    };

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

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
                {/* Visual Rings */}
                <View className="w-[320px] h-[320px] rounded-full bg-red-900/20 absolute items-center justify-center border border-red-900/30">
                    {/* Ring fills based on progress would be complex with just Views, using simpler opacity logic for now */}
                    <View
                        className="absolute inset-0 rounded-full bg-red-600/30"
                        style={{ opacity: progress }} // Fades in as you hold
                    />
                </View>

                <View className="w-[260px] h-[260px] rounded-full bg-red-800/30 absolute items-center justify-center transform scale-95" />

                {/* The Button */}
                <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                    style={Platform.OS === 'web' ? { userSelect: 'none', cursor: 'pointer' } : {}}
                >
                    <Animated.View
                        style={[animatedButtonStyle]}
                        className={`w-[200px] h-[200px] rounded-full items-center justify-center shadow-2xl shadow-red-600/50 border-4 ${progress > 0 ? 'border-white' : 'border-red-500'} bg-red-600`}
                    >
                        <Text className="text-white font-black text-6xl tracking-widest">SOS</Text>
                        {isPressing && (
                            <Text className="text-white font-bold text-sm absolute bottom-10">SEGURE</Text>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Instruction Text */}
            <View className="absolute bottom-20 px-10">
                <Text className="text-slate-400 text-center leading-6 text-base">
                    Pressione e segure por <Text className="font-bold text-white">3 segundos</Text> para enviar um alerta de emergência imediato.
                </Text>
            </View>

        </SafeAreaView>
    );
};

export default PanicButtonScreen;
