import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from './ThemedText';

const HomeHeader = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.header}>
      <ThemedText fontFamily="monaque" weight='bold' style={styles.greeting}>Hi, Maleek</ThemedText>
      <TouchableOpacity onPress={()=>navigation.navigate('Notification')} style={{ borderRadius:50, backgroundColor:'#641C37', padding:5 }}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
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
});
