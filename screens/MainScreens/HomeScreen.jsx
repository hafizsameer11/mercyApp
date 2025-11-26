import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import HomeHeader from '../../components/HomeHeader';
import HeroCarousel from '../../components/HeroCarousel';
import { StatusBar } from 'expo-status-bar';
import ServiceCategoryList from '../../components/ServiceList';
import LatestFeeds from '../../components/LatestFeeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../../config/api.config';
import useIsTablet from '../../hooks/useIsTablet';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Assuming you have a themed text component


const HomeScreen = () => {
  const isTablet = useIsTablet();
  const [userDetails, setUserDetails] = React.useState({})
  const [latestFeed, setLatestFeed] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState('Photo Editing');

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

  // Services list data
  const servicesList = [
    'Skin Smoothing',
    'Removal of scars',
    'Skin blemish removal, blurs',
    'Wrinkles, Pimples, Stretch marks, body hairs',
    'Skin tone adjustment, Whitening of teeth and eyes.....',
  ];

  // Tablet Layout (matching Figma) - Works in split view
  if (isTablet) {
    return (
      <ScrollView
        style={styles.tabletContainer}
        contentContainerStyle={styles.tabletContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <StatusBar style='light' />
        {/* Header Section */}
        <View style={styles.tabletHeaderSection}>
          <HomeHeader />

          {/* Hero Carousel Section - Inside header to extend full width */}
          <View style={styles.tabletHeroSection}>
            <HeroCarousel />
          </View>
        </View>

        {/* Service Categories Card */}
        <View style={styles.tabletServiceCard}>
          <ServiceCategoryList />
        </View>

        {/* Services List Section */}
        <View style={styles.tabletServicesListSection}>
          <ThemedText style={styles.tabletServicesTitle}>
            We offer the following photo editing services :
          </ThemedText>
          <View style={styles.tabletServicesList}>
            {servicesList.map((service, index) => (
              <View key={index} style={styles.tabletServiceItem}>
                <View style={styles.tabletBullet} />
                <ThemedText style={styles.tabletServiceText}>{service}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity style={styles.tabletProceedButton}>
          <ThemedText style={styles.tabletProceedText}>Proceed</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Mobile Layout (existing)
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
  },
  // Tablet Styles - Responsive, no fixed widths
  tabletContainer: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  tabletContent: {
    paddingBottom: 40,
    backgroundColor: '#fff', // Ensure white background
  },
  tabletHeaderSection: {
    backgroundColor: '#4a1227',
    height: 451, // Fixed height to match Figma
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 15, // Decreased from 20
    marginBottom: 0,
    overflow: 'visible', // Changed to visible to allow hero to extend beyond
    position: 'relative',
  },
  tabletHeroSection: {
    position: 'absolute',
    top: 122, // Position from top of header section (83px header + some spacing)
    left: -15, // Negative left to extend beyond header margin (compensate for marginHorizontal: 15)
    right: -15, // Negative right to extend beyond header margin - makes it full width
    height: 190, // Fixed height - only covers upper part
    paddingHorizontal: 0, // Remove any padding to make it full width
  },
  tabletServiceCard: {
    marginTop: -30, // Position after header section
    marginHorizontal: 15, // Decreased from 20
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletServicesListSection: {
    marginTop: 20,
    paddingHorizontal: 25, // Further reduced to prevent overflow
    backgroundColor: '#EEF6FA', // Light blue/off-white background
    paddingTop: 20,
    paddingBottom: 20,
    marginHorizontal: 15, // Decreased from 20
    borderRadius: 20,
  },
  tabletServicesTitle: {
    fontSize: 28, // Increased from 24
    color: '#000',
    marginTop: -10, // Negative margin to pull services text up
    marginBottom: 20, // Increased spacing
    fontWeight: '600',
  },
  tabletServicesList: {
    marginLeft: 23, // Space for bullet
    paddingRight: 15, // Increased right padding to prevent overflow
  },
  tabletServiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20, // Increased from 17
    paddingRight: 10, // Increased padding for text to prevent overflow
    flexShrink: 1, // Allow item to shrink
  },
  tabletBullet: {
    width: 16, // Increased from 14
    height: 16, // Increased from 14
    borderRadius: 8,
    backgroundColor: '#E31818',
    marginRight: 12, // Increased from 9
    marginTop: 4,
  },
  tabletServiceText: {
    fontSize: 20, // Increased from 18
    color: 'rgba(0,0,0,0.7)',
    flex: 1,
    lineHeight: 26,
    flexShrink: 1, // Allow text to shrink and wrap properly
  },
  tabletProceedButton: {
    backgroundColor: '#992C55',
    height: 50, // Increased from 45
    borderRadius: 100,
    width: 240, // Increased from 228
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Increased from 20
    marginBottom: 20,
  },
  tabletProceedText: {
    fontSize: 14, // Increased from 12
    color: '#fff',
    fontWeight: '600',
  },
});
