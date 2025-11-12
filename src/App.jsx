import React, { useState, useEffect, useMemo } from 'react';
import { initializeAuth } from './firebase/config';
import { useIssues } from './hooks/useIssues';
import { useDarkMode } from './hooks/useDarkMode';
import IssueList from './components/IssueList';
import FilterBar from './components/FilterBar';
import IssueModal from './components/IssueModal';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';

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
  const [currentView, setCurrentView] = useState('issues'); // 'dashboard' or 'issues'
  const [isDarkMode, toggleDarkMode] = useDarkMode();

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Initializing Bug Tracker...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
            Configuration Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{authError}</p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mini Bug Tracker</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your project issues efficiently
                </p>
              </div>

              {/* View Navigation */}
              <nav className="flex gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </span>
                </button>
                <button
                  onClick={() => setCurrentView('issues')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'issues'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Issues
                  </span>
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current User</p>
                <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-md mt-1">
                  {user?.uid?.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {issuesError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 dark:text-red-300">{issuesError}</p>
            </div>
          </div>
        )}

        {/* Conditional View Rendering */}
        {currentView === 'dashboard' ? (
          /* Dashboard View */
          <Dashboard issues={issues} />
        ) : (
          /* Issues View */
          <>
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
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
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
