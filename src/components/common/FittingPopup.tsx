import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Ruler, Minus } from 'lucide-react';

interface FittingData {
  [key: string]: {
    [key: string]: string;
  };
}

interface GarmentType {
  id: string;
  name: string;
  measurements: { id: string; name: string; value: string }[];
}

interface FittingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fittingData: FittingData) => Promise<void>;
  fitting?: FittingData | null;
  loading?: boolean;
}

const FittingPopup: React.FC<FittingPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  fitting,
  loading = false
}) => {
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (fitting) {
        // Convert fitting data to garment types format
        const convertedGarmentTypes: GarmentType[] = Object.entries(fitting).map(([garmentName, measurements], index) => ({
          id: `garment_${index}`,
          name: garmentName,
          measurements: Object.entries(measurements).map(([measurementName, value], measurementIndex) => ({
            id: `measurement_${index}_${measurementIndex}`,
            name: measurementName,
            value: value
          }))
        }));
        setGarmentTypes(convertedGarmentTypes);
      } else {
        setGarmentTypes([]);
      }
      setErrors({});
    }
  }, [isOpen, fitting]);

  const addGarmentType = () => {
    const newGarmentType: GarmentType = {
      id: `garment_${Date.now()}`,
      name: '',
      measurements: []
    };
    setGarmentTypes(prev => [...prev, newGarmentType]);
  };

  const removeGarmentType = (garmentId: string) => {
    setGarmentTypes(prev => prev.filter(garment => garment.id !== garmentId));
    setErrors({});
  };

  const updateGarmentName = (garmentId: string, name: string) => {
    setGarmentTypes(prev => prev.map(garment => 
      garment.id === garmentId ? { ...garment, name } : garment
    ));
    
    // Clear error for this field
    const errorKey = `garment_${garmentId}_name`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addMeasurement = (garmentId: string) => {
    const newMeasurement = {
      id: `measurement_${Date.now()}`,
      name: '',
      value: ''
    };
    
    setGarmentTypes(prev => prev.map(garment => 
      garment.id === garmentId 
        ? { ...garment, measurements: [...garment.measurements, newMeasurement] }
        : garment
    ));
  };

  const removeMeasurement = (garmentId: string, measurementId: string) => {
    setGarmentTypes(prev => prev.map(garment => 
      garment.id === garmentId 
        ? { ...garment, measurements: garment.measurements.filter(m => m.id !== measurementId) }
        : garment
    ));
    setErrors({});
  };

  const updateMeasurementName = (garmentId: string, measurementId: string, name: string) => {
    setGarmentTypes(prev => prev.map(garment => 
      garment.id === garmentId 
        ? {
            ...garment,
            measurements: garment.measurements.map(m => 
              m.id === measurementId ? { ...m, name } : m
            )
          }
        : garment
    ));
    
    // Clear error for this field
    const errorKey = `measurement_${measurementId}_name`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const updateMeasurementValue = (garmentId: string, measurementId: string, value: string) => {
    setGarmentTypes(prev => prev.map(garment => 
      garment.id === garmentId 
        ? {
            ...garment,
            measurements: garment.measurements.map(m => 
              m.id === measurementId ? { ...m, value } : m
            )
          }
        : garment
    ));
    
    // Clear error for this field
    const errorKey = `measurement_${measurementId}_value`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    garmentTypes.forEach(garment => {
      if (!garment.name.trim()) {
        newErrors[`garment_${garment.id}_name`] = 'Garment name is required';
      }
      
      garment.measurements.forEach(measurement => {
        if (!measurement.name.trim()) {
          newErrors[`measurement_${measurement.id}_name`] = 'Measurement name is required';
        }
        if (!measurement.value.trim()) {
          newErrors[`measurement_${measurement.id}_value`] = 'Measurement value is required';
        }
      });
    });

    if (garmentTypes.length === 0) {
      newErrors.general = 'Please add at least one garment type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToFittingData = (): FittingData => {
    const fittingData: FittingData = {};
    
    garmentTypes.forEach(garment => {
      if (garment.name.trim()) {
        const measurements: { [key: string]: string } = {};
        garment.measurements.forEach(measurement => {
          if (measurement.name.trim() && measurement.value.trim()) {
            measurements[measurement.name] = measurement.value;
          }
        });
        if (Object.keys(measurements).length > 0) {
          fittingData[garment.name] = measurements;
        }
      }
    });
    
    return fittingData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const fittingData = convertToFittingData();
      await onSave(fittingData);
    } catch (error) {
      console.error('Error saving fitting data:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {fitting ? 'Edit Fitting Details' : 'Add Fitting Details'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {errors.general}
            </div>
          )}

          {/* Add Garment Type Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Garment Types & Measurements
            </h3>
            <button
              type="button"
              onClick={addGarmentType}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Garment Type
            </button>
          </div>

          {/* Dynamic Garment Types */}
          {garmentTypes.map((garment, garmentIndex) => (
            <div key={garment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Garment Type *
                  </label>
                  <input
                    type="text"
                    value={garment.name}
                    onChange={(e) => updateGarmentName(garment.id, e.target.value)}
                    placeholder="e.g., Blouse, Lehenga, Saree, etc."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors[`garment_${garment.id}_name`]
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors[`garment_${garment.id}_name`] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors[`garment_${garment.id}_name`]}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeGarmentType(garment.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Remove Garment Type"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Measurements for this garment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Measurements
                  </h4>
                  <button
                    type="button"
                    onClick={() => addMeasurement(garment.id)}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Measurement
                  </button>
                </div>

                {garment.measurements.map((measurement, measurementIndex) => (
                  <div key={measurement.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Measurement Name *
                      </label>
                      <input
                        type="text"
                        value={measurement.name}
                        onChange={(e) => updateMeasurementName(garment.id, measurement.id, e.target.value)}
                        placeholder="e.g., Bust, Waist, Length, etc."
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm ${
                          errors[`measurement_${measurement.id}_name`]
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors[`measurement_${measurement.id}_name`] && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {errors[`measurement_${measurement.id}_name`]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={measurement.value}
                          onChange={(e) => updateMeasurementValue(garment.id, measurement.id, e.target.value)}
                          placeholder="e.g., 36 in, 28 cm, etc."
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm ${
                            errors[`measurement_${measurement.id}_value`]
                              ? 'border-red-300 dark:border-red-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors[`measurement_${measurement.id}_value`] && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors[`measurement_${measurement.id}_value`]}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMeasurement(garment.id, measurement.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove Measurement"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {garment.measurements.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No measurements added yet. Click "Add Measurement" to get started.
                  </div>
                )}
              </div>
            </div>
          ))}

          {garmentTypes.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No garment types added yet</p>
              <button
                type="button"
                onClick={addGarmentType}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Garment Type
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{fitting ? 'Update' : 'Save'} Fitting Details</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FittingPopup;
