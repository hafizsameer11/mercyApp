import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import HomeHeader from '../../components/HomeHeader';
import HeroCarousel from '../../components/HeroCarousel';
import { StatusBar } from 'expo-status-bar';
import ServiceCategoryList from '../../components/ServiceList';
import LatestFeeds from '../../components/LatestFeeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
 // Assuming you have a themed text component


const HomeScreen = () => {
  const [userDetails,setUserDetails]=React.useState({})
  //add use effect
  React.useEffect(() => {
    const getUserDetails=async()=>{
      const userdata=await AsyncStorage.getItem('user');
      setUserDetails(JSON.parse(userdata))
      console.log(JSON.parse(userdata))
    }
    getUserDetails()
  }, []);
  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light' />
      <HomeHeader />
      <HeroCarousel />
      
      <ServiceCategoryList />
      <View style={{ marginTop:20 }}>
      <LatestFeeds/>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF6FA',
  },
  feeds:{
    marginTop:30,
  }
});
