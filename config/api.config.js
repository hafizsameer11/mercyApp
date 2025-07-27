// api.config.js
const BASE_URL = 'https://editbymercy.hmstech.xyz/api';

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


};

export default API;
