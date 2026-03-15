import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";

import IncidentLocationMap from "./components/IncidentLocationMap";

const IncidentReportScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Funcionalidade do botão Radar
  const [scanMode, setScanMode] = useState("idle");

  const handleScan = () => {
    setScanMode("scanning");
    setTimeout(() => {
      setScanMode("analyzed");
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert("Ops!", "Selecione a categoria da ocorrência.");
      return;
    }

    if (!user && !isAnonymous) {
      Alert.alert(
        "Atenção",
        "Você está navegando como visitante. O relato será anônimo automaticamente.",
      );
    }

    setLoading(true);

    try {
      let latitude = -23.5505;
      let longitude = -46.6333;

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        }
      } catch (e) {
        console.log("Erro ao obter localização", e);
      }

      const { error } = await supabase.from("incidents").insert({
        user_id: isAnonymous ? null : user ? user.id : null,
        type: selectedType,
        description: description,
        latitude: latitude,
        longitude: longitude,
        status: "reportado",
      });

      if (error) throw error;

      Alert.alert(
        "Radar Atualizado! 📡",
        "Sua ocorrência foi confirmada. Você ganhou +50 XP pela contribuição!",
        [{ text: "Ver no Mapa", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao conectar no radar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0f1c]">
      <StatusBar style="light" />

      {/* OVERLAYS DO RADAR/SCANNER */}
      {/* O overlay de 'scanning' foi removido da tela inteira pois a animação foi movida para DENTRO do minimapa (IncidentLocationMap) */}

      {scanMode === "analyzed" && (
        <View className="absolute bottom-0 left-0 right-0 p-4 z-50">
          <View className="bg-slate-900/95 border border-red-500/30 rounded-2xl p-5 shadow-2xl">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-14 h-14 rounded-full bg-red-500/20 items-center justify-center border border-red-500/30">
                <Ionicons name="warning-outline" size={28} color="#ef4444" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">
                  Atenção: Risco Local
                </Text>
                <Text className="text-slate-400 text-sm">
                  1 incidente reportado nas últimas 24h
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setScanMode("idle");
                navigation.navigate("SafeRoute");
              }}
              className="bg-blue-600 h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-lg mb-3"
            >
              <MaterialIcons name="alt-route" size={24} color="white" />
              <Text className="text-white font-bold text-base">
                Sugerir Desvio Seguro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScanMode("idle")}
              className="h-10 items-center justify-center"
            >
              <Text className="text-slate-500 text-sm font-bold">FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Glowing Background Elements */}
      <View className="absolute top-0 w-full h-64 bg-red-600/5 rounded-full blur-3xl -z-10" />

      {/* Premium Header */}
      <View className="flex-row items-center justify-between px-6 py-4 z-20">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-slate-800/60 rounded-full items-center justify-center border border-white/5 backdrop-blur-md"
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white font-black text-[16px] tracking-widest uppercase">
            Reportar Alerta
          </Text>
          <Text className="text-red-400 text-[10px] font-bold tracking-widest uppercase mt-1">
            Sua voz protege todos
          </Text>
        </View>
        <View className="w-10" /> {/* Balanço flex */}
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Level/Gamification Banner */}
        <View className="flex-row items-center bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
          <View className="w-10 h-10 bg-blue-600/20 rounded-full items-center justify-center mr-3 border border-blue-500/30">
            <FontAwesome5 name="medal" size={16} color="#60a5fa" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              Nível 2: Observador
            </Text>
            <Text className="text-slate-300 text-[11px] leading-4">
              Reporte com precisão para ganhar +50 XP e evoluir para o próximo
              nível.
            </Text>
          </View>
        </View>

        {/* Location Map Preview */}
        <View className="flex-row items-center justify-between mb-3 mt-2">
          <Text className="text-white font-extrabold text-[15px] tracking-wide">
            Ponto de Risco
          </Text>
          <Text className="text-slate-500 text-xs ml-auto">
            Gps ativo
          </Text>
        </View>
        <View className="w-full h-40 rounded-3xl overflow-hidden mt-1 mb-4 bg-slate-800 border-2 border-slate-700/50 relative shadow-xl">
          <IncidentLocationMap scanMode={scanMode} />
          <View className="absolute inset-0 border-[3px] border-black/10 rounded-3xl pointer-events-none" />
        </View>
        
        {/* Componente de Área */}
        <View className="w-full flex-row rounded-3xl overflow-hidden mb-8 shadow-2xl">
          {/* Metade Esquerda: Incidentes (Cor Escura) */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Detalhes", "Há 1 incidente verificado próximo dessa região.\n\nVeja no mapa abaixo a área de perigo destacada!");
              setScanMode("analyzed");
            }}
            className="flex-1 bg-[#151C2C] py-7 items-center justify-center relative"
            activeOpacity={0.8}
          >
            <View className="bg-[#1C2538] w-14 h-14 rounded-[20px] items-center justify-center border border-[#2B354D] shadow-inner">
              <Text className="text-white font-black text-2xl tracking-tighter">1</Text>
            </View>
            <Text className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
              Incidentes
            </Text>
            {/* Divisória sutil */}
            <View className="absolute right-0 top-4 bottom-4 w-[1px] bg-[#2B354D]" />
          </TouchableOpacity>

          {/* Metade Direita: Autenticação/Scan (Azul Vibrante) */}
          <TouchableOpacity
            onPress={handleScan}
            className="flex-1 bg-[#2B354D] py-7 items-center justify-center"
            activeOpacity={0.8}
          >
            <View className="bg-[#2563EB] w-14 h-14 rounded-full items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-[#3B82F6]/50">
              <MaterialIcons name="radar" size={28} color="white" />
            </View>
            <Text className="text-[#93C5FD] font-bold text-[10px] uppercase tracking-[0.15em] mt-3">
              Verificar Área
            </Text>
          </TouchableOpacity>
        </View>

        {/* Incident Type Grid Glassmorphism */}
        <Text className="text-white font-extrabold text-[15px] tracking-wide mb-4">
          Classificação do Perigo
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
          <TouchableOpacity
            onPress={() => setSelectedType("roubo")}
            className={`w-[48%] p-5 rounded-3xl border border-white/5 items-center justify-center gap-3 backdrop-blur-md shadow-lg transition-all ${selectedType === "roubo" ? "bg-red-600 border-red-500" : "bg-slate-800/40"}`}
          >
            <MaterialIcons
              name="directions-run"
              size={28}
              color={selectedType === "roubo" ? "white" : "#94a3b8"}
            />
            <Text
              className={`font-bold text-xs uppercase tracking-widest ${selectedType === "roubo" ? "text-white" : "text-slate-400"}`}
            >
              Assalto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("suspect")}
            className={`w-[48%] p-5 rounded-3xl border border-white/5 items-center justify-center gap-3 backdrop-blur-md shadow-lg transition-all ${selectedType === "suspect" ? "bg-amber-500 border-amber-400" : "bg-slate-800/40"}`}
          >
            <Ionicons
              name="eye-outline"
              size={28}
              color={selectedType === "suspect" ? "white" : "#94a3b8"}
            />
            <Text
              className={`font-bold text-xs uppercase tracking-widest text-center ${selectedType === "suspect" ? "text-white" : "text-slate-400"}`}
            >
              Suspeitos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("vandalism")}
            className={`w-[48%] p-5 rounded-3xl border border-white/5 items-center justify-center gap-3 backdrop-blur-md shadow-lg transition-all ${selectedType === "vandalism" ? "bg-purple-600 border-purple-500" : "bg-slate-800/40"}`}
          >
            <FontAwesome5
              name="car-crash"
              size={24}
              color={selectedType === "vandalism" ? "white" : "#94a3b8"}
            />
            <Text
              className={`font-bold text-xs uppercase tracking-widest text-center ${selectedType === "vandalism" ? "text-white" : "text-slate-400"}`}
            >
              Acidente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("other")}
            className={`w-[48%] p-5 rounded-3xl border border-white/5 items-center justify-center gap-3 backdrop-blur-md shadow-lg transition-all ${selectedType === "other" ? "bg-blue-600 border-blue-500" : "bg-slate-800/40"}`}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={28}
              color={selectedType === "other" ? "white" : "#94a3b8"}
            />
            <Text
              className={`font-bold text-xs uppercase tracking-widest ${selectedType === "other" ? "text-white" : "text-slate-400"}`}
            >
              Outros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <Text className="text-white font-extrabold text-[15px] tracking-wide mb-4">
          Informações Adicionais
        </Text>
        <View className="bg-slate-800/40 border border-white/5 rounded-3xl p-5 h-36 mb-6 shadow-inner">
          <TextInput
            placeholder="Ex: Fugiram de moto placa final 2. Suspeitos armados..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            className="text-white flex-1 text-[15px] leading-6"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Anonymity Toggle */}
        <View className="flex-row items-center justify-between bg-slate-900/50 p-5 rounded-3xl border border-white/5 mb-8">
          <View className="flex-row items-center flex-1 pr-4">
            <View className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-4 border border-slate-700">
              <Ionicons
                name="incognito"
                size={20}
                color={isAnonymous ? "#60a5fa" : "#64748b"}
              />
            </View>
            <View>
              <Text className="text-white font-bold text-sm">
                Denúncia Anônima
              </Text>
              <Text className="text-slate-500 text-[10px] uppercase mt-1">
                Seu nome e foto serão ocultados no mapa
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#1e293b", true: "#3b82f6" }}
            thumbColor={"#ffffff"}
            onValueChange={setIsAnonymous}
            value={isAnonymous}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 h-16 rounded-full items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95 transition-transform border border-red-500"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center gap-3">
              <Ionicons name="radio" size={24} color="white" />
              <Text className="text-white font-black text-sm uppercase tracking-[0.2em]">
                Transmitir Alerta
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IncidentReportScreen;
