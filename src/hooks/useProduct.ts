import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

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

interface ProductDetailResponse {
  product: Product;
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
  const [productDetail, setProductDetail] = useState<Product | null>(null);
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

      const data: ProductDetailResponse = response.data;
      setProductDetail(data.product);
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

  return {
    createProduct,
    updateProduct,
    deleteProduct
  };
};