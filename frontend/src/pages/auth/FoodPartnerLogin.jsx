import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import '../../styles/auth.css'

function FoodPartnerLogin() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const response = await api.post('/api/auth/food-partner/login', { email, password })

      if (response.status === 200) {
        console.log('Partner login successful:', response.data)
        // Explicitly logging response.data as requested
        console.log(response.data)
        navigate('/foodpartner/dashboard')
      }
    } catch (err) {
      console.error('Partner login error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Login failed'
      setError(errorMsg)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo/yumzy.png" alt="Yumzy Logo" className="brand-logo" />
        <h2>Partner Login</h2>
        <p>Access your dashboard</p>
      </div>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Business Email</label>
          <input 
            name="email"
            type="email" 
            placeholder="partner@example.com" 
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            name="password"
            type="password" 
            placeholder="••••••••" 
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="auth-button">Partner Sign In</button>
      </form>
      <div className="auth-footer">
        Interested in joining? <Link to="/register">Register Business</Link>
      </div>
      <div className="auth-footer" style={{marginTop: '0.5rem'}}>
        Just a hungry user? <Link to="/user/login">Login as User</Link>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
