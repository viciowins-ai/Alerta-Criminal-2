import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const CommunityFeedScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Todos");

  // Map of likesByUser: { incidentId: true/false }
  const [likedPosts, setLikedPosts] = useState({});

  const fetchPosts = async () => {
    try {
      // Fetch incidents joined with profiles, likes count, comments count
      const { data, error } = await supabase
        .from("incidents")
        .select(
          `
            *,
            profiles (full_name, guardian_level),
            likes (count),
            comments (count)
          `
        )
        .order("created_at", { ascending: false });

      if (user) {
        const { data: userLikes } = await supabase
          .from("likes")
          .select("incident_id")
          .eq("user_id", user.id);

        const likesMap = {};
        userLikes?.forEach((l) => (likesMap[l.incident_id] = true));
        setLikedPosts(likesMap);
      }

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Exception fetching posts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
    setLikedPosts((prev) => ({ ...prev, [incidentId]: !isLiked })); // Optimistic

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .match({ user_id: user.id, incident_id: incidentId });
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, incident_id: incidentId });
    }
    fetchPosts();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  const getIncidentTitle = (type) => {
    switch (type) {
      case "roubo": return "Assalto na região";
      case "suspect": return "Atividade suspeita";
      case "vandalism": return "Acidente / Vandalismo";
      default: return "Alerta Vizinhança";
    }
  };

  const renderPost = ({ item }) => (
    <View className="bg-[#1f2235] px-5 pt-6 pb-4 border-b border-[#2C304A]">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("PostDetails", { postId: item.id })}
        className="flex-1"
      >
        {/* Header - User Info */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-indigo-500 items-center justify-center border-2 border-[#1f2235] shadow-lg shadow-indigo-500/30">
              <Text className="text-white font-extrabold text-[15px]">
                {item.profiles?.full_name ? item.profiles.full_name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-white font-bold text-[15px] tracking-tight">
                  {item.profiles?.full_name || "Usuário Anônimo"}
                </Text>
                {/* Verified/Guardian Badge Example */}
                {item.profiles?.guardian_level > 0 && (
                  <MaterialIcons name="verified" size={14} color="#fbbf24" />
                )}
              </View>
              <Text className="text-slate-400 text-[12px] font-medium mt-0.5">
                {formatTime(item.created_at)}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="p-2 -mr-3 rounded-full hover:bg-white/5 transition-colors">
            <MaterialIcons name="more-horiz" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Content Box */}
        <View className="bg-[#262A42] rounded-2xl p-4 mb-4 border border-[#303554] shadow-sm">
          <Text className="text-[#fbbf24] font-black text-[13px] uppercase tracking-wider mb-2">
            {getIncidentTitle(item.type)}
          </Text>
          <Text className="text-slate-200 text-[14px] leading-[22px]" numberOfLines={4}>
            {item.description || "Ocorrência sem descrição detalhada. Acesse para ver detalhes e localização exata no mapa."}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Footer Actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-6">
          <TouchableOpacity
            onPress={() => toggleLike(item.id)}
            className="flex-row items-center gap-2 px-2 py-1"
          >
            <FontAwesome5
              name="exclamation-triangle"
              size={15}
              color={likedPosts[item.id] ? "#fbbf24" : "#64748b"}
            />
            <Text className={`font-bold text-[13px] ${likedPosts[item.id] ? 'text-[#fbbf24]' : 'text-slate-400'}`}>
              {item.likes?.[0]?.count || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PostDetails", { postId: item.id })}
            className="flex-row items-center gap-2 px-2 py-1"
          >
            <Feather name="message-circle" size={16} color="#64748b" />
            <Text className="text-slate-400 font-bold text-[13px]">
              {item.comments?.[0]?.count || 0}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("PostDetails", { postId: item.id })}
          className="bg-[#fbbf24] px-5 py-2 rounded-full active:bg-[#f59e0b] shadow-[0_4px_14px_rgba(251,191,36,0.25)]"
        >
          <Text className="text-[#1f2235] font-black text-[12px] uppercase tracking-widest">
            Avaliar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1f2235]" edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor="#1f2235" />

      {/* Header Section */}
      <View className="px-5 pt-4 pb-3 z-20 bg-[#1f2235]">
        {/* Title Bar */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700">
              <Feather name="map-pin" size={18} color="#fbbf24" />
            </View>
            <View>
              <Text className="text-white font-extrabold text-[20px] tracking-tight">Comunidade</Text>
              <Text className="text-[#fbbf24] text-[11px] font-bold uppercase tracking-widest mt-0.5">Raio de 5km</Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700 active:bg-slate-700"
          >
            <Feather name="search" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Create Post Input Trigger */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Reportar")}
          className="flex-row items-center bg-[#292D46] border border-[#3A3F63] rounded-full px-4 py-3 mb-5 shadow-sm"
        >
          <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center mr-3">
            <MaterialIcons name="person" size={18} color="#94A3B8" />
          </View>
          <Text className="flex-1 text-slate-400 font-medium text-[14px]">
            Inicie uma discussão ou relate algo...
          </Text>
          <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-600/40">
            <Feather name="plus" size={18} color="white" />
          </View>
        </TouchableOpacity>

        {/* Horizontal Navigation Pills */}
        <View className="-mx-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {["Todos", "Alertas 🔥", "Suspeitos 👀", "Perdidos", "Eventos"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full border ${activeTab === tab
                  ? "bg-blue-600 border-blue-500 shadow-md shadow-blue-600/30"
                  : "bg-[#292D46] border-[#3A3F63]"
                  }`}
              >
                <Text
                  className={`font-bold text-[13px] ${activeTab === tab ? "text-white" : "text-slate-300"
                    }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Main List */}
      <View className="flex-1 bg-[#1A1C2C]">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#fbbf24" />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 4 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#fbbf24"
                colors={["#fbbf24"]}
                progressBackgroundColor="#1f2235"
              />
            }
            ListEmptyComponent={
              <View className="py-20 items-center px-10">
                <View className="w-20 h-20 bg-[#292D46] rounded-full items-center justify-center mb-6 border border-[#3A3F63]">
                  <Feather name="wind" size={32} color="#64748b" />
                </View>
                <Text className="text-white font-extrabold text-center text-[18px] mb-2 tracking-tight">
                  Tudo tranquilo por aqui
                </Text>
                <Text className="text-slate-400 text-center text-[14px] leading-6 font-medium">
                  Nenhum alerta ou discussão na sua área nas últimas 24 horas. Continue mantendo a vizinhança segura!
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityFeedScreen;
