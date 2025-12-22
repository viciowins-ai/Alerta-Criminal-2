import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar sessão ativa ao iniciar
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (session) {
                    setUser(session.user);
                }
            } catch (error) {
                console.log('Erro ao verificar sessão:', error.message);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Escutar mudanças na autenticação (login, logout, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session ? session.user : null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Erro no Login', error.message);
        }
        setLoading(false);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert('Erro ao sair', error.message);
    };

    const signUp = async (email, password, metadata = {}) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata // Ex: nome, telefone
            }
        });

        if (error) {
            Alert.alert('Erro no Cadastro', error.message);
            setLoading(false);
            return false;
        }

        if (data.user) {
            // Sucesso! Retorna true para a tela lidar com a navegação
            setLoading(false);
            return true;
        }

        setLoading(false);
        return false;
    };

    const signInAsGuest = async () => {
        setLoading(true);
        // Simula um usuário logado para testes
        const guestUser = {
            id: 'guest-123',
            email: 'visitante@teste.com',
            user_metadata: { full_name: 'Visitante' }
        };
        setUser(guestUser);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, signInAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
