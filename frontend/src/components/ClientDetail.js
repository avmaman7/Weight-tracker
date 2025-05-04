import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Use test API instead of regular API
import { getClient, getWeightEntries } from '../services/test-api';
import WeightForm from './WeightForm';
import WeightTable from './WeightTable';
import WeightChart from './WeightChart';

const ClientDetail = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [weightEntries, setWeightEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const [clientResponse, entriesResponse] = await Promise.all([
        getClient(clientId),
        getWeightEntries(clientId)
      ]);

      setClient(clientResponse.data);
      setWeightEntries(entriesResponse.data);
      setError(null);
    } catch (err) {
      setError('Error fetching client data. Please try again later.');
      console.error('Error fetching client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeightEntries = async () => {
    try {
      const response = await getWeightEntries(clientId);
      setWeightEntries(response.data);
    } catch (err) {
      console.error('Error refreshing weight entries:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading client data...</div>;
  }

  if (error || !client) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
        <p>{error || 'Client not found'}</p>
        <p className="mt-2">
          <Link to="/" className="underline">Return to client list</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clients
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>
          <p className="text-gray-600">{client.email}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary mt-3 md:mt-0"
        >
          {showForm ? 'Cancel' : 'Add Weight Entry'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <WeightForm
            clientId={clientId}
            onSuccess={() => {
              refreshWeightEntries();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {weightEntries.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No weight entries found. Add your first entry!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`pb-2 mr-4 text-sm font-medium ${
                  activeTab === 'chart'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('chart')}
              >
                Chart
              </button>
              <button
                className={`pb-2 mr-4 text-sm font-medium ${
                  activeTab === 'table'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('table')}
              >
                Table
              </button>
            </div>
          </div>

          {activeTab === 'chart' ? (
            <WeightChart weightEntries={weightEntries} />
          ) : (
            <WeightTable
              weightEntries={weightEntries}
              onUpdate={refreshWeightEntries}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
