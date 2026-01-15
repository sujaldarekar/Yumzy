import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import axios from 'axios';
import '../styles/Reels.css';

const VideoFeed = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food');
                // Use response.data.foodItems as requested
                let formattedVideos = response.data.foodItems.map(item => ({
                    id: item._id,
                    videoUrl: item.video,
                    foodName: item.name, // Added foodName
                    userName: item.foodPartner?.name || '@partner',
                    userAvatar: 'https://i.pravatar.cc/150?u=' + (item.foodPartner?._id || 'default'),
                    description: item.description,
                    partnerId: item.foodPartner?._id,
                    storeLink: '#'
                }));

                // If only 1 video, repeat it so scrolling works
                if (formattedVideos.length === 1) {
                    formattedVideos = [
                        ...formattedVideos,
                        { ...formattedVideos[0], id: formattedVideos[0].id + '_copy1' },
                        { ...formattedVideos[0], id: formattedVideos[0].id + '_copy2' }
                    ];
                }

                setVideos(formattedVideos);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching videos:", err);
                setError("Failed to load videos. Please try again later.");
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) return <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading videos...</div>;
    if (error) return <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>{error}</div>;

    return (
        <div className="reels-container">
            {videos.map((video) => (
                <VideoCard 
                    key={video.id}
                    {...video}
                />
            ))}
        </div>
    );
};

export default VideoFeed;
