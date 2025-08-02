import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import HomeHeader from '../../components/HomeHeader';
import HeroCarousel from '../../components/HeroCarousel';
import { StatusBar } from 'expo-status-bar';
import ServiceCategoryList from '../../components/ServiceList';
import LatestFeeds from '../../components/LatestFeeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../../config/api.config';

// Assuming you have a themed text component


const HomeScreen = () => {
  const [userDetails, setUserDetails] = React.useState({})
  const [latestFeed, setLatestFeed] = React.useState(null);
  //add use effect
  React.useEffect(() => {
    const getUserDetails = async () => {
      const userdata = await AsyncStorage.getItem('user');
      setUserDetails(JSON.parse(userdata))
      console.log(JSON.parse(userdata))
    }
    getUserDetails()
  }, []);

  React.useEffect(() => {
    const getUserDetails = async () => {
      const userdata = await AsyncStorage.getItem('user');
      setUserDetails(JSON.parse(userdata));
    };

    const fetchLatestFeed = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(API.GET_FEEDS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { feeds } = response.data.data;
        if (feeds?.length > 0) {
          const sorted = feeds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setLatestFeed([sorted[0]]); // ✅ Only the latest feed in array
        }
      } catch (error) {
        console.log('❌ Error fetching latest feed:', error.message);
      }
    };

    getUserDetails();
    fetchLatestFeed();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light' />
      <HomeHeader />
      <HeroCarousel />

      <ServiceCategoryList />
      <View style={{ marginTop: 20 }}>
        {latestFeed && <LatestFeeds feeds={latestFeed} />}

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
  feeds: {
    marginTop: 30,
  }
});
