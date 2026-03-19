import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Vibration,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

const PanicButtonScreen = ({ navigation }) => {
  const [isPressing, setIsPressing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const progressInterval = React.useRef(null);
  const { user } = useAuth(); // Get user for ID

  // Animation values
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    console.log("SOS: Press In Detected");
    setIsPressing(true);
    if (Platform.OS !== "web") Vibration.vibrate(50);
    scale.value = withTiming(0.9, { duration: 100 });

    // Start 3-second timer
    let currentProgress = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += 1;
      const newProgress = currentProgress / 300;
      setProgress(newProgress);

      // Log every second
      if (currentProgress % 100 === 0)
        console.log(`SOS: Holding... ${Math.round(newProgress * 100)}%`);

      // Pulse vibration every second
      if (currentProgress % 100 === 0 && Platform.OS !== "web")
        Vibration.vibrate(20);

      if (currentProgress >= 300) {
        console.log("SOS: Threshold reached, triggering!");
        triggerSOS();
        clearInterval(progressInterval.current);
      }
    }, 10);
  };

  const handlePressOut = () => {
    setIsPressing(false);
    scale.value = withTiming(1, { duration: 200 });
    clearInterval(progressInterval.current);
    setProgress(0);
  };

  const triggerSOS = async () => {
    Vibration.vibrate([0, 500, 200, 500]); // SOS Pattern (roughly)
    setIsPressing(false);
    setProgress(0);

    let lat = -23.55052;
    let long = -46.633308;

    if (!user) {
      Alert.alert(
        "Login necessário",
        "Para acionar o SOS, faça login com sua conta (Google).",
      );
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        lat = location.coords.latitude;
        long = location.coords.longitude;
      }
    } catch (e) {
      console.log("Erro ao obter localização real:", e);
    }

    // Insert into Supabase
    try {
      await supabase.from("incidents").insert({
        type: "SOS",
        description:
          "PEDIDO DE SOCORRO IMEDIATO! O usuário acionou o botão de pânico.",
        latitude: lat,
        longitude: long,
        user_id: user.id,
        status: "critical",
      });
    } catch (e) {
      console.log("Erro ao enviar SOS", e);
    }

    Alert.alert(
      "ALERTA ENVIADO!",
      "A central de monitoramento e seus contatos de emergência foram notificados com sua localização em tempo real.",
      [{ text: "OK" }],
    );
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-[#05070f] relative overflow-hidden items-center justify-center">
      <StatusBar style="light" />

      {/* Glowing Emergency Abyssal Background */}
      <View className="absolute top-1/2 left-1/2 -ml-[250px] -mt-[250px] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] -z-10 animate-pulse" />

      {/* Premium Glassmorphic Header */}
      <View className="absolute top-12 left-6 right-6 h-16 z-20 pointer-events-none flex-row items-center justify-between bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] px-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10 backdrop-blur-md pointer-events-auto active:bg-white/10"
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white font-black text-[15px] tracking-widest uppercase">
            Central de Pânico
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
            <Text className="text-red-400 text-[9px] font-black tracking-[0.3em] uppercase">
              Emergência
            </Text>
          </View>
        </View>
        <View className="w-10" />
      </View>

      {/* SOS Trigger Area */}
      <View className="items-center justify-center mt-10">
        {/* Visual Glass Rings */}
        <View className="w-[340px] h-[340px] rounded-full absolute items-center justify-center border border-red-500/10 bg-red-900/5 backdrop-blur-sm">
          {/* Progress Indicator Ring */}
          <View
            className="absolute inset-0 rounded-full bg-red-600/20"
            style={{
              transform: [{ scale: progress > 0 ? 1 : 0.8 }],
              opacity: progress,
            }}
          />
        </View>

        <View className="w-[280px] h-[280px] rounded-full absolute items-center justify-center border border-red-500/20 bg-red-900/10 backdrop-blur-md" />

        {/* The Core Button */}
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={
            Platform.OS === "web"
              ? { userSelect: "none", cursor: "pointer" }
              : {}
          }
          className="z-10"
        >
          <Animated.View
            style={[animatedButtonStyle]}
            className={`w-[220px] h-[220px] rounded-full items-center justify-center shadow-[0_0_80px_rgba(220,38,38,0.5)] border-4 ${isPressing ? "border-white bg-red-500" : "border-red-500/50 bg-[#dc2626]"} transition-colors duration-300 relative overflow-hidden`}
          >
            {/* Dynamic Filling background based on hold time */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white/30"
              style={{ height: `${progress * 100}%` }}
            />

            <MaterialIcons
              name="crisis-alert"
              size={40}
              color={isPressing ? "white" : "rgba(255,255,255,0.8)"}
              className="mb-2"
            />
            <Text
              className={`font-black text-6xl tracking-[0.1em] text-center ${isPressing ? "text-white" : "text-white"}`}
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.4)",
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 10,
              }}
            >
              SOS
            </Text>

            <Text className="text-white/80 font-black text-[10px] tracking-widest uppercase mt-3">
              {isPressing ? "Mantendo..." : "Pressione"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Instruction Footer Glass Panel */}
      <View className="absolute bottom-12 left-8 right-8 bg-slate-900/60 p-5 rounded-3xl border border-white/5 backdrop-blur-xl items-center">
        <View className="w-12 h-1 bg-white/10 rounded-full mb-4" />
        <Text className="text-slate-400 text-center text-sm font-medium leading-6">
          Mantenha pressionado por{" "}
          <Text className="font-black text-white">3 segundos</Text> para enviar
          sua localização exata para contatos de emergência e autoridades
          conectadas.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PanicButtonScreen;
