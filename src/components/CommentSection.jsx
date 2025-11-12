import React, { useState } from 'react';

/**
 * CommentSection Component
 * Displays comments and allows adding new comments
 */
const CommentSection = ({ comments = [], onAddComment, currentUserId }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // Sort comments by timestamp (newest first)
  const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="input resize-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {sortedComments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          sortedComments.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm text-gray-900">
                  {comment.userId === currentUserId ? 'You' : comment.userId.slice(0, 8)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
