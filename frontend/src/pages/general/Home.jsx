import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoFeed from '../../components/VideoFeed'
import api from '../../api/axios'
import '../../styles/App.css'

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        await api.get('/api/auth/verify');
        // User is authenticated, continue
      } catch {
        // Not authenticated, redirect to login
        navigate('/user/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      navigate('/user/login');
    } catch (error) {
      console.error('Logout failed:', error);
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
