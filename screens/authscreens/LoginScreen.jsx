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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Alert,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import logo from '../../assets/logo.png';
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
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import useIsTablet from '../../hooks/useIsTablet';

// Complete auth session for Expo Web Browser
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const isTablet = useIsTablet();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  // loading flag for "loggining....."
  const [isLoading, setIsLoading] = useState(false);


  // Google Auth hook - for development build
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
    iosClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
    androidClientId: '735121439507-4vkrabi0rqt19o7kujioma7pf5eu6omt.apps.googleusercontent.com',
    webClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
  });

  // toast/alert helper (Android toast, iOS alert)
  const notify = (title, message) => {
    const text = message ? `${title}: ${message}` : title;
    if (Platform.OS === 'android') {
      ToastAndroid.show(text, ToastAndroid.LONG);
    } else {
      Alert.alert(title, message || '');
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      notify('Login failed', 'Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        API.LOGIN,
        { email, password },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      const { user, token } = response.data?.data || {};

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      console.log('✅ Stored User:', savedUser ? JSON.parse(savedUser) : null);
      console.log('✅ Stored Token:', savedToken);

      console.log('Login Success:', response.data);
      navigation.navigate('Main');
    } catch (error) {
      if (error?.response) {
        const apiMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Invalid credentials';
        console.log('Login failed:', error.response.data);
        notify('Login failed', apiMsg);
      } else {
        console.log('Network or other error:', error?.message);
        notify('Network error', 'Please check your connection and try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google auth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSuccess(authentication);
    }
  }, [response]);

  // Google Authentication
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google auth error:', error);
      notify('Login failed', 'Failed to open Google login');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (authentication) => {
    try {
      const accessToken = authentication?.accessToken || authentication?.idToken;
      
      console.log('Access token:', accessToken ? 'Received' : 'Not received');

      if (!accessToken) {
        throw new Error('No access token received from Google');
      }
      
      // Send access token to backend
      const response = await axios.post(
        API.SOCIAL_AUTH('google'),
        {
          access_token: accessToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 20000,
        }
      );

      console.log('Backend response:', response.data);

      if (response.data && (response.data.status || response.data.token)) {
        // Store token and user data
        const token = response.data.token || response.data.access_token;
        const user = response.data.user || response.data.data?.user;
        
        await AsyncStorage.setItem('token', token);
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }
        
        notify('Success', 'Login successful!');
        navigation.navigate('Main');
      } else {
        notify('Login failed', response.data?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
      notify('Login failed', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          console.log('🔐 Token found, auto-logging in');
          navigation.replace('Main');
        }
      } catch (e) {
        console.log('❌ Error checking token:', e?.message);
      }
    };
    checkAuth();
  }, []);

  // Tablet Layout (matching Figma design)
  if (isTablet) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.tabletContainer}>
            <StatusBar style="light" />
            {/* Backdrop Blur Overlay */}
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={StyleSheet.absoluteFill} />
            
            {/* Centered Modal */}
            <View style={[styles.tabletModal, { width: Math.min(556, Dimensions.get('window').width * 0.85) }]}>
              {/* Purple Header */}
              <View style={styles.tabletHeader}>
                <Image style={styles.tabletLogo} source={logo} />
                <ThemedText style={styles.tabletSubtitle}>
                  Photo Editing • Photo Manipulation • Photo Reshaping
                </ThemedText>
              </View>

              {/* White Form Card */}
              <View style={styles.tabletCard}>
                {/* Social Buttons Row - Hidden */}
                {/* <View style={styles.tabletSocialRow}>
                  <TouchableOpacity
                    style={styles.tabletSocialButton}
                    disabled={isLoading}
                    onPress={handleGoogleAuth}
                  >
                    <Image style={styles.tabletSocialIcon} source={google} />
                    <Text style={styles.tabletSocialText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tabletSocialButton}
                    disabled={isLoading}
                  >
                    <Image style={styles.tabletSocialIcon} source={facebook} />
                    <Text style={styles.tabletSocialText}>Facebook</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.tabletDividerContainer}>
                  <View style={styles.tabletDividerLine} />
                  <View style={styles.tabletDividerTextBg}>
                    <Text style={styles.tabletDividerText}>or continue with</Text>
                  </View>
                </View> */}

                {/* Email Field */}
                <Text style={styles.tabletLabel}>Email</Text>
                <View style={[styles.tabletInputWrapper, isEmailFocused && styles.tabletInputFocused]}>
                  <Ionicons name="mail-outline" size={18} color="rgba(0,0,0,0.5)" style={styles.tabletInputIcon} />
                  <TextInput
                    placeholder="Enter email address"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.tabletInput}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>

                {/* Password Field */}
                <Text style={styles.tabletLabel}>Password</Text>
                <View style={[styles.tabletInputWrapper, isPasswordFocused && styles.tabletInputFocused]}>
                  <Ionicons name="lock-closed-outline" size={18} color="rgba(0,0,0,0.5)" style={styles.tabletInputIcon} />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.tabletInput}
                    secureTextEntry={!showPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="rgba(0,0,0,0.5)"
                    />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPass')}
                  style={styles.tabletForgotLink}
                  disabled={isLoading}
                >
                  <Text style={styles.tabletForgotText}>Forgot Password ?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.tabletLoginButton}
                  disabled={isLoading}
                  activeOpacity={isLoading ? 1 : 0.7}
                >
                  <Text style={styles.tabletLoginButtonText}>
                    {isLoading ? 'loggining.....' : 'Login'}
                  </Text>
                </TouchableOpacity>

                {/* Register Link */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  style={styles.tabletRegisterLink}
                  disabled={isLoading}
                >
                  <Text style={styles.tabletRegisterText}>Register</Text>
                </TouchableOpacity>

                {/* Terms */}
                <Text style={styles.tabletTermsText}>
                  By proceeding you agree with Edit by Mercy's{' '}
                  <Text style={styles.tabletTermsLink}>terms of use</Text> and{' '}
                  <Text style={styles.tabletTermsLink}>privacy policy</Text>
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // Mobile Layout (existing)
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
              <ImageBackground
                source={icon}
                style={[styles.imageBackground, { position: 'relative' }]}
                resizeMode="cover"
              />
              <View style={styles.overlay}>
                <Image style={styles.logo} source={logo} />
                <ThemedText style={styles.subtitle}>
                  Photo Editing • Manipulation • Reshaping
                </ThemedText>

                <View style={styles.card}>
                  {/* Social buttons - Commented out for now, will work on later */}
                  {/* <View style={styles.socialRow}>
                    <TouchableOpacity
                      style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}
                      disabled={isLoading}
                      onPress={handleGoogleAuth}
                    >
                      <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={google} />
                      <ThemedText style={styles.titleText}>Google</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}
                      disabled={isLoading}
                    >
                      <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={facebook} />
                      <ThemedText style={styles.titleText}>Facebook</ThemedText>
                    </TouchableOpacity>
                  </View>

                  <ThemedText style={{ marginTop: 10, color: '#B7B7B9', textAlign: 'center' }}>
                    _________or continue with_________
                  </ThemedText> */}

                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputWrapper, isEmailFocused && { borderColor: '#992C55' }]}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Enter email"
                      value={email}
                      onChangeText={setEmail}
                      style={styles.inputWithIcon}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      keyboardType="email-address"
                      editable={!isLoading}
                    />
                  </View>

                  <Text style={styles.label}>Password</Text>
                  <View
                    style={[styles.inputWrapper, isPasswordFocused && { borderColor: '#992C55' }]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter password"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.inputWithIcon}
                      secureTextEntry={!showPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPass')}
                    style={styles.forgotLink}
                    disabled={isLoading}
                  >
                    <ThemedText style={styles.forgotText}>Forgot Password?</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                    disabled={isLoading}
                    activeOpacity={isLoading ? 1 : 0.7}
                  >
                    <ThemedText style={styles.loginButtonText}>
                      {isLoading ? 'loggining.....' : 'Login'}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerLink}
                    disabled={isLoading}
                  >
                    <Text style={styles.registerText}>Register</Text>
                  </TouchableOpacity>

                  <ThemedText style={{ textAlign: 'center', marginTop: 25, fontSize: 12 }}>
                    By proceeding you agree with Edit by Mercy’s{' '}
                    <Text style={{ color: '#992C55' }}>terms of use</Text> and{' '}
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
  inputIcon: { marginRight: 8 },
  inputWithIcon: { flex: 1, fontSize: 14, color: '#333' },

  container: { flex: 1, backgroundColor: '#fff' },
  logo: { width: 140, height: 100, marginBottom: -30 },
  imageBackground: { height: 320, width: '100%' },
  overlay: {
    marginTop: -100,
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
  titleText: { fontSize: 16, color: '#000', fontWeight: '500' },
  subtitle: { marginTop: 8, color: '#fff', fontSize: 16, marginBottom: 10 },
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
  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
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
  },
  socialButtonText: { color: '#8C2D52', fontWeight: '600' },
  orText: { textAlign: 'center', marginVertical: 16, color: '#888' },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 4, marginTop: 10, color: '#333' },
  input: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 16, borderRadius: 8, marginBottom: 8 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotText: { color: '#8C2D52', fontSize: 13 },
  loginButton: { backgroundColor: '#8C2D52', paddingVertical: 12, borderRadius: 30, alignItems: 'center', marginBottom: 14 },
  loginButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  registerLink: { alignItems: 'center' },
  registerText: { color: '#992C55', fontSize: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  
  // Tablet Styles
  tabletContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  tabletModal: {
    backgroundColor: '#992C55',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  tabletHeader: {
    paddingTop: 64,
    paddingBottom: 28,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabletLogo: {
    width: 184,
    height: 81,
    marginBottom: 8,
  },
  tabletSubtitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  tabletCard: {
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    minHeight: 543,
  },
  tabletSocialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabletSocialButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  tabletSocialIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  tabletSocialText: {
    fontSize: 14,
    color: '#000',
  },
  tabletDividerContainer: {
    position: 'relative',
    height: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  tabletDividerLine: {
    position: 'absolute',
    top: 9,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#000',
    opacity: 0.1,
  },
  tabletDividerTextBg: {
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: [{ translateX: -42.5 }],
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 5,
  },
  tabletDividerText: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
  },
  tabletLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    marginTop: 0,
  },
  tabletInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  tabletInputFocused: {
    borderColor: '#992C55',
  },
  tabletInputIcon: {
    marginRight: 8,
  },
  tabletInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  tabletForgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  tabletForgotText: {
    fontSize: 14,
    color: '#992C55',
  },
  tabletLoginButton: {
    backgroundColor: '#992C55',
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabletLoginButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  tabletRegisterLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tabletRegisterText: {
    fontSize: 14,
    color: '#992C55',
  },
  tabletTermsText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    lineHeight: 16,
  },
  tabletTermsLink: {
    color: '#992C55',
  },
});

