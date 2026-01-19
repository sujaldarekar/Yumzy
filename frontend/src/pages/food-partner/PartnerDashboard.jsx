import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/PartnerDashboard.css';

const PartnerDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [myFood, setMyFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [ordersRes, foodRes] = await Promise.all([
                api.get('/api/orders/partner/all'),
                api.get('/api/food/my-food')
            ]);
            setOrders(ordersRes.data.orders);
            setMyFood(foodRes.data.foodItems);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        const loadInitialData = async () => {
            if (isMounted) await fetchData();
        };

        loadInitialData();
        
        // Refresh every minute
        const interval = setInterval(() => {
            if (isMounted) fetchData();
        }, 60000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchData]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/api/orders/${orderId}/status`, 
                { status: newStatus }
            );
            // Update local state
            setOrders(prev => prev.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/ /g, '-');
    };

    if (loading) return <div className="partner-dashboard"><div className="loading">Loading dashboard...</div></div>;

    return (
        <div className="partner-dashboard">
            <header className="dashboard-header">
            <div className="header-brand">
                <img src="/logo/yumzy.png" alt="Yumzy Logo" className="dashboard-logo" />
                <div className="header-info">
                    <h1>Partner Dashboard</h1>
                    <p className="partner-stats">{myFood.length} Videos Uploaded • {orders.length} Active Orders</p>
                </div>
            </div>
                <button 
                    className="add-food-btn"
                    onClick={() => navigate('/create-food')}
                >
                    + Add New Food Item
                </button>
            </header>

            <div className="dashboard-content">
                <section className="dashboard-section">
                    <h2>Active Orders</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <p>No orders found yet. Keep up the great work!</p>
                        </div>
                    ) : (
                        <div className="orders-grid">
                            {orders.map(order => (
                                <div key={order._id} className={`order-card ${getStatusClass(order.status)}`}>
                                    <div className="order-id">Order ID: #{order._id.slice(-6).toUpperCase()}</div>
                                    
                                    <div className="customer-info">
                                        <h3>{order.user?.fullName}</h3>
                                        <p>{order.user?.email}</p>
                                    </div>

                                    <div className="order-item">
                                        <div className="video-preview-small">
                                            <video src={order.foodItem?.video} muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                        </div>
                                        <div className="item-details">
                                            <h4>{order.foodItem?.name}</h4>
                                            <p>Qty: {order.quantity} • ₹{order.totalAmount}</p>
                                        </div>
                                    </div>

                                    <div className="order-address">
                                        <strong>Delivery Address:</strong>
                                        <p>{order.address.street}, {order.address.city}</p>
                                    </div>

                                    <div className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </div>

                                    <div className="status-actions">
                                        <button 
                                            className="action-btn confirm"
                                            disabled={order.status !== 'Pending'}
                                            onClick={() => handleStatusUpdate(order._id, 'Confirmed')}
                                        >
                                            Confirm
                                        </button>
                                        <button 
                                            className="action-btn prepare"
                                            disabled={order.status !== 'Confirmed'}
                                            onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                                        >
                                            Prepare
                                        </button>
                                        <button 
                                            className="action-btn deliver"
                                            disabled={order.status !== 'Preparing'}
                                            onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}
                                        >
                                            Dispatch
                                        </button>
                                        <button 
                                            className="action-btn complete"
                                            disabled={order.status !== 'Out for Delivery'}
                                            onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-section video-gallery-section">
                    <div className="section-header">
                        <h2>My Uploaded Videos</h2>
                        <button 
                            className="add-video-mini-btn"
                            onClick={() => navigate('/create-food')}
                            title="Upload New Video"
                        >
                            + Upload
                        </button>
                    </div>
                    {myFood.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't uploaded any videos yet.</p>
                            <button onClick={() => navigate('/create-food')}>Upload First Movie</button>
                        </div>
                    ) : (
                        <div className="video-gallery">
                            {myFood.map(item => (
                                <div key={item._id} className="video-card-mini">
                                    <div className="video-preview-wrapper">
                                        <video 
                                            src={item.video} 
                                            muted 
                                            loop 
                                            onMouseOver={e => e.target.play()} 
                                            onMouseOut={e => e.target.pause()}
                                            onClick={() => navigate(`/store/${item.foodPartner}`)}
                                        />
                                        <div className="video-overlay-mini">
                                            <span className="price-tag-mini">₹{item.price}</span>
                                        </div>
                                    </div>
                                    <div className="video-info-mini">
                                        <h4>{item.name}</h4>
                                        <p className="description-mini">{item.description?.slice(0, 50)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default PartnerDashboard;
