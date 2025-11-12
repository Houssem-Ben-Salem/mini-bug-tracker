import React, { useState, useEffect, useMemo } from 'react';
import { initializeAuth } from './firebase/config';
import { useIssues } from './hooks/useIssues';
import IssueList from './components/IssueList';
import FilterBar from './components/FilterBar';
import IssueModal from './components/IssueModal';
import Toast from './components/Toast';

/**
 * Main App Component
 * Handles Firebase initialization, authentication, and application state
 */
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [toast, setToast] = useState(null);

  // Initialize Firebase authentication
  useEffect(() => {
    const init = async () => {
      try {
        const authenticatedUser = await initializeAuth();
        setUser(authenticatedUser);
        setAuthLoading(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        setAuthError('Failed to authenticate. Please check your Firebase configuration.');
        setAuthLoading(false);
      }
    };

    init();
  }, []);

  // Use custom hook for issues management
  const {
    issues,
    loading: issuesLoading,
    error: issuesError,
    createIssue,
    updateIssue,
    deleteIssue,
    updateStatus,
    addComment,
  } = useIssues(user?.uid);

  // Filter issues based on search, status, and priority
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Text search filter (case-insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = issue.title?.toLowerCase().includes(searchLower);
        const matchesDescription = issue.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Status filter (exact match)
      if (filters.status && issue.status !== filters.status) {
        return false;
      }

      // Priority filter (exact match)
      if (filters.priority && issue.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [issues, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
    });
  };

  // Handle opening modal for new issue
  const handleNewIssue = () => {
    setSelectedIssue(null);
    setIsModalOpen(true);
  };

  // Handle edit issue
  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handle save issue (create or update)
  const handleSaveIssue = async (formData, issueId) => {
    try {
      if (issueId) {
        // Update existing issue
        await updateIssue(issueId, formData);
        showToast('Issue updated successfully!', 'success');
      } else {
        // Create new issue
        await createIssue(formData);
        showToast('Issue created successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to save issue', 'error');
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Handle add comment
  const handleAddComment = async (issueId, commentText) => {
    try {
      await addComment(issueId, commentText);
      showToast('Comment added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add comment', 'error');
      throw error;
    }
  };

  // Handle delete issue
  const handleDelete = async (issueId) => {
    try {
      await deleteIssue(issueId);
      showToast('Issue deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete issue', 'error');
    }
  };

  // Handle status change
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateStatus(issueId, newStatus);
      showToast(`Status updated to ${newStatus}`, 'info');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key to close modal
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Initializing Bug Tracker...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Configuration Error
          </h2>
          <p className="text-gray-600 text-center mb-4">{authError}</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-700 mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Create a Firebase project</li>
              <li>Enable Firestore Database</li>
              <li>Enable Anonymous Authentication</li>
              <li>Update your .env.local file with Firebase credentials</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mini Bug Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your project issues efficiently
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current User</p>
              <p className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-md mt-1">
                {user?.uid?.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {issuesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{issuesError}</p>
            </div>
          </div>
        )}

        {/* Add Issue Button */}
        <div className="mb-6">
          <button
            className="btn btn-primary"
            onClick={handleNewIssue}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Issue
            </span>
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Issues Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredIssues.length} of {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </div>

        {/* Issues List */}
        <IssueList
          issues={filteredIssues}
          loading={issuesLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>Mini Bug Tracker - Built with React, Tailwind CSS & Firebase</p>
        </div>
      </footer>

      {/* Issue Modal */}
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={selectedIssue}
        onSave={handleSaveIssue}
        onAddComment={handleAddComment}
        currentUserId={user?.uid}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
