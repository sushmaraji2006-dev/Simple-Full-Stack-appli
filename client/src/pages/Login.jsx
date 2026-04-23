import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Bus, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Save email to localStorage
      localStorage.setItem('userEmail', formData.email);
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div 
      className="login-container" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.8)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '1rem'
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          borderRadius: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '3.5rem', 
            height: '3.5rem', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
          }}>
            <Bus size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Book your next journey with us.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <div className="error-message">
                <AlertCircle size={14} /> {errors.email}
              </div>
            )}
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="link" onClick={(e) => { e.preventDefault(); alert("Forgot Password Flow")}}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={14} /> {errors.password}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Login <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="link" style={{ fontWeight: '600' }}>
              Go to Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
