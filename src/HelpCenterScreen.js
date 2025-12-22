import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const HelpCenterScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">Suporte e Contato</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* FAQ Link */}
                <TouchableOpacity className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center justify-between mb-6 active:bg-slate-700">
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-full bg-orange-900/30 items-center justify-center border border-orange-700/30">
                            <MaterialIcons name="help-outline" size={22} color="#f97316" />
                        </View>
                        <Text className="text-white font-bold text-base">Perguntas Frequentes (FAQ)</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#64748b" />
                </TouchableOpacity>

                {/* Fale Conosco Form */}
                <View className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-8">
                    <Text className="text-white font-bold text-lg mb-4">Fale Conosco</Text>

                    <Text className="text-slate-400 text-sm mb-2">Seu Nome</Text>
                    <TextInput
                        className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 h-12 text-white mb-4"
                        placeholderTextColor="#64748b"
                    />

                    <Text className="text-slate-400 text-sm mb-2">Seu E-mail</Text>
                    <TextInput
                        className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 h-12 text-white mb-4"
                        keyboardType="email-address"
                        placeholderTextColor="#64748b"
                    />

                    <Text className="text-slate-400 text-sm mb-2">Assunto</Text>
                    <TextInput
                        className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 h-12 text-white mb-4"
                        placeholderTextColor="#64748b"
                    />

                    <Text className="text-slate-400 text-sm mb-2">Mensagem</Text>
                    <TextInput
                        className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 h-32 text-white mb-6"
                        multiline
                        textAlignVertical="top"
                        placeholderTextColor="#64748b"
                    />

                    <TouchableOpacity className="w-full bg-orange-500 h-12 rounded-xl items-center justify-center shadow-lg shadow-orange-500/20 active:bg-orange-600">
                        <Text className="text-white font-bold text-base">Enviar Mensagem</Text>
                    </TouchableOpacity>
                </View>

                {/* Outros Canais */}
                <Text className="text-white font-bold text-lg mb-4">Outros Canais</Text>
                <View className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                    {/* WhatsApp */}
                    <TouchableOpacity className="p-4 border-b border-slate-700/50 flex-row items-center justify-between active:bg-slate-700">
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-full bg-green-900/20 items-center justify-center">
                                <FontAwesome5 name="whatsapp" size={20} color="#22c55e" />
                            </View>
                            <Text className="text-white font-bold text-base">WhatsApp</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>

                    {/* Email Direto */}
                    <TouchableOpacity className="p-4 border-b border-slate-700/50 flex-row items-center justify-between active:bg-slate-700">
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-full bg-blue-900/20 items-center justify-center">
                                <MaterialIcons name="alternate-email" size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-white font-bold text-base">E-mail Direto</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>

                    {/* Redes Sociais */}
                    <TouchableOpacity className="p-4 flex-row items-center justify-between active:bg-slate-700">
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-full bg-purple-900/20 items-center justify-center">
                                <MaterialIcons name="groups" size={22} color="#a855f7" />
                            </View>
                            <Text className="text-white font-bold text-base">Redes Sociais</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpCenterScreen;
