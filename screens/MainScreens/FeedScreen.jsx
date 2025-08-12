// FeedPage.js (React Native + TanStack Query, optimistic like)
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import API from '../../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.92;

const FeedPage = () => {
  const queryClient = useQueryClient();

  // UI filter state
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ---- Query: Feeds + Categories ----
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['feeds'],
    queryFn: async ({ signal }) => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(API.GET_FEEDS, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      // Expecting { data: { feeds: [...], feedCategories: [...] } }
      const payload = res?.data?.data || { feeds: [], feedCategories: [] };
      // Normalize items a bit (fallbacks)
      const feeds = (payload.feeds || []).map((f) => ({
        ...f,
        id: String(f.id),
        likes_count: Number(f.likes_count ?? 0),
        is_liked: Boolean(f.is_liked ?? false),
        category: f.category || 'Other',
        featured_image: f.featured_image || '',
        caption: f.caption || '',
      }));
      const feedCategories = (payload.feedCategories || []).map((c) => c.name);
      return { feeds, feedCategories };
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    placeholderData: (prev) => prev ?? { feeds: [], feedCategories: [] },
  });

  const feeds = data?.feeds ?? [];
  const categories = useMemo(
    () => ['All', ...(data?.feedCategories ?? [])],
    [data?.feedCategories]
  );

  // ---- Mutation: Toggle Like (Optimistic) ----
  const toggleLikeMutation = useMutation({
    mutationFn: async (id) => {
      const token = await AsyncStorage.getItem('token');
      return axios.post(
        API.TOGGLE_LIKE(id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches so we don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['feeds'] });

      // Snapshot previous value
      const prev = queryClient.getQueryData(['feeds']);

      // Optimistically update the cache
      queryClient.setQueryData(['feeds'], (old) => {
        if (!old) return old;
        const nextFeeds = old.feeds.map((item) => {
          if (item.id !== String(id)) return item;
          const willLike = !item.is_liked;
          return {
            ...item,
            is_liked: willLike,
            likes_count: item.likes_count + (willLike ? 1 : -1),
          };
        });
        return { ...old, feeds: nextFeeds };
      });

      // Return context for rollback
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      // Rollback on failure
      if (ctx?.prev) queryClient.setQueryData(['feeds'], ctx.prev);
    },
    onSettled: () => {
      // Ensure we’re in sync with server
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });

  const toggleLike = (id) => {
    // fire & forget (instant UI via optimistic cache)
    toggleLikeMutation.mutate(id);
  };

  // ---- Derived filtered list ----
  const filteredFeeds =
    selectedCategory === 'All'
      ? feeds
      : feeds.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#992C55" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ThemedText fontFamily="monaque" weight="bold" style={styles.headerTitle}>
            Feed
          </ThemedText>
          {isFetching ? <ActivityIndicator size="small" color="#fff" /> : null}
        </View>

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
                  disabled={toggleLikeMutation.isPending} // prevent multi-tap spam
                >
                  <Ionicons
                    name={item.is_liked ? 'heart' : 'heart-outline'}
                    size={26}
                    color="#992C55"
                  />
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.likes}>
                {item.likes_count} likes
              </ThemedText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topSection: {
    backgroundColor: '#992C55',
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  headerTitle: { fontSize: 26, fontWeight: '600', color: '#fff', marginBottom: 16 },
  categoryContainer: { flexDirection: 'row', alignItems: 'center' },
  categoryButton: {
    backgroundColor: '#BA3B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: { backgroundColor: '#fff' },
  categoryText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  activeCategoryText: { color: '#000' },

  cardWrapper: {
    flex: 1,
    position: 'absolute',
    top: 190,
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
  feedImage: { width: '100%', height: 220, borderRadius: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 12 },
  feedTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  likeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 20,
    marginTop: 10,
    borderRadius: 40,
  },
  likes: { fontSize: 12, color: '#992C55', marginTop: -14, paddingLeft: 12, paddingBottom: 10 },
});

export default FeedPage;
