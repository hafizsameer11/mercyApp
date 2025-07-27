// import { NavigationContainer } from '@react-navigation/native';
// import AuthNavigator from './navigation/AuthNavigator';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <AuthNavigator />
//     </NavigationContainer>
//   );
// }
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

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
    // 'Monaque-Medium': require('./assets/fonts/Monarque-Medium.ttf'),
    // 'Monaque-MediumItalic': require('./assets/fonts/Monarque-MediumItalic.ttf'),
    'Monaque-SemiBold': require('./assets/fonts/Monarque-SemiBold.ttf'),
    'Monaque-SemiBoldItalic': require('./assets/fonts/Monarque-SemiBoldItalic.ttf'),
    'Monaque-Thin': require('./assets/fonts/Monarque-Thin.ttf'),
    'Monaque-ThinItalic': require('./assets/fonts/Monarque-ThinItalic.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#992C55" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
