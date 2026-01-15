import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/auth.css'

function ChooseRegistration() {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo/yumzy.png" alt="Yumzy Logo" className="brand-logo" />
        <h2>Join Yumzy</h2>
        <p>Choose how you want to use the platform</p>
      </div>
      
      <div className="choice-grid" style={{
        display: 'grid',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div 
          className="choice-card"
          onClick={() => navigate('/user/register')}
          style={{
            padding: '1.5rem',
            border: '2px solid var(--border-color, #eee)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'var(--card-bg, #fff)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-color, #007bff)'
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color, #eee)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😋</div>
          <h3>I'm a Customer</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Order delicious food and explore local kitchens.</p>
        </div>

        <div 
          className="choice-card"
          onClick={() => navigate('/foodpartner/register')}
          style={{
            padding: '1.5rem',
            border: '2px solid var(--border-color, #eee)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'var(--card-bg, #fff)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-color, #28a745)'
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color, #eee)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍳</div>
          <h3>I'm a Food Partner</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Grow your business and reach more hungry customers.</p>
        </div>
      </div>

      <div className="auth-footer" style={{ marginTop: '2rem' }}>
        Already have an account? <a href="/user/login">Login here</a>
      </div>
    </div>
  )
}

export default ChooseRegistration
