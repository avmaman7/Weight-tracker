import React, { useState } from 'react';
// Use test API instead of regular API
import { addWeightEntry } from '../services/test-api';
import { format } from 'date-fns';
import { lbsToKg } from '../utils/weightConversion';

const WeightForm = ({ clientId, onSuccess }) => {
  const [formData, setFormData] = useState({
    weight: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.weight) {
      setError('Weight is required');
      return;
    }

    try {
      setLoading(true);
      // Convert pounds to kilograms before sending to the API
      await addWeightEntry({
        weight: lbsToKg(parseFloat(formData.weight)),
        date: formData.date,
        client_id: parseInt(clientId)
      });

      setFormData({
        weight: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });

      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error adding weight entry. Please try again.');
      console.error('Error adding weight entry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Add Weight Entry</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter weight"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Weight Entry'}
          </button>
        </div>
      </form>
    </>
  );
};

export default WeightForm;
