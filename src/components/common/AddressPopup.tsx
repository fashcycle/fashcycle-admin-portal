import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressType: string;
  pincode: string;
  city: string;
  state: string;
}

interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  addressType: string;
  pincode: {
    pincode: string;
    city: string;
    state: string;
  };
}

interface AddressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: AddressData) => Promise<void>;
  address?: Address | null;
  loading?: boolean;
}

const AddressPopup: React.FC<AddressPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  address,
  loading = false,
}) => {
  const [formData, setFormData] = useState<AddressData>({
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    addressType: 'HOME',
    pincode: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');

  const isEditMode = !!address;

  useEffect(() => {
    if (address) {
      setFormData({
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        landmark: address.landmark || '',
        addressType: address.addressType,
        pincode: address.pincode.pincode,
        city: address.pincode.city,
        state: address.pincode.state,
      });
    } else {
      setFormData({
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        addressType: 'HOME',
        pincode: '',
        city: '',
        state: '',
      });
    }
    setError('');
  }, [address, isOpen]);

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.addressLine1.trim()) {
      setError('Address Line 1 is required');
      return;
    }
    if (!formData.pincode.trim()) {
      setError('Pincode is required');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    if (!formData.state.trim()) {
      setError('State is required');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address Line 1 */}
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter address line 1"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter address line 2 (optional)"
            />
          </div>

          {/* Landmark */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              value={formData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter landmark (optional)"
            />
          </div>

          {/* Address Type */}
          <div>
            <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Type *
            </label>
            <input
              type="text"
              id="addressType"
              value={formData.addressType}
              onChange={(e) => handleInputChange('addressType', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Home, Work, Office"
              required
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter pincode"
                required
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter city"
                required
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State *
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Address' : 'Add Address'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPopup; 