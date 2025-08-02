import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThemedText from './ThemedText';


// Dummy feed data — replace with real dynamic data or API
const feeds = [
    {
        id: '1',
        image: require('../assets/Frame 38.png'), // Combined before/after image
        title: 'Skin Smoothing',
        likes: 200,
    },
    // Add more feeds if needed
];

const LatestFeeds = ({ feeds, style }) => {
    const [likedFeeds, setLikedFeeds] = useState({}); // Track liked state

    const toggleLike = (id) => {
        setLikedFeeds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                {/* <Text weight="bold" style={styles.title}>Latest Feeds</Text> */}
                <ThemedText weight='bold' style={styles.title}>Latest Feeds</ThemedText>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                <ThemedText style={styles.subText}>View the latest photo edits, manipulations and retouches</ThemedText>
                <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
                    <ThemedText style={styles.viewAll}>View All</ThemedText>
                </TouchableOpacity>

            </View>

            {/* Feed List */}
            <FlatList
                data={feeds}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.featured_image }} // ← dynamic image
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
    );
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.9;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginTop: -58,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        paddingLeft: 15,
    },
    title: {
        // fontWeight: 'bold',
        fontSize: 16,
        color: '#1a1a1a',

    },
    viewAll: {
        color: '#a30059',
        fontWeight: '400',
        marginRight: 10,
        fontSize: 14,

    },
    subText: {
        color: '#666',
        fontSize: 10,
        marginTop: 4,
        paddingLeft: 15,
        // marginBottom: 12,
    },
    card: {
        backgroundColor: '#FFE2ED',
        // padding: 12,
        borderRadius: 12,
        // marginRight: -16,
        marginLeft: 10,
        marginTop: 10,
        width: cardWidth,
        shadowColor: '#000',
        minHeight: 270,
        shadowOpacity: 0.08,
        height: 290,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    feedImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: 10,
        paddingLeft: 12,
    },
    feedTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    likeBtn: {
        backgroundColor: '#fff',
        // padding: 10,
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
    },
});

export default LatestFeeds;
