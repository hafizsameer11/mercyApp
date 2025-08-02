import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';

const API_URL = 'https://editbymercy.hmstech.xyz/api/set-fcm-token';

export const registerForPushNotificationsAsync = async () => {
    try {
        if (!Device.isDevice) {
            alert('Push notifications are only supported on physical devices.');
            console.warn('Device check failed: Not a physical device.');
            return null;
        }

        // Step 2: Get current notification permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('Existing Notification Permission Status:', existingStatus);

        let finalStatus = existingStatus;

        // Step 3: Request permissions if not granted
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log('Updated Notification Permission Status:', finalStatus);
        }

        // Step 4: Handle denied permissions
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notifications. Permissions not granted.');
            console.error('Notification permissions not granted.');
            return null;
        }

        // Step 5: Get the FCM push token using getDevicePushTokenAsync
        const tokenData = await Notifications.getDevicePushTokenAsync();
        const fcmToken = tokenData.data;
        console.log('FCM Push Token Retrieved:', fcmToken);

        return fcmToken;
    } catch (error) {
        console.error('Error while registering for push notifications:', error);
        return null;
    }
};

/**
 * Function to send the FCM token to the backend
 */
export const saveFcmTokenToServer = async (fcmToken, authToken) => {
    try {
        const response = await axios.post(
            API_URL,
            { fcmToken },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        console.log('FCM token saved successfully:', response.data.message);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Failed to save FCM token:', error.response.data);
        } else {
            console.error('Error saving FCM token:', error.message);
        }
    }
};
