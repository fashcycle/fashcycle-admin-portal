import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Eye, Download, FileText, Video, Image } from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
}

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productDetailToUpdate, getProductDetail } = useProduct();

  // Initialize with empty state first
  const [product, setProduct] = useState({
    id: '1',
    name: 'jhgfashd',
    mobileNumber: '',
    category: '',
    originalPurchasePrice: 0,
    sizeFlexibility: '',
    color: '',
    listingType: 'rent',
    files: {
      frontLook: null as FileItem | null,
      backLook: null as FileItem | null,
      sideLook: null as FileItem | null,
      closeUpLook: null as FileItem | null,
      optional1: null as FileItem | null,
      optional2: null as FileItem | null,
      productVideo: null as FileItem | null,
      accessories: null as FileItem | null,
      proofOfPurchase: null as FileItem | null
    },
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch product details on component mount
  useEffect(() => {
    if (id) {
      const fetchProductDetail = async () => {
        setDataLoading(true);
        try {
          await getProductDetail(id);
        } catch (error) {
          console.error('Error fetching product details:', error);
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    if (productDetailToUpdate) {
      const convertToFileItem = (imageData: any): FileItem | null => {
        if (!imageData) return null;
        
        return {
          id: `existing-${Date.now()}`,
          name: `${imageData.split('/').pop() || 'image'}`,
          url: imageData,
          type: 'image',
          size: ""
        };
      };

      setProduct({
        id: productDetailToUpdate.id || '',
        name: productDetailToUpdate?.name || '',
        mobileNumber: productDetailToUpdate?.mobileNumber || '',
        category: productDetailToUpdate?.category?.name || '',
        originalPurchasePrice: productDetailToUpdate?.originalPurchasePrice || 0,
        sizeFlexibility: productDetailToUpdate?.sizeFlexibility || '',
        color: productDetailToUpdate?.color || '',
        listingType: productDetailToUpdate?.listingType?.[0] || 'rent',
        files: {
          frontLook: convertToFileItem(productDetailToUpdate?.previewFiles?.frontLook),
          backLook: convertToFileItem(productDetailToUpdate?.previewFiles?.backLook),
          sideLook: convertToFileItem(productDetailToUpdate?.previewFiles?.sideLook),
          closeUpLook: convertToFileItem(productDetailToUpdate?.previewFiles?.closeUpLook),
          optional1: convertToFileItem(productDetailToUpdate?.previewFiles?.optional1),
          optional2: convertToFileItem(productDetailToUpdate?.previewFiles?.optional2),
          productVideo: productDetailToUpdate?.previewFiles?.productVideo ? {
            id: `video-${Date.now()}`,
            name: 'Product Video',
            url: productDetailToUpdate?.previewFiles?.productVideo,
            type: 'video',
            size: 'Unknown'
          } : null,
          accessories: convertToFileItem(productDetailToUpdate?.previewFiles?.accessories),
          proofOfPurchase: convertToFileItem(productDetailToUpdate?.previewFiles?.proofOfPurchase)
        },
        description: productDetailToUpdate.description || '',
      });
    }
  }, [productDetailToUpdate]);


  const categories = ['Formal Wear', 'Business Wear', 'Casual Wear', 'Sports Wear', 'Accessories'];
  const sizeFlexibilityOptions = ['flexible', 'fixed'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const handleInputChange = (field: string, value: any) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (section: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Take only the first file
    const newFile: FileItem = {
      id: `${section}-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };

    setProduct(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [section]: newFile
      }
    }));
  };

  const removeFile = (section: string) => {
    setProduct(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [section]: null
      }
    }));
  };

  const downloadFile = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewFile = (file: FileItem) => {
    window.open(file.url, '_blank');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const FileUploadSection = ({ 
    title, 
    section, 
    required = false, 
    maxSize = "20MB",
    accept = "image/*,video/*,.pdf,.doc,.docx"
  }: {
    title: string;
    section: string;
    required?: boolean;
    maxSize?: string;
    accept?: string;
  }) => {
    const file = product.files[section as keyof typeof product.files];

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="text-center">
            <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <div className="flex items-center justify-center">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500 font-medium text-sm">Choose File</span>
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileUpload(section, e.target.files)}
                  className="hidden"
                />
              </label>
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">No file chosen</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max size: {maxSize}
            </p>
          </div>
        </div>

        {/* File Preview */}
        {file && (
          <div className="space-y-3">
            {/* File Preview Image/Video */}
            {file.type === 'image' && (
              <div className="relative">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeFile(section)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {file.type === 'video' && (
              <div className="relative">
                <video
                  src={file.url}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  controls
                />
                <button
                  type="button"
                  onClick={() => removeFile(section)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* File Info and Actions */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 text-gray-400">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {file.size}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  type="button"
                  onClick={() => viewFile(file)}
                  className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile(file)}
                  className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(section)}
                  className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state if no product data
  if (!dataLoading && !productDetailToUpdate) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load product details</p>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/dashboard/products`)}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Product</span>
          </button>
        </div>
        {success && (
          <div className="text-green-600 dark:text-green-400 font-medium">
            Product updated successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={product.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={product.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Purchase Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={product.originalPurchasePrice}
                onChange={(e) => handleInputChange('originalPurchasePrice', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size Flexibility <span className="text-red-500">*</span>
              </label>
              <select
                value={product.sizeFlexibility}
                onChange={(e) => handleInputChange('sizeFlexibility', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select flexibility</option>
                {sizeFlexibilityOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <select
                value={product.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select color</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Images Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Product Images <span className="text-sm text-gray-500">(Min 4 required)</span> <span className="text-red-500">*</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FileUploadSection
              title="Front Look"
              section="frontLook"
              required
              accept="image/*"
              maxSize="10MB"
            />
            
            <FileUploadSection
              title="Back Look Image"
              section="backLook"
              required
              accept="image/*"
              maxSize="10MB"
            />
            
            <FileUploadSection
              title="Side Look Image"
              section="sideLook"
              required
              accept="image/*"
              maxSize="10MB"
            />
            
            <FileUploadSection
              title="CloseUp Look Image"
              section="closeUpLook"
              required
              accept="image/*"
              maxSize="10MB"
            />
            
            <FileUploadSection
              title="Optional 1 Image"
              section="optional1"
              accept="image/*"
              maxSize="10MB"
            />
            
            <FileUploadSection
              title="Optional 2 Image"
              section="optional2"
              accept="image/*"
              maxSize="10MB"
            />
          </div>
        </div>

        {/* Additional Media Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Additional Media & Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadSection
              title="Product Video (Max 20MB)"
              section="productVideo"
              accept="video/*"
              maxSize="20MB"
            />
            
            <FileUploadSection
              title="Accessories Image"
              section="accessories"
              accept="image/*"
              maxSize="10MB"
            />
            
            <div className="md:col-span-2">
              <FileUploadSection
                title="Proof of Purchase"
                section="proofOfPurchase"
                accept="image/*,.pdf,.doc,.docx"
                maxSize="10MB"
              />
            </div>
          </div>
        </div>

        {/* Listing Type */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Listing Type <span className="text-red-500">*</span>
          </h2>
          
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="listingType"
                value="rent"
                checked={product.listingType === 'rent'}
                onChange={(e) => handleInputChange('listingType', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Rent
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="listingType"
                value="sell"
                checked={product.listingType === 'sell'}
                onChange={(e) => handleInputChange('listingType', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sell
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;