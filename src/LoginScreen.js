import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { signIn, signInAsGuest, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }
        await signIn(email, password);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">

                    {/* Header Logo */}
                    <View className="items-center mb-10">
                        <View className="w-20 h-20 bg-slate-800 rounded-3xl items-center justify-center border border-slate-700 mb-4 shadow-lg shadow-blue-900/20 transform rotate-3">
                            <FontAwesome5 name="shield-alt" size={40} color="#3b82f6" style={{ transform: [{ rotate: '-3deg' }] }} />
                        </View>
                        <Text className="text-white font-bold text-3xl tracking-tight">Alerta Criminal</Text>
                        <Text className="text-slate-400 text-base mt-1">Sua segurança em primeiro lugar</Text>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <Text className="text-slate-300 font-bold mb-2 ml-1">E-mail</Text>
                        <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center mb-4 focus:border-blue-500 transition-colors">
                            <MaterialIcons name="email" size={20} color="#64748b" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="seu@email.com"
                                placeholderTextColor="#64748b"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <Text className="text-slate-300 font-bold mb-2 ml-1">Senha</Text>
                        <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center mb-2 focus:border-blue-500 transition-colors">
                            <MaterialIcons name="lock" size={20} color="#64748b" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity className="self-end p-2">
                            <Text className="text-blue-400 font-bold text-sm">Esqueci minha senha</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-blue-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-blue-600/30 active:bg-blue-700 mb-4"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Entrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Guest Login Button */}
                    <TouchableOpacity
                        onPress={signInAsGuest}
                        disabled={loading}
                        className="bg-slate-700 h-14 rounded-xl items-center justify-center border border-slate-600 active:bg-slate-600 mb-6"
                    >
                        <Text className="text-white font-bold text-base">Entrar como Visitante (Teste)</Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center gap-1">
                        <Text className="text-slate-400">Não tem uma conta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-blue-400 font-bold text-base">Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Admin Link (Hidden/Subtle) */}
                    <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} className="mt-12 self-center opacity-50">
                        <Text className="text-slate-600 text-xs uppercase tracking-widest">Acesso Administrativo</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
