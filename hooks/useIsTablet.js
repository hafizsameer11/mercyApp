import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import * as Device from 'expo-device';

/**
 * Custom hook to detect if the device is a tablet
 * Uses both screen dimensions and device type for accurate detection
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIsTablet = () => {
      const { width, height } = Dimensions.get('window');
      const screenWidth = Math.min(width, height);
      const screenHeight = Math.max(width, height);

      // Check device type if available (iOS/Android)
      if (Device.deviceType) {
        if (Device.deviceType === Device.DeviceType.TABLET) {
          setIsTablet(true);
          return;
        }
        if (Device.deviceType === Device.DeviceType.PHONE) {
          setIsTablet(false);
          return;
        }
      }

      // Fallback: Use screen dimensions
      // Tablets typically have:
      // - Minimum width of 600px (Android tablets)
      // - Minimum width of 768px (iPad)
      // - Aspect ratio considerations
      const minDimension = Math.min(screenWidth, screenHeight);
      const isTabletBySize = minDimension >= 600;

      setIsTablet(isTabletBySize);
    };

    checkIsTablet();

    // Listen for dimension changes (orientation changes)
    const subscription = Dimensions.addEventListener('change', checkIsTablet);

    return () => {
      subscription?.remove();
    };
  }, []);

  return isTablet;
};

export default useIsTablet;

