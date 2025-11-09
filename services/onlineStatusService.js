import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/api.config';

// Get auth token from storage
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Create axios instance with auth
const createAuthAxios = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Check if a single user is online
 * @param {number} userId - User ID to check
 * @returns {Promise<Object>} User status data
 */
export const checkUserOnlineStatus = async (userId) => {
  try {
    console.log("👤 API Service: Checking online status for userId:", userId)
    const axiosInstance = await createAuthAxios();
    const url = `/user/${userId}/online-status`;
    console.log("📡 API Service: Calling endpoint:", url);
    
    const response = await axiosInstance.get(url);
    console.log("✅ API Service: Response received:", response.data);
    
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ API Service: Error checking user status:', error?.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check multiple users' online status (bulk)
 * @param {Array<number>} userIds - Array of user IDs
 * @returns {Promise<Object>} Array of user statuses
 */
export const checkMultipleUsersStatus = async (userIds) => {
  try {
    const axiosInstance = await createAuthAxios();
    const response = await axiosInstance.post('/users/online-status', {
      user_ids: userIds,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error checking multiple users status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send heartbeat to keep user online
 * @returns {Promise<Object>} Heartbeat response
 */
export const sendHeartbeat = async () => {
  try {
    console.log('💓 Heartbeat API call starting...');
    const axiosInstance = await createAuthAxios();
    const response = await axiosInstance.post('/heartbeat');
    console.log('💓 Heartbeat API response:', response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Error sending heartbeat:', error?.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  checkUserOnlineStatus,
  checkMultipleUsersStatus,
  sendHeartbeat,
};

