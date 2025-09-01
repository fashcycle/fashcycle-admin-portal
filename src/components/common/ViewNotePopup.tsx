import React from 'react';
import { X } from 'lucide-react';

interface ViewNotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  note: string;
}

const ViewNotePopup: React.FC<ViewNotePopupProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Transaction Note
            </h3>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
              {note || 'No note provided'}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotePopup;
