import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const slides = [
  {
    id: '1',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
 background: require('../assets/Group 13.png'),  },
  {
    id: '2',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
 background: require('../assets/Group 13.png'),  },
  {
    id: '3',
    banner: require('../assets/Frame 30 (1).png'), // full banner image
    background: require('../assets/Group 13.png'),
  },
];

const HeroCarousel = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
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
});
