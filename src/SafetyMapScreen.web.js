import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

const SafetyMapScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-900 w-full h-full" edges={["top", "left", "right"]}>
      <StatusBar style="light" />
      <View className="flex-1 w-full h-full flex-col overflow-hidden">

        {/* Renderiza o Mapbox via iFrame no navegador, exatamente como o WebView faz no celular */}
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

      </View>
    </SafeAreaView>
  );
};

export default SafetyMapScreen;
