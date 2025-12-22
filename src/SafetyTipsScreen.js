import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const CATEGORIES = [
    { id: '1', name: 'Casa', icon: 'home' },
    { id: '2', name: 'Rua', icon: 'walking' },
    { id: '3', name: 'Digital', icon: 'laptop' },
    { id: '4', name: 'Carro', icon: 'car' },
];

const TIPS = [
    {
        id: '1',
        title: 'Ao chegar em casa à noite',
        category: 'Casa',
        content: 'Evite demorar para abrir o portão. Verifique o entorno antes de entrar e se possível, mantenha a área iluminada.',
        premium: false,
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80',
    },
    {
        id: '4',
        title: 'Golpes no WhatsApp',
        category: 'Digital',
        content: 'Ative a confirmação em duas etapas e nunca compartilhe códigos SMS com ninguém.',
        premium: false,
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80',
    },
    {
        id: '3',
        title: 'Técnicas de Autodefesa',
        category: 'Rua',
        content: 'Aprenda pontos vitais e como se desvencilhar de agarramentos. Conteúdo exclusivo para assinantes.',
        premium: true,
        image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&q=80',
    },
    {
        id: '2',
        title: 'Evitando roubos em semaforos',
        category: 'Carro',
        content: 'Mantenha os vidros fechados e não deixe objetos de valor à vista. Fique atento aos retrovisores.',
        premium: true,
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80',
    },

];

const SafetyTipsScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredTips = selectedCategory
        ? TIPS.filter(t => t.category === selectedCategory)
        : TIPS;

    return (
        <SafeAreaView className="flex-1 bg-background-dark w-full h-full" edges={['top']}>
            <StatusBar style="light" />
            <View className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 border-b border-slate-800/50 flex-row items-center gap-3 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 active:scale-95 transition-transform">
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white tracking-tight">Dicas de Segurança</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                    {/* Featured Tip (Dica do Dia) */}
                    <View className="px-6 pt-6 pb-4">
                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Destaque do Dia</Text>
                        <View className="bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden border border-blue-500/50">
                            <View className="z-10 relative">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-400/30">
                                        <Text className="text-blue-100 text-xs font-bold uppercase tracking-wide">Essencial</Text>
                                    </View>
                                    <TouchableOpacity className="w-8 h-8 items-center justify-center rounded-full bg-blue-500/30">
                                        <MaterialIcons name="bookmark-border" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-white font-black text-2xl w-3/4 mb-3 leading-7">Não reaja a assaltos</Text>
                                <Text className="text-blue-100 text-sm leading-6 mb-5 font-medium opacity-90">Sua vida vale mais que qualquer bem material. Mantenha a calma e faça movimentos lentos.</Text>
                                <TouchableOpacity className="bg-white px-5 py-3 self-start rounded-xl active:scale-95 transition-transform">
                                    <Text className="text-blue-700 font-bold text-sm">Ler artigo completo</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Decorative Icon */}
                            <IconBackground name="shield-alt" size={180} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', right: -30, bottom: -30, transform: [{ rotate: '-15deg' }] }} />
                        </View>
                    </View>

                    {/* Categories */}
                    <View className="px-6 mb-6">
                        <Text className="text-white font-bold text-lg mb-4">Explorar por Categoria</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(null)}
                                className={`px-5 py-2.5 rounded-full border ${!selectedCategory ? 'bg-slate-700 border-slate-500' : 'bg-slate-800/80 border-slate-700'}`}
                            >
                                <Text className={`font-bold text-sm ${!selectedCategory ? 'text-white' : 'text-slate-400'}`}>Todas</Text>
                            </TouchableOpacity>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setSelectedCategory(cat.name)}
                                    className={`px-5 py-2.5 rounded-full border flex-row items-center gap-2 ${selectedCategory === cat.name ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 border-slate-700'}`}
                                >
                                    <FontAwesome5 name={cat.icon} size={12} color={selectedCategory === cat.name ? 'white' : '#94a3b8'} />
                                    <Text className={`font-bold text-sm ${selectedCategory === cat.name ? 'text-white' : 'text-slate-400'}`}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Tips List */}
                    <View className="px-6 gap-5">
                        <Text className="text-white font-bold text-lg">Conteúdos Recentes</Text>

                        {filteredTips.map(tip => (
                            <TouchableOpacity key={tip.id} className="bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700/50 shadow-sm active:scale-[0.98] transition-all">
                                <View className="h-40 w-full relative">
                                    <Image source={{ uri: tip.image }} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                                    {tip.premium && (
                                        <View className="absolute top-3 right-3 bg-yellow-400/90 px-2.5 py-1 rounded-lg flex-row items-center gap-1.5 shadow-lg backdrop-blur-sm">
                                            <FontAwesome5 name="crown" size={10} color="#422006" />
                                            <Text className="text-yellow-950 text-[10px] font-black uppercase tracking-wide">Premium</Text>
                                        </View>
                                    )}

                                    <View className="absolute bottom-3 left-4 right-4">
                                        <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 drop-shadow-md">{tip.category}</Text>
                                        <Text className="text-white font-bold text-xl leading-6 drop-shadow-md">{tip.title}</Text>
                                    </View>
                                </View>

                                <View className="p-5 relative">
                                    <Text className="text-slate-300 text-sm leading-6 mb-4 font-light" numberOfLines={2}>{tip.content}</Text>

                                    <View className="flex-row items-center justify-between pt-2 border-t border-slate-700/30">
                                        <View className="flex-row items-center gap-1.5 bg-slate-900/30 px-2 py-1 rounded-md">
                                            <MaterialIcons name="access-time" size={14} color="#94a3b8" />
                                            <Text className="text-slate-400 text-xs font-medium">5 min</Text>
                                        </View>

                                        {tip.premium ? (
                                            <View className="flex-row items-center gap-2">
                                                <MaterialIcons name="lock" size={14} color="#fbbf24" />
                                                <Text className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Desbloquear</Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row items-center gap-1">
                                                <Text className="text-blue-400 text-xs font-bold uppercase tracking-wide">Ler Artigo</Text>
                                                <MaterialIcons name="arrow-forward" size={14} color="#60a5fa" />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Premium Promo Banner */}
                    <View className="mx-6 mt-8 mb-4">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PremiumTips')}
                            activeOpacity={0.9}
                            className="bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-800 p-6 rounded-3xl flex-row items-center justify-between overflow-hidden relative shadow-2xl shadow-amber-900/40 border border-yellow-500/30"
                        >
                            <View className="relative z-10 flex-1 pr-2">
                                <Text className="text-white font-black text-xl mb-1.5 drop-shadow-sm">Seja Guardiã Ouro</Text>
                                <Text className="text-yellow-50 text-xs mb-4 leading-5 opacity-90">Acesso ilimitado a dicas avançadas, aulas de autodefesa e alertas prioritários.</Text>
                                <View className="bg-black/80 px-5 py-2.5 rounded-xl self-start border border-yellow-500/30">
                                    <Text className="text-yellow-400 font-bold text-sm">Assinar Agora</Text>
                                </View>
                            </View>
                            <View className="relative z-10">
                                <FontAwesome5 name="crown" size={48} color="white" style={{ opacity: 0.9, shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 10 }} />
                            </View>

                            {/* Decorative Background Patterns */}
                            <IconBackground name="shield-alt" size={160} color="rgba(255,255,255,0.06)" style={{ position: 'absolute', right: -40, top: -20, transform: [{ rotate: '15deg' }] }} />
                        </TouchableOpacity>
                    </View>

                </ScrollView >
            </View >
        </SafeAreaView >
    );
};

// Helper component for FontAwesome5 to avoid prop warnings
const IconBackground = ({ name, size, color, style }) => (
    <View style={style} pointerEvents="none">
        <FontAwesome5 name={name} size={size} color={color} />
    </View>
);

export default SafetyTipsScreen;
