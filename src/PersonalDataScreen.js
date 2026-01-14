import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const PersonalDataScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
            // Pre-fill email from auth user if available
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error(error);
                Alert.alert('Erro', 'Falha ao carregar perfil.');
            } else if (data) {
                setFormData({
                    name: data.full_name || '',
                    email: user.email, // Keep auth email as truth
                    phone: data.phone || '',
                    cpf: data.cpf || ''
                });
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updates = {
                id: user.id,
                full_name: formData.name,
                phone: formData.phone,
                // CPF is usually not editable by normal update, but if it is empty we allow setting it?
                // For now let's assume valid updates.
                updated_at: new Date(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) {
                throw error;
            }

            Alert.alert('Sucesso', 'Seus dados foram atualizados com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, value, onChangeText, keyboardType = 'default', editable = true, icon }) => (
        <View className="mb-5">
            <Text className="text-slate-400 text-xs uppercase font-bold mb-2 ml-1 tracking-wider">{label}</Text>
            <View className={`flex-row items-center px-4 h-14 rounded-2xl border transition-all ${editable ? 'bg-slate-800/60 border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800' : 'bg-slate-900/40 border-slate-800/50'}`}>
                {icon && <MaterialIcons name={icon} size={20} color={editable ? "#94a3b8" : "#475569"} style={{ marginRight: 12 }} />}
                <TextInput
                    className={`flex-1 text-white text-base font-medium ${editable ? '' : 'text-slate-500'}`}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#64748b"
                    keyboardType={keyboardType}
                    editable={editable}
                />
                {!editable && <MaterialIcons name="lock" size={16} color="#475569" />}
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
                        Dados Pessoais
                    </Text>
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 active:scale-95 transition-transform"
                        onPress={handleSave}
                    >
                        <MaterialIcons name="check" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 pt-8" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                    {/* Avatar Section */}
                    <View className="items-center mb-10">
                        <View className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 mb-4 shadow-xl shadow-blue-500/20 relative">
                            <View className="w-full h-full rounded-full bg-slate-800 overflow-hidden relative">
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv72kPURbe1UXfRd8yp6_kln-ZotyaJLlffXNLXBpN0EKVf5dLvdIAaCw5x0i_LwW795iWZyeKPlRrFsse4Y31XuBn9gAsE0vb6NkKmj1tRwGliqcGHkOfQzEMomUF0sf08FhysLwIT70jIIGiFY1amTqGsbHsbEi8a1jWCOJXh0llXu_4zkAQfLzv0DXCnHuub9jeLgJP0BYd0Ed1SjpQhHVFuvWCSMuiaanJWCq7oE0adzqhSYgEVYsOwowH0eLc1Fff92Cj4A4q" }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity className="absolute bottom-0 w-full bg-black/60 py-1.5 items-center backdrop-blur-sm">
                                    <Text className="text-[10px] text-white font-bold uppercase tracking-wide">Editar</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1.5 border border-slate-700">
                                <MaterialIcons name="camera-alt" size={16} color="#3b82f6" />
                            </View>
                        </View>
                        <Text className="text-slate-400 text-sm font-medium">Toque na foto para alterar</Text>
                    </View>

                    {/* Form Section */}
                    <View className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
                        <InputField
                            label="Nome Completo"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            icon="person"
                        />
                        <InputField
                            label="E-mail"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                            icon="email"
                        />
                        <InputField
                            label="Telefone"
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            keyboardType="phone-pad"
                            icon="phone"
                        />
                        <InputField
                            label="CPF"
                            value={formData.cpf}
                            editable={false}
                            icon="badge"
                        />
                    </View>

                    <Text className="text-slate-500 text-xs text-center mt-6 px-4 leading-5">
                        Para alterar seu CPF ou outras informações sensíveis, entre em contato com o suporte através da Central de Ajuda.
                    </Text>

                </ScrollView>

                <View className="p-6 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md absolute bottom-0 w-full">
                    <TouchableOpacity
                        className="w-full bg-blue-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all border border-blue-500/20"
                        onPress={handleSave}
                    >
                        <Text className="text-white font-bold text-lg tracking-wide">Salvar Alterações</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PersonalDataScreen;
