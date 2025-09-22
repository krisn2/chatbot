import React, { useState } from 'react';

const AuthForm = ({ title, fields, onSubmit, submitText, toggleView, toggleText }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700">{title}</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      ))}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <button
          type="submit"
          className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {submitText}
        </button>
        <button
          type="button"
          onClick={toggleView}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          {toggleText}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
