import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ThemedText from '../../components/ThemedText';
import API from '../../config/api.config';
import useIsTablet from '../../hooks/useIsTablet';

// Images
import logo from '../../assets/logo.png';
import icon from '../../assets/Img.png';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';

// Complete auth session for Expo Web Browser
WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const navigation = useNavigation();
  const isTablet = useIsTablet();

  // form state
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');

  // ui state
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPass] = useState(false);

  // focus states (visual only)
  const [focus, setFocus] = useState({ user: false, email: false, phone: false, pass: false });

  // Google Auth hook - use web client for Expo Go testing
  // Android client will be used automatically when you build standalone APK with EAS
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
    iosClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
    androidClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com', // Use web client for Expo Go
    webClientId: '735121439507-793fqpbr7nh3k8tnh79pgbmf2sfitkhj.apps.googleusercontent.com',
  });

  const showToast = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const extractErrorMessage = (error) => {
    try {
      if (error && error.response) {
        const { status, data } = error.response;

        // Laravel validation shape
        if (data && data.errors && typeof data.errors === 'object') {
          const firstKey = Object.keys(data.errors)[0];
          const firstArr = data.errors[firstKey];
          if (Array.isArray(firstArr) && firstArr.length) return String(firstArr[0]);
        }

        if (typeof data === 'string') return data;
        if (data && data.message) return String(data.message);
        if (data && data.error) return String(data.error);

        if (status === 400) return 'Bad request. Please check the provided data.';
        if (status === 401) return 'Unauthorized. Please log in again.';
        if (status === 403) return 'Forbidden. You do not have access.';
        if (status === 404) return 'Endpoint not found.';
        if (status === 409) return 'Conflict. This email/phone may already be registered.';
        if (status === 422) return 'Validation failed. Please review your inputs.';
        if (status === 429) return 'Too many attempts. Please try again later.';
        if (status >= 500) return 'Server error. Please try again later.';
        return `Request failed with status ${status}.`;
      }

      if (error && error.code === 'ECONNABORTED') return 'Request timed out. Check your internet and try again.';
      if (error && error.message === 'Network Error') return 'Network error. Please check your connection.';
      return 'Something went wrong. Please try again.';
    } catch {
      return 'Something went wrong. Please try again.';
    }
  };

  const validate = () => {
    if (!username.trim()) return 'Username is required';
    if (!email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address';
    if (!phone.trim()) return 'Phone number is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const canSubmit = useMemo(() => {
    return username.trim() && email.trim() && phone.trim() && password.length >= 6 && !loading;
  }, [username, email, phone, password, loading]);

  const handleRegister = async () => {
    const localErr = validate();
    if (localErr) {
      showToast(localErr);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        API.REGISTER,
        {
          name: username.trim(),
          email: email.trim(),
          password,
          role: 'user',
          phone: phone.trim(),
        },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          timeout: 20000,
        }
      );

      console.log('Registration Success:', res.data);
      showToast('Account created successfully. Please log in.');
      navigation.navigate('Login');
    } catch (err) {
      const msg = extractErrorMessage(err);
      showToast(msg);
      if (err && err.response) {
        console.log('Server responded with status', err.response.status);
        console.log('Response data:', err.response.data);
      } else if (err && err.request) {
        console.log('No response received:', err.request);
      } else {
        console.log('Axios config error:', err?.message || err);
      }
    } finally {
      setLoading(false);
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
      setLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google auth error:', error);
      showToast('Failed to open Google login');
      setLoading(false);
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
        
        showToast('Login successful!');
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        showToast(response.data?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
      showToast(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

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
              <ScrollView 
                style={styles.tabletCard}
                contentContainerStyle={styles.tabletCardContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
                {/* Social Buttons Row - Hidden */}
                {/* <View style={styles.tabletSocialRow}>
                  <TouchableOpacity
                    style={styles.tabletSocialButton}
                    disabled={loading}
                    onPress={handleGoogleAuth}
                  >
                    <Image style={styles.tabletSocialIcon} source={google} />
                    <Text style={styles.tabletSocialText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tabletSocialButton}
                    disabled={loading}
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

                {/* Form Fields Container */}
                <View style={styles.tabletFormFields}>
                  {/* Username */}
                  <View style={styles.tabletFieldContainer}>
                    <Text style={styles.tabletLabel}>Username</Text>
                    <View style={[styles.tabletInputWrapper, focus.user && styles.tabletInputFocused]}>
                      <TextInput
                        placeholder="Enter username"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.tabletInput}
                        onFocus={() => setFocus({ ...focus, user: true })}
                        onBlur={() => setFocus({ ...focus, user: false })}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.tabletFieldContainer}>
                    <Text style={styles.tabletLabel}>Email</Text>
                    <View style={[styles.tabletInputWrapper, focus.email && styles.tabletInputFocused]}>
                      <TextInput
                        placeholder="email"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.tabletInput}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocus({ ...focus, email: true })}
                        onBlur={() => setFocus({ ...focus, email: false })}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  {/* Phone */}
                  <View style={styles.tabletFieldContainer}>
                    <Text style={styles.tabletLabel}>Phone number</Text>
                    <View style={[styles.tabletInputWrapper, focus.phone && styles.tabletInputFocused]}>
                      <TextInput
                        placeholder="Enter phone number"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.tabletInput}
                        keyboardType="phone-pad"
                        onFocus={() => setFocus({ ...focus, phone: true })}
                        onBlur={() => setFocus({ ...focus, phone: false })}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  {/* Password */}
                  <View style={styles.tabletFieldContainer}>
                    <Text style={styles.tabletLabel}>Password</Text>
                    <View style={[styles.tabletInputWrapper, focus.pass && styles.tabletInputFocused]}>
                      <TextInput
                        placeholder="Enter password"
                        placeholderTextColor="rgba(0,0,0,0.5)"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.tabletInput}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocus({ ...focus, pass: true })}
                        onBlur={() => setFocus({ ...focus, pass: false })}
                        editable={!loading}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPass(!showPassword)}
                        disabled={loading}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color="rgba(0,0,0,0.5)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[styles.tabletRegisterButton, !canSubmit && { opacity: 0.6 }]}
                  activeOpacity={0.7}
                  onPress={handleRegister}
                  disabled={!canSubmit}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.tabletRegisterButtonText}>Register</Text>
                  )}
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={styles.tabletLoginLink}
                  disabled={loading}
                >
                  <Text style={styles.tabletLoginLinkText}>Login</Text>
                </TouchableOpacity>

                {/* Terms */}
                <Text style={styles.tabletTermsText}>
                  By proceeding you agree with Edit by Mercy's{' '}
                  <Text style={styles.tabletTermsLink}>terms of use</Text> and{' '}
                  <Text style={styles.tabletTermsLink}>privacy policy</Text>
                </Text>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // Mobile Layout (existing)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Image */}
        <View style={styles.imageSection}>
          <ImageBackground source={icon} style={styles.imageBackground} resizeMode="cover">
            <View style={styles.overlay}>
              <Image style={styles.logo} source={logo} />
              <ThemedText style={styles.subtitle}>Photo Editing • Manipulation • Reshaping</ThemedText>
            </View>
          </ImageBackground>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Social buttons - Commented out for now, will work on later */}
          {/* <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}
              disabled={loading}
              onPress={handleGoogleAuth}
            >
              <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={google} />
              <ThemedText style={styles.titleText}>Google</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}
              disabled={loading}
            >
              <Image style={{ height: 25, width: 25, marginLeft: 5 }} source={facebook} />
              <ThemedText style={styles.titleText}>Facebook</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={{ marginTop: 10, color: '#B7B7B9', textAlign: 'center' }}>
            _________or continue with_________
          </ThemedText> */}

          {/* Username */}
          <ThemedText style={styles.label}>Username</ThemedText>
          <View style={[styles.inputWrapper, focus.user && { borderColor: '#992C55' }]}>
            <TextInput
              placeholder="Enter username"
              style={styles.inputWithIcon}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocus({ ...focus, user: true })}
              onBlur={() => setFocus({ ...focus, user: false })}
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <ThemedText style={styles.label}>Email</ThemedText>
          <View style={[styles.inputWrapper, focus.email && { borderColor: '#992C55' }]}>
            <TextInput
              placeholder="Enter email address"
              style={styles.inputWithIcon}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocus({ ...focus, email: true })}
              onBlur={() => setFocus({ ...focus, email: false })}
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Phone */}
          <ThemedText style={styles.label}>Phone Number</ThemedText>
          <View style={[styles.inputWrapper, focus.phone && { borderColor: '#992C55' }]}>
            <TextInput
              placeholder="Enter phone number"
              style={styles.inputWithIcon}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocus({ ...focus, phone: true })}
              onBlur={() => setFocus({ ...focus, phone: false })}
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <ThemedText style={styles.label}>Password</ThemedText>
          <View style={[styles.inputWrapper, focus.pass && { borderColor: '#992C55' }]}>
            <TextInput
              placeholder="Enter password"
              style={styles.inputWithIcon}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocus({ ...focus, pass: true })}
              onBlur={() => setFocus({ ...focus, pass: false })}
              editable={!loading}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPassword)}
              disabled={loading}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.loginButton, !canSubmit && { opacity: 0.6 }]}
            activeOpacity={0.7}
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Register</ThemedText>
            )}
          </TouchableOpacity>

          {/* Go to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.registerLink}
            disabled={loading}
          >
            <ThemedText style={styles.registerText}>Login</ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ textAlign: 'center', marginTop: 25, fontSize: 12 }}>
            By proceeding you agree with Edit by Mercy’s{' '}
            <ThemedText style={{ color: '#992C55' }}>terms of use</ThemedText> and{' '}
            <ThemedText style={{ color: '#992C55' }}>privacy policy</ThemedText>
          </ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollContent: { backgroundColor: '#fff', paddingBottom: 30 },
  imageSection: { width: '100%', height: 320 },
  imageBackground: { flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end' },
  overlay: {
    backgroundColor: '#992C55',
    marginHorizontal: 20,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
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
    borderRadius: 24,
    padding: 24,
    zIndex: 0,
    elevation: 10,
    shadowColor: '#000',
  },
  logo: { width: 140, height: 100, marginTop: -20, marginBottom: -10 },
  subtitle: { marginTop: 5, color: '#fff', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
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
  titleText: { fontSize: 16, color: '#000', fontWeight: '500' },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 4, marginTop: 10, color: '#333' },
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
    gap: 8,
  },
  inputWithIcon: { flex: 1, fontSize: 14, color: '#000' },
  loginButton: {
    backgroundColor: '#8C2D52',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 14,
  },
  loginButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  registerLink: { alignItems: 'center' },
  registerText: { color: '#992C55', fontSize: 16 },
  
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
    maxHeight: '90%',
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
    maxHeight: 721,
  },
  tabletCardContent: {
    padding: 20,
    paddingBottom: 30,
    flexGrow: 1,
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
  tabletFormFields: {
    marginBottom: 20,
  },
  tabletFieldContainer: {
    marginBottom: 20,
  },
  tabletLabel: {
    fontSize: 14,
    color: '#000',
  },
  tabletInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#fff',
  },
  tabletInputFocused: {
    borderColor: '#992C55',
  },
  tabletInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  tabletRegisterButton: {
    backgroundColor: '#992C55',
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabletRegisterButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  tabletLoginLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tabletLoginLinkText: {
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



