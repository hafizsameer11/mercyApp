import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ThemedText from '../../../components/ThemedText';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://editbymercy.hmstech.xyz';
const DELETE_ACCOUNT_URL = `${API_BASE}/api/delete-account`;

const DeleteAccount = ({ isTabletSplitView = false }) => {
  const navigation = useNavigation();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    // Show confirmation alert first
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Second confirmation
            Alert.alert(
              'Final Confirmation',
              'This is your last chance. Are you absolutely sure you want to delete your account?',
              [
                {
                  text: 'No, Keep My Account',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setDeleting(true);
                      const token = await AsyncStorage.getItem('token');
                      
                      if (!token) {
                        Alert.alert('Error', 'Not authenticated. Please log in again.');
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        return;
                      }

                      const response = await axios.delete(
                        DELETE_ACCOUNT_URL,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                          },
                        }
                      );

                      if (response.data?.status === 'success' || response.status === 200) {
                        // Clear all local data
                        await AsyncStorage.multiRemove(['user', 'token']);
                        
                        Alert.alert(
                          'Account Deleted',
                          'Your account has been successfully deleted.',
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                              },
                            },
                          ]
                        );
                      } else {
                        throw new Error(response.data?.message || 'Failed to delete account');
                      }
                    } catch (error) {
                      console.error('Delete account error:', error?.response?.data || error?.message);
                      
                      // Handle 401/403 - user might already be logged out
                      if (error?.response?.status === 401 || error?.response?.status === 403) {
                        Alert.alert(
                          'Session Expired',
                          'Your session has expired. Please log in again.',
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                              },
                            },
                          ]
                        );
                        return;
                      }

                      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete account. Please try again.';
                      Alert.alert('Error', errorMessage);
                    } finally {
                      setDeleting(false);
                    }
                  },
                },
              ],
              { cancelable: true }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, isTabletSplitView && styles.tabletHeader]}>
        {!isTabletSplitView && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        )}
        <ThemedText style={[styles.title, isTabletSplitView && styles.tabletTitle]}>Delete Account</ThemedText>
      </View>

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={48} color="#ff4444" />
        </View>
        <ThemedText style={[styles.warningTitle, isTabletSplitView && styles.tabletWarningTitle]}>
          Warning: This action cannot be undone
        </ThemedText>
        <ThemedText style={[styles.warningText, isTabletSplitView && styles.tabletWarningText]}>
          Deleting your account will permanently remove:
        </ThemedText>
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color="#ff4444" />
            <ThemedText style={[styles.listText, isTabletSplitView && styles.tabletListText]}>
              All your personal information
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color="#ff4444" />
            <ThemedText style={[styles.listText, isTabletSplitView && styles.tabletListText]}>
              All your messages and chat history
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color="#ff4444" />
            <ThemedText style={[styles.listText, isTabletSplitView && styles.tabletListText]}>
              All your orders and transactions
            </ThemedText>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color="#ff4444" />
            <ThemedText style={[styles.listText, isTabletSplitView && styles.tabletListText]}>
              All your saved preferences
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={[styles.deleteBtn, isTabletSplitView && styles.tabletDeleteBtn, deleting && { opacity: 0.7 }]}
        onPress={handleDeleteAccount}
        disabled={deleting}
      >
        {deleting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <ThemedText style={[styles.deleteText, isTabletSplitView && styles.tabletDeleteText]}>
              Delete My Account
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.cancelBtn, isTabletSplitView && styles.tabletCancelBtn]}
        onPress={() => navigation.goBack()}
        disabled={deleting}
      >
        <ThemedText style={[styles.cancelText, isTabletSplitView && styles.tabletCancelText]}>
          Cancel
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  warningContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
  // Tablet-specific styles
  tabletHeader: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  tabletTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  tabletWarningTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  tabletWarningText: {
    fontSize: 16,
    marginBottom: 20,
  },
  tabletListText: {
    fontSize: 16,
  },
  tabletDeleteBtn: {
    paddingVertical: 16,
    marginTop: 40,
  },
  tabletDeleteText: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabletCancelBtn: {
    paddingVertical: 16,
    marginTop: 16,
  },
  tabletCancelText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

