import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to recenter map
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const SafeRouteScreen = ({ navigation }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [routeData, setRouteData] = useState(null); // { distance, duration, path: [[lat,lng], ...] }
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([-23.550520, -46.633308]); // SP Center
    const [mapZoom, setMapZoom] = useState(13);

    const geocode = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            }
            return null;
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    };

    const calculateRoute = async () => {
        if (!origin || !destination) {
            alert("Por favor, preencha origem e destino.");
            return;
        }

        setLoading(true);
        setRouteData(null);

        try {
            // 1. Geocode Origin
            const startCoords = await geocode(origin);
            if (!startCoords) throw new Error("Endereço de origem não encontrado.");

            // 2. Geocode Destination
            const endCoords = await geocode(destination);
            if (!endCoords) throw new Error("Endereço de destino não encontrado.");

            // 3. Get Route from OSRM
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`;
            const response = await fetch(osrmUrl);
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error("Não foi possível calcular a rota.");
            }

            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON is [lon, lat], Leaflet wants [lat, lon]
            const distKm = (route.distance / 1000).toFixed(1) + " km";
            const durMin = Math.round(route.duration / 60) + " min";

            setRouteData({
                distance: distKm,
                duration: durMin,
                path: coordinates,
                start: startCoords,
                end: endCoords
            });

            // Center map on route middle
            const midIndex = Math.floor(coordinates.length / 2);
            setMapCenter(coordinates[midIndex]);
            setMapZoom(12);

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900 h-full w-full">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-slate-900/50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">Planejador de Rota Segura (OpenFree)</Text>
            </View>

            <View className="flex-1 px-5 pt-4">

                {/* Free API Banner */}
                <View className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 flex-row items-center gap-4 mb-4">
                    <FontAwesome5 name="globe-americas" size={20} color="#4ade80" />
                    <Text className="text-green-400 font-medium flex-1 text-sm">Usando Mapas Livres (OSM + OSRM)</Text>
                </View>

                {/* Inputs */}
                <View className="gap-3 mb-4">
                    <View>
                        <Text className="text-white font-bold mb-1 ml-1 text-xs uppercase text-slate-400">Ponto de partida</Text>
                        <View className="bg-slate-800 rounded-xl border border-slate-700 flex-row items-center px-4 h-12">
                            <MaterialIcons name="my-location" size={20} color="#94a3b8" />
                            <TextInput
                                value={origin}
                                onChangeText={setOrigin}
                                className="flex-1 text-white ml-3 font-medium outline-none"
                                placeholder="Ex: Av. Paulista, 1000"
                                placeholderTextColor="#64748b"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-white font-bold mb-1 ml-1 text-xs uppercase text-slate-400">Destino</Text>
                        <View className="bg-slate-800 rounded-xl border border-slate-700 flex-row items-center px-4 h-12">
                            <MaterialIcons name="location-pin" size={20} color="#94a3b8" />
                            <TextInput
                                value={destination}
                                onChangeText={setDestination}
                                placeholder="Para onde você vai?"
                                className="flex-1 text-white ml-3 font-medium outline-none"
                                placeholderTextColor="#64748b"
                                onSubmitEditing={calculateRoute}
                            />
                        </View>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={calculateRoute}
                    disabled={loading}
                    className={`w-full h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg mb-4 ${loading ? 'bg-slate-700' : 'bg-blue-600 active:bg-blue-700 shadow-blue-600/20'}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialIcons name="directions" size={20} color="white" />
                            <Text className="text-white font-bold text-base">Calcular Rota Grátis</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Leaflet Map Container */}
                <View className="flex-1 bg-slate-800 rounded-3xl overflow-hidden relative mb-4 border border-slate-700 shadow-inner z-0">
                    {/* We need to define style explicitly for Leaflet container to show up */}
                    <div style={{ height: '100%', width: '100%' }}>
                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false} // Custom look
                        >
                            <ChangeView center={mapCenter} zoom={mapZoom} />

                            {/* Dark Mode Tiles (CartoDB Dark Matter) */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {/* Render Route if available */}
                            {routeData && (
                                <>
                                    <Marker position={[routeData.start.lat, routeData.start.lon]} icon={icon} />
                                    <Marker position={[routeData.end.lat, routeData.end.lon]} icon={icon} />
                                    <Polyline pathOptions={{ color: '#3b82f6', weight: 5 }} positions={routeData.path} />
                                </>
                            )}
                        </MapContainer>
                    </div>
                </View>

                {/* Bottom Result Card */}
                {routeData && (
                    <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4 animate-fade-in-up">
                        <View className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="text-white font-bold text-lg">{routeData.duration}</Text>
                                <Text className="text-slate-400 text-xs">{routeData.distance}</Text>
                            </View>
                            <View className="bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">
                                <Text className="text-green-400 font-bold text-xs uppercase">Rota Otimizada</Text>
                            </View>
                        </View>
                        <Text className="text-slate-400 text-sm leading-5">
                            Rota calculada usando dados abertos do OpenStreetMap.
                        </Text>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

export default SafeRouteScreen;
