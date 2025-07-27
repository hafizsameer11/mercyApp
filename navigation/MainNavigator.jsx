// // MainNavigation.jsx
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// // Screens
// import HomeScreen from '../screens/MainScreens/HomeScreen';
// import OrdersScreen from '../screens/MainScreens/OrdersScreen';
// import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
// import FeedScreen from '../screens/MainScreens/FeedScreen';
// import ChatsScreen from '../screens/MainScreens/ChatsScreen';
// // import ProfileNavigator from './ProfileNavigator';



// const Tab = createBottomTabNavigator();

// const MainNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#992C55',
//         tabBarInactiveTintColor: '#999',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           height: 60,
//           paddingBottom: 10,
//         },
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           if (route.name === 'Home') iconName = 'home-outline';
//           else if (route.name === 'Feed') iconName = 'rss-outline';
//           else if (route.name === 'Chats') iconName = 'chatbubble-outline';
//           else if (route.name === 'Orders') iconName = 'albums-outline';
//           else if (route.name === 'Profile') iconName = 'person-outline';

//           return <Ionicons name={iconName} size={22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Feed" component={FeedScreen} />
//       <Tab.Screen name="Chats" component={ChatsScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />

//       {/* <Tab.Screen name="Profile" component={ProfileNavigator} /> */}


//     </Tab.Navigator>
//   );
// };

// export default MainNavigator;
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { View } from 'react-native';

// // Screens
// import HomeScreen from '../screens/MainScreens/HomeScreen';
// import OrdersScreen from '../screens/MainScreens/OrdersScreen';
// import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
// import FeedScreen from '../screens/MainScreens/FeedScreen';
// import ChatsScreen from '../screens/MainScreens/ChatsScreen';

// const Tab = createBottomTabNavigator();

// const MainNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#992C55',
//         tabBarInactiveTintColor: '#999',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           height: 70,
//           paddingBottom: 10,
//         },
//         tabBarIcon: ({ color, focused, size }) => {
//           let iconName;
//           let iconComponent = Ionicons;

//           // Customize icons and styles per route
//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Feed') {
//             iconComponent = MaterialCommunityIcons; // Use a more WiFi-style icon
//             iconName = focused ? 'wifi' : 'wifi-off'; // Tilted-style alternatives
//           } else if (route.name === 'Chats') {
//             iconName = focused ? 'chatbubble' : 'chatbubble-outline';
//             return (
//               <View
//                 style={{
//                   backgroundColor: focused ? '#992C55' : '#eee',
//                   borderRadius: 25,
//                   padding: 20,
//                 }}
//               >
//                 <Ionicons name={iconName} size={22} color={focused ? '#fff' : '#992C55'} />
//               </View>
//             );
//           } else if (route.name === 'Orders') {
//             iconName = focused ? 'image' : 'image-outline';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           const Icon = iconComponent;
//           return <Icon name={iconName} size={22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Feed" component={FeedScreen} />
//       <Tab.Screen name="Chats" component={ChatsScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default MainNavigator;

// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { View } from 'react-native';

// // Screens
// import HomeScreen from '../screens/MainScreens/HomeScreen';
// import OrdersScreen from '../screens/MainScreens/OrdersScreen';
// import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
// import FeedScreen from '../screens/MainScreens/FeedScreen';
// import ChatsScreen from '../screens/MainScreens/ChatsScreen';

// const Tab = createBottomTabNavigator();

// const MainNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#992C55',
//         tabBarInactiveTintColor: '#999',
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           height: 70,
//           paddingBottom: 10,
//         },
//         tabBarIcon: ({ color, focused }) => {
//           let iconName;
//           let iconComponent = Ionicons;

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Feed') {
//             iconComponent = MaterialCommunityIcons;
//             iconName = focused ? 'wifi' : 'wifi-off';
//           } else if (route.name === 'Chats') {
//             // Always render fixed icon with background
//             return (
//               <View
//                 style={{
//                   backgroundColor: '#992C55',
//                   borderRadius: 40,
//                   width: 48,
//                   height: 48,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginBottom: -18, // lift slightly to match other icons visually
//                 }}
//               >
//                 <Ionicons name="chatbubble-outline" size={24} color="#fff" />
//               </View>
//             );
//           } else if (route.name === 'Orders') {
//             iconName = focused ? 'image' : 'image-outline';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           const Icon = iconComponent;
//           return <Icon name={iconName} size={22} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Feed" component={FeedScreen} />
//       <Tab.Screen
//         name="Chats"
//         component={ChatsScreen}
//         options={{ tabBarLabel: () => null }} // Hide Chats label
//       />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default MainNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Image } from 'react-native';

// Screens
import HomeScreen from '../screens/MainScreens/HomeScreen';
import OrdersScreen from '../screens/OrderScreens/OrdersScreen';
import ProfileScreen from '../screens/MainScreens/ProfileScreens/ProfileScreen';
import FeedScreen from '../screens/MainScreens/FeedScreen';
import ChatsScreen from '../screens/MainScreens/ChatScreens/ChatsScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#992C55',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
        },
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
    // 🔁 Return your custom image icon here
    return (
      <View style={styles.iconContainer}>
        {focused && <View style={styles.activeIndicator} />}
        <Image
          source={require('../assets/Rss.png')} // replace with actual path
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
          marginBottom: -18,
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
}

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
    justifyContent: 'center',
    height: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 3,
    borderRadius:20,
    backgroundColor: '#992C55',
    // borderBottomLeftRadius: 2,
    // borderBottomRightRadius: 2,
  },
  iconWrapper: {
    marginTop: 5, // Adjust this to position the icon vertically
  },
  customIcon: {
  width: 25,
  height: 25,
  marginTop: 10, // Adjust this to position the icon vertically
  resizeMode: 'contain',
},

});

export default MainNavigator;
