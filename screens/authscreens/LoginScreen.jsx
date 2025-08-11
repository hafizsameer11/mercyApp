import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Image,
} from 'react-native';
import logo from '../../assets/logo.png';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import icon from '../../assets/Img.png';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/api.config';



const LoginScreen = () => {
    const navigation = useNavigation(); // Using the hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const handleLogin = async () => {
        try {
            const response = await axios.post(API.LOGIN, {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            const { user, token } = response.data?.data;

            // Store user and token separately
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', token);

            const savedUser = await AsyncStorage.getItem('user');
            const savedToken = await AsyncStorage.getItem('token');
            console.log('✅ Stored User:', JSON.parse(savedUser));
            console.log('✅ Stored Token:', savedToken);



            console.log('Login Success:', response.data);
            navigation.navigate('Main');

        } catch (error) {
            if (error.response) {
                console.log('Login failed:', error.response.data);
            } else {
                console.log('Network or other error:', error.message);
            }
        }

    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    // Optionally validate token via API if needed
                    console.log('🔐 Token found, auto-logging in');
                    navigation.replace('Main');
                }
            } catch (e) {
                console.log('❌ Error checking token:', e.message);
            }
        };

        checkAuth();
    }, []);



    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        <SafeAreaView>
                            <StatusBar style="dark" />
                            {/* Top Image with overlay and title */}
                            <ImageBackground
                                source={icon}
                                style={[styles.imageBackground, { position: 'relative' }]}
                                resizeMode="cover"
                            >
                            </ImageBackground>
                            <View style={styles.overlay}>

                                <Image style={styles.logo} source={logo} />

                                <ThemedText style={styles.subtitle}>Photo Editing • Manipulation • Reshaping</ThemedText>

                                <View style={styles.card}>
                                    <View style={styles.socialRow}>
                                        <TouchableOpacity style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}>
                                            <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={google} />
                                            <ThemedText style={styles.titleText}>Google</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}>
                                            <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={facebook} />
                                            <ThemedText style={styles.titleText}>Facebook</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                    <ThemedText style={{ marginTop: 10, color: '#B7B7B9', textAlign: 'center' }}>_________or continue with_________</ThemedText>
                                    <Text style={styles.label}>Email</Text>
                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            isEmailFocused && { borderColor: '#992C55' }
                                        ]}
                                    >
                                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            placeholder="Enter email"
                                            value={email}
                                            onChangeText={setEmail}
                                            style={styles.inputWithIcon}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    <Text style={styles.label}>Password</Text>
                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            isPasswordFocused && { borderColor: '#992C55' }
                                        ]}
                                    >
                                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            placeholder="Enter password"
                                            value={password}
                                            onChangeText={setPassword}
                                            style={styles.inputWithIcon}
                                            secureTextEntry={!showPassword}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons
                                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')} style={styles.forgotLink}>
                                        <ThemedText style={styles.forgotText}>Forgot Password?</ThemedText></TouchableOpacity>

                                    <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                                        <ThemedText style={styles.loginButtonText}>Login</ThemedText></TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
                                        <Text style={styles.registerText}>Register</Text></TouchableOpacity>

                                    <ThemedText style={{ textAlign: 'center', marginTop: 25, fontSize: 12 }}>By proceeding you agree with Edit by Mercy’s &nbsp;
                                        <Text style={{ color: '#992C55' }}>terms of use</Text> and &nbsp;
                                        <Text style={{ color: '#992C55' }}>privacy policy</Text>
                                    </ThemedText>
                                </View>

                            </View>
                        </SafeAreaView>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </>

    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputIcon: {
        marginRight: 8,
    },
    inputWithIcon: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logo: {
        width: 140,
        height: 100,
        // marginTop: -1,
        marginBottom: -30,
    },
    imageBackground: {
        height: 320,
        width: '100%',
    },
    overlay: {
        marginTop: -100, // adjust based on how much overlap you want
        width: '90%',
        backgroundColor: '#992C55',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        elevation: 10,
        alignSelf: 'center',
    },

    titleText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',

    },
    subtitle: {
        marginTop: 8,
        color: '#fff',
        fontSize: 16,
        marginBottom: 10
    },
    card: {
        backgroundColor: '#F5F5F7',
        marginTop: 7,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        padding: 24,
        width: '100%',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#8C2D52',
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 6,
        borderRadius: 10,
        gap: 10,
        // alignItems: 'center',
    },
    socialButtonText: {
        color: '#8C2D52',
        fontWeight: '600',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#888',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        marginTop: 10,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    forgotText: {
        color: '#8C2D52',
        fontSize: 13,
    },
    loginButton: {
        backgroundColor: '#8C2D52',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 14,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    registerLink: {
        alignItems: 'center',
    },
    registerText: {
        color: '#992C55',
        fontSize: 16,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});
