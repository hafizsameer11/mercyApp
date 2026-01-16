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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const fallbackAvatar = require('../../../assets/Ellipse 18.png');

export default function ForwardMessageScreen() {
  const insets = useSafeAreaInsets();
  const [allUsers, setAllUsers] = useState([]); // All users (customers + team)
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [peerTab, setPeerTab] = useState('Customer'); // 'Customer' or 'Team'
  const [userRole, setUserRole] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const forwardedMessage = route.params?.forwardMessage;
  const forwardMessages = route.params?.forwardMessages; // Array of message IDs for mass forward

  // Load user role and set initial tab
  useEffect(() => {
    (async () => {
      try {
        const userdata = await AsyncStorage.getItem('user');
        if (userdata) {
          const user = JSON.parse(userdata);
          const role = user?.role || '';
          setUserRole(role);
          // For customers, default to Team tab (only show team members)
          if (role === 'user' || role === 'customer') {
            setPeerTab('Team');
          }
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    })();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch all users (non-users endpoint returns all users except current user)
      const res = await fetch('https://editbymercy.hmstech.xyz/api/non-users', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      const json = await res.json();
      if (json.status === 'success') {
        const users = json.data || [];
        
        // Categorize users by role
        const categorized = users.map(u => {
          const role = (u.role || '').toLowerCase();
          // Customers are users with role 'user' or 'customer'
          // Team members are support, agent, admin, etc.
          const isCustomer = role === 'user' || role === 'customer';
          return {
            ...u,
            _type: isCustomer ? 'customer' : 'team',
          };
        });
        
        setAllUsers(categorized);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

const forwardMessageToUser = async () => {
  if (!selectedUserId) {
    Alert.alert('Error', 'Please select a user to forward the message.');
    return;
  }

  // Handle mass forward (multiple messages)
  if (forwardMessages && Array.isArray(forwardMessages) && forwardMessages.length > 0) {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please login again.');
        return;
      }

      // Filter out temp/pending messages - only forward saved messages
      const validMessageIds = forwardMessages.filter(msgId => {
        const idStr = String(msgId);
        const isTemp = idStr.startsWith('temp-') || idStr.startsWith('local-');
        return !isTemp;
      });

      if (validMessageIds.length === 0) {
        Alert.alert('Error', 'Cannot forward pending messages. Please wait for messages to be sent first.');
        return;
      }

      if (validMessageIds.length < forwardMessages.length) {
        const skippedCount = forwardMessages.length - validMessageIds.length;
        Alert.alert(
          'Notice',
          `${skippedCount} pending message(s) were skipped. Only sent messages can be forwarded.`
        );
      }

      let successCount = 0;
      let failCount = 0;
      let lastChat = null;
      const errors = [];

      // Forward messages one by one (backend supports one at a time)
      for (const messageId of validMessageIds) {
        try {
          // Ensure messageId is a number (not string)
          const numericId = typeof messageId === 'string' && !isNaN(messageId) ? parseInt(messageId, 10) : messageId;
          
          const requestData = {
            original_message_id: numericId,
            receiver_id: selectedUserId,
          };
          
          console.log('📤 Forwarding message - Request data:', JSON.stringify(requestData, null, 2));
          console.log('📤 Message ID:', numericId, 'Type:', typeof numericId);
          console.log('📤 Receiver ID:', selectedUserId, 'Type:', typeof selectedUserId);
          
          const response = await axios.post(
            'https://editbymercy.hmstech.xyz/api/forward-message',
            requestData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );
          
          console.log('📥 Forward response:', JSON.stringify(response?.data, null, 2));

          if (response?.data?.status === 'success') {
            successCount++;
            // Keep last chat for navigation
            if (response?.data?.data?.chat) {
              lastChat = response.data.data.chat;
            }
          } else {
            failCount++;
            const errorMsg = response?.data?.message || 'Unknown error';
            errors.push(`Message ${numericId}: ${errorMsg}`);
          }
        } catch (error) {
          failCount++;
          const errorMsg = error?.response?.data?.message || error?.message || 'Network error';
          console.error(`Failed to forward message ${messageId}:`, error);
          errors.push(`Message ${messageId}: ${errorMsg}`);
        }
      }

      // Get selected user's name from the list
      const selectedUser = allUsers.find(u => u.id === selectedUserId);
      const selectedUserName = selectedUser?.name || 'User';

      // Clear selection
      setSelectedUserId(null);

      if (successCount > 0) {
        if (failCount === 0) {
          Alert.alert('Success', `Successfully forwarded ${successCount} message(s).`);
        } else {
          Alert.alert(
            'Partial Success',
            `Forwarded ${successCount} message(s), ${failCount} failed.\n\nErrors:\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? '\n...' : ''}`
          );
        }

        // Navigate to chat if we have a chat ID
        if (lastChat) {
          const pA = lastChat?.participant_a || {};
          const pB = lastChat?.participant_b || {};
          const agent = [pA, pB].find(p => p?.role === 'support' || p?.id === lastChat.agent_id) || pB || pA;
          const user = agent?.id === pA?.id ? pB : pA;

          // Get selected user's image if available
          const selectedUserImage = selectedUser?.profile_picture || agent?.profile_picture || null;

          navigation.navigate('Chat', {
            chat_id: lastChat?.id,
            userRole: userRole || 'agent',
            user: selectedUserName, // Use the selected user's name from forwarding list
            agent: {
              name: selectedUserName, // Use the selected user's name from forwarding list
              image: selectedUserImage,
            },
            service: lastChat.service || 'General',
          });
        } else {
          // Just go back if no chat to navigate to
          navigation.goBack();
        }
      } else {
        Alert.alert('Error', `Failed to forward all messages.\n\nErrors:\n${errors.slice(0, 5).join('\n')}`);
      }
    } catch (error) {
      console.error('Mass forwarding error:', error);
      Alert.alert('Error', `Something went wrong: ${error?.message || 'Unknown error'}`);
    }
    return;
  }

  // Handle single message forward
  if (!forwardedMessage) {
    Alert.alert('Error', 'No message to forward.');
    return;
  }

  // Check if message is pending/temp (cannot forward)
  const messageIdStr = String(forwardedMessage.id || '');
  const isTemp = messageIdStr.startsWith('temp-') || messageIdStr.startsWith('local-') || forwardedMessage.pending === true;
  
  if (isTemp) {
    Alert.alert('Error', 'Cannot forward pending messages. Please wait for the message to be sent first.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    // Ensure messageId is a number (not string)
    const numericId = typeof forwardedMessage.id === 'string' && !isNaN(forwardedMessage.id) 
      ? parseInt(forwardedMessage.id, 10) 
      : forwardedMessage.id;

    const requestData = {
      original_message_id: numericId,
      receiver_id: selectedUserId,
    };
    
    console.log('📤 Forwarding single message - Request data:', JSON.stringify(requestData, null, 2));
    console.log('📤 Message object:', JSON.stringify(forwardedMessage, null, 2));
    console.log('📤 Message ID:', numericId, 'Type:', typeof numericId);
    console.log('📤 Receiver ID:', selectedUserId, 'Type:', typeof selectedUserId);

    const response = await axios.post(
      'https://editbymercy.hmstech.xyz/api/forward-message',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('📥 Forward response:', JSON.stringify(response?.data, null, 2));

    if (response?.data?.status === 'success') {
      const chat = response?.data?.data?.chat;

      if (!chat) {
        Alert.alert('Error', 'Forwarded but no chat returned from server.');
        return;
      }

      // Get selected user's name from the list
      const selectedUser = allUsers.find(u => u.id === selectedUserId);
      const selectedUserName = selectedUser?.name || 'User';

      // Identify agent & user
      const pA = chat?.participant_a || {};
      const pB = chat?.participant_b || {};
      const agent = [pA, pB].find(p => p?.role === 'support' || p?.id === chat.agent_id) || pB || pA;
      const user = agent?.id === pA?.id ? pB : pA;

      // Get selected user's image if available
      const selectedUserImage = selectedUser?.profile_picture || agent?.profile_picture || null;

      Alert.alert('Success', 'Message forwarded successfully.');
      console.log('Forwarded to chat:', chat?.id);
      
      navigation.navigate('Chat', {
        chat_id: chat?.id,
        userRole: userRole || 'agent',
        user: selectedUserName, // Use the selected user's name from forwarding list
        agent: {
          name: selectedUserName, // Use the selected user's name from forwarding list
          image: selectedUserImage,
        },
        service: chat.service || 'General',
      });
    } else {
      const errorMsg = response?.data?.message || 'Failed to forward message.';
      Alert.alert('Error', errorMsg);
    }
  } catch (error) {
    console.error('Forwarding error:', error?.response?.data || error?.message);
    const errorMsg = error?.response?.data?.message || error?.message || 'Something went wrong while forwarding the message.';
    Alert.alert('Error', errorMsg);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on tab and search
  // For customers, only show team members (hide tabs)
  const isCustomer = userRole === 'user' || userRole === 'customer';
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) || false;
    if (isCustomer) {
      // Customers can only see team members
      return matchesSearch && user._type === 'team';
    }
    // For non-customers, filter by selected tab
    const matchesTab = peerTab === 'Customer' 
      ? user._type === 'customer'
      : user._type === 'team';
    return matchesSearch && matchesTab;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F5F7" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>
          {forwardMessages && forwardMessages.length > 0 
            ? `Forward ${forwardMessages.length} Message${forwardMessages.length > 1 ? 's' : ''}` 
            : 'Forward Message'}
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {selectedUserId && (
        <TouchableOpacity 
          style={styles.forwardBtnTop} 
          onPress={forwardMessageToUser}
        >
          <ThemedText style={styles.forwardBtnText}>
            ✓ Forward {forwardMessages && forwardMessages.length > 0 ? `${forwardMessages.length} Message${forwardMessages.length > 1 ? 's' : ''}` : 'Message'}
          </ThemedText>
        </TouchableOpacity>
      )}

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

      {/* Customer/Team Tabs - Only show for non-customers */}
      {!(userRole === 'user' || userRole === 'customer') && (
        <View style={styles.tabSwitch}>
          <TouchableOpacity
            style={[styles.tabBtn, peerTab === 'Customer' && styles.tabBtnActive]}
            onPress={() => setPeerTab('Customer')}
          >
            <ThemedText style={[styles.tabText, peerTab === 'Customer' && styles.tabTextActive]}>
              Customers
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, peerTab === 'Team' && styles.tabBtnActive]}
            onPress={() => setPeerTab('Team')}
          >
            <ThemedText style={[styles.tabText, peerTab === 'Team' && styles.tabTextActive]}>
              Team
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#992C55" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ marginTop: 20, flex: 1 }}>
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
  forwardBtnTop: {
    backgroundColor: '#992C55',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  forwardBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#992C55',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
