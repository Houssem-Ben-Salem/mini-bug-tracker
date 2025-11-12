import React from 'react';

/**
 * IssueCard Component
 * Displays individual issue with status, priority, and quick actions
 */
const IssueCard = ({ issue, onEdit, onDelete, onStatusChange, isSelected, onSelectIssue }) => {
  // Status flow: Open → In-Progress → Review → Closed
  const statusFlow = ['Open', 'In-Progress', 'Review', 'Closed'];

  const getNextStatus = (currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[(currentIndex + 1) % statusFlow.length];
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Open': 'status-open',
      'In-Progress': 'status-in-progress',
      'Review': 'status-review',
      'Closed': 'status-closed',
    };
    return `badge ${statusMap[status] || 'status-open'}`;
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      'Critical': 'priority-critical',
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low',
    };
    return `badge ${priorityMap[priority] || 'priority-medium'}`;
  };

  const handleStatusToggle = async () => {
    const nextStatus = getNextStatus(issue.status);
    try {
      await onStatusChange(issue.id, nextStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`card p-5 hover:scale-[1.02] transition-all relative ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={(e) => {
            e.stopPropagation();
            onSelectIssue(issue.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Header with Priority and Status */}
      <div className="flex justify-between items-start mb-3 ml-8">
        <div className="flex gap-2 flex-wrap">
          <span className={getPriorityClass(issue.priority)}>
            {issue.priority || 'Medium'}
          </span>
          <span className={getStatusClass(issue.status)}>
            {issue.status || 'Open'}
          </span>
        </div>
      </div>

      {/* Issue Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {issue.title}
      </h3>

      {/* Description Preview */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {issue.description}
      </p>

      {/* Labels */}
      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {issue.labels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
            >
              {label}
            </span>
          ))}
          {issue.labels.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
              +{issue.labels.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer with Metadata and Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Assignee: <span className="font-medium text-gray-700 dark:text-gray-300">{issue.assignee || 'Unassigned'}</span></div>
          <div>Created: {formatDate(issue.createdAt)}</div>
          {issue.comments && issue.comments.length > 0 && (
            <div className="flex items-center gap-1 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Status Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusToggle();
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={`Change to ${getNextStatus(issue.status)}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(issue);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit issue"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this issue?')) {
                onDelete(issue.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete issue"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
