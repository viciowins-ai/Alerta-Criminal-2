import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from '@teovilla/react-native-web-maps';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// Initial Region (São Paulo Placeholder)
const INITIAL_REGION = {
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
};

const SafetyMapScreen = ({ navigation }) => {
    const [selectedRange, setSelectedRange] = useState('1 km');
    const [showSummary, setShowSummary] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-slate-900 w-full h-full" edges={['top', 'left', 'right']}>
            <StatusBar style="light" />

            {/* Header / Top Overlays */}
            <View className="absolute top-14 left-0 right-0 z-10 px-4 flex-row justify-between items-start pointer-events-none">
                {/* Range Filters */}
                <View className="flex-row gap-3 pointer-events-auto">
                    {['1 km', '5 km', '10 km'].map((range) => (
                        <TouchableOpacity
                            key={range}
                            onPress={() => setSelectedRange(range)}
                            className={`px-4 py-2 rounded-full ${selectedRange === range ? 'bg-yellow-500' : 'bg-slate-800/90'}`}
                        >
                            <Text className={`font-bold ${selectedRange === range ? 'text-slate-900' : 'text-white'}`}>{range}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Filter Button */}
                <TouchableOpacity className="w-10 h-10 bg-slate-800/90 rounded-full items-center justify-center pointer-events-auto shadow-lg">
                    <MaterialIcons name="filter-list" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Back Button (since full screen) */}
            <TouchableOpacity className="absolute top-4 left-4 z-20 w-10 h-10 items-center justify-center p-2 rounded-full active:bg-black/20 pointer-events-auto">
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="absolute top-4 left-0 right-0 text-center text-white text-lg font-bold z-10 pointer-events-none">Mapa de Segurança</Text>


            {/* Main Map Content */}
            <View className="relative flex-1 bg-slate-900 overflow-hidden">
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={INITIAL_REGION}
                >
                    {/* Heatmap Layer Simulated with Overlay or Markers */}
                    {/* Using mock markers for visual context */}
                </MapView>

                {/* Bottom Card: Area Summary */}
                {showSummary && (
                    <Animated.View
                        entering={FadeInDown.duration(600)}
                        className="absolute bottom-24 left-4 right-4 z-20"
                    >
                        <View className="bg-slate-800/95 border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
                            <View className="flex-row justify-between items-start mb-4">
                                <Text className="text-white font-bold text-lg">Resumo da Área</Text>
                                <TouchableOpacity onPress={() => setShowSummary(false)}>
                                    <MaterialIcons name="close" size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-start gap-4 mb-4">
                                <View className="w-14 h-14 rounded-full bg-red-500/20 items-center justify-center border border-red-500/30">
                                    <Ionicons name="warning-outline" size={28} color="#ef4444" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg">Alto Risco</Text>
                                    <Text className="text-slate-400 text-sm">12 incidentes nas últimas 24h</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('SafeRoute')}
                                        className="mt-2 bg-blue-600 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-white font-bold text-xs">Traçar Rota Segura</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="flex-row justify-between px-2">
                                <View className="items-center">
                                    <Text className="text-white font-black text-xl">8</Text>
                                    <Text className="text-slate-500 text-xs">Roubos</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-white font-black text-xl">3</Text>
                                    <Text className="text-slate-500 text-xs">Furtos</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-white font-black text-xl">1</Text>
                                    <Text className="text-slate-500 text-xs">Vandalismo</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* FAB */}
                <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-yellow-500 rounded-full items-center justify-center shadow-lg shadow-yellow-500/40 z-30 active:scale-95 transition-transform">
                    <MaterialIcons name="my-location" size={24} color="#0f172a" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default SafetyMapScreen;
