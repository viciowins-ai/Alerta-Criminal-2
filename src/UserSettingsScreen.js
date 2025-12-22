import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// ... imports remain the same ...

const UserSettingsScreen = ({ navigation }) => {
    // State to manage toggle switches
    const [isDarkMode, setIsDarkMode] = useState(true);

    const SettingClickableRow = ({ title, showChevron = true, icon, onPress, color = '#3b82f6' }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between min-h-[60px] px-5 py-3 active:bg-slate-700/30 transition-colors"
            onPress={onPress}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/80 border border-slate-700/50 shadow-sm">
                    <MaterialIcons name={icon} size={22} color={color} />
                </View>
                <Text className="text-[15px] text-slate-200 font-semibold tracking-wide">
                    {title}
                </Text>
            </View>
            {showChevron && (
                <MaterialIcons name="chevron-right" size={22} color="#64748b" />
            )}
        </TouchableOpacity>
    );

    const SettingSwitchRow = ({ title, icon, value, onToggle, color = '#3b82f6' }) => (
        <View className="flex-row items-center justify-between min-h-[60px] px-5 py-3">
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl items-center justify-center bg-slate-800/80 border border-slate-700/50 shadow-sm">
                    <MaterialIcons name={icon} size={22} color={color} />
                </View>
                <Text className="text-[15px] text-slate-200 font-semibold tracking-wide">
                    {title}
                </Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "#1e293b", true: "#3b82f6" }}
                thumbColor={"#f8fafc"}
            />
        </View>
    );

    const SectionHeader = ({ title }) => (
        <Text className="pt-8 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500 px-6 ml-1">
            {title}
        </Text>
    );

    const GroupContainer = ({ children }) => (
        <View className="bg-slate-900/40 rounded-3xl overflow-hidden mx-5 border border-slate-800/80 shadow-sm backdrop-blur-md">
            {React.Children.map(children, (child, index) => (
                <>
                    {child}
                    {index < React.Children.count(children) - 1 && (
                        <View className="h-[1px] bg-slate-800/80 ml-[70px]" />
                    )}
                </>
            ))}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <View className="flex-1 w-full h-full">

                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-4 bg-background-dark border-b border-slate-800/50 sticky top-0 z-10 backdrop-blur-md bg-opacity-95">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-center text-white tracking-tight">
                        Configurações
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* CONTA */}
                    <SectionHeader title="Sua Conta" />
                    <GroupContainer>
                        <SettingClickableRow
                            title="Informações do Perfil"
                            icon="person"
                            color="#38bdf8"
                            onPress={() => navigation.navigate('PersonalData')}
                        />
                        <SettingClickableRow
                            title="Alterar E-mail"
                            icon="email"
                            color="#38bdf8"
                        />
                        <SettingClickableRow
                            title="Segurança e Senha"
                            icon="lock"
                            color="#38bdf8"
                            onPress={() => navigation.navigate('SecuritySettings')}
                        />
                    </GroupContainer>

                    {/* NOTIFICAÇÕES */}
                    <SectionHeader title="Notificações" />
                    <GroupContainer>
                        <SettingClickableRow title="Notificações Push" icon="notifications" color="#fbbf24" />
                    </GroupContainer>

                    {/* PRIVACIDADE E SEGURANÇA */}
                    <SectionHeader title="Privacidade" />
                    <GroupContainer>
                        <SettingClickableRow title="Localização" icon="location-on" color="#4ade80" />
                        <SettingClickableRow
                            title="Contatos Bloqueados"
                            icon="block"
                            color="#f87171"
                            onPress={() => navigation.navigate('EmergencyContacts')}
                        />
                    </GroupContainer>

                    {/* GERAL */}
                    <SectionHeader title="Preferências" />
                    <GroupContainer>
                        <SettingClickableRow title="Idioma" icon="language" color="#a78bfa" />
                        <SettingSwitchRow
                            title="Modo Escuro"
                            icon="dark-mode"
                            color="#a78bfa"
                            value={isDarkMode}
                            onToggle={() => setIsDarkMode(!isDarkMode)}
                        />
                    </GroupContainer>

                    {/* SOBRE */}
                    <SectionHeader title="Sobre o App" />
                    <GroupContainer>
                        <SettingClickableRow title="Termos de Serviço" icon="gavel" color="#94a3b8" />
                        <SettingClickableRow title="Política de Privacidade" icon="security" color="#94a3b8" />
                        <SettingClickableRow
                            title="Ajuda e Suporte"
                            icon="help-outline"
                            color="#94a3b8"
                            onPress={() => navigation.navigate('HelpCenter')}
                        />
                    </GroupContainer>

                    {/* Actions */}
                    <View className="mx-6 mt-10 gap-4 mb-4">
                        <TouchableOpacity className="bg-slate-800 py-4 rounded-xl items-center border border-slate-700 active:bg-slate-700">
                            <Text className="text-white font-bold tracking-wide">Sair da Conta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-500/10 py-4 rounded-xl items-center border border-red-500/20 active:bg-red-500/20">
                            <Text className="text-red-400 font-bold tracking-wide">Excluir Conta</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-slate-600 text-[11px] mb-8 font-medium">
                        Stitch Alerta • Versão 1.1.0 (Build 502)
                    </Text>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserSettingsScreen;
