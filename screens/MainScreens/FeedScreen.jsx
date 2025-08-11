 import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText'; // Adjust the path as necessary
import API from '../../config/api.config'; // adjust the path
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const categories = ['All', 'Editing', 'Manipulation', 'Retouching', 'Other', 'Testing'];

const FeedPage = () => {

  const [feeds, setFeeds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedFeeds, setLikedFeeds] = useState({});

  const toggleLike = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(API.TOGGLE_LIKE(id), {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setLikedFeeds((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.log('❌ Error toggling like:', error?.response?.data || error.message);
    }
  };


  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(API.GET_FEEDS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { feeds, feedCategories } = response.data.data;
        console.log("feeds",feeds)
        setFeeds(feeds);
        setCategories(['All', ...feedCategories.map(cat => cat.name)]); 
      } catch (error) {
        console.log('❌ Error fetching feeds:', error?.response?.data || error.message);
      }
    };

    fetchFeeds();
  }, []);



  const filteredFeeds =
    selectedCategory === 'All'
      ? feeds
      : feeds.filter((item) => item.category === selectedCategory);


  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <ThemedText fontFamily='monaque' weight='bold' style={styles.headerTitle}>Feed</ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.activeCategoryButton,
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cards Container */}
      <View style={styles.cardWrapper}>
        <FlatList
          data={filteredFeeds}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* <Image source={item.image} style={styles.feedImage} resizeMode="cover" /> */}
              <Image
                source={{ uri: item.featured_image }}
                style={styles.feedImage}
                resizeMode="cover"
              />

              <View style={styles.footerRow}>
                <ThemedText style={styles.feedTitle}>{item.caption}</ThemedText>
                <TouchableOpacity
                  style={styles.likeBtn}
                  onPress={() => toggleLike(item.id)}
                >
                  <Ionicons
                    name={likedFeeds[item.id] ? 'heart' : 'heart-outline'}
                    size={26}
                    color="#992C55"
                  />
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.likes}>
                {item.likes_count + (likedFeeds[item.id] ? 1 : 0)} likes
              </ThemedText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.92;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Top Section with Header and Category Buttons
  topSection: {
    backgroundColor: '#992C55',
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#BA3B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#000',
  },

  // Feed card wrapper with elevation and white background
  cardWrapper: {
    flex: 1,
    position: 'absolute',
    top: 190, // overlaps the maroon top
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 2,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  card: {
    backgroundColor: '#FFE2ED',
    borderRadius: 15,
    marginBottom: 16,
    width: cardWidth,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    minHeight: 270,
  },
  feedImage: {
    width: '100%',
    height: 220,
    borderRadius: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    // paddingBottom:10,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  likeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 20,
    marginTop: 10,
    borderRadius: 40,
  },
  likes: {
    fontSize: 12,
    color: '#992C55',
    marginTop: -14,
    paddingLeft: 12,
    paddingBottom: 10,
  },
});

export default FeedPage;
