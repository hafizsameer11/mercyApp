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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import ThemedText from '../../components/ThemedText';
import API from '../../config/api.config';

// Images
import logo from '../../assets/logo.png';
import icon from '../../assets/Img.png';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';

const RegisterScreen = () => {
  const navigation = useNavigation();

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
          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialButton, { flexDirection: 'row', alignItems: 'center' }]}
              disabled={loading}
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
          </ThemedText>

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
});
