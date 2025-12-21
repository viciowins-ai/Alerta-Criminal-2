import React, { useState } from 'react';
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

    const handleUpdatePassword = () => {
        if (passwords.new !== passwords.confirm) {
            Alert.alert('Erro', 'As novas senhas não conferem.');
            return;
        }
        if (passwords.new.length < 6) {
            Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        // Implement password update logic here
        Alert.alert('Sucesso', 'Sua senha foi atualizada com sucesso!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const PasswordInput = ({ label, value, onChangeText, placeholder }) => (
        <View className="mb-4">
            <Text className="text-slate-400 text-xs uppercase font-bold mb-2 ml-1">{label}</Text>
            <View className="flex-row items-center px-4 h-12 rounded-xl border bg-slate-800 border-slate-700 focus:border-blue-500">
                <MaterialIcons name="lock-outline" size={20} color="#64748b" style={{ marginRight: 10 }} />
                <TextInput
                    className="flex-1 text-white text-base"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#475569"
                    secureTextEntry
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 bg-background-dark border-b border-slate-800 sticky top-0 z-10">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-bold text-center text-white">
                        Segurança
                    </Text>
                    <View className="w-10 h-10" />
                </View>

                <ScrollView className="flex-1 px-4 pt-6">

                    <View className="mb-8">
                        <Text className="text-white text-lg font-bold mb-1">Alterar Senha</Text>
                        <Text className="text-slate-500 text-sm mb-6">Escolha uma senha forte para proteger sua conta.</Text>

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
                            className="mt-2 bg-slate-700 h-12 rounded-xl items-center justify-center border border-slate-600 active:bg-slate-600"
                            onPress={handleUpdatePassword}
                        >
                            <Text className="text-white font-bold">Atualizar Senha</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mb-8 pt-6 border-t border-slate-800">
                        <Text className="text-white text-lg font-bold mb-4">Autenticação em Duas Etapas</Text>

                        <View className="flex-row items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <View className="flex-1 pr-4">
                                <Text className="text-slate-200 font-medium mb-1">Verificação em 2 Etapas</Text>
                                <Text className="text-slate-500 text-xs">Adicione uma camada extra de segurança à sua conta exigindo um código ao entrar.</Text>
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
