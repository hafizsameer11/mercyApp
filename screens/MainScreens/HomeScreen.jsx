import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import HomeHeader from '../../components/HomeHeader';
import HeroCarousel from '../../components/HeroCarousel';
import { StatusBar } from 'expo-status-bar';
import ServiceCategoryList from '../../components/ServiceList';
import LatestFeeds from '../../components/LatestFeeds';
 // Assuming you have a themed text component


const HomeScreen = () => {
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
