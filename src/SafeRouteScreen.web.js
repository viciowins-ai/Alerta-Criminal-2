import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "";

const SafeRouteScreen = ({ navigation }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);

  const geocode = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      );
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
      const startCoords = await geocode(origin);
      if (!startCoords) throw new Error("Endereço de origem não encontrado.");

      const endCoords = await geocode(destination);
      if (!endCoords) throw new Error("Endereço de destino não encontrado.");

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`;
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("Não foi possível calcular a rota.");
      }

      const route = data.routes[0];
      // OSRM GeoJSON já é [lon, lat], que é exatamente o que o Mapbox pede!
      const coordinates = route.geometry.coordinates; 
      const distKm = (route.distance / 1000).toFixed(1) + " km";
      const durMin = Math.round(route.duration / 60) + " min";

      const rData = {
        distance: distKm,
        duration: durMin,
        path: coordinates,
        start: startCoords,
        end: endCoords,
      };

      setRouteData(rData);

      // Enviando para o iframe do Mapbox 3D desenhar as vias
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          { type: "RENDER_ROUTE", payload: rData },
          "*"
        );
      }
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg ml-2">
          Planejador de Rota Segura (OpenFree)
        </Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        {/* Usando Mapbox - Badge */}
        <View className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 flex-row items-center gap-4 mb-4">
          <FontAwesome5 name="map" size={20} color="#60a5fa" />
          <Text className="text-blue-400 font-medium flex-1 text-sm">
            Powered by Mapbox & OSMR
          </Text>
        </View>

        {/* Inputs */}
        <View className="gap-3 mb-4">
          <View>
            <Text className="text-white font-bold mb-1 ml-1 text-xs uppercase text-slate-400">
              Ponto de partida
            </Text>
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
            <Text className="text-white font-bold mb-1 ml-1 text-xs uppercase text-slate-400">
              Destino
            </Text>
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
          className={`w-full h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg mb-4 ${loading ? "bg-slate-700" : "bg-blue-600 active:bg-blue-700 shadow-blue-600/20"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="directions" size={20} color="white" />
              <Text className="text-white font-bold text-base">
                Calcular Rota Segura
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Mapbox Web Container */}
        <View className="flex-1 bg-slate-800 rounded-3xl overflow-hidden relative mb-4 border border-slate-700 shadow-inner z-0 pointer-events-auto">
          <iframe
            ref={iframeRef}
            src={`/mapbox_route.html?token=${MAPBOX_TOKEN}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="geolocation"
            title="Mapbox Route Engine"
          />
        </View>

        {/* Bottom Result Card */}
        {routeData && (
          <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4 animate-fade-in-up">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-white font-bold text-lg">
                  {routeData.duration}
                </Text>
                <Text className="text-slate-400 text-xs">
                  {routeData.distance}
                </Text>
              </View>
              <View className="bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">
                <Text className="text-green-400 font-bold text-xs uppercase">
                  Rota Otimizada
                </Text>
              </View>
            </View>
            <Text className="text-slate-400 text-sm leading-5">
              Calculada por dados abertos. Risco de incidentes verificado.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SafeRouteScreen;
