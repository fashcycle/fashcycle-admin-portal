import { useState } from 'react';
import globalRequest from '../services/globalRequest';
import { useAppState } from '../contexts/AppStateContext';
import apiRoutes from '../utils/apiRoutes';

interface PlatformSetting {
  id: string;
  key: string;
  value: string | number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PlatformSettingsResponse {
  success: boolean;
  data: PlatformSetting[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const usePlatformSettings = () => {
  const [platformSettings, setPlatformSettings] = useState<PlatformSetting[]>([]);
  const { setLoading, setMessage } = useAppState();

  const getPlatformSettings = async () => {
    try {
      setLoading(true);
      const response: PlatformSettingsResponse = await globalRequest(
        apiRoutes.platformSettings,
        'get'
      );
      
      if (response.success) {
        setPlatformSettings(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch platform settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePlatformSetting = async (id: string, key: string, value: string | number) => {
    try {
      setLoading(true);
      const response = await globalRequest(
        apiRoutes.platformSettingUpdate(id),
        'put',
        {
          key,
          value: value.toString()
        }
      );
      
      if (response.success) {
        setMessage("Platform setting updated successfully", "success");
        // Refresh the settings list
        await getPlatformSettings();
      }
      
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update platform setting";
      setMessage(message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    platformSettings,
    getPlatformSettings,
    updatePlatformSetting,
  };
}; 