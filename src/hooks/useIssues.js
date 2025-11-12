import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Custom hook for managing issues with real-time Firestore synchronization
 * @param {string} userId - Current authenticated user ID
 * @returns {object} Issues state and CRUD operations
 */
export const useIssues = (userId) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for issues collection
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const issuesRef = collection(db, 'issues');
      const q = query(issuesRef, orderBy('createdAt', 'desc'));

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const issuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setIssues(issuesData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching issues:', err);
          setError('Failed to load issues. Please check your Firebase configuration.');
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Failed to initialize. Please check your Firebase configuration.');
      setLoading(false);
    }
  }, [userId]);

  /**
   * Create a new issue
   * @param {object} issueData - Issue data (title, description, status, priority, etc.)
   * @returns {Promise<string>} Created document ID
   */
  const createIssue = async (issueData) => {
    try {
      const issuesRef = collection(db, 'issues');
      const newIssue = {
        ...issueData,
        assignee: issueData.assignee || userId,
        comments: issueData.comments || [],
        labels: issueData.labels || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(issuesRef, newIssue);
      console.log('✅ Issue created:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('❌ Error creating issue:', err);
      throw new Error('Failed to create issue. Please try again.');
    }
  };

  /**
   * Update an existing issue
   * @param {string} issueId - Issue document ID
   * @param {object} updates - Fields to update
   * @returns {Promise<void>}
   */
  const updateIssue = async (issueId, updates) => {
    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Issue updated:', issueId);
    } catch (err) {
      console.error('❌ Error updating issue:', err);
      throw new Error('Failed to update issue. Please try again.');
    }
  };

  /**
   * Delete an issue
   * @param {string} issueId - Issue document ID
   * @returns {Promise<void>}
   */
  const deleteIssue = async (issueId) => {
    try {
      const issueRef = doc(db, 'issues', issueId);
      await deleteDoc(issueRef);
      console.log('✅ Issue deleted:', issueId);
    } catch (err) {
      console.error('❌ Error deleting issue:', err);
      throw new Error('Failed to delete issue. Please try again.');
    }
  };

  /**
   * Add a comment to an issue
   * @param {string} issueId - Issue document ID
   * @param {string} commentText - Comment text
   * @returns {Promise<void>}
   */
  const addComment = async (issueId, commentText) => {
    try {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      const newComment = {
        userId,
        text: commentText,
        timestamp: Date.now(),
      };

      await updateIssue(issueId, {
        comments: [...(issue.comments || []), newComment],
      });
      console.log('✅ Comment added to issue:', issueId);
    } catch (err) {
      console.error('❌ Error adding comment:', err);
      throw new Error('Failed to add comment. Please try again.');
    }
  };

  /**
   * Quick status update (for status toggle buttons)
   * @param {string} issueId - Issue document ID
   * @param {string} newStatus - New status value
   * @returns {Promise<void>}
   */
  const updateStatus = async (issueId, newStatus) => {
    try {
      await updateIssue(issueId, { status: newStatus });
    } catch (err) {
      console.error('❌ Error updating status:', err);
      throw err;
    }
  };

  return {
    issues,
    loading,
    error,
    createIssue,
    updateIssue,
    deleteIssue,
    addComment,
    updateStatus,
  };
};
