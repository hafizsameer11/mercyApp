// services/questionnaireService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api.config';

/**
 * Fetch all questionnaires from backend
 * @returns {Promise<Array>} Array of questionnaire categories with questions
 */
export const fetchQuestionnaires = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await axios.get(API.GET_ALL_QUESTIONNAIRES, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    console.log('✅ Questionnaires fetched:', response.data);

    // Handle both response formats
    if (response.data.status === 'success' || response.data.success) {
      return response.data.data || response.data.questionnaires || [];
    }

    // If data is directly in response.data
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('❌ Error fetching questionnaires:', error.message);
    
    // Return empty array on error so app doesn't crash
    // You can also return the hardcoded fallback data here
    return [];
  }
};

/**
 * Get questionnaire progress for a specific chat
 * @param {number} chatId - The chat ID
 * @returns {Promise<Object>} Progress data
 */
export const getQuestionnaireProgress = async (chatId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await axios.get(API.QUESTIONNAIRE_PROGRESS(chatId), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching progress:', error.message);
    return { progress: 0, completed_sections: 0, answers: {} };
  }
};

/**
 * Save questionnaire answers
 * @param {number} chatId - The chat ID
 * @param {number} userId - The user ID
 * @param {Object} answers - The answers object
 * @returns {Promise<Object>} Response data
 */
export const saveQuestionnaireAnswers = async (chatId, userId, answers) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await axios.post(
      API.SAVE_QUESTIONNAIRE_ANSWER,
      { chat_id: chatId, user_id: userId, answers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('✅ Answers saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error saving answers:', error.message);
    return { status: 'error', message: error.message };
  }
};

