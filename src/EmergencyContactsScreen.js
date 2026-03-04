import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const EmergencyContactsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar contatos");
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const handleDelete = (id) => {
    Alert.alert(
      "Remover Contato",
      "Tem certeza que deseja remover este contato de emergência?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("emergency_contacts")
              .delete()
              .eq("id", id);

            if (error)
              Alert.alert("Erro", "Não foi possível remover o contato.");
            else fetchContacts();
          },
        },
      ],
    );
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert("Erro", "Nome e telefone são obrigatórios.");
      return;
    }

    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: user.id,
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
    });

    if (error) {
      Alert.alert("Erro", "Não foi possível adicionar o contato.");
      console.error(error);
    } else {
      fetchContacts();
      setNewContact({ name: "", phone: "", relationship: "" });
      setModalVisible(false);
    }
  };

  const renderContactItem = ({ item }) => (
    <View className="flex-row items-center bg-slate-800/60 p-4 mb-3 rounded-2xl border border-slate-700/50 shadow-sm">
      <View className="w-12 h-12 rounded-full bg-slate-700/50 items-center justify-center mr-4 border border-slate-600/50">
        <Text className="text-xl font-bold text-slate-300">
          {item.name.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-base">{item.name}</Text>
        <Text className="text-slate-400 text-sm">{item.phone}</Text>
        {item.relationship && (
          <Text className="text-blue-400 text-xs mt-1 font-medium bg-blue-500/10 self-start px-2 py-0.5 rounded-full">
            {item.relationship}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        className="p-3 bg-red-500/10 rounded-xl"
      >
        <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-background-dark w-full h-full"
      edges={["top"]}
    >
      <StatusBar style="light" />
      <View className="flex-1 w-full h-full">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 active:scale-95 transition-transform"
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-center text-white tracking-tight">
            Contatos de Emergência
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-6">
          <View className="bg-red-900/20 p-4 rounded-2xl border border-red-900/30 mb-6 flex-row gap-3">
            <MaterialIcons
              name="info-outline"
              size={24}
              color="#f87171"
              className="mt-0.5"
            />
            <Text className="text-red-200 text-sm flex-1 leading-5">
              Esses contatos serão notificados{" "}
              <Text className="font-bold text-red-100">
                automaticamente e instantaneamente
              </Text>{" "}
              quando você acionar o botão SOS (Pânico). Mantenha esta lista
              atualizada.
            </Text>
          </View>

          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-20 opacity-50">
                <View className="w-20 h-20 bg-slate-800/50 rounded-full items-center justify-center mb-4">
                  <MaterialIcons
                    name="contact-phone"
                    size={40}
                    color="#64748b"
                  />
                </View>
                <Text className="text-slate-500 mt-2 text-center text-base">
                  Nenhum contato adicionado.
                </Text>
              </View>
            )}
          />
        </View>

        {/* Add Contact Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/80 backdrop-blur-sm">
            <View className="bg-slate-900 rounded-t-[2.5rem] p-8 border-t border-slate-700 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-white">
                  Novo Contato
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-slate-800 p-2 rounded-full"
                >
                  <MaterialIcons name="close" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View className="space-y-5">
                <View>
                  <Text className="text-slate-400 text-xs font-bold mb-2.5 ml-1 uppercase tracking-wider">
                    Nome
                  </Text>
                  <TextInput
                    className="bg-slate-800/80 text-white p-4 rounded-2xl border border-slate-700 focus:border-blue-500 transition-colors"
                    placeholder="Ex: Mãe, João Silva"
                    placeholderTextColor="#475569"
                    value={newContact.name}
                    onChangeText={(text) =>
                      setNewContact({ ...newContact, name: text })
                    }
                  />
                </View>
                <View className="mt-4">
                  <Text className="text-slate-400 text-xs font-bold mb-2.5 ml-1 uppercase tracking-wider">
                    Telefone
                  </Text>
                  <TextInput
                    className="bg-slate-800/80 text-white p-4 rounded-2xl border border-slate-700 focus:border-blue-500 transition-colors"
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#475569"
                    keyboardType="phone-pad"
                    value={newContact.phone}
                    onChangeText={(text) =>
                      setNewContact({ ...newContact, phone: text })
                    }
                  />
                </View>
                <View className="mt-4">
                  <Text className="text-slate-400 text-xs font-bold mb-2.5 ml-1 uppercase tracking-wider">
                    Parentesco (Opcional)
                  </Text>
                  <TextInput
                    className="bg-slate-800/80 text-white p-4 rounded-2xl border border-slate-700 focus:border-blue-500 transition-colors"
                    placeholder="Ex: Pai, Vizinho, Amigo"
                    placeholderTextColor="#475569"
                    value={newContact.relationship}
                    onChangeText={(text) =>
                      setNewContact({ ...newContact, relationship: text })
                    }
                  />
                </View>

                <TouchableOpacity
                  className="bg-blue-600 h-14 rounded-2xl items-center justify-center mt-8 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                  onPress={handleAddContact}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    Adicionar Contato
                  </Text>
                </TouchableOpacity>
                <View className="h-4" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default EmergencyContactsScreen;
