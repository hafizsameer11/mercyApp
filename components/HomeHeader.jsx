import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from './ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useIsTablet from '../hooks/useIsTablet';

const HomeHeader = () => {
  const navigation = useNavigation();
  const isTablet = useIsTablet();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser?.fullName || parsedUser?.name || ''); // handle different key names
        }
      } catch (err) {
        console.log('❌ Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={[styles.header, isTablet && styles.tabletHeader]}>
      <ThemedText fontFamily="monaque" weight="bold" style={[styles.greeting, isTablet && styles.tabletGreeting]}>
        Hi{userName ? `, ${userName}` : ''}
      </ThemedText>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notification')}
        style={[styles.bellButton, isTablet && styles.tabletBellButton]}
      >
        <Ionicons name="notifications-outline" size={isTablet ? 20 : 24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4a1227',
    padding: 20,
    paddingTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  bellButton: {
    borderRadius: 50,
    backgroundColor: '#641C37',
    padding: 5,
  },
  // Tablet Styles
  tabletHeader: {
    height: 83,
    padding: 0,
    paddingTop: 27,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  tabletGreeting: {
    fontSize: 28, // Increased from 24
    fontWeight: 'bold',
  },
  tabletBellButton: {
    width: 37,
    height: 37,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
