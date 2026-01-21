import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import '../../styles/auth.css'

function UserRegister() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const firstName = e.target.firstName.value
    const lastName = e.target.lastName.value
    const email = e.target.email.value
    const password = e.target.password.value

    const fullName = `${firstName} ${lastName}`

    try {
      const response = await api.post('/api/auth/user/register', { 
        fullName, 
        email, 
        password 
      })

      if (response.status === 201) {
        console.log('Registration successful:', response.data)
        // Save token to localStorage for header-based auth
        if (response.data.token) {
          localStorage.setItem('userToken', response.data.token)
          localStorage.removeItem('partnerToken') // Clear partner token if switching accounts
        }
        navigate('/user/home')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo/yumzy.png" alt="Yumzy Logo" className="brand-logo" />
        <h2>Create Account</h2>
        <p>Join the community</p>
      </div>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>First Name</label>
            <input 
              name="firstName"
              type="text" 
              placeholder="John" 
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input 
              name="lastName"
              type="text" 
              placeholder="Doe" 
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Email Address</label>
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
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/user/login">Login</Link>
      </div>
      <div className="auth-footer" style={{marginTop: '0.5rem'}}>
        Want to sell food? <Link to="/register">Become a Partner</Link>
      </div>
    </div>
  )
}

export default UserRegister
