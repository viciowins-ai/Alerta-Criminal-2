import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable, Vibration, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedProps,
    withTiming,
    withRepeat,
    withSequence,
    withSpring,
    Easing,
    interpolateColor,
    FadeIn,
    ZoomIn,
    runOnJS as _runOnJS
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7; // Responsive size
const STROKE_WIDTH = 15;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PanicButtonScreen = () => {
    const [status, setStatus] = useState('idle'); // 'idle', 'holding', 'active'
    const vibrationInterval = useRef(null);

    // Animation Values
    const progress = useSharedValue(0);
    const scale = useSharedValue(1);
    const bgOpacity = useSharedValue(0);

    // Helper to run JS function from UI thread callback
    const runOnJS = (fn) => {
        'worklet';
        return () => {
            _runOnJS(fn)();
        };
    };

    // SOS Activation Logic
    const handlePressIn = useCallback(() => {
        if (status === 'active') return;
        setStatus('holding');

        // Initial bump
        Vibration.vibrate(50);

        // Continuous "Charging" Vibration Loop
        clearInterval(vibrationInterval.current);
        vibrationInterval.current = setInterval(() => {
            Vibration.vibrate(30); // Short, sharp pulses
        }, 150); // Fast beat

        // Scale down effect
        scale.value = withSpring(0.9);

        // Start filling the ring (3 seconds to activate)
        progress.value = withTiming(1, { duration: 3000, easing: Easing.linear }, (finished) => {
            if (finished) {
                runOnJS(activateAlarm)();
            }
        });
    }, [status]);

    const handlePressOut = useCallback(() => {
        if (status === 'active') return;

        // Stop vibration immediately
        clearInterval(vibrationInterval.current);
        Vibration.cancel();

        // Reset if released early
        setStatus('idle');
        scale.value = withSpring(1);
        progress.value = withTiming(0, { duration: 300 }); // Fast reset
    }, [status]);

    const activateAlarm = () => {
        clearInterval(vibrationInterval.current);
        Vibration.cancel(); // Stop charging vibration

        setStatus('active');
        Vibration.vibrate([0, 500, 200, 500, 200, 1000], true); // Heavy alarm pattern

        bgOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0.2, { duration: 500 })
            ),
            -1,
            true
        );
    };

    const cancelAlarm = () => {
        clearInterval(vibrationInterval.current);
        Vibration.cancel();

        setStatus('idle');
        progress.value = 0;
        bgOpacity.value = 0;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(vibrationInterval.current);
            Vibration.cancel();
        };
    }, []);

    // Animated Props for SVG Circle
    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    // Style for the pulsing red background in emergency mode
    const emergencyBackgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: 'rgba(220, 38, 38, 1)', // Red-600
            opacity: status === 'active' ? bgOpacity.value : 0,
        };
    });

    const buttonScaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Emergency Background Layer */}
            <Animated.View style={[StyleSheet.absoluteFill, emergencyBackgroundStyle]} />

            <View className="flex-1 w-full h-full relative z-10">

                {/* Header */}
                <View className="flex-row items-center p-4">
                    {/* Back Button (Hidden if Active) */}
                    {status !== 'active' ? (
                        <TouchableOpacity className="p-2 w-12 h-12 items-center justify-center bg-zinc-800 rounded-full" >
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ) : <View className="w-12" />}

                    <Text className="flex-1 text-xl font-bold text-center text-white tracking-wider uppercase">
                        {status === 'active' ? 'EMERGÊNCIA ATIVA' : 'Botão de Pânico'}
                    </Text>
                    <View className="w-12" />
                </View>

                {/* Main Interaction Area */}
                <View className="flex-1 items-center justify-center pb-20">

                    {/* Status Text */}
                    <View className="h-20 mb-8 items-center justify-end">
                        {status === 'idle' && (
                            <Animated.Text entering={FadeIn} className="text-zinc-400 text-center font-medium">
                                Segure para ativar o SOS
                            </Animated.Text>
                        )}
                        {status === 'holding' && (
                            <Text className="text-white text-lg font-bold animate-pulse text-center uppercase tracking-widest text-red-500">
                                ARMANDO...
                            </Text>
                        )}
                        {status === 'active' && (
                            <View className="items-center">
                                <Text className="text-white text-2xl font-black uppercase text-center shadow-lg">ALERTA ENVIADO</Text>
                                <Text className="text-white/80 text-sm mt-1 text-center font-bold bg-black/30 px-3 py-1 rounded">LOCALIZAÇÃO COMPARTILHADA</Text>
                            </View>
                        )}
                    </View>

                    {/* The BIG Button */}
                    <View className="relative items-center justify-center">
                        {/* Progress Ring SVG */}
                        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                            {/* Track */}
                            <Circle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke="#3f3f46" // zinc-700
                                strokeWidth={STROKE_WIDTH}
                                fill="none"
                            />
                            {/* Progress Indicator */}
                            <AnimatedCircle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke="#ef4444" // red-500
                                strokeWidth={STROKE_WIDTH}
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                animatedProps={animatedProps}
                            />
                        </Svg>

                        {/* Interactive Core */}
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={status === 'active'}
                        >
                            <Animated.View
                                style={[
                                    buttonScaleStyle,
                                    {
                                        width: CIRCLE_SIZE - 40,
                                        height: CIRCLE_SIZE - 40,
                                        borderRadius: 999,
                                        backgroundColor: status === 'active' ? '#fff' : '#ef4444',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: '#ef4444',
                                        shadowOffset: { width: 0, height: 10 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 20,
                                        elevation: 10
                                    }
                                ]}
                            >
                                {status === 'active' ? (
                                    <MaterialIcons name="notifications-active" size={80} color="#ef4444" />
                                ) : (
                                    <View className="items-center">
                                        <Text className="text-white font-black text-5xl tracking-tighter">SOS</Text>
                                        <MaterialIcons name="touch-app" size={32} color="rgba(255,255,255,0.6)" style={{ marginTop: 5 }} />
                                    </View>
                                )}
                            </Animated.View>
                        </Pressable>
                    </View>

                    {/* Cancel Action */}
                    {status === 'active' && (
                        <Animated.View entering={ZoomIn.delay(500)} className="mt-16 w-full px-10">
                            <TouchableOpacity
                                onPress={cancelAlarm}
                                className="w-full bg-white h-14 rounded-full flex-row items-center justify-between px-2"
                            >
                                <View className="w-10 h-10 rounded-full bg-zinc-200 items-center justify-center">
                                    <MaterialIcons name="close" size={24} color="black" />
                                </View>
                                <Text className="flex-1 text-center font-bold text-black text-lg uppercase">
                                    Cancelar Alerta
                                </Text>
                                <View className="w-10" />
                            </TouchableOpacity>
                            <Text className="text-white/50 text-xs text-center mt-3">
                                Deslize ou toque para cancelar (Senha solicitada)
                            </Text>
                        </Animated.View>
                    )}

                </View>
            </View>
        </SafeAreaView>
    );
};

export default PanicButtonScreen;
