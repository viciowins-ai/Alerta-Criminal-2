import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const UserProfileScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <View className="flex-1 w-full h-full">

                {/* Header Actions */}
                <View className="flex-row items-center justify-between px-4 py-2 z-10">
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Secret Admin Shortcut */}
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center opacity-50"
                        onPress={() => navigation.navigate('AdminDashboard')}
                        onLongPress={() => alert('Modo Admin Ativado')}
                    >
                        <MaterialIcons name="admin-panel-settings" size={24} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Profile & Level Header */}
                    <Animated.View entering={FadeInDown.delay(100)} className="items-center px-4 pt-2 mb-8">
                        <View className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-yellow-500 to-transparent mb-4 relative">
                            {/* Avatar Ring */}
                            <View className="w-full h-full rounded-full border-4 border-slate-900 overflow-hidden relative z-10">
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv72kPURbe1UXfRd8yp6_kln-ZotyaJLlffXNLXBpN0EKVf5dLvdIAaCw5x0i_LwW795iWZyeKPlRrFsse4Y31XuBn9gAsE0vb6NkKmj1tRwGliqcGHkOfQzEMomUF0sf08FhysLwIT70jIIGiFY1amTqGsbHsbEi8a1jWCOJXh0llXu_4zkAQfLzv0DXCnHuub9jeLgJP0BYd0Ed1SjpQhHVFuvWCSMuiaanJWCq7oE0adzqhSYgEVYsOwowH0eLc1Fff92Cj4A4q" }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            {/* Level Badge */}
                            <View className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1">
                                <View className="bg-yellow-500 w-10 h-10 rounded-full items-center justify-center border-2 border-slate-800">
                                    <Text className="font-black text-slate-900 text-sm">LV.5</Text>
                                </View>
                            </View>
                        </View>

                        <Text className="text-2xl font-bold text-white mb-1">Ana Oliveira</Text>
                        <Text className="text-yellow-500 font-bold uppercase tracking-wider text-xs bg-yellow-500/10 px-3 py-1 rounded-full mb-6">
                            Guardiã Ouro
                        </Text>

                        {/* XP Progress */}
                        <View className="w-full max-w-xs">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-slate-400 text-xs font-bold">XP: 1250</Text>
                                <Text className="text-slate-500 text-xs text-right">Próximo: 2000</Text>
                            </View>
                            <View className="h-3 bg-slate-800 rounded-full overflow-hidden w-full">
                                <View className="h-full bg-yellow-500 w-[65%]" />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Stats Grid */}
                    <Animated.View entering={FadeInDown.delay(200)} className="flex-row justify-between px-4 mb-8">
                        <View className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 w-[31%] items-center">
                            <MaterialIcons name="visibility" size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
                            <Text className="text-white font-bold text-lg">42</Text>
                            <Text className="text-slate-500 text-[10px] uppercase text-center">Alertas Vistos</Text>
                        </View>
                        <View className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 w-[31%] items-center">
                            <MaterialIcons name="favorite" size={24} color="#ef4444" style={{ marginBottom: 4 }} />
                            <Text className="text-white font-bold text-lg">15</Text>
                            <Text className="text-slate-500 text-[10px] uppercase text-center">Pessoas Ajudadas</Text>
                        </View>
                        <View className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 w-[31%] items-center">
                            <FontAwesome5 name="medal" size={20} color="#eab308" style={{ marginBottom: 8 }} />
                            <Text className="text-white font-bold text-lg">8</Text>
                            <Text className="text-slate-500 text-[10px] uppercase text-center">Medalhas</Text>
                        </View>
                    </Animated.View>

                    {/* Badge Showcase */}
                    <Animated.View entering={FadeInDown.delay(300)} className="px-4 mb-8">
                        <Text className="text-white font-bold text-lg mb-4">Conquistas Recentes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            <View className="bg-slate-800/80 p-3 rounded-2xl w-32 items-center border border-slate-700">
                                <View className="w-12 h-12 bg-blue-500/20 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons name="local-police" size={24} color="#3b82f6" />
                                </View>
                                <Text className="text-white font-bold text-xs text-center mb-1">Vigilante</Text>
                                <Text className="text-slate-500 text-[10px] text-center">Reportou 10 crimes</Text>
                            </View>

                            <View className="bg-slate-800/80 p-3 rounded-2xl w-32 items-center border border-slate-700">
                                <View className="w-12 h-12 bg-green-500/20 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons name="verified" size={24} color="#22c55e" />
                                </View>
                                <Text className="text-white font-bold text-xs text-center mb-1">Confiável</Text>
                                <Text className="text-slate-500 text-[10px] text-center">50 votos positivos</Text>
                            </View>

                            <View className="bg-slate-800/80 p-3 rounded-2xl w-32 items-center border border-slate-700 opacity-50">
                                <View className="w-12 h-12 bg-slate-700 rounded-full items-center justify-center mb-2">
                                    <MaterialIcons name="lock" size={24} color="#94a3b8" />
                                </View>
                                <Text className="text-slate-400 font-bold text-xs text-center mb-1">Lenda Urbana</Text>
                                <Text className="text-slate-600 text-[10px] text-center">Em breve</Text>
                            </View>
                        </ScrollView>
                    </Animated.View>

                    {/* Premium Promo CTA */}
                    <Animated.View entering={FadeInUp.delay(400)} className="px-4 mb-8">
                        <View className="bg-gradient-to-r from-red-600 to-red-900 rounded-3xl p-5 relative overflow-hidden">
                            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />

                            <View className="flex-row justify-between items-start mb-2">
                                <View className="bg-white/20 px-3 py-1 rounded-lg">
                                    <Text className="text-white font-bold text-xs uppercase">Premium</Text>
                                </View>
                                <FontAwesome5 name="ghost" size={24} color="white" style={{ opacity: 0.8 }} />
                            </View>

                            <Text className="text-white font-black text-2xl mb-1">Modo Fantasma</Text>
                            <Text className="text-white/80 text-sm mb-4 max-w-[80%]">Navegue pelo mapa sem deixar rastros e veja incidentes exclusivos da polícia.</Text>

                            <TouchableOpacity className="bg-white w-full h-12 rounded-xl items-center justify-center shadow-lg">
                                <Text className="text-red-900 font-bold font-lg">Desbloquear Agora</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Settings Lists */}
                    <View className="px-4 gap-y-3">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Settings')}
                            className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700"
                        >
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="settings" size={20} color="#94a3b8" />
                                <Text className="text-slate-200 font-medium">Configurações</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons name="help" size={20} color="#94a3b8" />
                                <Text className="text-slate-200 font-medium">Ajuda e Suporte</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-center p-4 mt-4">
                            <Text className="text-slate-500 font-medium">Sair da conta</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserProfileScreen;
