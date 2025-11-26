import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useIsTablet from '../hooks/useIsTablet';
import TabletSidebar from '../components/TabletSidebar';

// Screens
import HomeScreen from '../screens/MainScreens/HomeScreen';
import OrdersScreen from '../screens/OrderScreens/OrdersScreen';
import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
import FeedScreen from '../screens/MainScreens/FeedScreen';
import ChatsScreen from '../screens/MainScreens/ChatScreens/ChatsScreen';
import ChatSplitView from '../components/ChatSplitView';
import OrderSplitView from '../components/OrderSplitView';
import ProfileSplitView from '../components/ProfileSplitView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const isTablet = useIsTablet();
  const [activeRoute, setActiveRoute] = useState('Home');

  // Tablet Layout: Sidebar + Split View (Home + Feed) - Always show split view on tablet
  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        {/* Sidebar */}
        <TabletSidebar 
          activeRoute={activeRoute} 
          onNavigate={(route) => setActiveRoute(route)}
        />
        
        {/* Content Area */}
        <View style={styles.tabletContentArea}>
          {/* Left Panel - Home (always show when Home is active) */}
          {activeRoute === 'Home' && (
            <>
              <View style={styles.tabletLeftPanel}>
                <HomeScreen />
              </View>
              
              {/* Right Panel - Feed (always show when Home is active) */}
              <View style={styles.tabletRightPanel}>
                <FeedScreen />
              </View>
            </>
          )}
          
          {/* Split View for Chats */}
          {activeRoute === 'Chats' && (
            <View style={styles.tabletFullPanel}>
              <ChatSplitView />
            </View>
          )}

          {/* Split View for Orders */}
          {activeRoute === 'Orders' && (
            <View style={styles.tabletFullPanel}>
              <OrderSplitView />
            </View>
          )}

          {/* Split View for Profile */}
          {activeRoute === 'Profile' && (
            <View style={styles.tabletFullPanel}>
              <ProfileSplitView />
            </View>
          )}
          
          {/* Full Screen for other routes */}
          {activeRoute !== 'Home' && activeRoute !== 'Chats' && activeRoute !== 'Orders' && activeRoute !== 'Profile' && (
            <View style={styles.tabletFullPanel}>
              {activeRoute === 'Feed' && <FeedScreen />}
            </View>
          )}
        </View>
      </View>
    );
  }

  // Mobile Layout - Bottom Tabs
  const safeAreaBottom = Math.max(insets.bottom, 8);
  const tabBarHeight = 65 + safeAreaBottom;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
    tabBarActiveTintColor: '#992C55',
    tabBarInactiveTintColor: '#999',
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,        
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: tabBarHeight,
      paddingBottom: safeAreaBottom,
      paddingTop: 6,
      position: 'absolute',
      elevation: 0,
      shadowOpacity: 0,
      borderTopWidth: 0,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 0,
      paddingBottom: 0,
    },
    tabBarItemStyle: {
      paddingVertical: 4,
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
                  marginTop: -8,
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
  // Tablet Styles
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F7', // Light gray background like Figma
    padding: 20,
  },
  tabletContentArea: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
  },
  tabletLeftPanel: {
    flex: 1,
    minWidth: 400, // Minimum width for Home panel
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 20, // Gap between panels
  },
  tabletRightPanel: {
    flex: 1,
    minWidth: 300, // Minimum width for Feed panel
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tabletFullPanel: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  
  // Mobile Styles
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingTop: 4,
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