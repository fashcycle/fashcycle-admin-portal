import React, { useEffect, useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { usePlatformSettings } from "../../hooks/usePlatformSettings";

interface PlatformSetting {
  id: string;
  key: string;
  value: string | number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

const PlatformSettings: React.FC = () => {
  const { platformSettings, getPlatformSettings, updatePlatformSetting } = usePlatformSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getPlatformSettings();
  }, []);

  const handleEdit = (setting: PlatformSetting) => {
    setEditingId(setting.id);
    setEditValues({
      [setting.id]: setting.value.toString()
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (setting: PlatformSetting) => {
    const newValue = editValues[setting.id];
    if (newValue !== undefined && newValue !== setting.value.toString()) {
      try {
        await updatePlatformSetting(setting.id, setting.key, newValue);
        setEditingId(null);
        setEditValues({});
      } catch (error) {
        console.error('Failed to update setting:', error);
      }
    } else {
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleInputChange = (settingId: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const formatKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Platform Settings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {platformSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatKey(setting.key)}
                  </h3>
                  {setting.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {setting.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {editingId === setting.id ? (
                    <>
                      <input
                        type="text"
                        value={editValues[setting.id] || setting.value.toString()}
                        onChange={(e) => handleInputChange(setting.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter value"
                      />
                      <button
                        onClick={() => handleSave(setting)}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Save"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {setting.value}
                      </span>
                      <button
                        onClick={() => handleEdit(setting)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {platformSettings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No platform settings found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings; 