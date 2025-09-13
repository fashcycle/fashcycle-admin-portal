import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface SizeChartSizes {
  [key: string]: {
    [key: string]: string;
  };
}

interface SizeChart {
  id: string;
  name: string;
  description: string;
  sizes: SizeChartSizes;
  createdAt: string;
  updatedAt: string;
}

interface SizeChartListResponse {
  sizeCharts?: SizeChart[];
  data?: SizeChart[];
  total?: number;
  totalSizeCharts?: number;
  currentPage?: number;
  page?: number;
  limit?: number;
  success?: boolean;
  message?: string;
}

interface SizeChartDetailResponse {
  success: boolean;
  sizeChart: SizeChart;
}

interface GetSizeChartListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface SizeChartData {
  name: string;
  description: string;
  sizes: SizeChartSizes;
}

export const useSizeChart = () => {
  const [sizeChartList, setSizeChartList] = useState<SizeChart[]>([]);
  const [sizeChartDetail, setSizeChartDetail] = useState<SizeChart | null>(null);
  const [totalSizeCharts, setTotalSizeCharts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { setLoading } = useAppState();

  const getSizeChartList = async (params: GetSizeChartListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.sizeChartList,
        'get',
        {},
        {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || '',
          }
        }
      );
      
      const data: SizeChartListResponse = response;
      
      // Handle different possible response structures
      const sizeCharts = data.sizeCharts || data.data || [];
      const total = data.total || data.totalSizeCharts || 0;
      const currentPage = data.currentPage || data.page || 1;
      
      setSizeChartList(sizeCharts);
      setTotalSizeCharts(total);
      setCurrentPage(currentPage);
      
      return data;
    } catch (error) {
      console.error('Failed to fetch size charts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSizeChartDetail = async (id: string) => {
    if (!id) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.sizeChartDetail(id),
        'get'
      );
      
      // Handle different possible response structures
      const sizeChart = response.sizeChart || response.data || response;
      
      if (sizeChart) {
        setSizeChartDetail(sizeChart);
        return sizeChart;
      } else {
        throw new Error('Failed to fetch size chart details');
      }
    } catch (error) {
      console.error('Failed to fetch size chart details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createSizeChart = async (sizeChartData: SizeChartData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.sizeChartCreate,
        'post',
        sizeChartData
      );
      
      // Refresh size chart list after creating
      if (response.success) {
        await getSizeChartList();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to create size chart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSizeChart = async (id: string, sizeChartData: SizeChartData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.sizeChartUpdate(id),
        'put',
        sizeChartData
      );
      
      // Refresh size chart list after updating
      if (response.success) {
        await getSizeChartList();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to update size chart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSizeChart = async (id: string) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.sizeChartDelete(id),
        'delete'
      );
      
      // Refresh size chart list after deleting
      if (response.success) {
        await getSizeChartList();
      }
      
      return response;
    } catch (error) {
      console.error('Failed to delete size chart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sizeChartList,
    sizeChartDetail,
    totalSizeCharts,
    currentPage,
    getSizeChartList,
    getSizeChartDetail,
    createSizeChart,
    updateSizeChart,
    deleteSizeChart,
  };
};
