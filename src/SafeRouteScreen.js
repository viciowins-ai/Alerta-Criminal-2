import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const SafeRouteScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-slate-900/50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">Planejador de Rota Segura</Text>
            </View>

            <View className="flex-1 px-5 pt-4">

                {/* Premium Banner */}
                <View className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4 flex-row items-center gap-4 mb-6">
                    <FontAwesome5 name="medal" size={20} color="#fbbf24" />
                    <Text className="text-yellow-500 font-medium flex-1 text-sm">Você está usando o Planejador de Rota Premium.</Text>
                </View>

                {/* Inputs */}
                <View className="gap-4 mb-6">
                    <View>
                        <Text className="text-white font-bold mb-2 ml-1">Ponto de partida</Text>
                        <View className="bg-slate-800 rounded-xl border border-slate-700 flex-row items-center px-4 h-14">
                            <MaterialIcons name="my-location" size={20} color="#94a3b8" />
                            <TextInput
                                value="Seu local atual"
                                className="flex-1 text-white ml-3 font-medium"
                                placeholderTextColor="#64748b"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-white font-bold mb-2 ml-1">Destino</Text>
                        <View className="bg-slate-800 rounded-xl border border-slate-700 flex-row items-center px-4 h-14">
                            <MaterialIcons name="location-pin" size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Para onde você vai?"
                                className="flex-1 text-white ml-3 font-medium"
                                placeholderTextColor="#64748b"
                            />
                        </View>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity className="w-full bg-blue-600 h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-600/20 mb-6 active:bg-blue-700">
                    <MaterialIcons name="security" size={20} color="white" />
                    <Text className="text-white font-bold text-base">Calcular Rota Segura</Text>
                </TouchableOpacity>

                {/* Map Preview (Styled Placeholder) */}
                <View className="flex-1 bg-[#F5F5F0] rounded-3xl overflow-hidden relative mb-6 border-4 border-slate-800">
                    {/* Mock Map Shapes */}
                    <View className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 transform scale-150" />
                    <View className="absolute bottom-10 right-10 w-full h-40 bg-blue-300 rounded-full opacity-20 transform rotate-12" />

                    {/* Route Line Mock */}
                    <View className="absolute top-1/2 left-1/4 right-1/4 h-32 w-2 border-l-4 border-dashed border-slate-400 transform rotate-12" />

                    {/* Current Loc Icon */}
                    <View className="absolute top-4 right-4 bg-slate-800 p-2 rounded-full">
                        <MaterialIcons name="my-location" size={24} color="white" />
                    </View>

                    {/* Route Path (Blue Shape from Image) */}
                    <View className="flex-1 items-center justify-center">
                        <FontAwesome5 name="route" size={100} color="#3b82f6" />
                    </View>
                </View>

                {/* Bottom Result Card */}
                <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white font-bold text-lg">Resumo da Rota</Text>
                        <View className="bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/30">
                            <Text className="text-green-400 font-bold text-xs uppercase">Segurança: Alta</Text>
                        </View>
                    </View>
                    <Text className="text-slate-400 text-sm leading-5">
                        A rota sugerida pela IA evita 3 áreas de alto risco reportadas recentemente.
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default SafeRouteScreen;
