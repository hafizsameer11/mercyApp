import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const fetchNotifications = async ({ signal }) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get('https://editbymercy.hmstech.xyz/api/get-notifications', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
    timeout: 15000,
  });

  const items = (res && res.data && res.data.data) || [];
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.content,
    time: new Date(item.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    unread: item.is_read === 0,
    avatar: null, // keep null unless you add an image
  }));
};

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: ({ signal }) => fetchNotifications({ signal }),
    staleTime: 10000,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            {item.unread && <View style={styles.redDot} />}
          </View>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.time}>{item.time}</ThemedText>
        </View>
        {item.avatar ? <Image source={item.avatar} style={styles.avatar} /> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching || isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <ThemedText style={{ color: '#777' }}>No notifications</ThemedText>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F7',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 105,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  redDot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginVertical: 8,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 12,
  },
});
