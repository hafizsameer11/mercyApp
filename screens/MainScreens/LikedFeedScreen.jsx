import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import API from '../../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LikedFeedScreen = () => {
    const [allFeeds, setAllFeeds] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Explicit overrides so UI updates instantly (id -> true/false)
    const [likeOverrides, setLikeOverrides] = useState({});

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.get(API.GET_FEEDS, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { feeds, feedCategories } = res.data.data || {};
                setAllFeeds(Array.isArray(feeds) ? feeds : []);

                // categories list (same design as Feed)
                const catNames = Array.isArray(feedCategories)
                    ? ['All', ...feedCategories.map(c => c.name)]
                    : ['All'];
                setCategories(catNames);
            } catch (e) {
                console.log('❌ Error fetching feeds:', e?.response?.data || e.message);
            }
        };

        fetchFeeds();
    }, []);

    // Helpers
    const baseLiked = (item) => Boolean(item?.is_liked ?? item?.liked ?? false);

    const likedNow = (item) =>
        Object.prototype.hasOwnProperty.call(likeOverrides, item.id)
            ? likeOverrides[item.id]
            : baseLiked(item);

    const displayLikes = (item) => {
        const base = item?.likes_count || 0;
        const now = likedNow(item);
        const was = baseLiked(item);
        if (now && !was) return base + 1;
        if (!now && was) return Math.max(0, base - 1);
        return base;
    };

    // Only liked feeds, then category filter
    const likedOnly = useMemo(() => {
        const liked = allFeeds.filter(likedNow);
        if (selectedCategory === 'All') return liked;
        return liked.filter((f) => f.category === selectedCategory);
    }, [allFeeds, likeOverrides, selectedCategory]);

    const toggleLike = async (item) => {
        const id = item.id;
        const prev = likedNow(item);
        const next = !prev;

        // Animate removal when unliking
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLikeOverrides((m) => ({ ...m, [id]: next }));

        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(API.TOGGLE_LIKE(id), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            // Revert if server call fails
            setLikeOverrides((m) => ({ ...m, [id]: prev }));
            console.log('❌ Error toggling like:', e?.response?.data || e.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Section (same design) */}
            <View style={styles.topSection}>
                <ThemedText fontFamily="monaque" weight="bold" style={styles.headerTitle}>
                    Liked Posts
                </ThemedText>

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

            {/* Cards */}
            <View style={styles.cardWrapper}>
                {likedOnly.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <ThemedText style={{ color: '#992C55' }}>
                            No liked posts yet.
                        </ThemedText>
                    </View>
                ) : (
                    <FlatList
                        data={likedOnly}
                        keyExtractor={(item) => String(item.id)}
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
                                        onPress={() => toggleLike(item)}
                                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                    >
                                        <Ionicons
                                            name={likedNow(item) ? 'heart' : 'heart-outline'}
                                            size={26}
                                            color="#992C55"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <ThemedText style={styles.likes}>
                                    {displayLikes(item)} likes
                                </ThemedText>
                            </View>
                        )}
                    />
                )}
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

export default LikedFeedScreen;
