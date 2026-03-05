import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "./context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { signInAsGuest, signInWithGoogle, loading } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#0a0f1c]">
      <StatusBar style="light" />

      <View className="flex-1 justify-center items-center px-8">
        {/* Efeitos de Luz de Fundo (Abstract Glow) */}
        <View
          className="absolute top-1/4 w-72 h-72 bg-blue-600 rounded-full opacity-10"
          style={styles.glow}
          blurRadius={Platform.OS === "ios" ? 70 : 0}
        />
        <View
          className="absolute bottom-1/4 -right-10 w-64 h-64 bg-indigo-600 rounded-full opacity-10"
          style={styles.glow}
          blurRadius={Platform.OS === "ios" ? 70 : 0}
        />

        {/* Bloco de Logo e Textos Premium */}
        <View className="items-center mb-16 w-full mt-10">
          <View
            className="w-24 h-24 bg-slate-800/90 rounded-[32px] items-center justify-center border border-slate-700/60 mb-8"
            style={styles.iconShadow}
          >
            <FontAwesome5
              name="shield-alt"
              size={46}
              color="#3b82f6"
            />
          </View>

          <Text className="text-white font-extrabold text-[38px] tracking-tighter text-center">
            Alerta Criminal
          </Text>
          <Text className="text-blue-400 font-bold text-sm tracking-[0.2em] mt-3 uppercase text-center opacity-90">
            Inteligência Coletiva
          </Text>

          <Text className="text-slate-400 text-center text-base mt-6 leading-6 px-2 font-medium">
            Junte-se a primeira rede de radar comunitário. Reporte riscos reais
            em segundos e mapeie lugares perigosos.
          </Text>
        </View>

        {/* Botões de Acesso Rapido */}
        <View className="w-full relative z-10 gap-5 mb-auto">
          {/* Botão Google Elevado Escala */}
          <TouchableOpacity
            onPress={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white h-16 rounded-full flex-row items-center px-6 shadow-xl active:bg-gray-200"
            style={styles.googleBtn}
          >
            {loading ? (
              <ActivityIndicator color="#1f2937" className="mx-auto" />
            ) : (
              <>
                <Image
                  source={{
                    uri: "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png",
                  }}
                  style={{ width: 28, height: 28, marginRight: 16 }}
                  resizeMode="contain"
                />
                <Text className="flex-1 text-center font-extrabold text-[#111827] text-[17px] mr-8 tracking-tight">
                  Continuar com o Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botão Visitante Estilo Glass */}
          <TouchableOpacity
            onPress={signInAsGuest}
            disabled={loading}
            className="w-full bg-slate-800/40 h-16 rounded-full items-center justify-center border border-slate-700/60 active:bg-slate-800/60"
          >
            <Text className="text-slate-300 font-semibold text-[15px]">
              Ativar Modo Testador 👀
            </Text>
          </TouchableOpacity>
        </View>

        {/* Links Secundários */}
        <View className="absolute bottom-10 items-center justify-center w-full">
          <Text className="text-slate-500 text-[11px] text-center leading-5 px-10">
            Ao continuar, você concorda com os nossos Termos de Uso e entende
            nossa Política de Privacidade.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AdminLogin")}
            className="mt-6 p-2"
          >
            <Text className="text-slate-700 font-bold text-[10px] uppercase tracking-widest">
              Acesso Restrito
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  glow: {
    transform: [{ scale: 1.5 }],
  },
  iconShadow: {
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  googleBtn: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;
