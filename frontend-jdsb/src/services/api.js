import axios from 'axios';

// API base URL - change this to match your backend URL
const API_BASE_URL = 'http://127.0.0.1:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const analyzeText = async (text, context = '') => {
  try {
    const response = await apiClient.post('/analyze', {
      text: text,
      context: context
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

export const analyzeUrl = async (url) => {
  try {
    const response = await apiClient.post('/analyze_url', {
      url: url
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
};

export const findSimilarClaims = async (text) => {
  try {
    const response = await apiClient.post('/similar_claims', {
      text: text
    });
    return response.data;
  } catch (error) {
    console.error('Error finding similar claims:', error);
    throw error;
  }
};

export const getToken = async (username, password) => {
  try {
    const response = await apiClient.post('/token', {
      username: username,
      password: password
    });
    // Store token in localStorage
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default {
  analyzeText,
  analyzeUrl,
  findSimilarClaims,
  getToken,
  checkHealth
};