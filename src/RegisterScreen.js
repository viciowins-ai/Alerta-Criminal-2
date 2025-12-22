import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { signUp, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        await signUp(email, password, { full_name: name });
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }} className="px-6">

                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700 mb-6">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <Text className="text-white font-bold text-3xl mb-2">Crie sua conta</Text>
                    <Text className="text-slate-400 text-base mb-8">Junte-se à comunidade e proteja o seu bairro.</Text>

                    {/* Form */}
                    <View className="gap-5 mb-8">
                        <View>
                            <Text className="text-slate-300 font-bold mb-2 ml-1">Nome Completo</Text>
                            <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center focus:border-blue-500">
                                <MaterialIcons name="person" size={20} color="#64748b" style={{ marginRight: 10 }} />
                                <TextInput
                                    className="flex-1 text-white text-base"
                                    placeholder="Ex: Ana Silva"
                                    placeholderTextColor="#64748b"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-300 font-bold mb-2 ml-1">E-mail</Text>
                            <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center focus:border-blue-500">
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
                        </View>

                        <View>
                            <Text className="text-slate-300 font-bold mb-2 ml-1">Senha</Text>
                            <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center focus:border-blue-500">
                                <MaterialIcons name="lock" size={20} color="#64748b" style={{ marginRight: 10 }} />
                                <TextInput
                                    className="flex-1 text-white text-base"
                                    placeholder="Mínimo 6 caracteres"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-300 font-bold mb-2 ml-1">Confirmar Senha</Text>
                            <View className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 h-14 flex-row items-center focus:border-blue-500">
                                <MaterialIcons name="lock-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
                                <TextInput
                                    className="flex-1 text-white text-base"
                                    placeholder="Repita a senha"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>
                    </View>


                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className="bg-blue-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-blue-600/30 active:bg-blue-700 mb-6"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Criar Conta</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center gap-1 mb-8">
                        <Text className="text-slate-400">Já tem uma conta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-blue-400 font-bold text-base">Entrar</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-slate-600 text-xs text-center px-4">
                        Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
