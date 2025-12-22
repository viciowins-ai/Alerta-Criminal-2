import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const CommunityFeedScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async () => {
        try {
            // Fetch incidents from Supabase
            // We select *, and ideally we would join with profiles, but let's start simple
            const { data, error } = await supabase
                .from('incidents')
                .select('*')
                .order('created_at', { ascending: false });

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

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
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
        <View className="border-b border-slate-800 bg-slate-900 pt-4 pb-2">
            <View className="px-4 flex-row justify-between items-start mb-2">
                <View className="flex-row gap-3">
                    <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center border border-slate-600">
                        <FontAwesome5 name={getIconForType(item.type)} size={16} color="#94a3b8" />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-base">Alerta de {item.type ? item.type.toUpperCase() : 'INCIDENTE'}</Text>
                        <Text className="text-slate-500 text-xs">{formatTime(item.created_at)}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name="more-horiz" size={24} color="#64748b" />
                </TouchableOpacity>
            </View>

            <Text className="text-slate-100 px-4 mb-3 leading-5">
                {item.description || "Sem descrição fornecida."}
            </Text>

            {/* Location Tag */}
            <View className="px-4 mb-3 flex-row items-center gap-1">
                <MaterialIcons name="location-pin" size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs">Lat: {item.latitude?.toFixed(4)}, Long: {item.longitude?.toFixed(4)}</Text>
            </View>

            {/* Actions */}
            <View className="flex-row border-t border-slate-800 mt-2 py-2 mx-4">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-1">
                    <Feather name="thumbs-up" size={18} color="#94a3b8" />
                    <Text className="text-slate-400 text-sm">Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-1">
                    <Feather name="message-square" size={18} color="#94a3b8" />
                    <Text className="text-slate-400 text-sm">Comentar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-1">
                    <Feather name="share-2" size={18} color="#94a3b8" />
                    <Text className="text-slate-400 text-sm">Compartilhar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <View style={{ width: 24 }} />
                <Text className="text-white font-bold text-lg">Rede Comunitária</Text>
                <TouchableOpacity onPress={fetchPosts}>
                    <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Create Post Input */}
            <View className="px-4 py-4 border-b border-slate-800 bg-slate-900/50 flex-row gap-3 items-center">
                <View className="w-10 h-10 rounded-full bg-orange-200 items-center justify-center">
                    <Text className="font-bold text-orange-800">EU</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Reportar')}
                    className="flex-1 bg-slate-800 h-12 rounded-full justify-center px-4 border border-slate-700"
                >
                    <Text className="text-slate-400">Reportar algo suspeito...</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                    }
                    ListEmptyComponent={
                        <View className="py-10 items-center">
                            <Text className="text-slate-500">Nenhum alerta recente na sua área.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default CommunityFeedScreen;
