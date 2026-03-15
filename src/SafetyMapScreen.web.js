import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

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
          {/* Iframe for WEB instead of WebView */}
          <iframe
            src="https://alerta-criminal.vercel.app"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "#0f172a",
            }}
            allow="geolocation"
            title="Mapbox Alerta Criminal"
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
                      onPress={() => {
                        if (navigation) navigation.navigate("SafeRoute");
                      }}
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

export default SafetyMapScreen;
