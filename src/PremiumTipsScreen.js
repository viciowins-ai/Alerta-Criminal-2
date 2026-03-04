import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const PremiumTipsScreen = ({ navigation }) => {
  const aiTips = [
    {
      id: "1",
      icon: "mobile-alt",
      iconColor: "#f59e0b",
      bg: "bg-yellow-500/10",
      title: "Cuidado com Celular à Noite",
      content:
        "Evite exibir seu celular em bares e restaurantes após as 20h, período com maior índice de furtos na região.",
    },
    {
      id: "2",
      icon: "walking",
      iconColor: "#3b82f6",
      bg: "bg-blue-500/10",
      title: "Trajetos Bem Iluminados",
      content:
        "Ao caminhar, prefira ruas principais como a R. Harmonia, que são mais iluminadas e movimentadas.",
    },
    {
      id: "3",
      icon: "car",
      iconColor: "#ef4444",
      bg: "bg-red-500/10",
      title: "Atenção ao Estacionar",
      content:
        "Houve um aumento de arrombamentos de veículos na área. Não deixe objetos visíveis e use travas de segurança.",
    },
    {
      id: "4",
      icon: "users",
      iconColor: "#10b981",
      bg: "bg-green-500/10",
      title: "Ande em Grupo",
      content:
        "Sempre que possível, especialmente à noite, caminhe acompanhado. Isso inibe a ação de criminosos.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-800/50 bg-slate-900/50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white flex-1 text-center pr-8">
          Dicas Premium
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* AI Header */}
        <View className="items-center mt-8 mb-8">
          <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6 shadow-lg shadow-blue-500/40">
            <FontAwesome5 name="magic" size={32} color="white" />
          </View>
          <Text className="text-white font-bold text-xl mb-2 text-center">
            Suas Dicas Personalizadas
          </Text>
          <Text className="text-slate-400 text-center px-4 leading-6">
            Geradas por IA com base nos incidentes recentes em{" "}
            <Text className="text-white font-bold">Vila Madalena</Text>.
          </Text>
        </View>

        {/* Tips List */}
        <View className="gap-4">
          {aiTips.map((tip) => (
            <View
              key={tip.id}
              className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex-row gap-4"
            >
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${tip.bg}`}
              >
                <FontAwesome5 name={tip.icon} size={20} color={tip.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base mb-1">
                  {tip.title}
                </Text>
                <Text className="text-slate-400 text-sm leading-5">
                  {tip.content}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-6 py-6 bg-background-dark border-t border-slate-800">
        <TouchableOpacity className="w-full bg-blue-600 h-14 rounded-xl items-center justify-center mb-3 shadow-lg shadow-blue-600/20 active:bg-blue-700">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="refresh" size={22} color="white" />
            <Text className="text-white font-bold text-base">
              Gerar Novas Dicas
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="w-full bg-slate-800 h-14 rounded-xl items-center justify-center border border-slate-700 active:bg-slate-700">
          <Text className="text-white font-bold text-base">
            Ver Todas as Dicas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PremiumTipsScreen;
