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

// Mock users database
const mockUsers = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    created_at: new Date().toISOString()
  }
];

// Mock clients database with user_id to separate data
const mockClientsDatabase = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    user_id: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    user_id: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Admin Client 1',
    email: 'client1@admin.com',
    user_id: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Admin Client 2',
    email: 'client2@admin.com',
    user_id: 2,
    created_at: new Date().toISOString()
  }
];

// Store the current logged-in user
let currentUser = null;

// Mock API functions with user authentication and data separation
export const getCurrentUser = () => {
  if (!currentUser) {
    return Promise.reject({ response: { status: 401, data: { error: 'Not authenticated' } } });
  }
  return Promise.resolve({ data: { user: currentUser } });
};

export const login = (userData) => {
  // Find user by username and password
  const user = mockUsers.find(
    u => u.username === userData.username && u.password === userData.password
  );

  if (!user) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Invalid username or password' }
      }
    });
  }

  // Set the current user (simulating a session)
  currentUser = { ...user };
  delete currentUser.password; // Don't expose password

  return Promise.resolve({
    data: {
      message: 'Login successful',
      user: currentUser
    }
  });
};

export const register = (userData) => {
  // Check if username already exists
  if (mockUsers.some(u => u.username === userData.username)) {
    return Promise.reject({
      response: {
        status: 409,
        data: { error: 'Username already exists' }
      }
    });
  }

  // Check if email already exists
  if (mockUsers.some(u => u.email === userData.email)) {
    return Promise.reject({
      response: {
        status: 409,
        data: { error: 'Email already exists' }
      }
    });
  }

  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    created_at: new Date().toISOString()
  };

  mockUsers.push(newUser);

  // Set as current user
  currentUser = { ...newUser };
  delete currentUser.password; // Don't expose password

  return Promise.resolve({
    data: {
      message: 'User registered successfully',
      user: currentUser
    }
  });
};

export const logout = () => {
  // Clear the current user
  currentUser = null;
  return Promise.resolve({ data: { message: 'Logout successful' } });
};

export const getClients = () => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  // Filter clients by user_id
  const userClients = mockClientsDatabase.filter(client => client.user_id === currentUser.id);
  return Promise.resolve({ data: userClients });
};

export const getClient = (clientId) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  // Find client by ID and check if it belongs to the current user
  const client = mockClientsDatabase.find(
    c => c.id === parseInt(clientId) && c.user_id === currentUser.id
  );

  if (!client) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Client not found or unauthorized' }
      }
    });
  }

  return Promise.resolve({ data: client });
};

export const addClient = (clientData) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  // Check if email already exists
  if (mockClientsDatabase.some(c => c.email === clientData.email)) {
    return Promise.reject({
      response: {
        status: 409,
        data: { error: 'Email already registered' }
      }
    });
  }

  // Create new client with user_id
  const newClient = {
    id: mockClientsDatabase.length + 1,
    ...clientData,
    user_id: currentUser.id,
    created_at: new Date().toISOString()
  };

  mockClientsDatabase.push(newClient);
  return Promise.resolve({
    data: {
      message: 'Client added successfully',
      client: newClient
    }
  });
};

export const deleteClient = (clientId) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  // Find client index
  const index = mockClientsDatabase.findIndex(
    client => client.id === clientId && client.user_id === currentUser.id
  );

  if (index === -1) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Client not found or unauthorized' }
      }
    });
  }

  // Remove client
  mockClientsDatabase.splice(index, 1);
  return Promise.resolve({ data: { message: 'Client deleted successfully' } });
};

// Mock weight entries for clients with user_id separation
const mockWeightEntries = {
  // Client ID 1 (belongs to user 1)
  1: [
    { id: 1, weight: 180.5, date: '2025-04-01', client_id: 1 },
    { id: 2, weight: 178.2, date: '2025-04-15', client_id: 1 },
    { id: 3, weight: 176.8, date: '2025-05-01', client_id: 1 }
  ],
  // Client ID 2 (belongs to user 1)
  2: [
    { id: 4, weight: 145.0, date: '2025-04-05', client_id: 2 },
    { id: 5, weight: 143.5, date: '2025-04-20', client_id: 2 }
  ],
  // Client ID 3 (belongs to user 2)
  3: [
    { id: 6, weight: 190.0, date: '2025-04-01', client_id: 3 },
    { id: 7, weight: 188.5, date: '2025-04-15', client_id: 3 }
  ],
  // Client ID 4 (belongs to user 2)
  4: [
    { id: 8, weight: 165.0, date: '2025-04-05', client_id: 4 }
  ]
};

// Get weight entries for a client
export const getWeightEntries = (clientId) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  // Check if client belongs to current user
  const client = mockClientsDatabase.find(
    c => c.id === parseInt(clientId) && c.user_id === currentUser.id
  );

  if (!client) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Client not found or unauthorized' }
      }
    });
  }

  const entries = mockWeightEntries[clientId] || [];
  return Promise.resolve({ data: entries });
};

// Add a weight entry
export const addWeightEntry = (weightData) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  const clientId = weightData.client_id;

  // Check if client belongs to current user
  const client = mockClientsDatabase.find(
    c => c.id === parseInt(clientId) && c.user_id === currentUser.id
  );

  if (!client) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Client not found or unauthorized' }
      }
    });
  }

  if (!mockWeightEntries[clientId]) {
    mockWeightEntries[clientId] = [];
  }

  const newEntry = {
    id: Date.now(), // Use timestamp as ID
    weight: weightData.weight,
    date: weightData.date || new Date().toISOString().split('T')[0],
    client_id: clientId
  };

  mockWeightEntries[clientId].push(newEntry);
  return Promise.resolve({
    data: {
      message: 'Weight entry added successfully',
      entry: newEntry
    }
  });
};

// Update a weight entry
export const updateWeightEntry = (entryId, weightData) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  let updated = false;

  // Only check clients that belong to the current user
  const userClientIds = mockClientsDatabase
    .filter(client => client.user_id === currentUser.id)
    .map(client => client.id);

  userClientIds.forEach(clientId => {
    if (mockWeightEntries[clientId]) {
      const entries = mockWeightEntries[clientId];
      const index = entries.findIndex(entry => entry.id === entryId);

      if (index !== -1) {
        entries[index] = { ...entries[index], ...weightData };
        updated = true;
      }
    }
  });

  if (!updated) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Weight entry not found or unauthorized' }
      }
    });
  }

  return Promise.resolve({ data: { message: 'Weight entry updated successfully' } });
};

// Delete a weight entry
export const deleteWeightEntry = (entryId) => {
  // Check if user is authenticated
  if (!currentUser) {
    return Promise.reject({
      response: {
        status: 401,
        data: { error: 'Authentication required' }
      }
    });
  }

  let deleted = false;

  // Only check clients that belong to the current user
  const userClientIds = mockClientsDatabase
    .filter(client => client.user_id === currentUser.id)
    .map(client => client.id);

  userClientIds.forEach(clientId => {
    if (mockWeightEntries[clientId]) {
      const entries = mockWeightEntries[clientId];
      const index = entries.findIndex(entry => entry.id === entryId);

      if (index !== -1) {
        entries.splice(index, 1);
        deleted = true;
      }
    }
  });

  if (!deleted) {
    return Promise.reject({
      response: {
        status: 404,
        data: { error: 'Weight entry not found or unauthorized' }
      }
    });
  }

  return Promise.resolve({ data: { message: 'Weight entry deleted successfully' } });
};

// Logout function
export const logout = () => {
  // In a real app, this would clear the session/token
  return Promise.resolve({ data: { message: 'Logout successful' } });
};

export default api;
