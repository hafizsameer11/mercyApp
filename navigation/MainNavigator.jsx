import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. Import the hook

// Screens
import HomeScreen from '../screens/MainScreens/HomeScreen';
import OrdersScreen from '../screens/OrderScreens/OrdersScreen';
import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
import FeedScreen from '../screens/MainScreens/FeedScreen';
import ChatsScreen from '../screens/MainScreens/ChatScreens/ChatsScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets(); // 2. Get safe area insets

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#992C55',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        // 3. Update tabBarStyle to use the bottom inset
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          // Set a base height and add the inset
          height: 65 + insets.bottom,
          // Add padding to the bottom to push content up
          paddingBottom: insets.bottom,
        },
        // 4. Simplify tabBarLabelStyle
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          let iconComponent = Ionicons;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Feed') {
            return (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Image
                  source={require('../assets/Rss.png')}
                  style={[
                    styles.customIcon,
                    { tintColor: focused ? '#992C55' : '#000' },
                  ]}
                />
              </View>
            );
          } else if (route.name === 'Chats') {
            return (
              <View
                style={{
                  backgroundColor: '#992C55',
                  borderRadius: 40,
                  width: 48,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Adjust positioning to look good with the new dynamic height
                  // transform: [{ translateY: -15 }],
                  marginBottom:-10
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
              </View>
            );
          } else if (route.name === 'Orders') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              {iconComponent && (
                <View style={styles.iconWrapper}>
                  {React.createElement(iconComponent, {
                    name: iconName,
                    size: 24,
                    color: color,
                  })}
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ tabBarLabel: () => null }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to the top
    paddingTop: 8, // Add some top padding
    height: '100%',
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 30, // Give it a specific width
    height: 3,
    borderRadius: 20,
    backgroundColor: '#992C55',
  },
  iconWrapper: {
    // No extra margin needed now
  },
  customIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default MainNavigator;