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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Images
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.png';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import API from '../../config/api.config';

const NewPasswordScreen = () => {
    const route = useRoute();
    const { email } = route.params || {};
    const navigation = useNavigation(); // Using the hook
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [showPassword, setShowPassword] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [isPhoneNumber, setPhoneNumber] = useState(false);
    const [isUserName, setUserName] = useState(false);

    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (!email) {
            setError("Email not found in route.");
            return;
        }

        try {
            const response = await axios.post(API.RESET_PASSWORD, {
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Password changed:', response.data);
            navigation.navigate('Login');
        } catch (err) {
            console.log('Error:', err.response?.data || err.message);
            setError('Something went wrong.');
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
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

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 50, marginBottom: 20 }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.goBack()}>
                            <Ionicons
                                name='chevron-back'
                                size={30}
                            />
                        </TouchableOpacity>

                        <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>New Password</ThemedText>

                    </View>

                    <ThemedText style={{ color: '#6A6A6A', lineHeight: '20', marginLeft: '8', marginTop: '10' }}>Create new password</ThemedText>

                    <ThemedText style={styles.label}>New Password</ThemedText>
                    <View
                        style={[
                            styles.inputWrapper,
                            isPasswordFocused && { borderColor: '#992C55' }
                        ]}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Enter password"
                            secureTextEntry={!showPassword}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            style={[styles.input, styles.inputWithIcon, error ? styles.inputError : null]}

                        />
                        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                    <ThemedText style={styles.label}>Reenter Password</ThemedText>
                    <View
                        style={[
                            styles.inputWrapper,
                            isPasswordFocused && { borderColor: '#992C55' }
                        ]}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Enter password"
                            secureTextEntry={!showPassword}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                            style={[styles.input, styles.inputWithIcon, error ? styles.inputError : null]}

                        />
                        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}


                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                        <ThemedText style={styles.loginButtonText}>Proceed</ThemedText></TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default NewPasswordScreen;
const styles = StyleSheet.create({
    scrollContent: {
        backgroundColor: '#fff',
        paddingBottom: 10,
    },
    imageSection: {
        width: '100%',
        height: 320,
    },
    errorText: {
        color: 'red',
        // marginBottom: 3,
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
        height: 90,
        marginTop: -20,
        marginBottom: -10,
    },
    subtitle: {
        // marginTop: 5,
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
    titleText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        marginTop: 18,
        color: '#333',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderStyle: 'transparent',
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
        marginTop: 140,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    }
});
