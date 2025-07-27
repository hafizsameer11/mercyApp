import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native';


const dummyUsers = [
  { id: '1', name: 'Wanda', role: 'Chief Editor 1', avatar: require('../../../assets/Ellipse 18.png') },
  { id: '2', name: 'Chris', role: 'Chief Editor 2', avatar: require('../../../assets/Ellipse 18.png') },
  { id: '3', name: 'Adam', role: 'Chief Editor 3', avatar: require('../../../assets/Ellipse 18.png') },
];

export default function NewChatScreen({ navigation }) {
  // const navigation = useNavigation();
  return (
    
    <>

      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#F5F5F7" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>New Chat</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#aaa" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search Users"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>

        <ScrollView style={{ marginTop: 20 }}>
          {dummyUsers.map(user => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AgentToAgentChat', {
                  agent: {
                    name: user.name,
                    image: user.avatar,
                  },
                })
              }
              key={user.id} style={styles.userRow}>
              <Image source={user.avatar} style={styles.avatar} />
              <View>
                <ThemedText style={styles.userName}>{user.name}</ThemedText>
                <ThemedText style={styles.userRole}>{user.role}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
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
  searchInput: { flex: 1, marginLeft: 10, color: '#000', },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  userRole: { fontSize: 12, color: '#666' },
});
