import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import '../../styles/auth.css'

function FoodPartnerRegister() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formData = {
      name: e.target.name.value,
      contactName: e.target.contactName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      password: e.target.password.value
    }

    try {
      const response = await api.post('/api/auth/food-partner/register', formData)

      if (response.status === 201) {
        console.log('Partner registration successful:', response.data)
        // Save token to localStorage for header-based auth
        if (response.data.token) {
          localStorage.setItem('partnerToken', response.data.token)
          localStorage.removeItem('userToken') // Clear user token if switching accounts
        }
        navigate('/foodpartner/dashboard')
      }
    } catch (err) {
      console.error('Partner registration error:', err)
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo/yumzy.png" alt="Yumzy Logo" className="brand-logo" />
        <h2>Partner Signup</h2>
        <p>Start your journey as a partner</p>
      </div>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Business Name</label>
          <input 
            name="name"
            type="text" 
            placeholder="Gourmet Kitchen" 
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Name</label>
          <input 
            name="contactName"
            type="text" 
            placeholder="John Doe" 
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            name="phone"
            type="tel" 
            placeholder="+91 00000 00000" 
            required
          />
        </div>
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
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="auth-button">Create Partner Account</button>
      </form>
      <div className="auth-footer">
        Already a partner? <Link to="/foodpartner/login">Log in here</Link>
      </div>
      <div className="auth-footer" style={{marginTop: '0.5rem'}}>
        Not a business? <Link to="/register">Register as User</Link>
      </div>
    </div>
  )
}

export default FoodPartnerRegister
