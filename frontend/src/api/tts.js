import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tts';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const convertTextToSpeech = async (text, voiceId, token) => {
  const response = await axios.post(
    `${API_URL}/convert`,
    { text, voiceId },
    getAuthHeader(token)
  );
  return response.data;
};

export const getConversionHistory = async (token) => {
  const response = await axios.get(`${API_URL}/history`, getAuthHeader(token));
  return response.data;
};