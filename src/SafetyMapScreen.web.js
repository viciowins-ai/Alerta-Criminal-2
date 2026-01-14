import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix icons
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper for changing view
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const SafetyMapScreen = ({ navigation }) => {
    const [selectedRange, setSelectedRange] = useState('1 km');
    const [showSummary, setShowSummary] = useState(true);
    const [mapCenter, setMapCenter] = useState([-23.550520, -46.633308]); // Default SP
    const [incidents, setIncidents] = useState([]);
    const [zoom, setZoom] = useState(13);

    const fetchIncidents = async () => {
        const { data, error } = await supabase
            .from('incidents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching incidents:', error);
        } else {
            console.log("Fetched incidents:", data);
            setIncidents(data || []);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    // Function to handle "My Location"
    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setZoom(15);
            }, (error) => {
                console.error("Error getting location", error);
                alert("Erro ao obter localização.");
            });
        } else {
            alert("Geolocalização não suportada neste navegador.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900 w-full h-full">
            <StatusBar style="light" />

            {/* Header Title */}
            <View className="absolute top-0 left-0 right-0 h-24 pt-8 items-center justify-start z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                <Text className="text-white text-lg font-bold shadow-md">Mapa de Segurança (OSM)</Text>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-8 left-4 z-30 w-10 h-10 items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md active:bg-slate-800"
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Range Filters - Visual Only for now */}
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

            {/* Leaflet Map */}
            <View className="relative flex-1 bg-slate-900 overflow-hidden z-0">
                {/* Explicit style for container */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={zoom}
                        style={{ height: '100%', width: '100%', flex: 1 }}
                        zoomControl={false}
                    >
                        <ChangeView center={mapCenter} zoom={zoom} />

                        {/* Dark Mode Tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Render Markers */}
                        {incidents.map((incident) => (
                            <Marker
                                key={incident.id}
                                position={[incident.latitude, incident.longitude]}
                                icon={icon}
                            >
                                <Popup>
                                    <strong>{incident.type}</strong><br />
                                    {incident.description}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Bottom Card: Area Summary */}
                {showSummary && (
                    <Animated.View
                        entering={FadeInDown.duration(600)}
                        className="absolute bottom-24 left-4 right-4 z-20 pointer-events-none"
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
                                    <Text className="text-slate-400 text-sm">{incidents.length} incidentes reportados</Text>
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
                                    <Text className="text-white font-black text-2xl">{incidents.filter(i => i.type && i.type.toLowerCase().includes('roubo')).length}</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Roubos</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-800" />
                                <View className="items-center">
                                    <Text className="text-white font-black text-2xl">{incidents.filter(i => i.type && i.type.toLowerCase().includes('furto')).length}</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Furtos</Text>
                                </View>
                                <View className="w-[1px] h-8 bg-slate-800" />
                                <View className="items-center">
                                    <Text className="text-white font-black text-2xl">{incidents.filter(i => i.type && !i.type.toLowerCase().includes('roubo') && !i.type.toLowerCase().includes('furto')).length}</Text>
                                    <Text className="text-slate-500 text-xs font-bold uppercase">Outros</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* FAB - My Location */}
                <TouchableOpacity
                    onPress={handleMyLocation}
                    className="absolute bottom-28 right-4 w-12 h-12 bg-slate-800 rounded-full items-center justify-center shadow-lg border border-slate-700 z-10 active:scale-95">
                    <MaterialIcons name="my-location" size={24} color="#e2e8f0" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default SafetyMapScreen;
