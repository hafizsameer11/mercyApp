import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fallbackAvatar = require('../../../assets/Ellipse 18.png');

export default function NewChatScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F5F7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>New Chat</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Input */}
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

      {/* Loading Spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#992C55" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userRow}
              onPress={() =>
                navigation.navigate('AgentToAgentChat', {
                  agent: {
                    id: user.id,
                    name: user.name,
                    image: user.profile_picture,
                  },
                })
              }
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
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  userRole: { fontSize: 12, color: '#666' },
});
