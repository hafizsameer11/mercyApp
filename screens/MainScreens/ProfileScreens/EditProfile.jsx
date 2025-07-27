import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUsername(parsed.name || '');
        setPhone(parsed.phone || '');
      }
    };
    getUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'https://editbymercy.hmstech.xyz/api/edit-profile',
        {
          name: username,
          phone: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Edit Profile Error:', error);
      Alert.alert('Error', 'Something went wrong while updating your profile.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Edit Profile</ThemedText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <ThemedText style={styles.label}>Username</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <ThemedText style={styles.label}>Phone number</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <ThemedText style={styles.label}>Password</ThemedText>
        <TouchableOpacity
          style={styles.passwordRow}
          onPress={() => navigation.navigate('ChangePass')}
        >
          <ThemedText style={styles.passwordText}>Change Password</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
        <ThemedText style={styles.saveText}>Save Changes</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
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
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 20,
  },
  passwordRow: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordText: {
    fontSize: 15,
    color: '#222',
  },
  saveBtn: {
    backgroundColor: '#992C55',
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 400,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
