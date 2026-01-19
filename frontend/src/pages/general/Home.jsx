import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoFeed from '../../components/VideoFeed'
import api from '../../api/axios'

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

  return (
    <div className="home-page">
      <div className="brand-overlay">
        <img src="/logo/yumzy.png" alt="Yumzy" />
      </div>
      <VideoFeed />
    </div>
  )
}

export default Home
