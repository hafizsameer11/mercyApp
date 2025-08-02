import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, saveFcmTokenToServer } from './notificationService';
// import { registerForPushNotificationsAsync, saveFcmTokenToServer } from '@/utils/notificationService';
// import { useRouter } from 'expo-router';

export default function NotificationManager() {
    const notificationListener = useRef(null);
    const responseListener = useRef(null);
    const appState = useRef(AppState.currentState);
    // const router = useRouter();

    const setupNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.id;

            if (!token || !userId) return;

            Notifications.setNotificationHandler({
                handleNotification: async (notification) => {
                    const notifUserId = notification?.request?.content?.data?.userId;
                    if (parseInt(notifUserId) == userId) {
                        return {
                            shouldShowAlert: true,
                            shouldPlaySound: true,
                            shouldSetBadge: true,
                        };
                    }
                    return {
                        shouldShowAlert: false,
                        shouldPlaySound: false,
                        shouldSetBadge: false,
                    };
                },
            });

            const fcmToken = await registerForPushNotificationsAsync();
            if (fcmToken) {
                await saveFcmTokenToServer(fcmToken, token);
                console.log('✅ FCM token saved for user:', userId);
            }

            // Remove old listeners
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }

            // Foreground listener
            notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
                const data = notification.request.content.data || {};
                const notifUserId = data.userId;
                console.log('📥 Notification received (foreground):', data);

                
            });

            // Background / tapped listener
            responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
                const data = response.notification.request.content.data || {};
                const notifUserId = data.userId;
                console.log('📥 Notification tap response received:', data);

               
            });

        } catch (error) {
            console.error('Error in NotificationManager:', error);
        }
    };

    useEffect(() => {
        setupNotifications();

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return null;
}
