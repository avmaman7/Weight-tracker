import React, { useState } from 'react';
import { format } from 'date-fns';
// Use test API instead of regular API
import { updateWeightEntry, deleteWeightEntry } from '../services/test-api';
import EditWeightModal from './EditWeightModal';
import { kgToLbs } from '../utils/weightConversion';

const WeightTable = ({ weightEntries, onUpdate }) => {
  const [editingEntry, setEditingEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteWeightEntry(entryId);
        if (onUpdate) onUpdate();
      } catch (err) {
        setError('Failed to delete entry. Please try again.');
        console.error('Error deleting entry:', err);
      }
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleUpdate = async (entryId, updatedData) => {
    try {
      await updateWeightEntry(entryId, updatedData);
      setIsModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError('Failed to update entry. Please try again.');
      console.error('Error updating entry:', err);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight (lbs)
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {weightEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{kgToLbs(entry.weight)} lbs</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditWeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entry={editingEntry}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default WeightTable;
