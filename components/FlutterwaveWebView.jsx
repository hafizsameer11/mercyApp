// components/FlutterwaveWebView.js
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FlutterwaveWebView = ({ route, navigation }) => {
    const { amount, order_id, chat_id } = route.params;

    const handleWebViewMessage = async (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.event === 'success') {
                console.log('✅ Payment Success:', data.data);

                // Call Laravel API to update the payment
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`${BASE_URL}/update-payment`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chat_id }),
                });
                console.log("response of payment update", response)

                alert('Payment Successful!');
                navigation.goBack();
            } else if (data.event === 'failed') {
                alert('Payment Failed.');
                navigation.goBack();
            } else if (data.event === 'closed') {
                navigation.goBack();
            }

        } catch (err) {
            console.error('❌ Error parsing WebView message', err);
        }
    };

    // Flutterwave URL with query params
    const flutterwaveUrl = `https://hmstech.xyz/flutterwave-payment.html?amount=${amount}&order_id=${order_id}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: flutterwaveUrl }}
                onMessage={handleWebViewMessage}
                startInLoadingState
                renderLoading={() => <ActivityIndicator size="large" color="#992C55" />}
            />
        </View>
    );
};

export default FlutterwaveWebView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
