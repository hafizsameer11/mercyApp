// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API from '../../../config/api.config.js';

// export const fetchQuestionnaire = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');

//     const response = await axios.get(API.GET_QUESTIONNAIRE, {
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data.data; // Extract the `data` array
//   } catch (error) {
//     console.error('Error fetching questionnaire:', error?.response?.data || error.message);
//     return [];
//   }
// };
