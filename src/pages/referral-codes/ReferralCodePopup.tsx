import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useReferralCodes } from '../../hooks/useReferralCodes';

interface ReferralCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add' | 'edit';
  referralCode: any;
}

const ReferralCodePopup: React.FC<ReferralCodePopupProps> = ({
  isOpen,
  onClose,
  type,
  referralCode
}) => {
  const [formData, setFormData] = useState({
    code: '',
    referrerName: '',
    contactNo: '',
    email: '',
    upiId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createReferralCode, updateReferralCode } = useReferralCodes();

  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && referralCode) {
        setFormData({
          code: referralCode.code || '',
          referrerName: referralCode.referrerName || '',
          contactNo: referralCode.contactNo || '',
          email: referralCode.email || '',
          upiId: referralCode.upiId || ''
        });
      } else {
        setFormData({
          code: '',
          referrerName: '',
          contactNo: '',
          email: '',
          upiId: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, type, referralCode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.referrerName.trim()) {
      newErrors.referrerName = 'Referrer name is required';
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (type === 'add') {
        await createReferralCode(formData);
      } else {
        await updateReferralCode(referralCode.id, formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {type === 'add' ? 'Add Referral Code' : 'Edit Referral Code'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter referral code"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>
            )}
          </div>

          {/* Referrer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Referrer Name *
            </label>
            <input
              type="text"
              value={formData.referrerName}
              onChange={(e) => handleInputChange('referrerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.referrerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter referrer name"
            />
            {errors.referrerName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.referrerName}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contactNo}
              onChange={(e) => handleInputChange('contactNo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.contactNo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter contact number"
            />
            {errors.contactNo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactNo}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.upiId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter UPI ID"
            />
            {errors.upiId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.upiId}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : type === 'add' ? 'Add Referral Code' : 'Update Referral Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralCodePopup; 