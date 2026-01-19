import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/Store.css';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState(1200000); // 1.2M starting demo state
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchStoreData = async () => {
            try {
                const response = await api.get(`/api/food/partner/${id}`);
                if (!isMounted) return;
                setStoreData(response.data);
                
                // Check if the current logged-in partner is the owner
                try {
                    const authRes = await api.get('/api/auth/verify-partner');
                    if (isMounted && authRes.data.partner.id === id) {
                        setIsOwner(true);
                    }
                } catch {
                    // Not a partner or not logged in as partner, that's fine
                }

                if (isMounted) setLoading(false);
            } catch (err) {
                console.error("Error fetching store data:", err);
                if (isMounted) {
                    setError("Store not found or connection error.");
                    setLoading(false);
                }
            }
        };

        fetchStoreData();
        return () => { isMounted = false; };
    }, [id]);

    if (loading) return <div className="store-loading">Loading Store profile...</div>;
    if (error) return <div className="store-error">{error}</div>;

    const { partner, foodItems } = storeData;

    // Logic for counts
    const totalMeals = foodItems.length;
    // Mocking served count based on meals for demo purposes
    const totalServed = totalMeals * 145 + 1200; 

    const handleFollow = () => {
        if (isFollowing) {
            setFollowers(prev => prev - 1);
        } else {
            setFollowers(prev => prev + 1);
        }
        setIsFollowing(!isFollowing);
    };

    const formatFollowers = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="store-container">
            {/* Nav Bar */}
            <nav className="insta-nav">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div className="nav-center">
                    <img src="/logo/yumzy.png" alt="Yumzy" className="nav-logo" />
                    <span className="nav-username">{partner.name}</span>
                </div>
                <div className="nav-actions">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </div>
            </nav>

            <div className="custom-profile-header">
                {/* Left Side: PFP + Bio */}
                <div className="header-left">
                    <div className="profile-image-container">
                        <img 
                            src={`https://i.pravatar.cc/150?u=${partner._id}`} 
                            alt={partner.name} 
                            className="profile-avatar" 
                        />
                    </div>
                    
                    <div className="profile-bio-section">
                        <div className="bio-item">
                            <span className="bio-icon">📍</span>
                            <span className="bio-text">{partner.contactName || '123 Food Street, City'}</span>
                        </div>
                         <div className="bio-item">
                            <span className="bio-icon">📞</span>
                            <span className="bio-text">{partner.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Name + Stats */}
                <div className="header-right">
                    <h1 className="business-name">{partner.name}</h1>
                    
                    <div className="stats-container">
                        <div className="stat-box">
                            <span className="stat-number">{totalMeals}</span>
                            <span className="stat-label">Total Meals</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">{totalServed.toLocaleString()}</span>
                            <span className="stat-label">Happy Clients</span>
                        </div>
                         <div className="stat-box">
                            <span className="stat-number">{formatFollowers(followers)}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                         <button 
                            className={`action-btn ${!isFollowing ? 'primary' : 'secondary'}`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                         </button>
                         {isOwner && (
                            <button 
                                className="action-btn upload-btn"
                                onClick={() => navigate('/create-food')}
                                style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
                            >
                                + Upload Movie
                            </button>
                         )}
                    </div>
                </div>
            </div>

            <section className="insta-grid">
                {foodItems.map(item => (
                    <div key={item._id} className="grid-item">
                        <div className="grid-video-wrapper">
                            <video 
                                src={item.video} 
                                muted 
                                loop
                                onMouseOver={e => e.target.play()} 
                                onMouseOut={e => e.target.pause()}
                                onClick={() => handleVideoClick(item.video)}
                            />
                            <div className="grid-item-overlay">
                                <div className="grid-item-info">
                                    <span className="grid-item-price">₹{item.price}</span>
                                    <h4 className="grid-item-name">{item.name}</h4>
                                </div>
                                <button 
                                    className="grid-order-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/order/${item._id}`);
                                    }}
                                >
                                    Order Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

             {/* Video Modal */}
             {selectedVideo && (
                <div className="video-modal-overlay" onClick={closeVideo}>
                    <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={closeVideo}>&times;</button>
                        <video 
                            src={selectedVideo} 
                            controls 
                            autoPlay 
                            className="full-screen-video"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
