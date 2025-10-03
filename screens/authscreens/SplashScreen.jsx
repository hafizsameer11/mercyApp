import React from 'react';
import { View ,StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import image from '../../assets/logo-m.png'; // Adjust the path as necessary
const { width } = Dimensions.get('window');

const SplashScreen = () => {
    
  const navigation = useNavigation(); // Using the hook
   useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500); 

    return () => clearTimeout(timer); 
  }, []);


  return (
    <>
    
    
       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : '#992C55'}}>
        <StatusBar style="light" />
           <View style={{  justifyContent: 'center', alignItems: 'center', backgroundColor : '#992C55'}}>
            <Image style={styles.logo} source={image} />
           </View>

           {/* <TouchableOpacity style={{ backgroundColor: '#661E3B', paddingHorizontal:40, paddingVertical:10, borderRadius: 15, marginTop: 10, }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight:'bold'}} onPress={() => navigation.navigate('Login')}>
              Let's Get Started
            </Text>
           </TouchableOpacity> */}
       </SafeAreaView>



       </>
  );
};
const styles = StyleSheet.create({
  logo: {
    width: width * 0.8,   // 80% of screen width
    height: undefined,    // let aspect ratio decide height
    aspectRatio: 3 / 2,   // or your logo’s real ratio
    alignSelf: 'center',
    resizeMode: 'contain', // ✅ no crop
  }
});

export default SplashScreen;
