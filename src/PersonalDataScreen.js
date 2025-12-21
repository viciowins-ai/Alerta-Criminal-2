import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const PersonalDataScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: 'Humberto Silva',
        email: 'humberto@example.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00'
    });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // Implement save logic here (e.g., call API or update context)
        Alert.alert('Sucesso', 'Seus dados foram atualizados com sucesso!');
        navigation.goBack();
    };

    const InputField = ({ label, value, onChangeText, keyboardType = 'default', editable = true }) => (
        <View className="mb-4">
            <Text className="text-slate-400 text-xs uppercase font-bold mb-2 ml-1">{label}</Text>
            <View className={`flex-row items-center px-4 h-12 rounded-xl border ${editable ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
                <TextInput
                    className={`flex-1 text-white text-base ${editable ? '' : 'text-slate-500'}`}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#64748b"
                    keyboardType={keyboardType}
                    editable={editable}
                />
                {!editable && <MaterialIcons name="lock" size={16} color="#64748b" />}
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
                        Dados Pessoais
                    </Text>
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center"
                        onPress={handleSave}
                    >
                        <MaterialIcons name="check" size={24} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-4 pt-6">

                    {/* Avatar Section */}
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-slate-700 items-center justify-center border-2 border-slate-600 mb-3 relative overflow-hidden">
                            <MaterialIcons name="person" size={60} color="#94a3b8" />
                            <TouchableOpacity className="absolute bottom-0 w-full bg-black/50 py-1 items-center">
                                <Text className="text-[10px] text-white font-bold uppercase">Editar</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-slate-500 text-sm">Toque para alterar a foto</Text>
                    </View>

                    {/* Form Section */}
                    <View>
                        <InputField
                            label="Nome Completo"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                        />
                        <InputField
                            label="E-mail"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                        />
                        <InputField
                            label="Telefone"
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            keyboardType="phone-pad"
                        />
                        <InputField
                            label="CPF"
                            value={formData.cpf}
                            editable={false}
                        />
                    </View>

                    <Text className="text-slate-600 text-xs text-center mt-8 px-8">
                        Para alterar seu CPF ou outras informações sensíveis, entre em contato com o suporte.
                    </Text>

                </ScrollView>

                <View className="p-4 border-t border-slate-800 bg-background-dark">
                    <TouchableOpacity
                        className="w-full bg-blue-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-blue-900/20 active:bg-blue-700"
                        onPress={handleSave}
                    >
                        <Text className="text-white font-bold text-lg">Salvar Alterações</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PersonalDataScreen;
