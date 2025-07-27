import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../components/ThemedText'; // adjust the path if needed

const notificationsData = [
    {
        id: '1',
        title: 'New Notification',
        description:
            'Get the best photo editing services from us. We offer great services with the best prices, give us a trial today',
        time: '08:22 AM',
        avatar: require('../../assets/Rectangle 55.png'),
        unread: true,
    },
    {
        id: '2',
        title: 'New Notification',
        description:
            'Get the best photo editing services from us. We offer great services with the best prices, give us a trial today',
        time: '08:22 AM',
        avatar: null,
        unread: false,
    },
    {
        id: '3',
        title: 'New Notification',
        description:
            'Get the best photo editing services from us. We offer great services with the best prices, give us a trial today',
        time: '08:22 AM',
        avatar: require('../../assets/Rectangle 55.png'),
        unread: true,
    },
];

const NotificationsScreen = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <ThemedText style={styles.title}>{item.title}</ThemedText>
                        {item.unread && <View style={styles.redDot} />}
                    </View>
                    <ThemedText style={styles.description}>{item.description}</ThemedText>
                    <ThemedText style={styles.time}>{item.time}</ThemedText>
                </View>
                {item.avatar && (
                    <Image source={item.avatar} style={styles.avatar} />
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style='dark' />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
            </View>

            {/* Notification List */}
            <FlatList
                data={notificationsData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20 }}
            />
        </View>
    );
};
export default NotificationsScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F7',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 105,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    redDot: {
        width: 8,
        height: 8,
        backgroundColor: 'red',
        borderRadius: 4,
    },
    description: {
        fontSize: 13,
        color: '#555',
        marginVertical: 8,
    },
    time: {
        fontSize: 12,
        color: '#aaa',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginLeft: 12,
    },
});

