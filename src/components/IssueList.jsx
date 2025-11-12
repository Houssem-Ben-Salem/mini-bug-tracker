import React from 'react';
import IssueCard from './IssueCard';

/**
 * IssueList Component
 * Displays a grid of filtered issues
 */
const IssueList = ({
  issues,
  onEdit,
  onDelete,
  onStatusChange,
  loading,
  selectedIssueIds,
  onSelectIssue,
  onSelectAll
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <svg
          className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No issues found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters or create a new issue to get started.
        </p>
      </div>
    );
  }

  // Check if all issues are selected
  const allSelected = issues.length > 0 && issues.every((issue) => selectedIssueIds.has(issue.id));
  const someSelected = selectedIssueIds.size > 0 && !allSelected;

  return (
    <div className="space-y-4">
      {/* Select All Header */}
      {issues.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {allSelected
              ? `All ${issues.length} issue${issues.length > 1 ? 's' : ''} selected`
              : someSelected
              ? `${selectedIssueIds.size} of ${issues.length} selected`
              : `Select all issues`}
          </span>
        </div>
      )}

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            isSelected={selectedIssueIds.has(issue.id)}
            onSelectIssue={onSelectIssue}
          />
        ))}
      </div>
    </div>
  );
};

export default IssueList;
