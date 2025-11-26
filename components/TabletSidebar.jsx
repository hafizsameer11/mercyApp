import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';

const TabletSidebar = ({ activeRoute, onNavigate }) => {
  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { name: 'Feed', icon: 'rss-outline', activeIcon: 'rss', label: 'Feed', customIcon: require('../assets/Rss.png') },
    { name: 'Chats', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Chat' },
    { name: 'Orders', icon: 'image-outline', activeIcon: 'image', label: 'Orders' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
  ];

  // Handle navigation to other screens
  const handleNavigate = (route) => {
    onNavigate(route);
    // If navigating to a different screen, hide the split view
  };

  return (
    <View style={styles.sidebar}>
      {menuItems.map((item, index) => {
        const isActive = activeRoute === item.name;
        const topOffset = 18 + index * 76; // 18px top + 76px per item (60px height + 16px gap)

        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.menuItem, { top: topOffset }]}
            onPress={() => handleNavigate(item.name)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              {/* Active Indicator */}
              {isActive && <View style={styles.activeIndicator} />}
              
              {/* Icon */}
              {item.customIcon ? (
                <Image
                  source={item.customIcon}
                  style={[
                    styles.customIcon,
                    { tintColor: isActive ? '#992C55' : 'rgba(0,0,0,0.7)' },
                  ]}
                />
              ) : (
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={24}
                  color={isActive ? '#992C55' : 'rgba(0,0,0,0.7)'}
                />
              )}
              
              {/* Label */}
              <Text style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 87,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    position: 'relative',
    height: '100%',
  },
  menuItem: {
    position: 'absolute',
    left: 5,
    width: 77,
    height: 60,
  },
  menuItemContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 4,
    borderRadius: 100,
    backgroundColor: '#992C55',
  },
  customIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  menuLabel: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
  },
  activeMenuLabel: {
    color: '#992C55',
  },
});

export default TabletSidebar;

