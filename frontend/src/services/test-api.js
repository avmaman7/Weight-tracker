import axios from 'axios';

// Set your backend URL here
// Use environment variable in production, fallback for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const TEST_API_URL = API_URL.replace('/api', '');

// Create axios instance
const api = axios.create({
  baseURL: TEST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't use credentials for test API
  withCredentials: false
});

// Test endpoints that don't require authentication
export const getCurrentUser = () => api.get('/api/test/user');
export const getClients = () => api.get('/api/test/clients');
export const addClient = (clientData) => api.post('/api/test/clients', clientData);

export default api;
