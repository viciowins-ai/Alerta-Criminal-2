import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    withSpring,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Pulsing Heat Zone Component
const PulsingHeatZone = ({ x, y, size, color, delay = 0 }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        setTimeout(() => {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.2, { duration: 2000 }),
                    withTiming(0.6, { duration: 2000 })
                ),
                -1,
                true
            );
        }, delay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    zIndex: 0,
                },
                animatedStyle,
            ]}
        />
    );
};

// Interactive Incident Marker
const IncidentMarker = ({ x, y, icon, color }) => (
    <Animated.View entering={FadeIn.delay(500)} exiting={FadeOut}>
        <TouchableOpacity
            className="absolute items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"
            style={{
                left: x,
                top: y,
                backgroundColor: color,
                zIndex: 10,
                elevation: 5,
            }}
            activeOpacity={0.7}
        >
            <MaterialIcons name={icon} size={16} color="white" />
        </TouchableOpacity>
    </Animated.View>
);

// Safe Route SVG Path with realistic zigzag
const SafeRoutePath = () => (
    <View className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Dashed Path indicating recommended route avoiding red zones */}
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#22c55e" stopOpacity="0.8" />
                    <Stop offset="1" stopColor="#22c55e" stopOpacity="0.8" />
                </LinearGradient>
            </Defs>

            {/* Simulation of a street route: Go Straight -> Turn Left -> Go Straight -> Turn Right -> Arrive */}
            <Path
                d="M 50 90 L 50 75 L 25 75 L 25 35 L 50 35 L 50 10"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeDasharray="5, 5"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Start Point */}
            <Path d="M 50 90 L 50 90" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />

            {/* Turning Points (Street Corners) - Visual flair */}
            <Circle cx="50" cy="75" r="1.5" fill="#22c55e" opacity="0.5" />
            <Circle cx="25" cy="75" r="1.5" fill="#22c55e" opacity="0.5" />
            <Circle cx="25" cy="35" r="1.5" fill="#22c55e" opacity="0.5" />
            <Circle cx="50" cy="35" r="1.5" fill="#22c55e" opacity="0.5" />

            {/* End Point */}
            <Path d="M 50 10 L 50 10" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />

            {/* Destination Pulse Ring */}
            <Circle cx="50" cy="10" r="4" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
        </Svg>
    </View>
);


