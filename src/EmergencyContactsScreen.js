import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const EmergencyContactsScreen = ({ navigation }) => {
    const [contacts, setContacts] = useState([
        { id: '1', name: 'Mãe', phone: '(11) 98888-1111', relationship: 'Família' },
        { id: '2', name: 'Marcos (Vizinho)', phone: '(11) 97777-2222', relationship: 'Vizinho' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

    const handleDelete = (id) => {
        Alert.alert(
            "Remover Contato",
            "Tem certeza que deseja remover este contato de emergência?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => setContacts(prev => prev.filter(c => c.id !== id))
                }
            ]
        );
    };

    const handleAddContact = () => {
        if (!newContact.name || !newContact.phone) {
            Alert.alert("Erro", "Nome e telefone são obrigatórios.");
            return;
        }
        const contact = {
            id: Date.now().toString(),
            ...newContact
        };
        setContacts(prev => [...prev, contact]);
        setNewContact({ name: '', phone: '', relationship: '' });
        setModalVisible(false);
    };

    const renderContactItem = ({ item }) => (
        <View className="flex-row items-center bg-slate-800/50 p-4 mb-3 rounded-xl border border-slate-700">
            <View className="w-12 h-12 rounded-full bg-slate-700 items-center justify-center mr-4">
                <Text className="text-xl font-bold text-slate-300">{item.name.charAt(0)}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-white font-bold text-base">{item.name}</Text>
                <Text className="text-slate-400 text-sm">{item.phone}</Text>
                {item.relationship && (
                    <Text className="text-blue-400 text-xs mt-1">{item.relationship}</Text>
                )}
            </View>
            <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="p-2"
            >
                <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />
            <View className="flex-1 w-full h-full">

                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 bg-background-dark border-b border-slate-800 sticky top-0 z-10">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700"
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-lg font-bold text-center text-white">
                        Contatos de Emergência
                    </Text>
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/50"
                        onPress={() => setModalVisible(true)}
                    >
                        <MaterialIcons name="add" size={24} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 px-4 pt-6">
                    <Text className="text-slate-400 text-sm mb-6 text-center px-4">
                        Esses contatos serão notificados automaticamente quando você acionar o botão SOS (Pânico).
                    </Text>

                    <FlatList
                        data={contacts}
                        renderItem={renderContactItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center py-20 opacity-50">
                                <MaterialIcons name="contact-phone" size={64} color="#64748b" />
                                <Text className="text-slate-500 mt-4 text-center">Nenhum contato adicionado.</Text>
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
                    <View className="flex-1 justify-end bg-black/80">
                        <View className="bg-slate-900 rounded-t-3xl p-6 border-t border-slate-700">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-xl font-bold text-white">Novo Contato</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-slate-400 text-xs font-bold mb-2 ml-1 uppercase">Nome</Text>
                                    <TextInput
                                        className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                        placeholder="Nome do contato"
                                        placeholderTextColor="#475569"
                                        value={newContact.name}
                                        onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                                    />
                                </View>
                                <View className="mt-4">
                                    <Text className="text-slate-400 text-xs font-bold mb-2 ml-1 uppercase">Telefone</Text>
                                    <TextInput
                                        className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                        placeholder="(00) 00000-0000"
                                        placeholderTextColor="#475569"
                                        keyboardType="phone-pad"
                                        value={newContact.phone}
                                        onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                                    />
                                </View>
                                <View className="mt-4">
                                    <Text className="text-slate-400 text-xs font-bold mb-2 ml-1 uppercase">Parentesco (Opcional)</Text>
                                    <TextInput
                                        className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                        placeholder="Ex: Pai, Vizinho, Amigo"
                                        placeholderTextColor="#475569"
                                        value={newContact.relationship}
                                        onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
                                    />
                                </View>

                                <TouchableOpacity
                                    className="bg-blue-600 h-14 rounded-xl items-center justify-center mt-6 active:bg-blue-700 shadow-lg shadow-blue-900/20"
                                    onPress={handleAddContact}
                                >
                                    <Text className="text-white font-bold text-lg">Adicionar Contato</Text>
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
