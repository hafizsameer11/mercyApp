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
import axios from 'axios';


// Images
import logo from '../../assets/logo.png';
import icon from '../../assets/icon.png';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../components/ThemedText'; // Assuming you have a themed text component
import API from '../../config/api.config';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation(); // Using the hook

    const [showPassword, setShowPassword] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [isPhoneNumber, setPhoneNumber] = useState(false);
    const [isUserName, setUserName] = useState(false);
   


    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (input.trim() === '') {
            setError('This field is required.');
            return;
        }

        try {
            const response = await axios.post(API.FORGOT_PASSWORD, {
                email: input
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Verification code sent:', response.data);
            navigation.navigate('ForgotCode', { email: input }); // pass email to next screen if needed

        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.data);
                setError(error.response.data.message || 'Failed to send verification code.');
            } else {
                console.error('Network error:', error.message);
                setError('Network error. Please try again.');
            }
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

                        <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>Forgot Password</ThemedText>

                    </View>

                    <ThemedText style={{ color: '#6A6A6A', lineHeight: '20', marginLeft: '8', marginTop: '10' }}>Input your email address, then a verification code
                        will be sent to your email</ThemedText>

                    <ThemedText style={styles.label}>Email</ThemedText>
                    <View style={[styles.inputWrapper, isEmailFocused && { borderColor: '#992C55' }]}>
                        <TextInput
                            placeholder="Enter email adress"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            onChangeText={(text) => setInput(text)}
                            style={[styles.input, styles.inputWithIcon, error ? styles.inputError : null]}

                        />
                        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
                    </View>


                    <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                        <ThemedText style={styles.loginButtonText}>Proceed</ThemedText></TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
const styles = StyleSheet.create({
    scrollContent: {
        backgroundColor: '#fff',
        paddingBottom: 30,
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
        marginTop: 200,
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
