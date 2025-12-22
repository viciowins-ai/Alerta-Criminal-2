import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';

// ⚠️ USER API KEY
const GOOGLE_MAPS_API_KEY = "AIzaSyCco2RJC3lfAkjYb6RYjPZHLMOhm5M2d7g";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -23.550520,
    lng: -46.633308
};

// Dark Mode Style for Google Maps
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const SafetyMapScreen = ({ navigation }) => {
    const [selectedRange, setSelectedRange] = useState('1 km');
    const [showSummary, setShowSummary] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (!isLoaded) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center">
                <StatusBar style="light" />
                <ActivityIndicator size="large" color="#eab308" />
                <Text className="text-slate-400 mt-4 font-bold">Carregando Mapa...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-900 w-full h-full">
            <StatusBar style="light" />

            {/* Header Title */}
            <View className="absolute top-0 left-0 right-0 h-24 pt-8 items-center justify-start z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                <Text className="text-white text-lg font-bold shadow-md">Mapa de Segurança</Text>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-8 left-4 z-30 w-10 h-10 items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md active:bg-slate-800"
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Range Filters */}
            <View className="absolute top-20 left-0 right-0 z-20 px-4 flex-row justify-between items-start">
                <View className="flex-row gap-2">
                    {['1 km', '5 km', '10 km'].map((range) => (
                        <TouchableOpacity
                            key={range}
                            onPress={() => setSelectedRange(range)}
                            className={`px-4 py-2 rounded-full border border-white/10 shadow-lg ${selectedRange === range ? 'bg-yellow-500' : 'bg-slate-800/90 backdrop-blur-md'}`}
                        >
                            <Text className={`font-bold ${selectedRange === range ? 'text-slate-900' : 'text-white'}`}>{range}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Filter Button */}
                <TouchableOpacity className="w-10 h-10 bg-slate-800/90 backdrop-blur-md rounded-full items-center justify-center border border-white/10 shadow-lg top-1">
                    <MaterialIcons name="filter-list" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Google Map */}
            <View className="relative flex-1 bg-slate-900 overflow-hidden">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        styles: darkMapStyle,
                        disableDefaultUI: true, // Clean look
                        zoomControl: false,
                    }}
                >
                    {/* Exemplo de Marcador */}
                    <Marker position={center} />
                </GoogleMap>

                {/* Bottom Card: Area Summary */}
                {showSummary && (
                    <Animated.View
                        entering={FadeInDown.duration(600)}
                        className="absolute bottom-24 left-4 right-4 z-20 pointer-events-none" // pointer-events-none on wrapper to pass touches? No, card needs clicks.
                        style={{ pointerEvents: 'box-none' }}
                    >
                        <View className="bg-slate-900/95 border border-slate-700/50 rounded-3xl p-5 shadow-2xl backdrop-blur-xl pointer-events-auto">
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-white font-bold text-xl">Resumo da Área</Text>
                                    <Text className="text-slate-400 text-xs uppercase tracking-wider font-bold">Últimas 24 horas</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowSummary(false)}
                                    className="bg-slate-800 p-1 rounded-full"
                                >
                                    <MaterialIcons name="close" size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center gap-4 mb-6 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                <View className="w-12 h-12 rounded-full bg-red-500/10 items-center justify-center border border-red-500/20">
                                    <Ionicons name="warning" size={24} color="#f87171" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base">Risco Elevado</Text>
                                    <Text className="text-slate-400 text-sm">12 incidentes reportados</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('SafeRoute')}
                                    className="bg-blue-600 px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20"
                                >
                                    <Text className="text-white font-bold text-xs">Rota Segura</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between px-4">
                                <View className="items-center">
                                    <Text className="text-white font-black text-2xl">8</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Roubos</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-800" />
                                <View className="items-center">
                                    <Text className="text-white font-black text-2xl">3</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Furtos</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-800" />
                                <View className="items-center">
                                    <Text className="text-white font-black text-2xl">1</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Outros</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* FAB - My Location */}
                <TouchableOpacity className="absolute bottom-28 right-4 w-12 h-12 bg-slate-800 rounded-full items-center justify-center shadow-lg border border-slate-700 z-10 active:scale-95">
                    <MaterialIcons name="my-location" size={24} color="#e2e8f0" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default SafetyMapScreen;
