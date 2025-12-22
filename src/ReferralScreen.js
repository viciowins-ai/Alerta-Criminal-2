import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ReferralScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-slate-900/50 border-b border-slate-800/50">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">Indique e Ganhe</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>

                <Text className="text-white text-2xl font-black text-center mb-6 leading-8">
                    Proteja sua Comunidade e{"\n"}Ganhe Premium
                </Text>

                {/* Hero Card */}
                <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6 shadow-lg">
                    <Text className="text-white font-bold text-lg mb-2">Seu Código de Convite</Text>
                    <Text className="text-slate-400 text-sm mb-4 leading-5">
                        Compartilhe seu código com amigos. Quando eles se cadastrarem, você ganha!
                    </Text>

                    <View className="border border-slate-600 rounded-lg p-2 bg-slate-900/50 flex-row items-center justify-between border-dashed">
                        <Text className="text-white font-mono text-lg ml-3 tracking-widest">AC-1X8YZ9</Text>
                        <TouchableOpacity className="bg-orange-600 px-4 py-2 rounded-md active:bg-orange-700">
                            <Text className="text-white font-bold">Copiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Big Share Button */}
                <TouchableOpacity className="w-full bg-orange-600 h-14 rounded-xl items-center justify-center flex-row gap-2 shadow-lg shadow-orange-600/20 active:bg-orange-700 mb-8">
                    <MaterialIcons name="share" size={22} color="white" />
                    <Text className="text-white font-bold text-base">Compartilhar Link de Convite</Text>
                </TouchableOpacity>

                {/* Como Funciona */}
                <Text className="text-white font-bold text-lg mb-4">Como Funciona</Text>
                <View className="gap-3 mb-8">
                    {/* Step 1 */}
                    <View className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex-col items-center">
                        <View className="w-10 h-10 rounded-full bg-orange-500/10 items-center justify-center mb-2">
                            <MaterialIcons name="mail-outline" size={20} color="#f97316" />
                        </View>
                        <Text className="text-white font-bold mb-1">1. Compartilhe</Text>
                        <Text className="text-slate-400 text-xs text-center">Envie seu link para amigos e familiares.</Text>
                    </View>
                    {/* Step 2 */}
                    <View className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex-col items-center">
                        <View className="w-10 h-10 rounded-full bg-orange-500/10 items-center justify-center mb-2">
                            <MaterialIcons name="person-add-alt-1" size={20} color="#f97316" />
                        </View>
                        <Text className="text-white font-bold mb-1">2. Seu amigo se cadastra</Text>
                        <Text className="text-slate-400 text-xs text-center">Eles usam seu link para criar uma conta.</Text>
                    </View>
                    {/* Step 3 */}
                    <View className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex-col items-center">
                        <View className="w-10 h-10 rounded-full bg-orange-500/10 items-center justify-center mb-2">
                            <FontAwesome5 name="medal" size={18} color="#f97316" />
                        </View>
                        <Text className="text-white font-bold mb-1">3. Você ganha!</Text>
                        <Text className="text-slate-400 text-xs text-center">Receba 1 mês de Premium por cada amigo.</Text>
                    </View>
                </View>

                {/* Progress Bar Card */}
                <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-white font-bold">Sua próxima recompensa</Text>
                        <Text className="text-slate-400 text-xs">2/3 Convidados</Text>
                    </View>
                    <View className="h-3 bg-slate-700 rounded-full overflow-hidden w-full">
                        <View className="h-full bg-orange-600 w-[66%]" />
                    </View>
                </View>

                {/* Convites List */}
                <Text className="text-white font-bold text-lg mb-4">Suas Indicações</Text>
                <View className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-8">
                    {/* Item 1 */}
                    <View className="p-4 border-b border-slate-700/50 flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-full bg-slate-600/50 items-center justify-center">
                            <Text className="text-white font-bold">MA</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">Maria Alves</Text>
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-green-500" />
                                <Text className="text-green-500 text-xs font-bold">Recompensa Ganhada</Text>
                            </View>
                        </View>
                        <MaterialIcons name="check-circle" size={20} color="#22c55e" />
                    </View>
                    {/* Item 2 */}
                    <View className="p-4 border-b border-slate-700/50 flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-full bg-slate-600/50 items-center justify-center">
                            <Text className="text-white font-bold">JP</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">João Pereira</Text>
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-yellow-500" />
                                <Text className="text-yellow-500 text-xs font-bold">Cadastro Concluído</Text>
                            </View>
                        </View>
                        <MaterialIcons name="hourglass-empty" size={20} color="#eab308" />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ReferralScreen;
