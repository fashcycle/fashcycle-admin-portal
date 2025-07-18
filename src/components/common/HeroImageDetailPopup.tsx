import React, { useEffect, useState } from 'react';
import { X, Image, Type, FileText, Calendar, Clock } from 'lucide-react';
import { useHeroImage } from '../../hooks/useHeroImage';
import { helpers } from '../../utils/helper';

interface HeroImageDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  heroImageId: string | null;
}

const HeroImageDetailPopup: React.FC<HeroImageDetailPopupProps> = ({
  isOpen,
  onClose,
  heroImageId
}) => {
  const { heroImageDetail, getHeroImageDetail } = useHeroImage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHeroImageDetail = async () => {
      if (isOpen && heroImageId) {
        try {
          setLoading(true);
          await getHeroImageDetail(heroImageId);
        } catch (error) {
          console.error('Error fetching hero image details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHeroImageDetail();
  }, [isOpen, heroImageId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Image className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hero Image Details
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
        ) : !heroImageDetail ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Hero image not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              The hero image you're looking for doesn't exist or has been removed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Hero Image
                </label>
              </div>
              <div className="relative">
                <img
                  src={heroImageDetail.image}
                  alt={heroImageDetail.header}
                  className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            {/* Header and Description */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Header
                  </label>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {heroImageDetail.header || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                </div>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {heroImageDetail.description || '-'}
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
                    {heroImageDetail.createdAt
                      ? helpers?.formatDateFunction(
                          heroImageDetail.createdAt,
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
                    {heroImageDetail.updatedAt
                      ? helpers?.formatDateFunction(
                          heroImageDetail.updatedAt,
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

export default HeroImageDetailPopup; 