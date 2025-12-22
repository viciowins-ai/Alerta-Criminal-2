import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Image, ImageBackground, Switch } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import IncidentLocationMap from './components/IncidentLocationMap';

const AdminDashboardScreen = ({ navigation }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoBan, setAutoBan] = useState(true);

    const dashboardData = {
        '7d': { total: '124', verified: '98', trend: '+12%', chartPath: "M0 100 C 50 100 50 50 100 50 C 150 50 150 80 200 80 C 250 80 250 20 300 20 C 350 20 350 90 400 90 L 400 150 L 0 150 Z" },
        '30d': { total: '1,240', verified: '980', trend: '+15%', chartPath: "M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25V149H0V109Z" },
        '90d': { total: '3,540', verified: '3,100', trend: '+22%', chartPath: "M0 120 C 60 120 60 60 120 60 C 180 60 180 100 240 100 C 300 100 300 10 360 10 C 420 10 420 80 480 80 L 480 150 L 0 150 Z" },
    };
    const currentData = dashboardData[selectedTimeframe];

    const KPICard = ({ title, value, icon, iconColor, trend, isNegative }) => (
        <View className="flex-1 bg-slate-800/80 border border-slate-700 p-4 rounded-2xl min-w-[45%] mb-3">
            <View className="flex-row justify-between items-start mb-2">
                <View className={`w-10 h-10 rounded-xl items-center justify-center bg-slate-700/50`}>
                    <MaterialIcons name={icon} size={20} color={iconColor} />
                </View>
                {trend && (
                    <View className={`px-2 py-1 rounded-full ${isNegative ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        <Text className={`text-xs font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>{trend}</Text>
                    </View>
                )}
            </View>
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</Text>
            <Text className="text-2xl font-bold text-white shadow-sm">{value}</Text>
        </View>
    );

    const renderHeader = (title) => (
        <View className="flex-row items-center justify-between px-6 py-4 bg-background-dark border-b border-slate-800 sticky top-0 z-50">
            <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                <MaterialIcons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white tracking-wide uppercase">{title}</Text>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 relative">
                <MaterialIcons name="notifications" size={20} color="#fbbf24" />
                <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800" />
            </TouchableOpacity>
        </View>
    );

    const renderDashboard = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Status Bar */}
            <View className="mx-6 mt-6 mb-4 flex-row items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full self-start border border-green-500/20">
                <View className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Text className="text-green-400 text-xs font-bold uppercase tracking-widest">Sistema Operacional</Text>
            </View>

            {/* KPI Grid */}
            <View className="flex-row flex-wrap gap-3 px-6 mb-6">
                <KPICard title="Total de Alertas" value={currentData.total} icon="campaign" iconColor="#60a5fa" trend={currentData.trend} />
                <KPICard title="Resolvidos" value={currentData.verified} icon="check-circle" iconColor="#4ade80" trend="+8%" />
                <KPICard title="Usuários Ativos" value="5.6k" icon="group" iconColor="#facc15" trend="+12%" />
                <KPICard title="Alertas Críticos" value="3" icon="warning" iconColor="#ef4444" trend="+1" isNegative />
            </View>

            {/* Chart Section */}
            <View className="mx-6 p-5 bg-slate-800/50 rounded-2xl border border-slate-700 mb-6">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-white font-bold text-base">Volume de Ocorrências</Text>
                    <View className="flex-row bg-slate-700/50 rounded-lg p-1">
                        {['7d', '30d', '90d'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => setSelectedTimeframe(t)}
                                className={`px-3 py-1 rounded-md ${selectedTimeframe === t ? 'bg-slate-600' : ''}`}
                            >
                                <Text className={`text-xs font-bold ${selectedTimeframe === t ? 'text-white' : 'text-slate-400'}`}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View className="h-40 w-full">
                    <Svg height="100%" width="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.5" />
                                <Stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Path d={currentData.chartPath} fill="url(#grad)" stroke="#3b82f6" strokeWidth="3" />
                    </Svg>
                </View>
            </View>

            {/* Live Map Preview */}
            <View className="mx-6 mb-6 h-48 rounded-2xl overflow-hidden border border-slate-700 relative">
                <IncidentLocationMap />
                <View className="absolute top-3 left-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <Text className="text-white text-xs font-bold uppercase">Mapa ao Vivo</Text>
                </View>
            </View>

        </ScrollView>
    );

    const renderList = (type) => {
        const items = type === 'alertas' ? [
            { id: '84231', title: 'Assalto à Mão Armada', time: 'Hoje, 14:35', loc: 'Rua das Flores, 123', status: 'Pendente', criticality: 'Alta', color: '#ef4444' },
            { id: '84230', title: 'Atividade Suspeita', time: 'Hoje, 11:20', loc: 'Av. Principal, 500', status: 'Em Atendimento', criticality: 'Média', color: '#3b82f6' },
            { id: '84229', title: 'Vandalismo', time: 'Ontem, 22:15', loc: 'Praça da República', status: 'Verificado', criticality: 'Baixa', color: '#10b981' },
            { id: '84228', title: 'Ruído Excessivo', time: 'Ontem, 21:40', loc: 'Condomínio Sol Nascente', status: 'Dispensado', criticality: 'Baixa', color: '#64748b' },
        ] : [1, 2, 3, 4, 5, 6];

        return (
            <FlatList
                data={items}
                keyExtractor={i => (i.id || i).toString()}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                renderItem={({ item }) => {
                    if (type === 'usuarios') {
                        return (
                            <View className="bg-slate-800/50 p-4 rounded-xl mb-3 border border-slate-700 flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-full items-center justify-center bg-blue-500/10 border border-blue-500/30">
                                    <MaterialIcons name="person" size={24} color="#3b82f6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base">Usuário Silva #{item}</Text>
                                    <Text className="text-slate-400 text-xs">Online agora • Nível 5</Text>
                                </View>
                                <TouchableOpacity className="p-2 bg-slate-700 rounded-lg">
                                    <MaterialIcons name="more-horiz" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    // Alert Card Design
                    return (
                        <View className="bg-slate-800 rounded-2xl mb-4 overflow-hidden shadow-lg border border-slate-700/50 flex-row">
                            {/* Left Colored Strip */}
                            <View style={{ width: 6, backgroundColor: item.color }} />

                            <View className="flex-1 p-4">
                                {/* Header Tags */}
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View className={`px-2 py-0.5 rounded-md border`} style={{ backgroundColor: item.color + '20', borderColor: item.color + '50' }}>
                                        <Text style={{ color: item.color }} className="text-[10px] font-bold uppercase">{item.criticality === 'Alta' ? 'Alta Criticidade' : item.status}</Text>
                                    </View>
                                    {item.criticality === 'Alta' && (
                                        <View className="px-2 py-0.5 rounded-md border border-yellow-500/50 bg-yellow-500/10">
                                            <Text className="text-yellow-500 text-[10px] font-bold uppercase">{item.status}</Text>
                                        </View>
                                    )}
                                </View>

                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg mb-1">{item.title}</Text>
                                        <Text className="text-slate-400 text-sm mb-0.5">{item.time} • {item.loc}</Text>
                                        <Text className="text-slate-600 text-xs font-mono">ID: #{item.id}</Text>
                                    </View>
                                    <TouchableOpacity className="p-1 rounded-full hover:bg-slate-700">
                                        <MaterialIcons name="more-vert" size={20} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        );
    };

    const renderSettings = () => (
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden mb-6">
                {[
                    { label: "Notificações de Sistema", value: notificationsEnabled, set: setNotificationsEnabled, color: "#3b82f6" },
                    { label: "Modo de Manutenção", value: maintenanceMode, set: setMaintenanceMode, color: "#ef4444" },
                    { label: "Banimento Automático", value: autoBan, set: setAutoBan, color: "#f59e0b" },
                ].map((setting, idx) => (
                    <View key={idx} className={`flex-row items-center justify-between p-4 ${idx < 2 ? 'border-b border-slate-700' : ''}`}>
                        <Text className="text-white font-medium">{setting.label}</Text>
                        <Switch
                            value={setting.value}
                            onValueChange={setting.set}
                            trackColor={{ false: "#1e293b", true: setting.color }}
                            thumbColor="#f8fafc"
                        />
                    </View>
                ))}
            </View>
            <TouchableOpacity className="py-4 bg-slate-800 rounded-xl border border-slate-700 items-center mb-4">
                <Text className="text-white font-bold">Relatório de Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4 bg-red-900/20 rounded-xl border border-red-900/50 items-center">
                <Text className="text-red-500 font-bold">Encerrar Sessão</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar style="light" />

            {renderHeader(activeTab === 'dashboard' ? 'Painel de Controle' : activeTab.toUpperCase())}

            <View className="flex-1">
                {activeTab === 'dashboard' && renderDashboard()}
                {(activeTab === 'alertas' || activeTab === 'usuarios') && renderList(activeTab)}
                {activeTab === 'ajustes' && renderSettings()}

                {/* Bottom Nav */}
                <View className="absolute bottom-6 left-6 right-6 bg-slate-900/95 border border-slate-700/50 rounded-2xl flex-row items-center justify-between p-2 shadow-2xl backdrop-blur-xl">
                    {[
                        { id: 'dashboard', icon: 'dashboard', label: 'Painel' },
                        { id: 'alertas', icon: 'notifications', label: 'Alertas' },
                        { id: 'usuarios', icon: 'people', label: 'Usuários' },
                        { id: 'ajustes', icon: 'settings', label: 'Ajustes' },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 items-center justify-center rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-800' : ''}`}
                        >
                            <MaterialIcons name={tab.icon} size={24} color={activeTab === tab.id ? '#3b82f6' : '#64748b'} />
                            {activeTab === tab.id && <View className="w-1 h-1 rounded-full bg-blue-500 results mt-1" />}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AdminDashboardScreen;
