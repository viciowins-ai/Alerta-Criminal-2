import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const CommunityFeedScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <View style={{ width: 24 }} />
                <Text className="text-white font-bold text-lg">Rede Comunitária</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Create Post Input */}
                <View className="px-4 py-4 border-b border-slate-800 bg-slate-900/50 flex-row gap-3 items-center">
                    <View className="w-10 h-10 rounded-full bg-orange-200 items-center justify-center">
                        <Text className="font-bold text-orange-800">YO</Text>
                    </View>
                    <TouchableOpacity className="flex-1 bg-slate-800 h-12 rounded-full justify-center px-4 border border-slate-700">
                        <Text className="text-slate-400">Criar Nova Publicação...</Text>
                    </TouchableOpacity>
                </View>

                {/* Feed Items */}

                {/* Post 1: Joan Silva */}
                <View className="border-b border-slate-800 bg-slate-900 pt-4 pb-2">
                    <View className="px-4 flex-row justify-between items-start mb-2">
                        <View className="flex-row gap-3">
                            <Image
                                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                                className="w-10 h-10 rounded-full bg-slate-700"
                            />
                            <View>
                                <Text className="text-white font-bold text-base">João Silva</Text>
                                <Text className="text-slate-500 text-xs">há 5 min</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-horiz" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-slate-100 px-4 mb-3 leading-5">
                        Acabei de ver um carro desconhecido circulando lentamente pelo bairro. Alguém mais notou? Fiquem atentos.
                    </Text>

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

                {/* Post 2: Maria Oliveira (With Image) */}
                <View className="border-b border-slate-800 bg-slate-900 pt-4 pb-2">
                    <View className="px-4 flex-row justify-between items-start mb-2">
                        <View className="flex-row gap-3">
                            <Image
                                source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
                                className="w-10 h-10 rounded-full bg-slate-700"
                            />
                            <View>
                                <Text className="text-white font-bold text-base">Maria Oliveira</Text>
                                <Text className="text-slate-500 text-xs">há 1 hora</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-horiz" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-slate-100 px-4 mb-3 leading-5">
                        Pessoal, meu cachorro, um golden retriever chamado Max, fugiu hoje de manhã perto do parque. Ele é amigável e está com uma coleira azul. Se alguém o vir, por favor me avise!
                    </Text>

                    {/* Post Image */}
                    <Image
                        source={{ uri: "https://img.freepik.com/free-photo/golden-retriever-dog-portrait-outdoor_23-2149202521.jpg" }}
                        className="w-full h-64 bg-slate-800 mb-3"
                        resizeMode="cover"
                    />

                    {/* Actions */}
                    <View className="flex-row border-t border-slate-800 mt-1 py-2 mx-4">
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

                {/* Post 3: Carlos Souza */}
                <View className="border-b border-slate-800 bg-slate-900 pt-4 pb-2">
                    <View className="px-4 flex-row justify-between items-start mb-2">
                        <View className="flex-row gap-3">
                            <View className="w-10 h-10 rounded-full bg-orange-300 items-center justify-center">
                                <FontAwesome5 name="store" size={16} color="#7c2d12" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">Carlos Souza</Text>
                                <Text className="text-slate-500 text-xs">há 3 horas</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <MaterialIcons name="more-horiz" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-slate-100 px-4 mb-3 leading-5">
                        Atenção, vizinhos! A Rua das Flores estará fechada no próximo sábado, das 8h às 18h, para a nossa festa de bairro. Planejem suas rotas!
                    </Text>

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

            </ScrollView>
        </SafeAreaView>
    );
};

export default CommunityFeedScreen;
