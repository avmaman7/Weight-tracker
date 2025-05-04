import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Use test API instead of regular API
import { getClients, addClient } from '../services/test-api';
// Keep deleteClient from regular API for now
import { deleteClient } from '../services/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching clients. Please try again later.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newClient.name || !newClient.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await addClient(newClient);
      setNewClient({ name: '', email: '' });
      setShowForm(false);
      fetchClients();
    } catch (err) {
      setError('Error adding client. Please try again.');
      console.error('Error adding client:', err);
    }
  };

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleDeleteClient = async (clientId, e) => {
    // Stop the event from bubbling up to the Link
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this client? This will also delete all weight entries for this client.')) {
      try {
        await deleteClient(clientId);
        // Refresh the client list
        fetchClients();
        setError(null);
      } catch (err) {
        setError('Error deleting client. Please try again.');
        console.error('Error deleting client:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading clients...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Client'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newClient.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter email"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No clients found. Add your first client!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  to={`/clients/${client.id}`}
                  className="block hover:bg-gray-50 transition duration-150"
                >
                  <div className="px-6 py-4 flex items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => handleDeleteClient(client.id, e)}
                        className="text-red-600 hover:text-red-900 mr-4"
                        title="Delete client"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientList;
