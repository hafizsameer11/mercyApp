import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';

const EditProfile = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('Maleek');
  const [phone, setPhone] = useState('070301245678');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <StatusBar style="dark" />

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
      <TouchableOpacity style={styles.saveBtn}>
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
