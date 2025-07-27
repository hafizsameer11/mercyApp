import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText'; // Assuming you have a themed text component

const PaymentModal = ({ visible, onClose, onSend }) => {
    const [amount, setAmount] = useState('');
    const [photos, setPhotos] = useState('');
    const [editing, setEditing] = useState('');

    const handleSend = () => {
        const message = {
            id: Date.now().toString(),
            sender: 'agent',
            type: 'payment',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            name: 'Maleek',
            photos,
            category: editing,
            amount,
            status: 'Pending',
        };

        onSend(message);
        setAmount('');
        setPhotos('');
        setEditing('');
        onClose();
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
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <ThemedText style={styles.sendText}>Send</ThemedText>
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
       backgroundColor: '#00000090'
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
