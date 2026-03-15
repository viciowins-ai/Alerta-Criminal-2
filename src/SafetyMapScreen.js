import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Initial Region (São Paulo Placeholder)
const INITIAL_REGION = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

// Mock Coordinates for Interactivity
const HEAT_ZONE_1 = { latitude: -23.5525, longitude: -46.6355 };
const HEAT_ZONE_2 = { latitude: -23.5485, longitude: -46.6315 };
const INCIDENT_1 = { latitude: -23.5535, longitude: -46.6365 };
const INCIDENT_2 = { latitude: -23.5475, longitude: -46.6305 };

// Safe Route Path
const SAFE_ROUTE_COORDS = [
  { latitude: -23.555, longitude: -46.638 },
  { latitude: -23.553, longitude: -46.636 },
  { latitude: -23.551, longitude: -46.634 }, // Avoids Heat Zone 1
  { latitude: -23.55, longitude: -46.633 },
  { latitude: -23.549, longitude: -46.635 }, // Zigzag
  { latitude: -23.546, longitude: -46.632 }, // Destination
];

// We will use the Web-based Mapbox 3D rendering instead of manual native markers,
// giving us the premium Google-like map performance and 3D buildings without breaking Expo Go!

const SafetyMapScreen = ({ navigation }) => {
  // Modes: 'idle' (default), 'scanning', 'analyzed' (risks shown), 'route' (safe path shown)
  const [mapMode, setMapMode] = useState("idle");
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = () => {
    setMapMode("scanning");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setScanProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setMapMode("analyzed");
      }
    }, 200);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-surface-dark w-full h-full"
      edges={["top", "left", "right"]}
    >
      <StatusBar style="light" />
      <View className="flex-1 w-full h-full flex-col overflow-hidden">
        {/* Premium Header - Glassmorphic */}
        <View className="absolute top-10 w-[70%] self-center h-14 z-20 pointer-events-none flex-row items-center justify-center bg-slate-900/60 border border-white/10 rounded-full shadow-2xl">
          <MaterialIcons
            name="security"
            size={20}
            color="#3b82f6"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-[14px] font-black tracking-widest uppercase">
            Radar Ativo
          </Text>
        </View>

        {/* Main Map Content */}
        <View className="relative flex-1 bg-slate-900 overflow-hidden">
          <WebView
            source={{ uri: "https://alerta-criminal.vercel.app" }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#0f172a",
            }}
            geolocationEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />

          {/* UI OVERLAYS */}

          {/* O bloco flutuante de incidentes/radar foi movido para o IncidentReportScreen */}

          {/* State: SCANNING */}
          {mapMode === "scanning" && (
            <View className="absolute inset-0 items-center justify-center bg-black/60 z-10">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-white mt-4 font-bold text-lg">
                Analisando Perímetro...
              </Text>
            </View>
          )}

          {/* State: ANALYZED - Bottom Sheet */}
          {mapMode === "analyzed" && (
            <View className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <View className="bg-slate-900/95 border border-red-500/30 rounded-2xl p-5 shadow-2xl">
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-14 h-14 rounded-full bg-red-500/20 items-center justify-center border border-red-500/30">
                    <Ionicons
                      name="warning-outline"
                      size={28}
                      color="#ef4444"
                    />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">
                      Alto Risco
                    </Text>
                    <Text className="text-slate-400 text-sm">
                      12 incidentes nas últimas 24h
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("SafeRoute")}
                      className="mt-2 bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-bold text-xs">
                        Traçar Rota Segura
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setMapMode("route")}
                  className="bg-green-600 h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg hover:bg-green-500"
                >
                  <MaterialIcons name="alt-route" size={24} color="white" />
                  <Text className="text-white font-bold text-base">
                    Traçar Rota Segura
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMapMode("idle")}
                  className="mt-3 items-center"
                >
                  <Text className="text-slate-500 text-sm">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* State: ROUTE - Navigation Panel */}
          {mapMode === "route" && (
            <View className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <View className="bg-slate-900/95 border border-green-500/30 rounded-2xl p-5 shadow-2xl">
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-green-400 font-bold text-xs uppercase tracking-wider">
                      Rota Segura Ativa
                    </Text>
                    <Text className="text-white font-bold text-xl">
                      Desvio Sugerido
                    </Text>
                  </View>
                  <View className="bg-slate-800 px-3 py-1 rounded-lg">
                    <Text className="text-white font-bold">+2 min</Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 bg-blue-600 h-12 rounded-xl items-center justify-center shadow-lg">
                    <Text className="text-white font-bold">
                      Iniciar Navegação
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMapMode("analyzed")}
                    className="w-12 h-12 bg-slate-800 rounded-xl items-center justify-center border border-slate-700"
                  >
                    <MaterialIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Dark Map Style JSON
const DARK_MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

export { DARK_MAP_STYLE };
export default SafetyMapScreen;
