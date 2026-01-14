import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';

import IncidentLocationMap from './components/IncidentLocationMap';

const IncidentReportScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedType) {
            Alert.alert('Ops!', 'Selecione o tipo de incidente.');
            return;
        }

        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para enviar um alerta.');
            return;
        }

        setLoading(true);

        try {
            let latitude = -23.5505;
            let longitude = -46.6333;

            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({});
                    latitude = location.coords.latitude;
                    longitude = location.coords.longitude;
                }
            } catch (e) {
                console.log("Erro ao obter localização, usando padrão:", e);
            }

            const { error } = await supabase.from('incidents').insert({
                user_id: user.id,
                type: selectedType,
                description: description,
                latitude: latitude,
                longitude: longitude,
                status: 'reportado'
            });

            if (error) throw error;

            Alert.alert('Sucesso', 'Alerta enviado para a comunidade!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Falha ao enviar o alerta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg ml-2">Reportar Ocorrência</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Location Map Preview */}
                <Text className="text-slate-300 font-bold text-sm mb-3">Sua Localização Atual</Text>
                <View className="w-full h-48 rounded-xl overflow-hidden mb-6 bg-slate-800 border border-slate-700 relative">
                    <IncidentLocationMap />
                </View>

                {/* Incident Type Grid */}
                <Text className="text-white font-bold text-lg mb-3">Tipo de Incidente</Text>
                <View className="flex-row flex-wrap justify-between gap-3 mb-6">
                    {/* Roubo */}
                    <TouchableOpacity
                        onPress={() => setSelectedType('roubo')}
                        className={`w-[48%] p-4 rounded-xl border flex-row items-center justify-center gap-2 ${selectedType === 'roubo' ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                        <FontAwesome5 name="running" size={18} color="white" />
                        <Text className="text-white font-bold text-sm">Roubo</Text>
                    </TouchableOpacity>

                    {/* Atividade Suspeita */}
                    <TouchableOpacity
                        onPress={() => setSelectedType('suspect')}
                        className={`w-[48%] p-4 rounded-xl border flex-row items-center justify-center gap-2 ${selectedType === 'suspect' ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                        <FontAwesome5 name="eye" size={18} color="white" />
                        <Text className="text-white font-bold text-xs">Atividade Suspeita</Text>
                    </TouchableOpacity>

                    {/* Vandalismo */}
                    <TouchableOpacity
                        onPress={() => setSelectedType('vandalism')}
                        className={`w-[48%] p-4 rounded-xl border flex-row items-center justify-center gap-2 ${selectedType === 'vandalism' ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                        <FontAwesome5 name="trash" size={18} color="white" />
                        <Text className="text-white font-bold text-sm">Vandalismo</Text>
                    </TouchableOpacity>

                    {/* Outro */}
                    <TouchableOpacity
                        onPress={() => setSelectedType('other')}
                        className={`w-[48%] p-4 rounded-xl border flex-row items-center justify-center gap-2 ${selectedType === 'other' ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                        <MaterialIcons name="more-horiz" size={24} color="white" />
                        <Text className="text-white font-bold text-sm">Outro</Text>
                    </TouchableOpacity>
                </View>

                {/* Details */}
                <Text className="text-white font-bold text-lg mb-3">Detalhes da Ocorrência</Text>
                <View className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 h-32 mb-6">
                    <TextInput
                        placeholder="Descreva o que está acontecendo... (Opcional)"
                        placeholderTextColor="#64748b"
                        multiline
                        textAlignVertical="top"
                        className="text-white flex-1 text-base"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Attach Media */}
                <TouchableOpacity className="border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 h-24 items-center justify-center flex-row gap-3 mb-8 hover:bg-slate-800/50 active:bg-slate-800">
                    <MaterialIcons name="add-a-photo" size={24} color="#94a3b8" />
                    <Text className="text-slate-400 font-bold">Anexar Foto ou Vídeo</Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="w-full bg-red-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-red-600/30 active:bg-red-700"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg uppercase tracking-wider">Enviar Alerta</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default IncidentReportScreen;
