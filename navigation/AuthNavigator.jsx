import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/authscreens/SplashScreen';
import LoginScreen from '../screens/authscreens/LoginScreen';
import RegisterScreen from '../screens/authscreens/RegisterScreen';
import ForgotPasswordScreen from '../screens/authscreens/ForgotPasswordScreen';
import ForgotCodeScreen from '../screens/authscreens/ForgotCodeScreen';
import NewPasswordScreen from '../screens/authscreens/NewPasswordScreen';
import MainNavigator from './MainNavigator';
// import ProfileNavigator from './ProfileNavigator';
import HomeScreen from '../screens/MainScreens/HomeScreen';
import EditProfile from '../screens/MainScreens/ProfileScreens/EditProfile';
import ChangePassword from '../screens/MainScreens/ProfileScreens/ChangePassword';
import OrderDetailsScreen from '../screens/OrderScreens/OrderDetails';
import Chat from '../screens/MainScreens/ChatScreens/Chats';
import AgentQuestionnaire from '../screens/MainScreens/ChatScreens/AgentQuestionnaire';
import NewChatScreen from '../screens/MainScreens/ChatScreens/NewChatScreen';
import QuickRepliesScreen from '../screens/MainScreens/ProfileScreens/QuickRepliesScreen';
import FaqScreen from '../screens/MainScreens/ProfileScreens/FaqScreen';
import NotificationsScreen from '../screens/MainScreens/NotificationsScreen';
import AgentToAgentChatScreen from '../screens/MainScreens/ChatScreens/AgentToAgentChatScreen';
import FlutterwaveWebView from '../components/FlutterwaveWebView';



const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPass" component={ForgotPasswordScreen} />
      <Stack.Screen name="ForgotCode" component={ForgotCodeScreen} />
      <Stack.Screen name="NewPass" component={NewPasswordScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePass" component={ChangePassword} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="AgentQuestionnaire" component={AgentQuestionnaire} />
      <Stack.Screen name="NewChat" component={NewChatScreen} />
      <Stack.Screen name="QuickReply" component={QuickRepliesScreen} />
      <Stack.Screen name="FAQ" component={FaqScreen} />
      <Stack.Screen name="Notification" component={NotificationsScreen} />
      <Stack.Screen name="AgentToAgentChat" component={AgentToAgentChatScreen} />
      <Stack.Screen name="FlutterwaveWebView" component={FlutterwaveWebView} />






      <Stack.Screen name="Main" component={MainNavigator} />
      {/* <Stack.Screen name="Profile" component={ProfileNavigator} /> */}


    </Stack.Navigator>
  );
};

export default AuthNavigator;
