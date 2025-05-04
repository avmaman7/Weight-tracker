import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { kgToLbs, lbsToKg } from '../utils/weightConversion';

const EditWeightModal = ({ isOpen, onClose, entry, onUpdate }) => {
  const [formData, setFormData] = useState({
    weight: '',
    date: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        // Convert from kg to lbs for display
        weight: kgToLbs(entry.weight),
        date: format(parseISO(entry.date), 'yyyy-MM-dd')
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.weight) {
      setError('Weight is required');
      return;
    }

    onUpdate(entry.id, {
      // Convert from lbs to kg before sending to API
      weight: lbsToKg(parseFloat(formData.weight)),
      date: formData.date
    });
  };

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Weight Entry</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-weight">
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              id="edit-weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter weight"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-date">
              Date
            </label>
            <input
              type="date"
              id="edit-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWeightModal;
