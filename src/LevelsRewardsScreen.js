import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const LevelsRewardsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // Simple Level Logic based on points
    const points = profile?.points || 0;
    const getLevelInfo = (pts) => {
        if (pts < 100) return { current: 'Guardião Bronze', next: 'Guardião Prata', max: 100 };
        if (pts < 300) return { current: 'Guardião Prata', next: 'Guardião Ouro', max: 300 };
        if (pts < 600) return { current: 'Guardião Ouro', next: 'Guardião Platina', max: 600 };
        return { current: 'Guardião Platina', next: 'Lenda Urbana', max: 1000 };
    };

    const levelInfo = getLevelInfo(points);
    const progressPercent = Math.min((points / levelInfo.max) * 100, 100);

    return (
        <SafeAreaView className="flex-1 bg-[#05070f] relative overflow-hidden">
            <StatusBar style="light" />

            {/* Glowing Emergency Abyssal Background */}
            <View className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
            <View className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[80px] -z-10" />

            {/* Premium Glassmorphic Header */}
            <View className="absolute top-12 left-6 right-6 h-16 z-20 pointer-events-none flex-row items-center justify-between bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] px-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10 backdrop-blur-md pointer-events-auto active:bg-white/10"
                >
                    <MaterialIcons name="arrow-back" size={20} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white font-black text-[15px] tracking-widest uppercase">Quartel General</Text>
                    <Text className="text-blue-400 text-[9px] font-black tracking-[0.3em] uppercase mt-1">Nível & Recompensas</Text>
                </View>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6 pt-32" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

                {/* Hero Shield Section */}
                <View className="items-center mt-6 mb-12">
                    <View className="relative justify-center items-center mb-8 w-44 h-44 border-4 border-yellow-500/20 rounded-full bg-yellow-500/5 backdrop-blur-3xl">
                        <View className="absolute inset-0 rounded-full border-r-2 border-yellow-400" style={{ transform: [{ rotate: '45deg' }] }} />
                        <FontAwesome5 name="shield-alt" size={90} color="#fbbf24" style={{ opacity: 0.9, textShadowColor: '#fbbf24', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }} />
                        {/* Avatar inside Shield */}
                        <View className="absolute">
                            <Ionicons name="person" size={40} color="#1e293b" />
                        </View>
                        <View className="absolute -bottom-4 bg-yellow-400 px-4 py-1.5 rounded-full items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] border-2 border-[#05070f]">
                            <Text className="text-[#05070f] font-black text-xs tracking-widest uppercase">Rank Secreto</Text>
                        </View>
                    </View>

                    <Text className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-1">Patente Atual</Text>
                    <Text className="text-[26px] font-black tracking-widest text-white mb-6 uppercase text-center">{levelInfo.current}</Text>

                    {/* Progress Bar Glassmorphic */}
                    <View className="w-full bg-slate-900/60 p-5 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
                        <View className="flex-row justify-between mb-3 px-1 items-end">
                            <View>
                                <Text className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Próxima Patente</Text>
                                <Text className="text-white font-extrabold text-[13px] tracking-wide">{levelInfo.next}</Text>
                            </View>
                            <View className="bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                                <Text className="text-yellow-400 font-black text-xs">{points} / {levelInfo.max} XP</Text>
                            </View>
                        </View>
                        <View className="h-2 bg-slate-800 rounded-full overflow-hidden w-full relative border border-slate-700">
                            <View
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                style={{ width: `${progressPercent}%`, backgroundColor: '#eab308' }}
                            />
                        </View>
                    </View>
                </View>

                {/* Recompensas Desbloqueadas */}
                <Text className="text-white font-extrabold text-[15px] tracking-wide mb-5">Arsenal Desbloqueado</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10 w-full overflow-visible" contentContainerStyle={{ gap: 16 }}>
                    {/* Card 1 */}
                    <View className="bg-slate-800/40 p-5 rounded-3xl border border-emerald-500/20 w-44 items-center shadow-lg backdrop-blur-md">
                        <View className="w-14 h-14 bg-emerald-500/10 rounded-full items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <FontAwesome5 name="id-card" size={22} color="#10b981" />
                        </View>
                        <Text className="text-white font-black tracking-wide text-center mb-2 text-[14px]">Distintivo Verificado</Text>
                        <Text className="text-slate-500 text-[11px] text-center leading-4 font-bold">Autenticidade visível na rede.</Text>
                    </View>

                    {/* Card 2 */}
                    <View className="bg-slate-800/40 p-5 rounded-3xl border border-blue-500/20 w-44 items-center shadow-lg backdrop-blur-md">
                        <View className="w-14 h-14 bg-blue-500/10 rounded-full items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <FontAwesome5 name="filter" size={20} color="#3b82f6" />
                        </View>
                        <Text className="text-white font-black tracking-wide text-center mb-2 text-[14px]">Radar Militar</Text>
                        <Text className="text-slate-500 text-[11px] text-center leading-4 font-bold">Filtros avançados do mapa liberados.</Text>
                    </View>
                </ScrollView>

                {/* Próximas Recompensas */}
                <Text className="text-white font-extrabold text-[15px] tracking-wide mb-5">Hardware Trancado</Text>
                <View className="flex-row gap-4 mb-10 w-full">
                    <View className="flex-1 bg-slate-900/60 p-5 rounded-3xl border border-white/5 border-dashed items-center justify-center h-36">
                        <View className="w-12 h-12 bg-black/40 rounded-full items-center justify-center mb-3 border border-white/5">
                            <MaterialIcons name="lock" size={20} color="#475569" />
                        </View>
                        <Text className="text-slate-300 font-extrabold text-center text-[12px] uppercase tracking-widest mb-1 opacity-50">Acesso Tático</Text>
                        <Text className="text-slate-600 font-bold text-[9px] text-center uppercase">Requer Nível Ouro</Text>
                    </View>

                    <View className="flex-1 bg-slate-900/60 p-5 rounded-3xl border border-white/5 border-dashed items-center justify-center h-36">
                        <View className="w-12 h-12 bg-black/40 rounded-full items-center justify-center mb-3 border border-white/5">
                            <MaterialIcons name="lock" size={20} color="#475569" />
                        </View>
                        <Text className="text-slate-300 font-extrabold text-center text-[12px] uppercase tracking-widest mb-1 opacity-50">Conselho Maior</Text>
                        <Text className="text-slate-600 font-bold text-[9px] text-center uppercase">Requer Nível Platina</Text>
                    </View>
                </View>

                {/* Como Ganhar Pontos */}
                <Text className="text-white font-extrabold text-[15px] tracking-wide mb-5">Instruções Operacionais (XP)</Text>
                <View className="gap-4 w-full">
                    <View className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 flex-row items-center justify-between backdrop-blur-md">
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-2xl bg-blue-500/10 items-center justify-center border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                <Ionicons name="radar-outline" size={24} color="#60a5fa" />
                            </View>
                            <View>
                                <Text className="text-white font-extrabold text-[14px] tracking-widest uppercase">Reportar Alerta</Text>
                                <Text className="text-slate-400 font-bold text-[10px] uppercase mt-1">Acionar radar no perigo</Text>
                            </View>
                        </View>
                        <View className="bg-blue-600/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                            <Text className="text-blue-400 font-black text-[12px]">+50 XP</Text>
                        </View>
                    </View>

                    <View className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 flex-row items-center justify-between backdrop-blur-md">
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-2xl bg-emerald-500/10 items-center justify-center border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                <Ionicons name="shield-checkmark-outline" size={24} color="#34d399" />
                            </View>
                            <View>
                                <Text className="text-white font-extrabold text-[14px] tracking-widest uppercase">Alerta Autêntico</Text>
                                <Text className="text-slate-400 font-bold text-[10px] uppercase mt-1">Incidente confirmado</Text>
                            </View>
                        </View>
                        <View className="bg-emerald-600/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                            <Text className="text-emerald-400 font-black text-[12px]">+10 XP</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-purple-900/40 p-5 rounded-3xl border border-purple-500/30 flex-row items-center justify-between backdrop-blur-md mb-8 active:bg-purple-900/60 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-2xl bg-purple-500/20 items-center justify-center border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                <Ionicons name="person-add" size={22} color="#c084fc" />
                            </View>
                            <View>
                                <Text className="text-white font-extrabold text-[14px] tracking-widest uppercase">Recrutar Vizinho</Text>
                                <Text className="text-purple-300 font-bold text-[10px] uppercase mt-1">Convidar no Programa</Text>
                            </View>
                        </View>
                        <View className="bg-purple-600/30 px-3 py-1.5 rounded-full border border-purple-400/50">
                            <Text className="text-purple-300 font-black text-[12px]">+500 XP</Text>
                        </View>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
};

export default LevelsRewardsScreen;