const SafetyMapScreen = () => {
    // Modes: 'idle' (default), 'scanning', 'analyzed' (risks shown), 'route' (safe path shown)
    const [mapMode, setMapMode] = useState('idle');
    const [scanProgress, setScanProgress] = useState(0);

    // Pan Gesture State
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const animatedMapStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: mapMode === 'idle' ? 1 : 1.2 }
        ],
    }));

    const handleScan = () => {
        setMapMode('scanning');
        // Simulate scanning process
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.1;
            setScanProgress(progress);
            if (progress >= 1) {
                clearInterval(interval);
                setMapMode('analyzed');
            }
        }, 200);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-surface-dark w-full h-full" edges={['top', 'left', 'right']}>
                <StatusBar style="light" />
                <View className="flex-1 w-full h-full flex-col overflow-hidden">

                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 py-3 bg-surface-dark shadow-md z-20">
                        <TouchableOpacity className="flex items-start justify-center w-12 h-12">
                            <MaterialIcons name="menu" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="flex-1 text-lg font-bold text-center text-white">
                            {mapMode === 'route' ? 'Navegação Segura' : 'Mapa de Segurança'}
                        </Text>
                        <View className="w-12 items-end justify-center">
                            <TouchableOpacity>
                                <MaterialIcons name="settings" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Main Map Content */}
                    <View className="relative flex-1 bg-slate-900 overflow-hidden">
                        <GestureDetector gesture={panGesture}>
                            <Animated.View className="flex-1 w-full h-full" style={animatedMapStyle}>
                                <ImageBackground
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8GE97LjX0E2YCcgJcn11kQ6of2weCzmAkR4Q5HNmJEvTmyFY_JLtAUMdmlzH3oYbfXG9NlNDGT6IG5BKkd5agtvE6ohXRVqQS8svaXNzmRyzd-4P4mlUb_EaN9HT4ASXBo0UWybrAS9eEdMqPwTfTg412qvTighcjlocIve1QfUr3iA7lDQweGkA-hbhIuDgRecqKPymOjPFbqi3Dv9teXp3zTJOs4i8HoTHR0hnOiHyYVrSjkUSJRLrdZG1-TV-SI236lWCiMk1" }}
                                    className="flex-1 w-full h-full"
                                    resizeMode="cover"
                                >
                                    {/* Layer: Heat Zones (Only in Analyzed or Route mode) */}
                                    {(mapMode === 'analyzed' || mapMode === 'route') && (
                                        <Animated.View entering={FadeIn.duration(1000)} style={{ opacity: mapMode === 'route' ? 0.3 : 1 }}>
                                            <View style={{ left: 50, top: 100 }}>
                                                <PulsingHeatZone x={0} y={0} size={150} color="rgba(220, 38, 38, 0.4)" delay={0} />
                                            </View>
                                            <View style={{ left: 200, top: 250 }}>
                                                <PulsingHeatZone x={0} y={0} size={200} color="rgba(245, 158, 11, 0.3)" delay={1000} />
                                            </View>

                                            {/* Incident Markers */}
                                            <IncidentMarker x={120} y={150} icon="warning" color="#ef4444" />
                                            <IncidentMarker x={250} y={300} icon="directions-run" color="#f59e0b" />
                                        </Animated.View>
                                    )}

                                    {/* Layer: Safe Route (Only in Route mode) */}
                                    {mapMode === 'route' && (
                                        <Animated.View entering={FadeIn.duration(1500)} className="absolute inset-0">
                                            <SafeRoutePath />
                                            {/* Navigation Marker user */}
                                            <View className="absolute left-[50%] bottom-[10%] -ml-4 -mb-4 bg-white p-1 rounded-full shadow-xl z-20">
                                                <MaterialIcons name="navigation" size={24} color="#22c55e" />
                                            </View>
                                        </Animated.View>
                                    )}

                                </ImageBackground>
                            </Animated.View>
                        </GestureDetector>

                        {/* UI OVERLAYS BASED ON STATE */}

                        {/* State: IDLE - "Scan" Button */}
                        {mapMode === 'idle' && (
                            <View className="absolute inset-0 items-center justify-center bg-black/40 z-10">
                                <View className="items-center gap-4">
                                    <View className="w-24 h-24 rounded-full border-4 border-white/20 items-center justify-center animate-pulse">
                                        <TouchableOpacity
                                            onPress={handleScan}
                                            className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-500/50"
                                        >
                                            <MaterialIcons name="radar" size={40} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text className="text-white text-lg font-bold shadow-black">Verificar Minha Área</Text>
                                    <Text className="text-slate-300 text-sm max-w-[200px] text-center">Analise crimes e riscos recentes em tempo real ao seu redor.</Text>
                                </View>
                            </View>
                        )}

                        {/* State: SCANNING */}
                        {mapMode === 'scanning' && (
                            <View className="absolute inset-0 items-center justify-center bg-black/60 z-10">
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text className="text-white mt-4 font-bold text-lg">Analisando Perímetro...</Text>
                                <Text className="text-blue-400 mt-1 text-sm">Buscando dados de delegacias e relatos...</Text>
                            </View>
                        )}

                        {/* State: ANALYZED - Risk Report & Route Suggestion */}
                        {mapMode === 'analyzed' && (
                            <Animated.View entering={FadeIn.duration(500)} className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <View className="bg-slate-900/95 border border-red-500/30 rounded-2xl p-5 shadow-2xl">
                                    <View className="flex-row items-start gap-4 mb-4">
                                        <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center border border-red-500/50">
                                            <MaterialIcons name="gpp-bad" size={28} color="#ef4444" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-xl">Atenção: Área de Risco</Text>
                                            <Text className="text-slate-400 text-sm mt-1">Detectamos 3 incidentes recentes e 2 zonas de calor no seu trajeto habitual.</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setMapMode('route')}
                                        className="bg-green-600 h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg hover:bg-green-500"
                                    >
                                        <MaterialIcons name="alt-route" size={24} color="white" />
                                        <Text className="text-white font-bold text-base">Traçar Rota Segura</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setMapMode('idle')} className="mt-3 items-center">
                                        <Text className="text-slate-500 text-sm">Cancelar e voltar ao mapa</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )}

                        {/* State: ROUTE - Navigation Panel */}
                        {mapMode === 'route' && (
                            <Animated.View entering={FadeIn.duration(500)} className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <View className="bg-slate-900/95 border border-green-500/30 rounded-2xl p-5 shadow-2xl">
                                    <View className="flex-row justify-between items-center mb-4">
                                        <View>
                                            <Text className="text-green-400 font-bold text-xs uppercase tracking-wider">Rota Segura Ativa</Text>
                                            <Text className="text-white font-bold text-xl">Desvio Sugerido</Text>
                                        </View>
                                        <View className="bg-slate-800 px-3 py-1 rounded-lg">
                                            <Text className="text-white font-bold">+2 min</Text>
                                        </View>
                                    </View>

                                    <Text className="text-slate-400 text-sm mb-4">Este caminho evita a Zona Central (Alto Risco) passando pela Av. Secundária (Iluminada).</Text>

                                    <View className="flex-row gap-3">
                                        <TouchableOpacity className="flex-1 bg-blue-600 h-12 rounded-xl items-center justify-center shadow-lg">
                                            <Text className="text-white font-bold">Iniciar Navegação</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setMapMode('analyzed')}
                                            className="w-12 h-12 bg-slate-800 rounded-xl items-center justify-center border border-slate-700"
                                        >
                                            <MaterialIcons name="close" size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        )}

                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default SafetyMapScreen;
