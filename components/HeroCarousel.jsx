import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useIsTablet from '../hooks/useIsTablet';
import ThemedText from './ThemedText';

const { width } = Dimensions.get('window');

// Figma image for tablet hero carousel
// TODO: Download the image from Figma (node-id: 1:29395, imgImage4) and add it to assets folder
// For now using existing image - replace with Figma image when available

const slides = [
  {
    id: '1',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
    background: require('../assets/Group 13.png'),
  },
  {
    id: '2',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
    background: require('../assets/Group 13.png'),
  },
  {
    id: '3',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
    background: require('../assets/Group 13.png'),
  },
];

const HeroCarousel = () => {
  const isTablet = useIsTablet();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        <View style={styles.tabletCard}>
          {/* Image only - contains all text already */}
          <Image 
            source={slides[currentIndex]?.banner || slides[0].banner} 
            style={styles.tabletBannerImage} 
            resizeMode="cover"
          />

          {/* Pagination */}
          {/* <View style={styles.tabletPagination}>
            <View style={styles.tabletPaginationBg}>
              <Text style={styles.tabletPaginationText}>
                {currentIndex + 1} / {slides.length}
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={styles.slideWrapper}>
            {/* Background shape image (at back) */}
            <Image source={item.background} style={styles.backgroundImage} />

            {/* Banner image (on top) */}
            <Image source={item.banner} style={styles.bannerImage} resizeMode="contain" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HeroCarousel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4a1227',
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    height: 290,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideWrapper: {
    // marginHorizontal: 10,
    marginTop:-100,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerImage: {
    width: width * 0.93,
    height: 250,
    zIndex: 2,
    borderRadius: 20,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 85,
    width: width * 0.85,
    height: 30,
    resizeMode: 'stretch',
    zIndex: 1,
    borderRadius: 20,
  },
  // Tablet Styles
  tabletContainer: {
    height: 190, // Fixed height - only covers upper part
    width: '90%',
    margin:'auto',
    paddingTop: 19, // 122 - 83 (header height)
    paddingHorizontal: 0, // No padding to make it full width
  },
  tabletCard: {
    backgroundColor: '#992c55',
    borderRadius: 0, // Remove border radius to make it full width
    height: 240, // Fixed height - only covers upper part
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabletBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Maintain original aspect ratio
  },
  tabletPagination: {
    position: 'absolute',
    top: 7,
    right: 7,
  },
  tabletPaginationBg: {
    backgroundColor: '#f1f1f1',
    height: 22,
    borderRadius: 100,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 46,
  },
  tabletPaginationText: {
    fontSize: 14,
    color: '#000',
  },
});
