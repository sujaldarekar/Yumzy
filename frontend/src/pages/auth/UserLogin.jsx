import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import '../../styles/auth.css'

function UserLogin() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const response = await api.post('/api/auth/user/login', { email, password })

      if (response.status === 200) {
        console.log('Login successful:', response.data)
        // Explicitly logging response.data as requested
        console.log(response.data)
        navigate('/user/home')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo/yumzy.png" alt="Yumzy Logo" className="brand-logo" />
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
      </div>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            name="email"
            type="email" 
            placeholder="name@example.com" 
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
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <div className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </div>
      <div className="auth-footer" style={{marginTop: '0.5rem'}}>
        Are you a partner? <Link to="/foodpartner/register">Register Business</Link>
      </div>
    </div>
  )
}

export default UserLogin
