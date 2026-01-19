import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../api/axios';
import 'leaflet/dist/leaflet.css';
import '../../styles/OrderTracking.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      setOrder(response.data.order);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
      setLoading(false);
    }
  }, [orderId]);

  const handleConfirmReceipt = async () => {
    try {
      await api.patch(`/api/orders/${orderId}/confirm-receipt`, {});
      // Redirect to home/reels after confirmation
      navigate('/');
    } catch (err) {
      console.error('Error confirming receipt:', err);
      alert('Failed to confirm receipt. Please try again.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
        if (isMounted) fetchOrder();
    };

    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
        if (isMounted) fetchOrder();
    }, 30000);

    return () => {
        isMounted = false;
        clearInterval(interval);
    };
  }, [fetchOrder]);

  // Delivery Simulation Logic
  useEffect(() => {
    if (!order) return;

    if (order.status?.toLowerCase() !== 'out for delivery') {
        const targetPos = (order.status?.toLowerCase() === 'delivered') 
            ? { lat: (order.foodPartner?.location?.lat || 19.0760) + 0.01, lng: (order.foodPartner?.location?.lng || 72.8777) + 0.01 }
            : (order.foodPartner?.location || { lat: 19.0760, lng: 72.8777 });
        
        // Wrap in setTimeout to avoid synchronous setState in effect warning
        setTimeout(() => {
            setRiderLocation(prev => {
                if (!prev || prev.lat !== targetPos.lat || prev.lng !== targetPos.lng) {
                    return targetPos;
                }
                return prev;
            });
        }, 0);
        return;
    }

    const startLoc = order.foodPartner?.location || { lat: 19.0760, lng: 72.8777 };
    const endLoc = { lat: startLoc.lat + 0.01, lng: startLoc.lng + 0.01 };
    
    // Initial position if not set
    setTimeout(() => {
        setRiderLocation(prev => prev || startLoc);
    }, 0);

    const duration = 120000; // 2 minutes for simulation
    const startTime = Date.now();

    const moveRider = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentLat = startLoc.lat + (endLoc.lat - startLoc.lat) * progress;
        const currentLng = startLoc.lng + (endLoc.lng - startLoc.lng) * progress;

        const nextPos = { lat: currentLat, lng: currentLng };
        
        setRiderLocation(prev => {
            // Only update if difference is meaningful to reduce re-renders
            if (!prev || Math.abs(prev.lat - nextPos.lat) > 0.0001 || Math.abs(prev.lng - nextPos.lng) > 0.0001) {
                return nextPos;
            }
            return prev;
        });

        if (progress >= 1) clearInterval(moveRider);
    }, 1000);

    return () => clearInterval(moveRider);
  }, [order]); // Removed riderLocation from dependencies to avoid infinite loop

  const getStatusProgress = useCallback((status) => {
    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(status);
    return ((currentIndex + 1) / statuses.length) * 100;
  }, []);

  const getStatusColor = useCallback((status) => {
    if (!status) return '#757575';
    switch (status.toLowerCase()) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'preparing': return '#9c27b0';
      case 'out for delivery': return '#ff5722';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  }, []);

  const formatDeliveryTime = (estimatedTime) => {
    if (!estimatedTime) return 'Calculating...';
    
    const deliveryDate = new Date(estimatedTime);
    const now = new Date();
    const diffMs = deliveryDate - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) return 'Arriving soon!';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  // Create custom icon for food partner
  const createRiderIcon = () => {
    return L.divIcon({
      className: 'rider-icon',
      html: `<div class="rider-marker">🛵</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  const createCustomIcon = (logoUrl) => {
    if (logoUrl) {
      return L.icon({
        iconUrl: logoUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
      });
    }
    return new L.Icon.Default();
  };

  if (loading) {
    return <div className="tracking-loading">Loading order tracking...</div>;
  }

  if (error || !order) {
    return (
      <div className="tracking-error">
        <p>{error || 'Order not found'}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  // Default location (partner location or fallback)
  const partnerLocation = order.foodPartner?.location || { lat: 19.0760, lng: 72.8777 }; // Mumbai default
  const userLocation = { lat: partnerLocation.lat + 0.01, lng: partnerLocation.lng + 0.01 }; // Simulated user location

  return (
    <div className="order-tracking-page">
      <div className="tracking-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <img src="/logo/yumzy.png" alt="Yumzy" className="order-logo" />
        <h1 className="tracking-title">Track Your Order</h1>
        


        {/* Order Status */}
        <div className="status-section">
          <div className="status-header">
            <h2 style={{ color: getStatusColor(order.status) }}>{order.status}</h2>
            <p className="delivery-time">
              {order.status === 'Delivered' ? 'Delivered!' : `Estimated: ${formatDeliveryTime(order.estimatedDeliveryTime)}`}
            </p>
          </div>

          <div className="status-progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${getStatusProgress(order.status)}%`,
                backgroundColor: getStatusColor(order.status)
              }}
            />
          </div>


          {/* Moved Button outside to ensure it's not hidden by status-section overflow */}
          {order.status && !['pending', 'confirmed', 'preparing'].includes(order.status.trim().toLowerCase()) && (
            <div className="receipt-confirmation" style={{ position: 'relative', zIndex: 1000 }}>
              <button className="confirm-received-btn" onClick={handleConfirmReceipt}>
                ✅ Order Received - Click to Finish
              </button>
              <p className="confirmation-hint">Enjoy your meal! This will close tracking and return to reels.</p>
            </div>
          )}

          <div className="status-steps">
            {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map(status => (
              <div 
                key={status} 
                className={`status-step ${order.status?.trim().toLowerCase() === status.toLowerCase() ? 'active' : ''}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h3>Live Location</h3>
          <MapContainer 
            center={[partnerLocation.lat, partnerLocation.lng]} 
            zoom={13} 
            className="order-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            
            {/* Food Partner Marker */}
            <Marker 
              position={[partnerLocation.lat, partnerLocation.lng]}
              icon={order.foodPartner?.logo ? createCustomIcon(order.foodPartner.logo) : new L.Icon.Default()}
            >
              <Popup>
                <div className="marker-popup">
                  <strong>{order.foodPartner?.name || 'Food Partner'}</strong>
                  <p>{partnerLocation.address || 'Restaurant Location'}</p>
                </div>
              </Popup>
            </Marker>

            {/* User Delivery Location Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="marker-popup">
                  <strong>Delivery Address</strong>
                  <p>{order.address.street}, {order.address.city}</p>
                  <p>{order.address.state} - {order.address.pincode}</p>
                </div>
              </Popup>
            </Marker>

            {/* Live Rider Marker */}
            {riderLocation && (
              <Marker 
                position={[riderLocation.lat, riderLocation.lng]} 
                icon={createRiderIcon()}
              >
                <Popup>
                  <div className="marker-popup">
                    <strong>Delivery Partner</strong>
                    <p>{order.status === 'Out for Delivery' ? 'Moving towards you...' : 'Waiting at restaurant'}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <h3>Order Details</h3>
          
          <div className="detail-row">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">#{order._id.slice(-8).toUpperCase()}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Food Item:</span>
            <span className="detail-value">{order.foodItem?.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{order.quantity}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">₹{order.totalAmount.toFixed(2)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Payment:</span>
            <span className="detail-value">{order.paymentOption}</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="detail-row discount">
              <span className="detail-label">Discount Applied:</span>
              <span className="detail-value">₹{order.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Restaurant:</span>
            <span className="detail-value">{order.foodPartner?.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{order.foodPartner?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
