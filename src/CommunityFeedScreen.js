import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const CommunityFeedScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Map of likesByUser: { incidentId: true/false }
    const [likedPosts, setLikedPosts] = useState({});

    const fetchPosts = async () => {
        try {
            // Fetch incidents joined with profiles, likes count, comments count
            const { data, error } = await supabase
                .from('incidents')
                .select(`
                    *,
                    profiles (full_name, guardian_level),
                    likes (count),
                    comments (count)
                `)
                .order('created_at', { ascending: false });

            // Also check which ones current user liked
            if (user) {
                const { data: userLikes } = await supabase
                    .from('likes')
                    .select('incident_id')
                    .eq('user_id', user.id);

                const likesMap = {};
                userLikes?.forEach(l => likesMap[l.incident_id] = true);
                setLikedPosts(likesMap);
            }

            if (error) {
                console.error('Error fetching pinst:', error);
            } else {
                setPosts(data || []);
            }
        } catch (err) {
            console.error('Exception fetching posts:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Reload when screen comes into focus or on mount
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts();
    }, []);

    const toggleLike = async (incidentId) => {
        if (!user) return;

        const isLiked = likedPosts[incidentId];

        // Optimistic update
        setLikedPosts(prev => ({ ...prev, [incidentId]: !isLiked }));

        if (isLiked) {
            await supabase.from('likes').delete().match({ user_id: user.id, incident_id: incidentId });
        } else {
            await supabase.from('likes').insert({ user_id: user.id, incident_id: incidentId });
        }
        fetchPosts(); // Refresh counts
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'roubo': return 'running';
            case 'suspect': return 'eye';
            case 'vandalism': return 'trash';
            default: return 'exclamation-circle';
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString();
    };

    const renderPost = ({ item }) => (
        <View className="bg-[#1f2235] px-4 pt-5 pb-3">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
                className="flex-1"
            >
                {/* Header do Post: Avatar, Nome, Tempo e Menu */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full bg-orange-200 items-center justify-center overflow-hidden border border-white/10 shadow-sm">
                            {/* Usa iniciais se não tiver imagem para simular o layout */}
                            <Text className="text-orange-900 font-bold text-sm">
                                {item.profiles?.full_name ? item.profiles.full_name.charAt(0).toUpperCase() : "U"}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold text-[14px] leading-4 mb-0.5">
                                {item.profiles?.full_name || "Usuário Anônimo"}
                            </Text>
                            <Text className="text-slate-400 text-[11px] font-medium leading-3">
                                {formatTime(item.created_at)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="p-2 -mr-2">
                        <MaterialIcons name="more-horiz" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Título do Incidente (Mapeado do Tipo) */}
                <Text className="text-white font-bold text-[15px] mb-2 leading-tight">
                    {item.type === 'roubo' ? "Assalto na região" :
                        item.type === 'suspect' ? "Atividade suspeita" :
                            item.type === 'vandalism' ? "Acidente/Vandalismo na via" :
                                "Reporte importante na vizinhança"}
                </Text>

                {/* Descrição Principal */}
                <Text className="text-slate-300 text-[13px] leading-5 mb-4" numberOfLines={4}>
                    {item.description || "Ocorrência sem descrição detalhada. Fique alerta nas redondezas e acesse o mapa para ver o local exato."}
                </Text>

                {/* Área de Mídia Simples (Exemplo Estático para imitar layout se houvesse imagem) */}
                {/* No futuro: if (item.image_url) renderImage... */}
            </TouchableOpacity>

            {/* Rodapé: Alertas (Curtidas) e Comentários (Botão Amarelo) */}
            <View className="flex-row items-center justify-between mt-1">
                {/* Contador de Engajamento */}
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                        onPress={() => toggleLike(item.id)}
                        className="flex-row items-center gap-1.5 p-1"
                    >
                        <FontAwesome5
                            name="exclamation"
                            size={14}
                            color={likedPosts[item.id] ? "#fbbf24" : "#fbbf24"} // Amarelo constante imitando o layout
                        />
                        <Text className="text-slate-400 font-bold text-[12px]">
                            {item.likes?.[0]?.count || 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
                        className="flex-row items-center gap-1.5 p-1"
                    >
                        <Feather name="message-square" size={14} color="#94a3b8" />
                        <Text className="text-slate-400 font-bold text-[12px]">
                            {item.comments?.[0]?.count || 0}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botão de Comentar (Amarelo Cápsula) */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
                    className="bg-[#fbbf24] px-5 py-1.5 rounded-full active:bg-[#f59e0b] shadow-[0_2px_10px_rgba(251,191,36,0.2)]"
                >
                    <Text className="text-[#1f2235] font-black text-[12px] uppercase">Comentar</Text>
                </TouchableOpacity>
            </View>

            {/* Linha Divisória Escura Simples entre posts */}
            <View className="h-[1px] bg-white/5 mt-4 -mx-4" />
        </View>
    );

    return (
    return (
        <SafeAreaView className="flex-1 bg-[#1f2235]">
            <StatusBar style="light" />

            {/* Top Bar (Cápsula Translúcida do Layout) */}
            <View className="bg-[#1f2235] px-4 pt-4 pb-4">
                <View className="flex-row items-center justify-between border-b border-white/5 pb-4">
                    <View className="w-10 h-10 rounded-full bg-orange-200 items-center justify-center shadow-sm">
                        <Text className="text-orange-900 font-bold text-sm">EU</Text>
                    </View>
                    <Text className="text-white font-extrabold text-[16px] tracking-wide">Feed da Comunidade</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Reportar')} className="w-10 h-10 items-center justify-center rounded-full bg-slate-800/30">
                        <FontAwesome5 name="plus" size={18} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Create Post Input Inline */}
                <View className="pt-4 flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-full bg-orange-200 items-center justify-center hidden" />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Reportar')}
                        className="flex-1 py-1"
                    >
                        <Text className="text-slate-400 text-[14px]">Compartilhe algo com sua vizinhança...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Reportar')}
                        className="bg-blue-600 px-5 py-1.5 rounded-full border border-blue-500 shadow-md"
                    >
                        <Text className="text-white font-bold text-[12px] uppercase">Postar</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Pills (Categorias do Layout) */}
                <View className="flex-row items-center gap-2 mt-4 pb-1">
                    <TouchableOpacity className="bg-blue-600 px-4 py-1.5 rounded-full border border-blue-500 shadow-sm">
                        <Text className="text-white font-bold text-[12px]">Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Text className="text-slate-300 font-medium text-[12px]">Alertas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Text className="text-slate-300 font-medium text-[12px]">Perguntas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Text className="text-slate-300 font-medium text-[12px]">Eventos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Linha Divisória Sutil no Final do Cabeçalho */}
            <View className="h-[1px] bg-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-10" />

            {loading ? (
                <View className="flex-1 items-center justify-center bg-[#1f2235]">
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="bg-[#1f2235]"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" colors={["#fbbf24"]} />
                    }
                    ListEmptyComponent={
                        <View className="py-16 items-center px-8">
                            <Ionicons name="chatbubbles-outline" size={48} color="#334155" className="mb-4" />
                            <Text className="text-white font-bold text-center text-[16px] mb-2">Comunidade Silenciosa</Text>
                            <Text className="text-slate-500 text-center text-[13px] leading-5">Não há alertas ou mensagens ativas na sua vizinhança recente.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default CommunityFeedScreen;
