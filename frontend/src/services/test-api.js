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

// Create a mock user for testing
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  created_at: new Date().toISOString()
};

// Create mock clients for testing
const mockClients = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    created_at: new Date().toISOString()
  }
];

// Mock API functions that don't require backend
export const getCurrentUser = () => {
  return Promise.resolve({ data: { user: mockUser } });
};

export const getClients = () => {
  return Promise.resolve({ data: mockClients });
};

export const addClient = (clientData) => {
  const newClient = {
    id: mockClients.length + 1,
    ...clientData,
    created_at: new Date().toISOString()
  };
  mockClients.push(newClient);
  return Promise.resolve({ data: { message: 'Client added successfully', client: newClient } });
};

export const deleteClient = (clientId) => {
  const index = mockClients.findIndex(client => client.id === clientId);
  if (index !== -1) {
    mockClients.splice(index, 1);
  }
  return Promise.resolve({ data: { message: 'Client deleted successfully' } });
};

export default api;
