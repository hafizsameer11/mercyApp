import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationManager from './utils/NotificationManager';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import NotificationManager from './utils/NotificationManager';
// import NotificationManager from './components/NotificationManager'; // Adjust path if needed

export default function App() {
  const [fontsLoaded] = useFonts({
    // Apercu Pro
    'ApercuPro-Regular': require('./assets/fonts/apercu_regular_pro.otf'),
    'ApercuPro-Bold': require('./assets/fonts/apercu_bold_pro.otf'),
    'ApercuPro-BoldItalic': require('./assets/fonts/apercu_bold_italic_pro.otf'),
    'ApercuPro-Medium': require('./assets/fonts/apercu_medium_pro.otf'),
    'ApercuPro-MediumItalic': require('./assets/fonts/apercu_medium_italic_pro.otf'),
    'ApercuPro-Italic': require('./assets/fonts/apercu_regular_italic_pro.otf'),

    // Monaque
    'Monaque-Regular': require('./assets/fonts/Monarque-Regular.ttf'),
    'Monaque-Bold': require('./assets/fonts/Monarque-Bold.ttf'),
    'Monaque-BoldItalic': require('./assets/fonts/Monarque-BoldItalic.ttf'),
    'Monaque-Italic': require('./assets/fonts/Monarque-Italic.ttf'),
    'Monaque-Light': require('./assets/fonts/Monarque-Light.ttf'),
    'Monaque-LightItalic': require('./assets/fonts/Monarque-LightItalic.ttf'),
    'Monaque-SemiBold': require('./assets/fonts/Monarque-SemiBold.ttf'),
    'Monaque-SemiBoldItalic': require('./assets/fonts/Monarque-SemiBoldItalic.ttf'),
    'Monaque-Thin': require('./assets/fonts/Monarque-Thin.ttf'),
    'Monaque-ThinItalic': require('./assets/fonts/Monarque-ThinItalic.ttf'),
  });

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to load token/user:', e);
      }
      setIsAppReady(true);
    };
    loadUserData();
  }, []);

  if (!fontsLoaded || !isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#992C55" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>

      <NavigationContainer>
        <AuthNavigator />
        {token && user && <NotificationManager token={token} user={user} />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
