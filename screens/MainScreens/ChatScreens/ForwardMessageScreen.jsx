import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const fallbackAvatar = require('../../../assets/Ellipse 18.png');

export default function ForwardMessageScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const forwardedMessage = route.params?.forwardMessage;

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://editbymercy.hmstech.xyz/api/non-users', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const json = await res.json();
      if (json.status === 'success') {
        setUsers(json.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

const forwardMessageToUser = async () => {
  if (!selectedUserId || !forwardedMessage) {
    Alert.alert('Please select a user to forward the message.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      'https://editbymercy.hmstech.xyz/api/forward-message',
      {
        original_message_id: forwardedMessage.id,
        receiver_id: selectedUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (response.data?.status === 'success') {
      // ✅ chat is directly in data (no `.chat`)
      const chat = response?.data?.data?.chat;

      // Identify agent & user
      const pA = chat?.participant_a || {};
      const pB = chat?.participant_b || {};
      const agent =
        [pA, pB].find(p => p?.role === 'support' || p?.id === chat.agent_id) || pB || pA;
      const user = agent?.id === pA?.id ? pB : pA;

      // Optional: useful debug
      // console.log('Chat ->', chat);
      // console.log('Agent ->', agent, 'User ->', user);

      Alert.alert('Success', 'Message forwarded successfully.');
      console.log('Forwarded to chat:', chat?.id);
      navigation.navigate('Chat', {
        chat_id: chat?.id,                 // 🔴 required
        userRole: 'agent',
        user: user?.name || 'Customer',
        agent: {                          // 🔴 required
          name: agent?.name || 'Agent',
          image: agent?.profile_picture || null,
        },
        service: chat.service || 'General',
      });
    } else {
      Alert.alert('Error', 'Failed to forward message.');
    }
  } catch (error) {
    console.error('Forwarding error:', error.response?.data || error.message);
    Alert.alert('Error', 'Something went wrong while forwarding the message.');
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F5F7" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Forward Message</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#aaa" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Search Users"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#992C55" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userRow,
                user.id === selectedUserId && { backgroundColor: '#E0C6CF' },
              ]}
              onPress={() => setSelectedUserId(user.id)}
            >
              <Image
                source={user.profile_picture ? { uri: user.profile_picture } : fallbackAvatar}
                style={styles.avatar}
              />
              <View>
                <ThemedText style={styles.userName}>{user.name}</ThemedText>
                <ThemedText style={styles.userRole}>{user.role}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {selectedUserId && (
        <TouchableOpacity style={styles.forwardBtn} onPress={forwardMessageToUser}>
          <ThemedText style={styles.forwardBtnText}>✓ Forward Message</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7', paddingTop: 60, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18 },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#000' },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 12,
  },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  userRole: { fontSize: 12, color: '#666' },
  forwardBtn: {
    backgroundColor: '#992C55',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  forwardBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
