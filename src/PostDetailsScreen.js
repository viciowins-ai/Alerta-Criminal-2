import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";

const PostDetailsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [postId]);

  const fetchPostDetails = async () => {
    const { data, error } = await supabase
      .from("incidents")
      .select(
        `
                *,
                profiles (full_name, guardian_level),
                likes (count),
                comments (count)
            `,
      )
      .eq("id", postId)
      .single();

    if (error) console.error("Error fetching post:", error);
    else setPost(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
                *,
                profiles (full_name, avatar_url)
            `,
      )
      .eq("incident_id", postId)
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching comments:", error);
    else setComments(data || []);
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      incident_id: postId,
      content: newComment.trim(),
    });

    if (error) {
      Alert.alert("Erro", "Não foi possível enviar o comentário.");
    } else {
      setNewComment("");
      fetchComments();
      // Refresh post to update comment count if needed, or optimistic update
    }
    setSubmitting(false);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " às " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getIconForType = (type) => {
    switch (type) {
      case "roubo":
        return "running";
      case "suspect":
        return "eye";
      case "vandalism":
        return "trash";
      default:
        return "exclamation-circle";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg ml-2">
          Detalhes do Alerta
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Original Post */}
          {post && (
            <View className="bg-slate-900 mb-4 border-b border-slate-800 pb-4">
              <View className="p-4 flex-row justify-between items-start mb-2">
                <View className="flex-row gap-3">
                  <View className="w-12 h-12 rounded-full bg-slate-700 items-center justify-center border border-slate-600">
                    <FontAwesome5
                      name={getIconForType(post.type)}
                      size={20}
                      color="#94a3b8"
                    />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">
                      {post.profiles?.full_name || "Anônimo"}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {post.profiles?.guardian_level || "Novo Guardião"} •{" "}
                      {formatTime(post.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-slate-100 px-4 mb-4 text-base leading-6">
                {post.description || "Sem descrição."}
              </Text>

              <View className="px-4 mb-4 flex-row items-center gap-1">
                <MaterialIcons
                  name="location-pinned"
                  size={16}
                  color="#64748b"
                />
                <Text className="text-slate-500 text-sm">
                  Lat: {post.latitude.toFixed(4)}, Long:{" "}
                  {post.longitude.toFixed(4)}
                </Text>
              </View>

              <View className="flex-row mx-4 py-2 border-t border-slate-800 gap-6">
                <View className="flex-row items-center gap-2">
                  <Feather name="thumbs-up" size={18} color="#94a3b8" />
                  <Text className="text-slate-400 font-bold">
                    {post.likes?.[0]?.count || 0}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Feather name="message-square" size={18} color="#94a3b8" />
                  <Text className="text-slate-400 font-bold">
                    {comments.length}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Comments Section */}
          <Text className="text-slate-400 font-bold px-4 mb-2 uppercase text-xs tracking-wider">
            Comentários
          </Text>

          {comments.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-slate-600">
                Seja o primeiro a comentar.
              </Text>
            </View>
          ) : (
            comments.map((comment) => (
              <View
                key={comment.id}
                className="px-4 py-3 border-b border-slate-800/50 flex-row gap-3"
              >
                <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center">
                  <Text className="text-white font-bold">
                    {comment.profiles?.full_name?.charAt(0) || "?"}
                  </Text>
                </View>
                <View className="flex-1 bg-slate-800/50 p-3 rounded-2xl rounded-tl-none">
                  <View className="flex-row justify-between items-baseline mb-1">
                    <Text className="text-white font-bold text-sm">
                      {comment.profiles?.full_name || "Anônimo"}
                    </Text>
                    <Text className="text-slate-600 text-[10px]">
                      {formatTime(comment.created_at)}
                    </Text>
                  </View>
                  <Text className="text-slate-300 leading-5">
                    {comment.content}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="p-4 bg-slate-900 border-t border-slate-800 flex-row gap-3 items-center">
          <TextInput
            className="flex-1 bg-slate-800 text-white p-3 rounded-full border border-slate-700 max-h-24"
            placeholder="Escreva um comentário..."
            placeholderTextColor="#64748b"
            multiline
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            onPress={handleSendComment}
            disabled={submitting || !newComment.trim()}
            className={`w-10 h-10 rounded-full items-center justify-center ${newComment.trim() ? "bg-blue-600" : "bg-slate-800"}`}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons
                name="send"
                size={18}
                color={newComment.trim() ? "white" : "#475569"}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailsScreen;
