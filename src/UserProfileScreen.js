import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const UserProfileScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg">Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>

                {/* Profile Info */}
                <View className="items-center mb-8 mt-2">
                    <View className="w-28 h-28 rounded-full p-1 bg-blue-600 mb-4 shadow-xl shadow-blue-500/20">
                        <View className="w-full h-full rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                            <Image
                                source={{ uri: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-white">Ana Oliveira</Text>
                </View>

                {/* Card: Nível de Contribuição */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('LevelsRewards')}
                    className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 mb-4"
                >
                    <Text className="text-white font-bold text-base mb-4">Nível de Contribuição</Text>
                    <View className="flex-row items-center gap-4 mb-4">
                        <View className="w-12 h-12 bg-yellow-900/30 rounded-xl items-center justify-center border border-yellow-500/20">
                            <FontAwesome5 name="shield-alt" size={20} color="#fbbf24" />
                        </View>
                        <Text className="text-white font-bold text-lg">Guardião Ouro</Text>
                    </View>
                    {/* Progress Bar */}
                    <View className="flex-row gap-2 items-center">
                        <View className="h-2 bg-slate-700 flex-1 rounded-full overflow-hidden">
                            <View className="h-full bg-yellow-500 w-[70%]" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Card: Estatísticas de Alerta */}
                <View className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 mb-4">
                    <Text className="text-white font-bold text-base mb-4">Estatísticas de Alerta</Text>

                    <View className="flex-row justify-between items-center py-2 border-b border-slate-700/50">
                        <Text className="text-slate-400">Alertas Reportados</Text>
                        <Text className="text-white font-bold">25</Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2 pt-3">
                        <Text className="text-slate-400">Alertas Verificados</Text>
                        <Text className="text-white font-bold">18</Text>
                    </View>
                </View>

                {/* Card: Minha Assinatura Premium */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('PremiumTips')}
                    className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 mb-8"
                >
                    <Text className="text-white font-bold text-base mb-4">Minha Assinatura Premium</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <FontAwesome5 name="medal" size={20} color="#3b82f6" />
                            <Text className="text-slate-300">Plano Ativo</Text>
                        </View>
                        <Text className="text-blue-500 font-bold">Gerenciar</Text>
                    </View>
                </TouchableOpacity>

                {/* Buttons */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('PersonalData')}
                    className="w-full bg-slate-800 h-14 rounded-xl items-center justify-center border border-blue-900/50 mb-4 active:bg-slate-700"
                >
                    <View className="flex-row gap-2 items-center">
                        <MaterialIcons name="edit" size={20} color="#60a5fa" />
                        <Text className="text-blue-400 font-bold text-base">Editar Perfil</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-red-900/10 h-14 rounded-xl items-center justify-center border border-red-900/30 active:bg-red-900/20"
                >
                    <View className="flex-row gap-2 items-center">
                        <MaterialIcons name="logout" size={20} color="#ef4444" />
                        <Text className="text-red-500 font-bold text-base">Sair</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default UserProfileScreen;
