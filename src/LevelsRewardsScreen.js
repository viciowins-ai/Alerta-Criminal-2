import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const LevelsRewardsScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-slate-800/50 bg-slate-900/50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white flex-1 text-center pr-8">Níveis e Recompensas</Text>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Hero Shield Section */}
                <View className="items-center mt-6 mb-8">
                    <View className="relative justify-center items-center mb-4">
                        <FontAwesome5 name="shield-alt" size={160} color="#334155" style={{ opacity: 0.5 }} />
                        {/* Avatar inside Shield */}
                        <View className="absolute top-8">
                            <Ionicons name="person-circle-outline" size={100} color="#eab308" />
                        </View>
                        <View className="absolute bottom-4 bg-yellow-500 w-12 h-12 rounded-full items-center justify-center border-4 border-slate-900 shadow-xl">
                            <FontAwesome5 name="shield-alt" size={20} color="#1e293b" />
                        </View>
                    </View>

                    <Text className="text-slate-400 text-sm mb-1">Seu Nível Atual</Text>
                    <Text className="text-3xl font-black text-white mb-6">Guardião Ouro</Text>

                    {/* Progress Bar */}
                    <View className="w-full">
                        <View className="flex-row justify-between mb-2 px-1">
                            <Text className="text-slate-400 text-xs">Próximo nível: Guardião Platina</Text>
                            <Text className="text-white font-bold text-xs">250/500</Text>
                        </View>
                        <View className="h-3 bg-slate-800 rounded-full overflow-hidden w-full relative">
                            <View className="h-full bg-yellow-500 w-[50%] rounded-full z-10" />
                            <View className="h-full bg-slate-700 w-full absolute top-0 left-0 opacity-30" />
                        </View>
                    </View>
                </View>

                {/* Recompensas Desbloqueadas */}
                <Text className="text-white font-bold text-lg mb-4">Recompensas Desbloqueadas</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" contentContainerStyle={{ gap: 12 }}>
                    {/* Card 1 */}
                    <View className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 w-40 items-center">
                        <View className="w-12 h-12 bg-green-500/10 rounded-full items-center justify-center mb-3">
                            <FontAwesome5 name="id-card" size={20} color="#22c55e" />
                        </View>
                        <Text className="text-white font-bold text-center mb-1">Distintivo Exclusivo</Text>
                        <Text className="text-slate-500 text-xs text-center leading-4">Mostre seu status no perfil.</Text>
                    </View>

                    {/* Card 2 */}
                    <View className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 w-40 items-center">
                        <View className="w-12 h-12 bg-blue-500/10 rounded-full items-center justify-center mb-3">
                            <FontAwesome5 name="filter" size={20} color="#3b82f6" />
                        </View>
                        <Text className="text-white font-bold text-center mb-1">Filtros Avançados</Text>
                        <Text className="text-slate-500 text-xs text-center leading-4">Acesse filtros de mapa premium.</Text>
                    </View>

                    {/* Card 3 Partial */}
                    <View className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 w-40 items-center opacity-50">
                        <View className="w-12 h-12 bg-purple-500/10 rounded-full items-center justify-center mb-3">
                            <FontAwesome5 name="crown" size={20} color="#a855f7" />
                        </View>
                        <Text className="text-white font-bold text-center mb-1">VIP</Text>
                    </View>
                </ScrollView>

                {/* Próximas Recompensas */}
                <Text className="text-white font-bold text-lg mb-4">Próximas Recompensas</Text>
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 border-dashed items-center justify-center h-32">
                        <View className="w-10 h-10 bg-slate-700 rounded-full items-center justify-center mb-2">
                            <MaterialIcons name="lock" size={20} color="#64748b" />
                        </View>
                        <Text className="text-white font-bold text-center text-sm mb-1">Acesso Antecipado</Text>
                        <Text className="text-slate-500 text-[10px] text-center">Teste novas funcionalidades.</Text>
                    </View>
                    <View className="flex-1 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 border-dashed items-center justify-center h-32">
                        <View className="w-10 h-10 bg-slate-700 rounded-full items-center justify-center mb-2">
                            <MaterialIcons name="lock" size={20} color="#64748b" />
                        </View>
                        <Text className="text-white font-bold text-center text-sm mb-1">Conselho Comunitário</Text>
                        <Text className="text-slate-500 text-[10px] text-center">Convite para moldar o futuro.</Text>
                    </View>
                </View>

                {/* Como Ganhar Pontos */}
                <Text className="text-white font-bold text-lg mb-4">Como Ganhar Pontos</Text>
                <View className="gap-3">
                    <View className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-xl bg-green-500/10 items-center justify-center">
                                <Ionicons name="alert-circle-outline" size={24} color="#22c55e" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">Alerta Verificado</Text>
                                <Text className="text-slate-400 text-xs">Reportar um incidente confirmado</Text>
                            </View>
                        </View>
                        <Text className="text-green-400 font-bold">+10 pts</Text>
                    </View>

                    <View className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-xl bg-green-500/10 items-center justify-center">
                                <Ionicons name="chatbox-outline" size={24} color="#22c55e" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">Engajamento na Rede</Text>
                                <Text className="text-slate-400 text-xs">Participar nas discussões</Text>
                            </View>
                        </View>
                        <Text className="text-green-400 font-bold">+2 pts</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Referral')}
                        className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-xl bg-green-500/10 items-center justify-center">
                                <Ionicons name="person-add-outline" size={24} color="#22c55e" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">Convidar Vizinho</Text>
                                <Text className="text-slate-400 text-xs">Trazer um novo membro</Text>
                            </View>
                        </View>
                        <Text className="text-green-400 font-bold">+20 pts</Text>
                    </TouchableOpacity>

                </View>

                {/* Report CTA */}
                <TouchableOpacity className="w-full bg-blue-700 h-14 rounded-xl items-center justify-center mt-6 shadow-lg shadow-blue-900/40 flex-row gap-2 active:bg-blue-600">
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text className="text-white font-bold text-lg">Reportar um Incidente</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default LevelsRewardsScreen;
