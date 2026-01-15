import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';

const CreateFood = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        validateAndSetFile(file);
    };

    const validateAndSetFile = (file) => {
        if (!file) return;
        
        if (!file.type.startsWith('video/')) {
            setError('Please upload a video file (MP4, WebM, etc.)');
            return;
        }

        // Limit file size if needed (e.g. 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('File size too large (Max 50MB)');
            return;
        }

        setError(''); // Clear errors
        setVideoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeFile = () => {
        setVideoFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const name = e.target.name.value;
        const description = e.target.description.value;
        const price = e.target.price.value;

        if (!name || !description || !price || !videoFile) {
            setError('Please include all fields and upload a video');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('video', videoFile);

        try {
            const response = await axios.post('http://localhost:3000/api/food', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201 || response.status === 200) {
                navigate('/foodpartner/dashboard');
            }
        } catch (err) {
            console.error('Error creating food:', err);
            const msg = err.response?.data?.message || 'Failed to upload food item';
            if (msg.toLowerCase().includes('partner not found') || err.response?.status === 401) {
                setError('Authentication failed. Please Login as a Food Partner again to upload.');
            } else {
                setError(msg);
            }
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>Add New Item</h2>
                <p>Upload a video to showcase your food</p>
            </div>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Food Name</label>
                    <input 
                        name="name"
                        type="text" 
                        placeholder="Spicy Ramen" 
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input 
                        name="price"
                        type="number" 
                        placeholder="299" 
                        min="0"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Video Upload</label>
                    {!videoFile ? (
                        <div 
                            className={`drop-zone ${isDragging ? 'active' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <span className="upload-icon">📹</span>
                            <span className="upload-text">Drag & Drop or Click to Upload Video</span>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileSelect} 
                                accept="video/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className="file-preview">
                            <video src={previewUrl} controls className="preview-video" />
                            <button type="button" className="remove-file-btn" onClick={removeFile}>
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        name="description"
                        placeholder="Delicious Spicy Ramen..." 
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            minHeight: '100px',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Publish Item'}
                </button>
            </form>
            
             <div className="auth-footer">
                <button 
                    onClick={() => navigate('/foodpartner/dashboard')}
                    style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    &larr; Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default CreateFood;
