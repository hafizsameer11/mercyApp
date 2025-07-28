import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API, { BASE_URL } from '../config/api.config';

const PaymentModal = ({ visible, onClose, onSend, chatId, userId }) => {
    const [amount, setAmount] = useState('');
    const [photos, setPhotos] = useState('');
    const [editing, setEditing] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!amount || !photos) {
            Alert.alert('Validation', 'Amount and Number of Photos are required.');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            const response = await axios.post(
                `${BASE_URL}/create-payment`,
                {
                    chat_id: chatId,
                    total_amount: amount,
                    no_of_photos: photos,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log('✅ Payment created:', response.data);

            // ✅ Assume success
            // const message = {
            //     id: Date.now().toString(),
            //     sender: 'agent',
            //     type: 'payment',
            //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            //     name: 'Agent', // or pass your name here
            //     photos,
            //     category: editing,
            //     amount,
            //     status: 'Pending',
            // };

            // onSend(message); // push to chat UI
            setAmount('');
            setPhotos('');
            setEditing('');
            onClose();
        } catch (error) {
            console.error('❌ Payment creation failed:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to create payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>Payment Details</ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder="Input Amount"
                        style={styles.input}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    <TextInput
                        placeholder="No of photos"
                        style={styles.input}
                        keyboardType="numeric"
                        value={photos}
                        onChangeText={setPhotos}
                    />
                    <TextInput
                        placeholder="Photo editing"
                        style={styles.input}
                        value={editing}
                        onChangeText={setEditing}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
                        <ThemedText style={styles.sendText}>{loading ? 'Sending...' : 'Send'}</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#00000090',
    },
    modal: {
        backgroundColor: '#F5F5F7',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
    },
    sendBtn: {
        backgroundColor: '#992c55',
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    sendText: { color: '#fff', fontWeight: '600' },
});
