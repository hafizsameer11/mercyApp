import React, { useState } from 'react';
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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Images
import logo from '../../assets/logo.png';
import icon from '../../assets/Img.png';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText';
import axios from 'axios';
import API from '../../config/api.config';


const RegisterScreen = () => {
    const navigation = useNavigation(); // Using the hook

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setisPhoneNumber] = useState('');
    const [password, setPassword] = useState('');



    const [showPassword, setShowPassword] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [isPhoneNumber, setPhoneNumber] = useState(false);
    const [isUserName, setUserName] = useState(false);

    const handleRegister = async () => {
        try {
            const response = await axios.post(API.REGISTER, {
                name: username,
                email: email,
                password: password,
                role: 'user', // default role
                phone: phoneNumber,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Registration Success:', response.data);
            // Navigate to login or home screen
            navigation.navigate('Login');

        } catch (error) {
            if (error.response) {
                console.log('Server responded with status', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Axios config error:', error.message);
            }
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >

            <StatusBar style="dark" />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Background image with overlay content inside */}
                <View style={styles.imageSection}>
                    <ImageBackground source={icon} style={styles.imageBackground} resizeMode="cover">
                        <View style={styles.overlay}>
                            <Image style={styles.logo} source={logo} />
                            <ThemedText style={styles.subtitle}>Photo Editing • Manipulation • Reshaping</ThemedText>
                        </View>
                    </ImageBackground>
                </View>

                {/* Form card */}
                <View style={styles.card}>
                    {/* Social buttons */}
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

                    {/* Email Input */}
                    <ThemedText style={styles.label}>Username</ThemedText>
                    <View style={[styles.inputWrapper, isUserName && { borderColor: '#992C55' }]}>
                        <TextInput
                            placeholder="Enter username"
                            style={styles.inputWithIcon}
                            onFocus={() => setUserName(true)}
                            onBlur={() => setUserName(false)}
                            keyboardType="email-address"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    {/* Password Input */}
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <View style={[styles.inputWrapper, isEmailFocused && { borderColor: '#992C55' }]}>
                        <TextInput
                            placeholder="Enter email adress"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            style={styles.inputWithIcon}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <ThemedText style={styles.label}>Phone Number</ThemedText>
                    <View style={[styles.inputWrapper, isPhoneNumber && { borderColor: '#992C55' }]}>
                        <TextInput
                            placeholder="Enter phone number"
                            onFocus={() => setPhoneNumber(true)}
                            onBlur={() => setPhoneNumber(false)}
                            style={styles.inputWithIcon}
                            value={phoneNumber}
                            onChangeText={setisPhoneNumber}
                        />
                    </View>
                    <ThemedText style={styles.label}>Password</ThemedText>
                    <View style={[styles.inputWrapper, isPasswordFocused && { borderColor: '#992C55' }]}>
                        <TextInput
                            placeholder="Enter password"
                            style={styles.inputWithIcon}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <ThemedText style={styles.loginButtonText}>Register</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerLink}>
                        <ThemedText style={styles.registerText}>Login</ThemedText>
                    </TouchableOpacity>

                    <ThemedText style={{ textAlign: 'center', marginTop: 25, fontSize: 12 }}>
                        By proceeding you agree with Edit by Mercy’s&nbsp;
                        <ThemedText style={{ color: '#992C55' }}>terms of use</ThemedText> and&nbsp;
                        <ThemedText style={{ color: '#992C55' }}>privacy policy</ThemedText>
                    </ThemedText>
                </View>

            </ScrollView>
        {/* </SafeAreaView> */}
        </KeyboardAvoidingView>


    );
};

export default RegisterScreen;
const styles = StyleSheet.create({
    scrollContent: {
        backgroundColor: '#fff',
        paddingBottom: 30,
    },
    imageSection: {
        width: '100%',
        height: 320,
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: '#992C55',
        marginHorizontal: 20,
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        // borderBottomLeftRadius: 24,
        // borderBottomRightRadius: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: -20,
        elevation: 10,

    },
    card: {
        backgroundColor: '#F5F5F7',
        marginTop: -10,
        marginHorizontal: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderRadius: 24,
        padding: 24,
        zIndex: 0,
        elevation: 10,
        shadowColor: '#000',
    },
    logo: {
        width: 140,
        height: 100,
        marginTop: -20,
        marginBottom: -10,
    },
    subtitle: {
        marginTop: 5,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    socialButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#8C2D52',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 6,
        gap: 10,
        borderRadius: 10,
    },
    titleText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        marginTop: 10,
        color: '#333',
    },
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
        color: '#000',
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
});
