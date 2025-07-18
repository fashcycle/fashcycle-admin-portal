import React, { useEffect, useState } from 'react';
import { X, MapPin, Building, Map, Globe, Calendar, Clock } from 'lucide-react';
import { usePincode } from '../../hooks/usePincode';
import { helpers } from '../../utils/helper';

interface PincodeDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pincodeId: string | null;
}

const PincodeDetailPopup: React.FC<PincodeDetailPopupProps> = ({
  isOpen,
  onClose,
  pincodeId
}) => {
  const { pincodeDetail, getPincodeDetail } = usePincode();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPincodeDetail = async () => {
      if (isOpen && pincodeId) {
        try {
          setLoading(true);
          await getPincodeDetail(pincodeId);
        } catch (error) {
          console.error('Error fetching pincode details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPincodeDetail();
  }, [isOpen, pincodeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pincode Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !pincodeDetail ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Pincode not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              The pincode you're looking for doesn't exist or has been removed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pincode Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pincode
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pincodeDetail.pincode || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    City
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pincodeDetail.city || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Map className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    State
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pincodeDetail.state || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Country
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pincodeDetail.country || '-'}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created Date
                    </label>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {pincodeDetail.createdAt
                      ? helpers?.formatDateFunction(
                          pincodeDetail.createdAt,
                          "dd/mm/yyyy",
                          true
                        )
                      : '-'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </label>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {pincodeDetail.updatedAt
                      ? helpers?.formatDateFunction(
                          pincodeDetail.updatedAt,
                          "dd/mm/yyyy",
                          true
                        )
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PincodeDetailPopup; 