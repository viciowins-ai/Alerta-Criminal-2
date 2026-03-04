import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const AdminLoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'cadastro'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // 1: Phone Input, 2: Verification Code

  const handleSendCode = (method) => {
    // Mock sending code
    setStep(2);
  };

  const handleVerify = () => {
    // Mock verification success
    navigation.replace("AdminDashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 justify-center w-full max-w-md mx-auto">
            {/* Logo & Header */}
            <View className="items-center mb-10">
              <View className="w-16 h-16 mb-4 items-center justify-center">
                <FontAwesome5 name="shield-alt" size={48} color="#f59e0b" />
              </View>
              <Text className="text-white font-bold text-2xl tracking-wider mb-2">
                Alerta Criminal
              </Text>
              <Text className="text-white font-bold text-3xl text-center">
                Acesso do Administrador
              </Text>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-slate-800 p-1 rounded-xl mb-8 border border-slate-700">
              <TouchableOpacity
                onPress={() => setActiveTab("login")}
                className={`flex-1 py-3 rounded-lg items-center ${activeTab === "login" ? "bg-slate-900 border border-slate-700" : ""}`}
              >
                <Text
                  className={`font-bold ${activeTab === "login" ? "text-white" : "text-slate-400"}`}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("cadastro")}
                className={`flex-1 py-3 rounded-lg items-center ${activeTab === "cadastro" ? "bg-slate-900 border border-slate-700" : ""}`}
              >
                <Text
                  className={`font-bold ${activeTab === "cadastro" ? "text-white" : "text-slate-400"}`}
                >
                  Cadastro
                </Text>
              </TouchableOpacity>
            </View>

            {step === 1 ? (
              <>
                {/* Phone Input */}
                <View className="mb-6">
                  <Text className="text-white font-medium mb-2 pl-1">
                    Número de telefone
                  </Text>
                  <View className="flex-row items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5">
                    <TextInput
                      className="flex-1 text-white text-base"
                      placeholder="(DDD) 99999-9999"
                      placeholderTextColor="#64748b"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                    {phoneNumber.length > 0 && (
                      <MaterialIcons name="phone" size={20} color="#64748b" />
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-4">
                  <TouchableOpacity
                    onPress={() => handleSendCode("sms")}
                    className="bg-slate-700 py-4 rounded-xl items-center flex-row justify-center gap-3 border border-slate-600 active:bg-slate-600"
                  >
                    <MaterialIcons name="sms" size={20} color="#cbd5e1" />
                    <Text className="text-slate-200 font-bold text-base">
                      Enviar Código via SMS
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSendCode("whatsapp")}
                    className="bg-slate-700 py-4 rounded-xl items-center flex-row justify-center gap-3 border border-slate-600 active:bg-slate-600"
                  >
                    <FontAwesome5 name="whatsapp" size={20} color="#cbd5e1" />
                    <Text className="text-slate-200 font-bold text-base">
                      Via WhatsApp
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Verification Code Input */}
                <View className="mb-8">
                  <Text className="text-white font-medium mb-2 pl-1">
                    Código de verificação
                  </Text>
                  <View className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5 items-center">
                    <TextInput
                      className="w-full text-white text-2xl text-center tracking-[8px] font-bold"
                      placeholder="- - - - - -"
                      placeholderTextColor="#475569"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      autoFocus
                    />
                  </View>
                  <Text className="text-slate-500 text-xs text-center mt-4">
                    Um código de verificação foi enviado por SMS ou WhatsApp.
                  </Text>
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleVerify}
                  className="bg-yellow-500 py-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-yellow-600 shadow-lg shadow-yellow-500/20"
                >
                  <MaterialIcons name="login" size={20} color="#1e293b" />
                  <Text className="text-slate-900 font-bold text-lg">
                    Verificar e Entrar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep(1)} className="mt-6">
                  <Text className="text-slate-500 text-center text-sm">
                    Alterar número de telefone
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Footer Help */}
            <TouchableOpacity className="mt-12">
              <Text className="text-slate-600 text-center text-sm font-medium">
                Precisa de ajuda? Fale com o Suporte
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminLoginScreen;
