import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface HeroImage {
  id: string;
  image: string;
  header: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface HeroImageListResponse {
  data: HeroImage[];
  total: number;
  currentPage: number;
  limit: number;
}

interface GetHeroImageListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CreateHeroImageData {
  image: File;
  header: string;
  description: string;
}

interface UpdateHeroImageData {
  image?: File;
  header: string;
  description: string;
}

export const useHeroImage = () => {
  const [heroImageList, setHeroImageList] = useState<HeroImage[]>([]);
  const [heroImageDetail, setHeroImageDetail] = useState<HeroImage | null>(null);
  const [totalHeroImages, setTotalHeroImages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading } = useAppState();

  const getHeroImageList = async (params: GetHeroImageListParams = {}) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.heroImageList,
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
      
      const data: HeroImageListResponse = response;
      setHeroImageList(data.data || []);
      setTotalHeroImages(data.total || 0);
      setCurrentPage(data.currentPage || 1);
      return data;
    } catch (error) {
      console.error('Failed to fetch hero images:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getHeroImageDetail = async (heroImageId: string) => {
    if (!heroImageId) return null;

    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.heroImageDetail(heroImageId),
        'get'
      );
      
      if (response.success && response.heroImage) {
        setHeroImageDetail(response.heroImage);
        return response.heroImage;
      } else {
        throw new Error('Failed to fetch hero image details');
      }
    } catch (error) {
      console.error('Failed to fetch hero image details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    heroImageList,
    heroImageDetail,
    totalHeroImages,
    currentPage,
    getHeroImageList,
    getHeroImageDetail,
  };
};

export const useHeroImageMutations = () => {
  const { setLoading } = useAppState();

  const createHeroImage = async (heroImageData: FormData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.heroImageCreate,
        'post',
        heroImageData        
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to create hero image');
      }
    } catch (error) {
      console.error('Failed to create hero image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateHeroImage = async (heroImageId: string, heroImageData: FormData) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.heroImageUpdate(heroImageId),
        'put',
        heroImageData        
      );
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Failed to update hero image');
      }
    } catch (error) {
      console.error('Failed to update hero image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroImage = async (heroImageId: string, callback: () => void) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.heroImageDelete(heroImageId),
        'delete'
      );
      
      if (response.success) {
        callback();
        return response;
      } else {
        throw new Error('Failed to delete hero image');
      }
    } catch (error) {
      console.error('Failed to delete hero image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createHeroImage,
    updateHeroImage,
    deleteHeroImage,
  };
}; 