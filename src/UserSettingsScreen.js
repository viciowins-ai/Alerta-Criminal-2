import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const UserSettingsScreen = ({ navigation }) => {
    // State to manage toggle switches
    const [notificationsMap, setNotificationsMap] = useState({
        roubo: true,
        atividades: true,
        comunitario: false
    });

    const [privacyMap, setPrivacyMap] = useState({
        perfilVisivel: true,
        localizacao: true,
        ghostMode: false
    });

    const toggleNotification = (key) => {
        setNotificationsMap(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const togglePrivacy = (key) => {
        setPrivacyMap(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingClickableRow = ({ title, showChevron = true, isDestructive = false, icon, onPress }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between min-h-[56px] px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 active:bg-slate-700"
            onPress={onPress}
        >
            <View className="flex-row items-center gap-3">
                {icon && <MaterialIcons name={icon} size={20} color={isDestructive ? '#ef4444' : '#94a3b8'} />}
                <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-slate-200'}`}>
                    {title}
                </Text>
            </View>
            {showChevron && (
                <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            )}
        </TouchableOpacity>
    );

    const SettingSwitchRow = ({ title, value, onToggle, subtitle, isPremium }) => (
        <View className="flex-row items-center justify-between min-h-[64px] px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
            <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-2">
                    <Text className={`text-base font-medium ${isPremium ? 'text-yellow-400' : 'text-slate-200'}`}>
                        {title}
                    </Text>
                    {isPremium && <FontAwesome5 name="crown" size={12} color="#facc15" />}
                </View>
                {subtitle && (
                    <Text className="text-xs text-slate-500 mt-1">{subtitle}</Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "#1e293b", true: isPremium ? "#eab308" : "#3b82f6" }}
                thumbColor={"#f8fafc"}
            />
        </View>
    );

    const SectionHeader = ({ title }) => (
        <Text className="pt-8 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">
            {title}
        </Text>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <View className="flex-1 w-full h-full">

                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 bg-background-dark border-b border-slate-800 sticky top-0 z-10">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-bold text-center text-white">
                        Ajustes
                    </Text>
                    <View className="w-10 h-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* Premium Banner */}
                    <View className="mt-6 mx-4 p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-full bg-yellow-500/20 items-center justify-center border border-yellow-500/50">
                                <FontAwesome5 name="crown" size={20} color="#fbbf24" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">Plano Guardian</Text>
                                <Text className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Membro Premium</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="mt-4 bg-slate-700 h-10 rounded-lg items-center justify-center border border-slate-600">
                            <Text className="text-white font-bold text-sm">Gerenciar Assinatura</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Privacidade */}
                    <SectionHeader title="Privacidade e Segurança" />
                    <View className="flex-col overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 mx-4">
                        <SettingSwitchRow
                            title="Modo Fantasma"
                            subtitle="Fique invisível no mapa enquanto navega."
                            value={privacyMap.ghostMode}
                            onToggle={() => togglePrivacy('ghostMode')}
                            isPremium={true}
                        />
                        <SettingSwitchRow
                            title="Perfil Público"
                            subtitle="Permitir que vizinhos vejam suas conquistas."
                            value={privacyMap.perfilVisivel}
                            onToggle={() => togglePrivacy('perfilVisivel')}
                        />
                        <SettingSwitchRow
                            title="Compartilhar Localização"
                            subtitle="Apenas durante alertas de SOS ativos."
                            value={privacyMap.localizacao}
                            onToggle={() => togglePrivacy('localizacao')}
                        />
                    </View>

                    {/* Notificações */}
                    <SectionHeader title="Alertas da Comunidade" />
                    <View className="flex-col overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 mx-4">
                        <SettingSwitchRow
                            title="Crimes Violentos"
                            value={notificationsMap.roubo}
                            onToggle={() => toggleNotification('roubo')}
                        />
                        <SettingSwitchRow
                            title="Atividades Suspeitas"
                            value={notificationsMap.atividades}
                            onToggle={() => toggleNotification('atividades')}
                        />
                        <SettingSwitchRow
                            title="Avisos Gerais"
                            value={notificationsMap.comunitario}
                            onToggle={() => toggleNotification('comunitario')}
                        />
                    </View>

                    {/* Conta */}
                    <SectionHeader title="Sua Conta" />
                    <View className="flex-col overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 mx-4">
                        <SettingClickableRow
                            title="Dados Pessoais"
                            icon="person"
                            onPress={() => navigation.navigate('PersonalData')}
                        />
                        <SettingClickableRow
                            title="Segurança e Senha"
                            icon="lock"
                            onPress={() => navigation.navigate('SecuritySettings')}
                        />
                        <SettingClickableRow
                            title="Contatos de Emergência"
                            icon="contact-phone"
                            onPress={() => navigation.navigate('EmergencyContacts')}
                        />
                    </View>

                    {/* Suporte */}
                    <SectionHeader title="Outros" />
                    <View className="flex-col overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 mx-4">
                        <SettingClickableRow title="Ajuda e Suporte" icon="help" />
                        <SettingClickableRow title="Termos de Uso" icon="description" />
                        <SettingClickableRow title="Sair da Conta" isDestructive={true} showChevron={false} icon="logout" />
                    </View>

                    <Text className="text-center text-slate-600 text-xs mt-8 mb-4">
                        Versão 1.0.2 (Build 2025.12)
                    </Text>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserSettingsScreen;
