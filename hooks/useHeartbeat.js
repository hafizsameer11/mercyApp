import { useEffect } from 'react';
import { AppState } from 'react-native';
import { sendHeartbeat } from '../services/onlineStatusService';

/**
 * Hook to send periodic heartbeat to keep user online
 * @param {boolean} enabled - Whether heartbeat is enabled
 * @param {number} interval - Heartbeat interval in ms (default: 120000 = 2 minutes)
 */
const useHeartbeat = (enabled = true, interval = 120000) => {
  useEffect(() => {
    if (!enabled) return;

    let heartbeatInterval;

    const startHeartbeat = () => {
      // Send initial heartbeat
      console.log('💓 Sending initial heartbeat...');
      sendHeartbeat();

      // Set up interval
      heartbeatInterval = setInterval(() => {
        console.log('💓 Sending periodic heartbeat...');
        sendHeartbeat();
      }, interval);
    };

    const stopHeartbeat = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };

    // Listen to app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        startHeartbeat();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        stopHeartbeat();
      }
    });

    // Start immediately if app is active
    if (AppState.currentState === 'active') {
      startHeartbeat();
    }

    return () => {
      stopHeartbeat();
      subscription.remove();
    };
  }, [enabled, interval]);
};

export default useHeartbeat;

