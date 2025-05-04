import axios from 'axios';

// Set your backend URL here
// Use environment variable in production, fallback for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client endpoints
export const getClients = () => api.get('/clients');
export const getClient = (clientId) => api.get(`/clients/${clientId}`);
export const addClient = (clientData) => api.post('/clients', clientData);
export const deleteClient = (clientId) => api.delete(`/clients/${clientId}`);

// Weight entry endpoints
export const getWeightEntries = (clientId) => api.get(`/weight/client/${clientId}`);
export const addWeightEntry = (weightData) => api.post('/weight', weightData);
export const updateWeightEntry = (entryId, weightData) => api.put(`/weight/${entryId}`, weightData);
export const deleteWeightEntry = (entryId) => api.delete(`/weight/${entryId}`);

export default api;
