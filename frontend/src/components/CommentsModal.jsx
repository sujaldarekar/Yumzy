import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Reels.css';

const CommentsModal = ({ foodId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/comments/${foodId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [foodId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/comments/${foodId}`, {
        text: newComment
      }, {
        withCredentials: true
      });

      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comments</h3>
          <button className="close-comments-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-user">{comment.user?.fullName || 'Anonymous'}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-time">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="comment-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
