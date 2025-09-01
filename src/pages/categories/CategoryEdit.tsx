import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Upload, X } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';

const CategoryEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categoryDetail, getCategoryDetail, updateCategory } = useCategory();

  const [category, setCategory] = useState({
    name: '',
    slug: '',
    status: 'active' as 'active' | 'inactive',
    image: null as File | null,
    rentPercent3Days: '',
    rentPercent7Days: '',
    rentPercent14Days: '',
    securityPercent: '',
    conveniencePercent: '',
    sellingPercent: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch category details on component mount
  useEffect(() => {
    if (id) {
      const fetchCategoryDetail = async () => {
        setDataLoading(true);
        try {
          await getCategoryDetail(id);
        } catch (error) {
          console.error('Error fetching category details:', error);
          setError('Failed to load category details');
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchCategoryDetail();
    }
  }, [id]);

  useEffect(() => {
    if (categoryDetail) {
      setCategory({
        name: categoryDetail.name || '',
        slug: categoryDetail.slug || '',
        status: categoryDetail.status === 'deleted' ? 'inactive' : categoryDetail.status || 'active',
        image: null,
        rentPercent3Days: categoryDetail.CategoryFeeSetting?.[0]?.rentPercent3Days?.toString() || '',
        rentPercent7Days: categoryDetail.CategoryFeeSetting?.[0]?.rentPercent7Days?.toString() || '',
        rentPercent14Days: categoryDetail.CategoryFeeSetting?.[0]?.rentPercent14Days?.toString() || '',
        securityPercent: categoryDetail.CategoryFeeSetting?.[0]?.securityPercent?.toString() || '',
        conveniencePercent: categoryDetail.CategoryFeeSetting?.[0]?.conveniencePercent?.toString() || '',
        sellingPercent: categoryDetail.CategoryFeeSetting?.[0]?.sellingPercent?.toString() || '',
      });
      // Set image preview if category has an image
      if (categoryDetail.image) {
        setImagePreview(categoryDetail.image);
      }
    }
  }, [categoryDetail]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setCategory(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setCategory(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setCategory(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const validatePercentageFields = () => {
    // Check if all percentage fields are numbers
    const percentageFields = {
      rentPercent3Days: category.rentPercent3Days,
      rentPercent7Days: category.rentPercent7Days,
      rentPercent14Days: category.rentPercent14Days,
      securityPercent: category.securityPercent,
      conveniencePercent: category.conveniencePercent,
      sellingPercent: category.sellingPercent,
    };

    for (const [field, value] of Object.entries(percentageFields)) {
      if (value === '') {
        setError(`${field} is required`);
        return false;
      }
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        setError(`${field} must be a number between 0 and 100`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePercentageFields()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('slug', category.slug);
      formData.append('status', category.status);
      formData.append('rentPercent3Days', category.rentPercent3Days);
      formData.append('rentPercent7Days', category.rentPercent7Days);
      formData.append('rentPercent14Days', category.rentPercent14Days);
      formData.append('securityPercent', category.securityPercent);
      formData.append('conveniencePercent', category.conveniencePercent);
      formData.append('sellingPercent', category.sellingPercent);
      
      if (category.image) {
        formData.append('image', category.image);
      }

      await updateCategory(id!, formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/categories');
      }, 2000);
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCategory(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug when name changes
    if (field === 'name') {
      const generatedSlug = generateSlug(value);
      setCategory(prev => ({
        ...prev,
        slug: generatedSlug
      }));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Category
          </h1>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          Category updated successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              value={category.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Category Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={category.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="category-slug"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              URL-friendly version of the category name (auto-generated from name)
            </p>
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Image
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={`w-8 h-8 mb-4 transition-colors ${
                      isDragOver 
                        ? 'text-blue-500' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <p className={`mb-2 text-sm transition-colors ${
                      isDragOver 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className="font-semibold">
                        {isDragOver ? 'Drop your image here' : 'Click to upload'}
                      </span>
                      {!isDragOver && ' or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Percentage Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rent Percentage for 3 Days */}
            <div>
              <label htmlFor="rentPercent3Days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rent Percentage (3 Days) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="rentPercent3Days"
                  value={category.rentPercent3Days}
                  onChange={(e) => handleInputChange('rentPercent3Days', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Rent Percentage for 7 Days */}
            <div>
              <label htmlFor="rentPercent7Days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rent Percentage (7 Days) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="rentPercent7Days"
                  value={category.rentPercent7Days}
                  onChange={(e) => handleInputChange('rentPercent7Days', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Rent Percentage for 14 Days */}
            <div>
              <label htmlFor="rentPercent14Days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rent Percentage (14 Days) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="rentPercent14Days"
                  value={category.rentPercent14Days}
                  onChange={(e) => handleInputChange('rentPercent14Days', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Security Percentage */}
            <div>
              <label htmlFor="securityPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Security Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="securityPercent"
                  value={category.securityPercent}
                  onChange={(e) => handleInputChange('securityPercent', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Convenience Percentage */}
            <div>
              <label htmlFor="conveniencePercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Convenience Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="conveniencePercent"
                  value={category.conveniencePercent}
                  onChange={(e) => handleInputChange('conveniencePercent', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Selling Percentage */}
            <div>
              <label htmlFor="sellingPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selling Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="sellingPercent"
                  value={category.sellingPercent}
                  onChange={(e) => handleInputChange('sellingPercent', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-12"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={category.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/dashboard/categories"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit; 