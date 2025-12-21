import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, Image, ImageBackground, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const AdminDashboardScreen = ({ navigation }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [activeTab, setActiveTab] = useState('dashboard');

    // Settings State
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoBan, setAutoBan] = useState(true);

    // Mock Data for interactivity
    const dashboardData = {
        '7d': { total: '320', verified: '290', trend: '+5.2%', chartPath: "M0 100 C 50 100 50 50 100 50 C 150 50 150 80 200 80 C 250 80 250 20 300 20 C 350 20 350 90 400 90 L 400 150 L 0 150 Z" },
        '30d': { total: '1,240', verified: '980', trend: '+15.3%', chartPath: "M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25V149H0V109Z" },
        '90d': { total: '3,540', verified: '3,100', trend: '+22.8%', chartPath: "M0 120 C 60 120 60 60 120 60 C 180 60 180 100 240 100 C 300 100 300 10 360 10 C 420 10 420 80 480 80 L 480 150 L 0 150 Z" },
    };

    const currentData = dashboardData[selectedTimeframe];

    const KPICard = ({ title, value, icon, color, iconColor }) => (
        <View className="flex-col flex-1 gap-2 p-4 mb-4 bg-white border border-gray-200 rounded-lg min-w-[45%] dark:bg-slate-900/50 dark:border-slate-800">
            <View className="flex-row items-center gap-2">
                <MaterialIcons name={icon} size={24} color={iconColor} />
                <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex-1 flex-wrap">
                    {title}
                </Text>
            </View>
            <Text className={`text-3xl font-bold tracking-tight ${color ? color : 'text-zinc-900 dark:text-white'}`}>
                {value}
            </Text>
        </View>
    );

    const renderDashboard = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* KPI Stats Cards */}
            <View className="flex-row flex-wrap gap-2 p-4">
                <KPICard
                    title="Total de Alertas"
                    value={currentData.total}
                    icon="notifications-active"
                    iconColor="#0D47A1"
                />
                <KPICard
                    title="Alertas Verificados"
                    value={currentData.verified}
                    icon="verified"
                    iconColor="#0D47A1"
                />
                <KPICard
                    title="Usuários Ativos"
                    value="5,600"
                    icon="group"
                    iconColor="#0D47A1"
                />
                <KPICard
                    title="Falsos Alarmes"
                    value="85"
                    icon="error"
                    iconColor="#D32F2F"
                    color="text-red-700 dark:text-red-500"
                />
            </View>

            {/* Chart Section */}
            <View className="px-4 py-2">
                <View className="flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-slate-900/50 dark:border-slate-800">

                    {/* Chart Header */}
                    <View className="flex-col gap-1">
                        <Text className="text-base font-semibold leading-normal text-zinc-900 dark:text-white">
                            Tendência de Incidentes
                        </Text>
                        <View className="flex-row items-baseline gap-2">
                            <Text className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
                                {selectedTimeframe === '7d' ? '84' : selectedTimeframe === '30d' ? '312' : '945'}
                            </Text>
                            <Text className="text-sm font-medium leading-normal text-green-500">
                                {currentData.trend}
                            </Text>
                        </View>
                    </View>

                    {/* Segmented Buttons */}
                    <View className="flex-row items-center justify-center w-full h-10 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        {['7d', '30d', '90d'].map((frame) => (
                            <TouchableOpacity
                                key={frame}
                                onPress={() => setSelectedTimeframe(frame)}
                                className={`flex-1 h-full items-center justify-center rounded-md ${selectedTimeframe === frame ? 'bg-white dark:bg-slate-950 shadow-sm' : 'bg-transparent'}`}
                            >
                                <Text className={`text-sm font-medium ${selectedTimeframe === frame ? 'text-blue-800 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                    {frame}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Chart Visualization */}
                    <View className="flex-col py-4 h-[180px]">
                        <Svg height="100%" width="100%" viewBox="-3 0 478 150" preserveAspectRatio="none">
                            <Defs>
                                <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor="#0D47A1" stopOpacity="0.3" />
                                    <Stop offset="1" stopColor="#0D47A1" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Path
                                d={currentData.chartPath}
                                fill="url(#chartFill)"
                                stroke="#0D47A1"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View className="flex-row justify-around mt-2">
                            <Text className="text-xs font-bold tracking-wide text-zinc-500">
                                {selectedTimeframe === '7d' ? 'Dia 1' : 'Sem 1'}
                            </Text>
                            <Text className="text-xs font-bold tracking-wide text-zinc-500">
                                {selectedTimeframe === '7d' ? 'Dia 3' : 'Sem 2'}
                            </Text>
                            <Text className="text-xs font-bold tracking-wide text-zinc-500">
                                {selectedTimeframe === '7d' ? 'Dia 5' : 'Sem 3'}
                            </Text>
                            <Text className="text-xs font-bold tracking-wide text-zinc-500">
                                {selectedTimeframe === '7d' ? 'Hoje' : 'Sem 4'}
                            </Text>
                        </View>
                    </View>

                </View>
            </View>
        </ScrollView>
    );

    const renderList = (type) => (
        <View className="flex-1 px-4 pt-4">
            <FlatList
                data={[1, 2, 3, 4, 5, 6]}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="p-4 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-slate-900/50 dark:border-slate-800 flex-row items-center gap-3">
                        <View className={`w-10 h-10 rounded-full items-center justify-center ${type === 'alertas' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                            <MaterialIcons name={type === 'alertas' ? "warning" : "person"} size={20} color={type === 'alertas' ? "#ef4444" : "#3b82f6"} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-zinc-900 dark:text-white">
                                {type === 'alertas' ? `Alerta de Risco #${200 + item}` : `Usuário Registrado #${1000 + item}`}
                            </Text>
                            <Text className="text-sm text-zinc-500">
                                {type === 'alertas' ? 'Reportado há 10 min em Centro' : 'Ativo agora • Premium'}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#52525b" />
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );

    const renderMap = () => (
        <View className="flex-1 w-full h-full relative">
            <ImageBackground
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8GE97LjX0E2YCcgJcn11kQ6of2weCzmAkR4Q5HNmJEvTmyFY_JLtAUMdmlzH3oYbfXG9NlNDGT6IG5BKkd5agtvE6ohXRVqQS8svaXNzmRyzd-4P4mlUb_EaN9HT4ASXBo0UWybrAS9eEdMqPwTfTg412qvTighcjlocIve1QfUr3iA7lDQweGkA-hbhIuDgRecqKPymOjPFbqi3Dv9teXp3zTJOs4i8HoTHR0hnOiHyYVrSjkUSJRLrdZG1-TV-SI236lWCiMk1" }}
                className="flex-1 w-full h-full"
                resizeMode="cover"
            >
                <View className="absolute top-4 left-4 right-4 bg-slate-900/90 p-4 rounded-xl border border-slate-700 shadow-xl">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
                            <MaterialIcons name="edit" size={20} color="#60a5fa" />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-base">Modo de Edição de Zonas</Text>
                            <Text className="text-slate-400 text-xs">Ajuste os raios de risco manualmente.</Text>
                        </View>
                    </View>
                </View>

                {/* Simulated Heat Points Edit */}
                <View className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full border-2 border-red-500 bg-red-500/10 items-center justify-center">
                    <MaterialIcons name="drag-handle" size={24} color="#ef4444" />
                </View>
            </ImageBackground>
        </View>
    );

    const renderEmpty = (text) => (
        <View className="flex-1 items-center justify-center">
            <MaterialIcons name="construction" size={64} color="#52525b" />
            <Text className="mt-4 text-zinc-500 text-lg font-medium">{text}</Text>
        </View>
    );

    const renderSettings = () => (
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
            <Text className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">Sistema</Text>
            <View className="bg-white dark:bg-slate-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 mb-6">
                <View className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-slate-800">
                    <View className="flex-1 mr-4">
                        <Text className="text-base font-semibold text-zinc-900 dark:text-white">Notificações Push</Text>
                        <Text className="text-xs text-zinc-500">Receber alertas de alta prioridade</Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: "#767577", true: "#0D47A1" }}
                        thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
                    />
                </View>
                <View className="p-4 flex-row items-center justify-between border-b border-gray-100 dark:border-slate-800">
                    <View className="flex-1 mr-4">
                        <Text className="text-base font-semibold text-zinc-900 dark:text-white">Manutenção do Sistema</Text>
                        <Text className="text-xs text-zinc-500">Suspender acesso de usuários temporariamente</Text>
                    </View>
                    <Switch
                        value={maintenanceMode}
                        onValueChange={setMaintenanceMode}
                        trackColor={{ false: "#767577", true: "#ef4444" }}
                        thumbColor={maintenanceMode ? "#fff" : "#f4f3f4"}
                    />
                </View>
                <View className="p-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-base font-semibold text-zinc-900 dark:text-white">Banimento Automático</Text>
                        <Text className="text-xs text-zinc-500">Bloquear IPs suspeitos automaticamente</Text>
                    </View>
                    <Switch
                        value={autoBan}
                        onValueChange={setAutoBan}
                        trackColor={{ false: "#767577", true: "#0D47A1" }}
                        thumbColor={autoBan ? "#fff" : "#f4f3f4"}
                    />
                </View>
            </View>

            <Text className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">Conta Admin</Text>
            <View className="bg-white dark:bg-slate-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 mb-24">
                <TouchableOpacity className="p-4 flex-row items-center gap-3 border-b border-gray-100 dark:border-slate-800">
                    <MaterialIcons name="lock-reset" size={24} color="#64748b" />
                    <Text className="text-base font-medium text-zinc-900 dark:text-white">Alterar Senha Mestra</Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 flex-row items-center gap-3">
                    <MaterialIcons name="logout" size={24} color="#ef4444" />
                    <Text className="text-base font-medium text-red-600 dark:text-red-500">Sair do Painel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-slate-950">
            <StatusBar style="auto" />

            {/* Top App Bar with Navigation Back */}
            <View className="flex-row items-center justify-between p-4 pb-2 bg-gray-100 dark:bg-slate-950 sticky top-0 z-10 w-full">
                {/* Back Button added for functionality */}
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} className="text-zinc-900 dark:text-white" color="#94a3b8" />
                </TouchableOpacity>

                <Text className="flex-1 text-2xl font-bold leading-tight tracking-tight text-center text-zinc-900 dark:text-white mr-10">
                    {activeTab === 'dashboard' ? 'Painel de Controle' :
                        activeTab === 'alertas' ? 'Gerenciar Alertas' :
                            activeTab === 'usuarios' ? 'Base de Usuários' :
                                activeTab === 'mapa' ? 'Mapa de Calor' : 'Ajustes'}
                </Text>

                {/* User Icon acts as Logout/Profile */}
                <TouchableOpacity className="items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <MaterialIcons name="person" size={24} className="text-zinc-900 dark:text-white" color="#64748b" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 w-full h-full">
                {/* Main Content Area */}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'alertas' && renderList('alertas')}
                {activeTab === 'usuarios' && renderList('usuarios')}
                {activeTab === 'mapa' && renderMap()}
                {activeTab === 'ajustes' && renderSettings()}

                {/* Floating Action Button (FAB) - Contextual */}
                {activeTab === 'dashboard' && (
                    <View className="absolute bottom-24 right-4 z-20">
                        <TouchableOpacity className="items-center justify-center w-14 h-14 bg-blue-900 rounded-full shadow-lg hover:bg-blue-800">
                            <MaterialIcons name="add" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Bottom Navigation Bar */}
                <View className="absolute bottom-0 flex-row items-center justify-around w-full h-20 bg-gray-100/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800 backdrop-blur-md pb-4">
                    <TouchableOpacity className="items-center gap-1 w-1/5" onPress={() => setActiveTab('dashboard')}>
                        <MaterialIcons
                            name="dashboard"
                            size={24}
                            color={activeTab === 'dashboard' ? "#0D47A1" : "#71717a"}
                        />
                        <Text className={`text-xs font-semibold ${activeTab === 'dashboard' ? 'text-blue-900 dark:text-amber-400' : 'text-zinc-500'}`}>
                            Dashboard
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center gap-1 w-1/5" onPress={() => setActiveTab('alertas')}>
                        <MaterialIcons
                            name="shield"
                            size={24}
                            color={activeTab === 'alertas' ? "#0D47A1" : "#71717a"}
                        />
                        <Text className={`text-xs font-semibold ${activeTab === 'alertas' ? 'text-blue-900 dark:text-amber-400' : 'text-zinc-500'}`}>
                            Alertas
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center gap-1 w-1/5" onPress={() => setActiveTab('usuarios')}>
                        <MaterialIcons
                            name="group"
                            size={24}
                            color={activeTab === 'usuarios' ? "#0D47A1" : "#71717a"}
                        />
                        <Text className={`text-xs font-semibold ${activeTab === 'usuarios' ? 'text-blue-900 dark:text-amber-400' : 'text-zinc-500'}`}>
                            Usuários
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center gap-1 w-1/5" onPress={() => setActiveTab('mapa')}>
                        <MaterialIcons
                            name="map"
                            size={24}
                            color={activeTab === 'mapa' ? "#0D47A1" : "#71717a"}
                        />
                        <Text className={`text-xs font-semibold ${activeTab === 'mapa' ? 'text-blue-900 dark:text-amber-400' : 'text-zinc-500'}`}>
                            Mapa
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center gap-1 w-1/5" onPress={() => setActiveTab('ajustes')}>
                        <MaterialIcons
                            name="settings"
                            size={24}
                            color={activeTab === 'ajustes' ? "#0D47A1" : "#71717a"}
                        />
                        <Text className={`text-xs font-semibold ${activeTab === 'ajustes' ? 'text-blue-900 dark:text-amber-400' : 'text-zinc-500'}`}>
                            Ajustes
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default AdminDashboardScreen;
