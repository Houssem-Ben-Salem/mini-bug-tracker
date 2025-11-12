import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CommentSection from './CommentSection';

/**
 * IssueModal Component
 * Handles both creating and editing issues
 */
const IssueModal = ({ isOpen, onClose, issue, onSave, onAddComment, currentUserId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    assignee: currentUserId || '',
    labels: [],
  });
  const [labelInput, setLabelInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!issue;

  // Populate form when editing
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || '',
        description: issue.description || '',
        status: issue.status || 'Open',
        priority: issue.priority || 'Medium',
        assignee: issue.assignee || currentUserId || '',
        labels: issue.labels || [],
      });
    } else {
      // Reset form for new issue
      setFormData({
        title: '',
        description: '',
        status: 'Open',
        priority: 'Medium',
        assignee: currentUserId || '',
        labels: [],
      });
    }
    setErrors({});
  }, [issue, isOpen, currentUserId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddLabel = (e) => {
    e.preventDefault();
    const trimmedLabel = labelInput.trim();
    if (trimmedLabel && !formData.labels.includes(trimmedLabel)) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, trimmedLabel],
      }));
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (labelToRemove) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label !== labelToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData, issue?.id);
      onClose();
    } catch (error) {
      console.error('Failed to save issue:', error);
      alert('Failed to save issue: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCommentWrapper = async (commentText) => {
    if (issue?.id) {
      await onAddComment(issue.id, commentText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto modal-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Issue' : 'Create New Issue'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Brief description of the issue"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description with Markdown Support */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(Markdown supported)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {showMarkdownPreview ? (
                  <div className="input min-h-[120px] prose prose-sm max-w-none">
                    <ReactMarkdown>{formData.description || '*No content*'}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={6}
                    className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Detailed description of the issue (supports Markdown)"
                  />
                )}
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="input"
                  >
                    <option value="Open">Open</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Review">Review</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="input"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                <input
                  type="text"
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="input"
                  placeholder="User ID"
                />
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddLabel(e);
                      }
                    }}
                    className="input flex-1"
                    placeholder="Type a label and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddLabel}
                    className="btn btn-secondary"
                  >
                    Add
                  </button>
                </div>
                {formData.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.labels.map((label, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section (Only in Edit Mode) */}
              {isEditMode && issue && (
                <div className="pt-6 border-t border-gray-200">
                  <CommentSection
                    comments={issue.comments || []}
                    onAddComment={handleAddCommentWrapper}
                    currentUserId={currentUserId}
                  />
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
