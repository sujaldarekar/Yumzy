import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CommentsModal from './CommentsModal';
import '../styles/Reels.css';

const VideoCard = ({ videoUrl, userName, userAvatar, description, partnerId, foodName, id }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [message, setMessage] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const navigate = useNavigate();

  // Fetch initial like status when component mounts
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await api.get(`/api/food/${id}/like-status`);
        setLiked(response.data.liked);
        setLikeCount(response.data.count);
        
        // Fetch comment count
        const commentsRes = await api.get(`/api/comments/${id}`);
        setCommentCount(commentsRes.data.comments.length);
      } catch {
        // User might not be logged in, that's okay
        console.log('Could not fetch like status');
      }
    };
    
    if (id) {
      fetchLikeStatus();
    }
  }, [id]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7, // Play when 70% of the video is visible
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLike = async () => {
    try {
      // Optimistic UI update

      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);

      const response = await api.post(`/api/food/${id}/like`, {});

      // Update with server response
      setLiked(response.data.liked);
      setLikeCount(response.data.count);
      
      // Show success message
      if (response.data.liked) {
        setMessage('❤️ Liked!');
      } else {
        setMessage('💔 Unliked');
      }
      
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      
      // Check if it's a duplicate like error
      if (error.response?.status === 409 || error.response?.data?.message?.includes('already')) {
        setMessage('You already liked this! 💖');
        setLiked(true); // Ensure UI shows liked state
      } else if (error.response?.status === 401) {
        setMessage('Please login to like 🔐');
      } else {
        setMessage('Something went wrong 😕');
      }
      
      setTimeout(() => setMessage(''), 3000);
      console.error('Error toggling like:', error);
    }
  };



  return (
    <div className="video-card">
      <div className="video-header">
        <img src={userAvatar || 'https://via.placeholder.com/40'} alt={userName} className="user-avatar" />
        <span className="user-name">{userName}</span>
      </div>

      <video
        ref={videoRef}
        onClick={handleVideoClick}
        src={videoUrl}
        loop
        playsInline
        muted
      />

      <div className="video-overlay">
        <div className="overlay-content">
          <h3 className="food-name">{foodName}</h3>
          <p className="video-description">{description}</p>
          <div className="action-buttons">
            <button 
                className="visit-store-btn"
                onClick={() => navigate(`/store/${partnerId}`)}
            >
              Visit Store
            </button>
            <button 
                className="order-food-btn"
                onClick={() => navigate(`/order/${id}`)}
            >
              Order Food
            </button>
          </div>
        </div>
        
        <div className="video-actions">
          {message && <div className="like-message">{message}</div>}
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill={liked ? '#FF1493' : 'none'} stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="like-count">{likeCount > 0 ? likeCount : ''}</span>
          </button>
          
          <button className="comment-btn" onClick={() => setShowComments(true)}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="comment-count">{commentCount > 0 ? commentCount : ''}</span>
          </button>
        </div>
      </div>
      
      {showComments && <CommentsModal foodId={id} onClose={() => setShowComments(false)} />}
    </div>
  );
};

export default VideoCard;
