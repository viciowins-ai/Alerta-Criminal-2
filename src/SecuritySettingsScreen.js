import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const SecuritySettingsScreen = ({ navigation }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [twoFactor, setTwoFactor] = useState(false);

    const handleChange = (key, value) => {
        setPasswords(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            Alert.alert('Erro', 'As novas senhas não conferem.');
            return;
        }
        if (passwords.new.length < 6) {
            Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: passwords.new });

        if (error) {
            Alert.alert('Erro', 'Não foi possível atualizar a senha. ' + error.message);
        } else {
            Alert.alert('Sucesso', 'Sua senha foi atualizada com sucesso!');
            setPasswords({ current: '', new: '', confirm: '' });
        }
    };

    const PasswordInput = ({ label, value, onChangeText, placeholder }) => (
        <View className="mb-5">
            <Text className="text-slate-400 text-xs uppercase font-bold mb-2 ml-1 tracking-wider">{label}</Text>
            <View className="flex-row items-center px-4 h-14 rounded-2xl border bg-slate-800/60 border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all">
                <MaterialIcons name="lock-outline" size={20} color="#94a3b8" style={{ marginRight: 12 }} />
                <TextInput
                    className="flex-1 text-white text-base font-medium"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#64748b"
                    secureTextEntry
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark w-full h-full" edges={['top']}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 active:scale-95 transition-transform"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-center text-white tracking-tight">
                        Segurança
                    </Text>
                    <View className="w-10 h-10" />
                </View>

                <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>

                    <View className="mb-8">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center">
                                <MaterialIcons name="shield" size={20} color="#3b82f6" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold">Alterar Senha</Text>
                                <Text className="text-slate-500 text-xs">Mantenha sua conta segura</Text>
                            </View>
                        </View>

                        <View className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
                            <PasswordInput
                                label="Senha Atual"
                                value={passwords.current}
                                onChangeText={(text) => handleChange('current', text)}
                                placeholder="Digite sua senha atual"
                            />
                            <PasswordInput
                                label="Nova Senha"
                                value={passwords.new}
                                onChangeText={(text) => handleChange('new', text)}
                                placeholder="Digite a nova senha"
                            />
                            <PasswordInput
                                label="Confirmar Nova Senha"
                                value={passwords.confirm}
                                onChangeText={(text) => handleChange('confirm', text)}
                                placeholder="Confirme a nova senha"
                            />

                            <TouchableOpacity
                                className="mt-2 bg-blue-600 h-12 rounded-xl items-center justify-center shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                                onPress={handleUpdatePassword}
                            >
                                <Text className="text-white font-bold tracking-wide">Atualizar Senha</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-10 pt-6 border-t border-slate-800/50">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-10 h-10 rounded-full bg-purple-500/10 items-center justify-center">
                                <MaterialIcons name="security" size={20} color="#a855f7" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold">Autenticação em Duas Etapas</Text>
                                <Text className="text-slate-500 text-xs">Proteção extra para o login</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50">
                            <View className="flex-1 pr-6">
                                <Text className="text-slate-200 font-bold text-base mb-1">Verificação em 2 Etapas</Text>
                                <Text className="text-slate-500 text-xs leading-5">Adicione uma camada extra de segurança exigindo um código ao entrar.</Text>
                            </View>
                            <Switch
                                value={twoFactor}
                                onValueChange={setTwoFactor}
                                trackColor={{ false: "#1e293b", true: "#3b82f6" }}
                                thumbColor={"#f8fafc"}
                            />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SecuritySettingsScreen;
