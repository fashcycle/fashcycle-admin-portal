import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';
import { helpers } from '../utils/helper';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface ProductListResponse {
  products: Product[];
  totalItems: number;
  page: number;
  limit: number;
}

interface ProductDetail {
  id: string;
  name: string;
  category: string;
  type: string;
  status: string;
  price: number;
  duration: number;
  seller: string;
  listedDate: string;
  color: string;
  size: string;
  address: string;
  description: string;
  images: string[];
  condition: string;
  flexibility: string;
  contactNumber: string;
}

interface ProductDetailResponse {
  product: ProductDetail;
}

interface GetProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export const useProduct = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getProductList = async (params: GetProductListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
            category: params.category || null,
            status: params.status || null
          }
        }
      );
      const data: ProductListResponse = response;
      setProductList(data.products);
      setTotalProducts(data.totalItems);
      setCurrentPage(data.page);
      return data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductDetail = async (productId: string) => {
    if (!productId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productDetail(productId),
        'get'
      );

      let product = response?.product;

      const productDetailData = {
        id: product.id,
        name: product.productName,
        category: product.category,
        type: product.listingType[0],
        status: product.status,
        price: product.originalPurchasePrice,
        duration: 3,
        seller: product.owner.name,
        listedDate: product.createdAt,
        color: product.color,
        size: product.size,
        condition: "-",//not found in response
        description: product.adminNote,
        images: helpers.extractUrls(product.productImage),
        contactNumber: product.owner.phone,
        flexibility: product.sizeFlexibility,
        address: "-"//not found in response
      }

      //if video is present then add video to the images array
      if(product.productVideo){
        productDetailData.images.push(product.productVideo);
      }
      //if accessoriesImage is present then add accessoriesImage to the images array
      if(product.accessoriesImage){
        productDetailData.images.push(product.accessoriesImage);
      }
      //if proofOfPurchase is present then add proofOfPurchase to the images array
      if(product.proofOfPurchase){
        productDetailData.images.push(product.proofOfPurchase);
      }

      const data: ProductDetailResponse = { product: productDetailData };
      setProductDetail(productDetailData);
      return data.product;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    productList,
    productDetail,
    totalProducts,
    currentPage,

    // Functions
    getProductList,
    getProductDetail
  };
};

export const useProductMutations = () => {
  const { setLoading } = useAppState();

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productCreate,
        'post',
        productData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productUpdate(productId),
        'put',
        productData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      await globalRequest(
        apiRoutes.productDelete(productId),
        'delete'
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, status: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.productUpdateStatus(productId),
        'patch',  
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update product status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
      deleteProduct,
    updateProductStatus
  };
};