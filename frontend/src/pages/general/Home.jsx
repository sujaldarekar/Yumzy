import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoFeed from '../../components/VideoFeed'
import api from '../../api/axios'
import '../../styles/App.css'

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by verifying token exists and is valid
    const checkAuth = async () => {
      const userToken = localStorage.getItem('userToken');
      
      // If no token stored, redirect to login
      if (!userToken) {
        navigate('/user/login');
        return;
      }
      
      try {
        // Verify token with backend
        await api.get('/api/auth/verify');
        // User is authenticated, continue
      } catch {
        // Token is invalid, clear and redirect to login
        localStorage.removeItem('userToken');
        navigate('/user/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear token and redirect, even if logout API fails
      localStorage.removeItem('userToken');
      localStorage.removeItem('partnerToken');
      navigate('/user/login');
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="brand-overlay">
          <img src="/logo/yumzy.png" alt="Yumzy" />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <VideoFeed />
    </div>
  )
}

export default Home
