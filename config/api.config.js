// api.config.js
export const BASE_URL = 'https://editbymercy.hmstech.xyz/api';

const API = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forget-password`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-code`,
  RESET_PASSWORD: `${BASE_URL}/auth/change-password`,
  ASSIGN_AGENT: `${BASE_URL}/assign-agent`,
  GET_FEEDS: `${BASE_URL}/feeds`,
  TOGGLE_LIKE: (feedId) => `${BASE_URL}/feeds/${feedId}/toggle-like`,
  ADDQUCK_REPLY: `${BASE_URL}/quick-replies`,
  GET_ALL_QUICK_REPLIES: `${BASE_URL}/quick-replies`,
  UPDATE_QUICK_REPLY: (replyId) => `${BASE_URL}/quick-replies/${replyId}`,
  DELETE_QUICK_REPLY: (replyId) => `${BASE_URL}/quick-replies/${replyId}`,
  SEND_MESSAGE: `${BASE_URL}/send-message`,
  GET_CHAT_MESSAGES: (chatId) => `${BASE_URL}/chat/${chatId}`,
  GET_ALL_CHATS: `${BASE_URL}/chats`,
  GET_QUESTIONNAIRE: `${BASE_URL}/admin/questionnaire`,
  ASSIGN_QUESTIONNAIRE: `${BASE_URL}/questionnaire/assign`,
  DELETE_MESSAGE: (messageId) => `${BASE_URL}/delete-message/${messageId}`,
  EDIT_MESSAGE: (messageId) => `${BASE_URL}/edit-message/${messageId}`,
  DOWNLOADED: (messageId) => `${BASE_URL}/downloaded/${messageId}`,
  DELETE_CHAT: (chatId) => `${BASE_URL}/delete-chat/${chatId}`,
  SOCIAL_AUTH: (provider) => `${BASE_URL}/auth/social/${provider}`,




};

export default API;
