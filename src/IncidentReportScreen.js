import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const IncidentReportScreen = () => {
    const [step, setStep] = useState(0); // 0: Location, 1: Type, 2: Details, 3: Success
    const [selectedType, setSelectedType] = useState(null);
    const [description, setDescription] = useState('');

    const INCIDENT_TYPES = [
        { id: 'theft', label: 'Roubo', icon: 'running', color: '#ef4444' },
        { id: 'assault', label: 'Assalto', icon: 'fist-raised', color: '#f97316' },
        { id: 'suspicious', label: 'Suspeito', icon: 'user-secret', color: '#eab308' },
        { id: 'vandalism', label: 'Vandalismo', icon: 'spray-can', color: '#8b5cf6' },
        { id: 'accident', label: 'Acidente', icon: 'car-crash', color: '#3b82f6' },
        { id: 'noise', label: 'Barulho', icon: 'bullhorn', color: '#10b981' },
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = () => {
        // Simulate API call
        setTimeout(() => {
            setStep(3);
        }, 1000);
    };

    const resetFlow = () => {
        setStep(0);
        setSelectedType(null);
        setDescription('');
    };

    const renderStepIndicator = () => (
        <View className="flex-row justify-center gap-2 mb-6">
            {[0, 1, 2].map(i => (
                <View
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-2 bg-green-500' : 'w-2 bg-slate-700'}`}
                />
            ))}
        </View>
    );

    // Step 0: Location Confirmation
    const LocationStep = () => (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1">
            <Text className="text-xl font-bold text-white mb-2 text-center">Onde aconteceu?</Text>
            <Text className="text-slate-400 text-center mb-6">Confirme a localização no mapa para alertar seus vizinhos.</Text>

            <View className="flex-1 bg-slate-800 rounded-2xl overflow-hidden mb-6 relative border border-slate-700">
                <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8GE97LjX0E2YCcgJcn11kQ6of2weCzmAkR4Q5HNmJEvTmyFY_JLtAUMdmlzH3oYbfXG9NlNDGT6IG5BKkd5agtvE6ohXRVqQS8svaXNzmRyzd-4P4mlUb_EaN9HT4ASXBo0UWybrAS9eEdMqPwTfTg412qvTighcjlocIve1QfUr3iA7lDQweGkA-hbhIuDgRecqKPymOjPFbqi3Dv9teXp3zTJOs4i8HoTHR0hnOiHyYVrSjkUSJRLrdZG1-TV-SI236lWCiMk1" }}
                    className="w-full h-full opacity-80"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 items-center justify-center">
                    <View className="w-48 h-48 bg-blue-500/20 rounded-full items-center justify-center animate-pulse border border-blue-500/50">
                        <MaterialIcons name="location-pin" size={48} color="#3b82f6" />
                    </View>
                </View>
                <View className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                    <Text className="text-white font-bold text-center">Rua das Flores, 123 - Centro</Text>
                </View>
            </View>

            <TouchableOpacity onPress={handleNext} className="bg-primary h-14 rounded-xl items-center justify-center shadow-lg shadow-red-500/20">
                <Text className="text-white font-bold text-lg">Confirmar Local</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    // Step 1: Incident Type Category
    const TypeStep = () => (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1">
            <Text className="text-xl font-bold text-white mb-2 text-center">O que você viu?</Text>
            <Text className="text-slate-400 text-center mb-6">Escolha a categoria que melhor descreve o incidente.</Text>

            <View className="flex-row flex-wrap justify-between gap-y-4">
                {INCIDENT_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        onPress={() => {
                            setSelectedType(type);
                            handleNext();
                        }}
                        className="w-[48%] aspect-square bg-slate-800 rounded-2xl items-center justify-center border-2 border-slate-700 active:border-primary active:bg-slate-700"
                    >
                        <View style={{ backgroundColor: type.color + '20' }} className="w-16 h-16 rounded-full items-center justify-center mb-3">
                            <FontAwesome5 name={type.icon} size={28} color={type.color} />
                        </View>
                        <Text className="text-white font-bold">{type.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    // Step 2: Details & Submit
    const DetailsStep = () => (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1">
            <Text className="text-xl font-bold text-white mb-2 text-center">Detalhes Adicionais</Text>
            <Text className="text-slate-400 text-center mb-6">Ajude a comunidade com mais informações (Opcional).</Text>

            <View className="flex-row items-center gap-4 mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <View style={{ backgroundColor: selectedType?.color + '20' }} className="w-12 h-12 rounded-full items-center justify-center">
                    <FontAwesome5 name={selectedType?.icon} size={20} color={selectedType?.color} />
                </View>
                <View>
                    <Text className="text-slate-400 text-xs uppercase">Categoria</Text>
                    <Text className="text-white font-bold text-lg">{selectedType?.label}</Text>
                </View>
                <TouchableOpacity onPress={handleBack} className="ml-auto">
                    <Text className="text-blue-400 font-bold">Alterar</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-white font-bold mb-2 ml-1">Descrição</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                className="w-full h-40 bg-slate-800 rounded-xl p-4 text-white text-base border border-slate-700 mb-6"
                placeholder="Ex: Dois indivíduos em uma moto preta..."
                placeholderTextColor="#64748b"
                multiline
                textAlignVertical="top"
            />

            <TouchableOpacity onPress={handleSubmit} className="mt-auto bg-green-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-green-500/20">
                <Text className="text-white font-bold text-lg">Publicar Alerta</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    // Step 3: Success & Gamification
    const SuccessStep = () => (
        <Animated.View entering={ZoomIn} className="flex-1 items-center justify-center">

            <View className="w-32 h-32 bg-green-500 rounded-full items-center justify-center shadow-lg shadow-green-500/50 mb-8 icon-pulse">
                <MaterialIcons name="check" size={64} color="white" />
            </View>

            <Text className="text-3xl font-bold text-white text-center mb-2">Alerta Publicado!</Text>
            <Text className="text-slate-400 text-center max-w-xs mb-8">Obrigado por contribuir para a segurança da sua comunidade.</Text>

            {/* Reward Card */}
            <View className="bg-slate-800/80 border border-yellow-500/30 w-full p-6 rounded-2xl items-center relative overflow-hidden mb-8">
                <View className="absolute top-0 w-full h-1 bg-yellow-500/50" />
                <Text className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-2">Recompensa</Text>
                <Text className="text-white font-black text-4xl mb-1">+50</Text>
                <Text className="text-slate-300 text-sm">Pontos de Cidadania</Text>
            </View>

            <TouchableOpacity onPress={resetFlow} className="bg-slate-700 w-full h-14 rounded-xl items-center justify-center">
                <Text className="text-white font-bold text-lg">Voltar ao Início</Text>
            </TouchableOpacity>
        </Animated.View>
    );


    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <StatusBar style="light" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <View className="flex-1 px-4 py-2">

                    {/* Header */}
                    {step < 3 && (
                        <View className="flex-row items-center mb-4">
                            {step > 0 && (
                                <TouchableOpacity onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 mr-4">
                                    <MaterialIcons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                            <Text className="text-white font-bold text-xl flex-1">Novo Relatório</Text>
                            <TouchableOpacity onPress={resetFlow}>
                                <MaterialIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {step < 3 && renderStepIndicator()}

                    {step === 0 && <LocationStep />}
                    {step === 1 && <TypeStep />}
                    {step === 2 && <DetailsStep />}
                    {step === 3 && <SuccessStep />}

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default IncidentReportScreen;
