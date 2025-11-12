import React, { useState } from 'react';

/**
 * BulkActionsBar Component
 * Displays action bar when issues are selected for bulk operations
 */
const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkStatusChange,
  onBulkDelete
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statuses = ['Open', 'In-Progress', 'Review', 'Closed'];

  const handleBulkStatusChange = async (status) => {
    setShowStatusDropdown(false);
    await onBulkStatusChange(status);
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} issue${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (confirmed) {
      setIsDeleting(true);
      await onBulkDelete();
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-6">
        {/* Selection Counter */}
        <div className="flex items-center gap-2 border-r border-blue-400 dark:border-blue-500 pr-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">
            {selectedCount} selected
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Change Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Change Status
            </button>

            {/* Dropdown Menu */}
            {showStatusDropdown && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusChange(status)}
                    className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="px-4 py-2 bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 dark:hover:text-blue-700 rounded-lg transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
