import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';

const ChangePassword = ({ isTabletSplitView = false, onBack, onSuccess }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [timer, setTimer] = useState(59);
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const toast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleSendCode = async () => {
    if (!email) return toast('Please enter your email');

    try {
      await axios.post('https://editbymercy.hmstech.xyz/api/auth/forget-password', {
        email,
      });
      toast('Code sent to email');
      setTimer(59);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast('Failed to send code');
    }
  };

  const handleVerifyCode = async () => {
    if (!email || !code) return toast('Enter both email and code');

    try {
      await axios.post('https://editbymercy.hmstech.xyz/api/auth/verify-code', {
        email,
        code,
      });
      toast('Code verified');
      setCodeVerified(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast('Invalid code or email');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !reenterPassword) {
      return toast('Please enter both passwords');
    }

    if (newPassword !== reenterPassword) {
      return toast('Passwords do not match');
    }

    try {
      await axios.post('https://editbymercy.hmstech.xyz/api/auth/change-password', {
        email,
        password: newPassword,
      });
      toast('Password changed successfully');
      if (isTabletSplitView && onSuccess) {
        onSuccess();
      } else {
        navigation.goBack();
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast('Failed to change password');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.header, isTabletSplitView && styles.tabletHeader]}>
        {!isTabletSplitView ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        ) : onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        ) : null}
        <ThemedText style={[styles.title, isTabletSplitView && styles.tabletTitle]}>Change Password</ThemedText>
      </View>

      <View style={styles.form}>
        <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Email</ThemedText>
        <ThemedText style={[styles.subLabel, isTabletSplitView && styles.tabletSubLabel]}>
          Input the email you used in creating your account, a verification code will be sent
        </ThemedText>

        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, isTabletSplitView && styles.tabletInput, { flex: 1 }]}
            placeholder="Input email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={[styles.sendBtn, isTabletSplitView && styles.tabletSendBtn]} onPress={handleSendCode}>
            <ThemedText style={[styles.sendText, isTabletSplitView && styles.tabletSendText]}>Send</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={[styles.timerText, isTabletSplitView && styles.tabletTimerText]}>
          Request new code in <Text style={{ color: 'red' }}>00:{String(timer).padStart(2, '0')}</Text>
        </ThemedText>

        <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Input Code</ThemedText>
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, isTabletSplitView && styles.tabletInput, { flex: 1 }]}
            placeholder="Enter code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={[styles.verifyBtn, isTabletSplitView && styles.tabletVerifyBtn]} onPress={handleVerifyCode}>
            <ThemedText style={[styles.sendText, isTabletSplitView && styles.tabletSendText]}>Verify</ThemedText>
          </TouchableOpacity>
        </View>

        {codeVerified && (
          <>
            <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>New Password</ThemedText>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, isTabletSplitView && styles.tabletInput]}
                placeholder="New password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword((prev) => !prev)}
                style={styles.eyeIcon}
              >
                <Ionicons name={showNewPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <ThemedText style={[styles.label, isTabletSplitView && styles.tabletLabel]}>Reenter Password</ThemedText>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, isTabletSplitView && styles.tabletInput]}
                placeholder="Reenter password"
                secureTextEntry={!showReenterPassword}
                value={reenterPassword}
                onChangeText={setReenterPassword}
              />
              <TouchableOpacity
                onPress={() => setShowReenterPassword((prev) => !prev)}
                style={styles.eyeIcon}
              >
                <Ionicons name={showReenterPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveBtn, isTabletSplitView && styles.tabletSaveBtn]} onPress={handleChangePassword}>
              <ThemedText style={[styles.saveText, isTabletSplitView && styles.tabletSaveText]}>Save Changes</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ChangePassword;

// ✅ Using your provided styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sendBtn: {
    backgroundColor: '#992C55',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 14,
    marginLeft: 8,
  },
  verifyBtn: {
    backgroundColor: '#C48DA6',
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  timerText: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
    marginLeft: 220,
  },
  inputWithIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  saveBtn: {
    backgroundColor: '#C48DA6',
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 210,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Tablet-specific styles with increased font sizes
  tabletHeader: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  tabletTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  tabletLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  tabletSubLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  tabletInput: {
    padding: 16,
    fontSize: 17,
    marginBottom: 14,
  },
  tabletSendBtn: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  tabletVerifyBtn: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  tabletSendText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabletTimerText: {
    fontSize: 14,
    marginBottom: 18,
  },
  tabletSaveBtn: {
    paddingVertical: 16,
    marginTop: 24,
  },
  tabletSaveText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
