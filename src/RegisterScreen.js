import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { signInWithGoogle, loading } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }} className="px-6">

                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700 mb-6">
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <Text className="text-white font-bold text-3xl mb-2">Crie sua conta</Text>
                    <Text className="text-slate-400 text-base mb-12">Junte-se à comunidade e proteja o seu bairro.</Text>

                    {/* Google Sign-up Button */}
                    <TouchableOpacity
                        onPress={signInWithGoogle}
                        disabled={loading}
                        className="bg-white h-14 rounded-full border border-gray-300 flex-row items-center shadow-sm active:bg-gray-100 mb-6 px-4"
                        style={{ elevation: 2 }}
                    >
                        <Image
                            source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
                            style={{ width: 24, height: 24, marginRight: 16 }}
                            resizeMode="contain"
                        />
                        <Text className="text-gray-600 font-semibold text-base flex-1 text-center" style={{ fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto' }}>
                            Cadastrar com o Google
                        </Text>
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
