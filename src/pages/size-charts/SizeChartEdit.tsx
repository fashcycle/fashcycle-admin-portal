import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ruler,
  Save,
} from 'lucide-react';
import { useSizeChart } from '../../hooks/useSizeChart';

const SizeChartEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSizeChartDetail, updateSizeChart } = useSizeChart();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sizes: {
      XS: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      S: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      M: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      L: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      XL: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      XXL: {
        'Bust': '',
        'Top Waist': '',
        'Hip': '',
        'Top Length': '',
        'Bottom Length': '',
        'Bottom Waist': ''
      },
      FREE_SIZE: {
        'description': ''
      }
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE_SIZE'];
  const measurementOptions = [
    'Bust',
    'Top Waist',
    'Hip',
    'Top Length',
    'Bottom Length',
    'Bottom Waist'
  ];

  useEffect(() => {
    if (id) {
      loadSizeChart();
    }
  }, [id]);

  const loadSizeChart = async () => {
    if (!id) return;
    
    setDataLoading(true);
    try {
      const sizeChart = await getSizeChartDetail(id);
      
      if (sizeChart) {
        const formData = {
          name: sizeChart.name || '',
          description: sizeChart.description || '',
          sizes: {
            XS: sizeChart.sizes?.XS || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            S: sizeChart.sizes?.S || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            M: sizeChart.sizes?.M || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            L: sizeChart.sizes?.L || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            XL: sizeChart.sizes?.XL || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            XXL: sizeChart.sizes?.XXL || { 'Bust': '', 'Top Waist': '', 'Hip': '', 'Top Length': '', 'Bottom Length': '', 'Bottom Waist': '' },
            FREE_SIZE: sizeChart.sizes?.FREE_SIZE || { 'description': '' }
          }
        };
        setFormData(formData);
      }
    } catch (error) {
      console.error('Error loading size chart:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSizeChange = (size: string, measurement: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [measurement]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    setLoading(true);
    try {
      // Clean up empty values from sizes
      const cleanedSizes = { ...formData.sizes };
      Object.keys(cleanedSizes).forEach(size => {
        if (size === 'FREE_SIZE') {
          if (!cleanedSizes[size].description) {
            cleanedSizes[size] = { description: '' };
          }
        } else {
          const cleanedSize: { [key: string]: string } = {};
          Object.keys(cleanedSizes[size]).forEach(measurement => {
            if (cleanedSizes[size][measurement]) {
              cleanedSize[measurement] = cleanedSizes[size][measurement];
            }
          });
          cleanedSizes[size] = cleanedSize;
        }
      });

      await updateSizeChart(id, {
        name: formData.name,
        description: formData.description,
        sizes: cleanedSizes
      });
      
      navigate('/dashboard/size-charts');
    } catch (error) {
      console.error('Error updating size chart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/size-charts')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Size Charts
        </button>
        <div className="flex items-center space-x-2">
          <Ruler className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Size Chart
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter size chart name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Size Chart Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Size Measurements
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                      Size
                    </th>
                    {measurementOptions.map((measurement) => (
                      <th key={measurement} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                        {measurement}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sizeOptions.map((size) => (
                    <tr key={size}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                        {size}
                      </td>
                      {size === 'FREE_SIZE' ? (
                        <td colSpan={measurementOptions.length} className="px-4 py-3">
                          <input
                            type="text"
                            value={formData.sizes[size].description}
                            onChange={(e) => handleSizeChange(size, 'description', e.target.value)}
                            placeholder="Enter description (e.g., One size fits all)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        </td>
                      ) : (
                        measurementOptions.map((measurement) => (
                          <td key={measurement} className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                            <input
                              type="text"
                              value={formData.sizes[size][measurement] || ''}
                              onChange={(e) => handleSizeChange(size, measurement, e.target.value)}
                              placeholder="e.g., 32-33 in"
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              * All measurements are optional. Enter values like "32-33 in" or "Small" as needed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard/size-charts')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Size Chart</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeChartEdit;
