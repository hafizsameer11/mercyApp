// utils/submitAnswers.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api.config';
// import API from '../config/api.config';

const submitAnswers = async (chat_id, user_id, answers) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const res = await axios.post(
      `${BASE_URL}/questionnaire/save-answer`,
      { chat_id, user_id, answers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    console.log('Response:', res.data);

    return res.data;
  } catch (err) {
    console.error('🚫 Error submitting answers:', err.message);
    return { status: 'error' };
  }
};

export default submitAnswers;
