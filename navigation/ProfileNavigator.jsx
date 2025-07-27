// ProfileNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../screens/MainScreens/ProfileScreens/EditProfile';
// import ChangePassword from '../screens/MainScreens/ProfileScreens/ChangePassword';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EditProfile" component={EditProfile} />
      {/* <Stack.Screen name="ChangePassword" component={ChangePassword} /> */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
