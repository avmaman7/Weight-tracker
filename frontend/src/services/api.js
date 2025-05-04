import axios from 'axios';

// Set your backend URL here
const API_URL = 'http://192.168.1.167:8000/api';

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

// Weight entry endpoints
export const getWeightEntries = (clientId) => api.get(`/weight/client/${clientId}`);
export const addWeightEntry = (weightData) => api.post('/weight', weightData);
export const updateWeightEntry = (entryId, weightData) => api.put(`/weight/${entryId}`, weightData);
export const deleteWeightEntry = (entryId) => api.delete(`/weight/${entryId}`);

export default api;
