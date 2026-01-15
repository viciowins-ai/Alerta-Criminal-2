import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from './lib/supabase';
import { MapContainer, TileLayer, Marker, useMap, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons (Webpack/Expo issue)
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- COMPONENTE DE CORREÇÃO DO MAPA ---
// Separação clara de responsabilidades:
// 1. MapViewUpdater: Cuida apenas de Mover a Câmera
// 2. MapLayoutFixer: Cuida apenas de evitar a Tela Branca
function MapLogic({ center, zoom }) {
    const map = useMap();

    // 1. Atualiza a VISÃO (Centro/Zoom)
    useEffect(() => {
        if (!map || !center) return;
        // Usa setView para movimento instantâneo e preciso
        map.setView(center, zoom);
    }, [center, zoom, map]);

    // 2. Corrige o LAYOUT (Tela Branca)
    useEffect(() => {
        if (!map) return;
        const fix = () => map.invalidateSize();

        // Executa agressivamente para garantir renderização
        fix();
        setTimeout(fix, 100);
        setTimeout(fix, 500);
        setTimeout(fix, 1000);

        window.addEventListener('resize', fix);
        return () => window.removeEventListener('resize', fix);
    }, [map]);

    return null;
}

const SafetyMapScreen = ({ navigation }) => {
    const [selectedRange, setSelectedRange] = useState('1 km');
    const [showSummary, setShowSummary] = useState(true);
    const [mapCenter, setMapCenter] = useState([-23.550520, -46.633308]); // Default SP
    const [userLocation, setUserLocation] = useState(null); // Localização do Usuário
    const [incidents, setIncidents] = useState([]);
    const [zoom, setZoom] = useState(13);

    const fetchIncidents = async () => {
        const { data, error } = await supabase
            .from('incidents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar incidentes:', error);
        } else {
            setIncidents(data || []);
        }
    };

    useEffect(() => {
        fetchIncidents();
        handleMyLocation(); // Tenta pegar a localização ao iniciar
    }, []);

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const newPos = [latitude, longitude];

                // Atualiza estados
                setUserLocation(newPos);
                setMapCenter(newPos);
                setZoom(18); // Zoom mais próximo

                console.log("Localização encontrada (Alta Precisão):", newPos);
            }, (error) => {
                console.error("Erro ao obter localização", error);
                alert("Não foi possível obter a localização precisa.");
            }, {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900 w-full h-full">
            <StatusBar style="light" />

            {/* Header Title */}
            <View className="absolute top-0 left-0 right-0 h-24 pt-8 items-center justify-start z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                <Text className="text-white text-lg font-bold shadow-md">Mapa de Segurança (Premium)</Text>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-8 left-4 z-30 w-10 h-10 items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md active:bg-slate-800 border border-slate-700 pointer-events-auto"
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Container do Mapa (HTML Div explícita para garantir renderização) */}
            <View className="relative flex-1 bg-slate-900 overflow-hidden z-0">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={zoom}
                        style={{ width: '100%', height: '100%', flex: 1 }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        {/* Lógica de Correção e Movimento */}
                        <MapLogic center={mapCenter} zoom={zoom} />

                        {/* Camada do Mapa - Estilo Dark Premium (CartoDB Dark Matter) */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Marcador de Localização do Usuário (Efeito de Pulso) */}
                        {userLocation && (
                            <CircleMarker
                                center={userLocation}
                                radius={8}
                                pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
                            >
                                <Popup>Você está aqui</Popup>
                            </CircleMarker>
                        )}
                        {userLocation && (
                            <CircleMarker
                                center={userLocation}
                                radius={20}
                                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2, weight: 0 }}
                            />
                        )}

                        {/* Marcadores de Incidentes */}
                        {incidents.map((incident) => (
                            <Marker
                                key={incident.id}
                                position={[incident.latitude, incident.longitude]}
                                icon={icon}
                            >
                                <Popup className="custom-popup">
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>{incident.type ? incident.type.toUpperCase() : 'ALERTA'}</Text>
                                        <Text style={{ fontSize: 12 }}>{incident.description}</Text>
                                    </View>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Custom Attribution (Clean & Bottom Right) */}
                <View className="absolute bottom-1 right-1 z-10 opacity-30 pointer-events-none">
                    <Text className="text-[8px] text-white">© OSM • © CARTO</Text>
                </View>

                {/* Card de Resumo Inferior - FIX: Estilos Inline para garantir Z-Index */}
                {showSummary ? (
                    <View
                        style={{ position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 9999 }}
                        pointerEvents="box-none"
                    >
                        <View className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-xl pointer-events-auto">
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-white font-bold text-xl">Resumo da Área</Text>
                                    <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Monitoramento Ativo</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowSummary(false)}
                                    className="bg-slate-800 p-1 rounded-full border border-slate-700 hover:bg-slate-700"
                                >
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row gap-4 mt-2">
                                <View className="items-center flex-1 bg-slate-800/50 p-2 rounded-xl border border-slate-700">
                                    <Text className="text-white font-black text-xl">{incidents.length}</Text>
                                    <Text className="text-slate-400 text-[10px] uppercase">Incidentes</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleMyLocation}
                                    className="items-center justify-center flex-1 bg-blue-600 p-2 rounded-xl shadow-lg active:bg-blue-700 border border-blue-500"
                                >
                                    <MaterialIcons name="my-location" size={24} color="white" />
                                    <Text className="text-white font-bold text-[10px] uppercase mt-1">Localizar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    /* Floating Controls when Summary is Closed */
                    <View style={{ position: 'absolute', bottom: 90, right: 16, zIndex: 9999, alignItems: 'flex-end', gap: 12 }} pointerEvents="box-none">
                        <TouchableOpacity
                            onPress={handleMyLocation}
                            className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-lg border border-white/20 active:scale-95"
                        >
                            <MaterialIcons name="my-location" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowSummary(true)}
                            className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center shadow-lg border border-slate-700 active:scale-95"
                        >
                            <MaterialIcons name="info-outline" size={24} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SafetyMapScreen;
