import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bus,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ChevronLeft,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

/* ─── static OTP (simulation) ─── */
const STATIC_OTP = '1234';

/* ─── tiny helper ─── */
const Field = ({ id, label, placeholder, type = 'text', icon, error, suffix, ...rest }) => (
  <div className="input-group">
    <label className="input-label" htmlFor={id}>{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', top: '50%', left: '1rem',
        transform: 'translateY(-50%)', color: 'var(--text-muted)',
        display: 'flex', alignItems: 'center', pointerEvents: 'none',
      }}>{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`input-field${error ? ' input-error' : ''}`}
        style={{ paddingRight: suffix ? '3rem' : undefined }}
        {...rest}
      />
      {suffix && (
        <span style={{
          position: 'absolute', top: '50%', right: '1rem',
          transform: 'translateY(-50%)', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
        }}>
          {suffix}
        </span>
      )}
    </div>
    {error && (
      <div className="error-message">
        <AlertCircle size={14} /> {error}
      </div>
    )}
  </div>
);

/* ═══════════════════════════════════════════
   VIEW 1 — Signup
═══════════════════════════════════════════ */
const SignupView = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;
    localStorage.setItem('userEmail', form.email);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1800);
  };

  return (
    <div style={viewStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <BusIcon />
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join BusGo and travel smarter.</p>
      </div>

      {success ? (
        <div style={successBoxStyle}>
          <CheckCircle2 size={40} color="#22c55e" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>Account Created!</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Redirecting to login…
          </p>
        </div>
      ) : (
        <form onSubmit={handleRegister} noValidate>
          <Field
            id="name" name="name" label="Full Name"
            placeholder="Enter your name"
            icon={<User size={18} />} error={errors.name}
            value={form.name} onChange={change}
          />
          <Field
            id="su-email" name="email" label="Email" type="email"
            placeholder="Enter your email"
            icon={<Mail size={18} />} error={errors.email}
            value={form.email} onChange={change}
          />
          <Field
            id="su-password" name="password" label="Password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            icon={<Lock size={18} />} error={errors.password}
            value={form.password} onChange={change}
            suffix={
              <span onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            }
          />

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Register <ArrowRight size={18} />
          </button>
        </form>
      )}

      {!success && (
        <div style={footerLinksStyle}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="link" style={{ fontWeight: 600 }}>Login</Link>
          </p>
          <button className="btn btn-ghost" style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }}
            onClick={() => onSwitch('forgot')}>
            Forgot Password?
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   VIEW 2 — Forgot Password (Email entry)
═══════════════════════════════════════════ */
const ForgotView = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const validate = () => {
    if (!email.trim()) { setError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email address'); return false; }
    setError('');
    return true;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSwitch('otp', email);
    }, 1200);
  };

  return (
    <div style={viewStyle}>
      <button style={backBtnStyle} onClick={() => onSwitch('signup')}>
        <ChevronLeft size={18} /> Back to Signup
      </button>

      <div style={headerStyle}>
        <div style={{ ...busIconStyle, background: '#7c3aed', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
          <KeyRound size={26} color="#fff" />
        </div>
        <h2 style={titleStyle}>Forgot Password</h2>
        <p style={subtitleStyle}>Enter your email and we'll send an OTP.</p>
      </div>

      <form onSubmit={handleSend} noValidate>
        <Field
          id="fp-email" label="Registered Email" type="email"
          placeholder="Enter your email"
          icon={<Mail size={18} />} error={error}
          value={email}
          onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: '1.25rem', background: sending ? '#7c3aed' : undefined,
                   boxShadow: sending ? '0 4px 6px -1px rgba(124,58,237,0.4)' : undefined }}
          disabled={sending}
        >
          {sending
            ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
            : <><Mail size={18} /> Send OTP</>}
        </button>
      </form>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem' }}>
        A one-time password will be sent to your inbox.
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════
   VIEW 3 — OTP Verify
═══════════════════════════════════════════ */
const OTPView = ({ email, onSwitch }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp.trim()) { setError('Please enter the OTP'); return; }
    if (otp !== STATIC_OTP) { setError('Invalid OTP. Try 1234 for this demo.'); return; }
    setError('');
    setVerified(true);
    setTimeout(() => navigate('/login'), 1800);
  };

  const handleResend = () => {
    setOtp('');
    setError('');
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  return (
    <div style={viewStyle}>
      <button style={backBtnStyle} onClick={() => onSwitch('forgot')}>
        <ChevronLeft size={18} /> Change Email
      </button>

      <div style={headerStyle}>
        <div style={{ ...busIconStyle, background: '#059669', boxShadow: '0 0 20px rgba(5,150,105,0.5)' }}>
          <ShieldCheck size={26} color="#fff" />
        </div>
        <h2 style={titleStyle}>Verify OTP</h2>
        <p style={subtitleStyle}>
          Code sent to <strong style={{ color: '#f59e0b' }}>{email}</strong>
        </p>
      </div>

      {/* Demo hint */}
      <div style={otpHintStyle}>
        <span style={{ fontSize: '1.25rem' }}>🔑</span>
        <p style={{ fontSize: '0.8125rem' }}>
          Demo OTP: <strong style={{ color: '#f59e0b', letterSpacing: '0.2em' }}>1234</strong>
        </p>
      </div>

      {verified ? (
        <div style={successBoxStyle}>
          <CheckCircle2 size={40} color="#22c55e" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>OTP Verified!</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Redirecting to login…
          </p>
        </div>
      ) : (
        <form onSubmit={handleVerify} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="otp-input">Enter OTP</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', top: '50%', left: '1rem',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', pointerEvents: 'none',
              }}>
                <KeyRound size={18} />
              </span>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                placeholder="Enter 4-digit OTP"
                className={`input-field${error ? ' input-error' : ''}`}
                value={otp}
                onChange={e => { setOtp(e.target.value); if (error) setError(''); }}
                style={{ letterSpacing: '0.3em', fontWeight: 700, fontSize: '1.25rem' }}
              />
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '1.25rem', background: '#059669', boxShadow: '0 4px 6px -1px rgba(5,150,105,0.4)' }}
          >
            <ShieldCheck size={18} /> Verify OTP
          </button>
        </form>
      )}

      {!verified && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          {resent
            ? <p style={{ color: '#22c55e', fontSize: '0.825rem' }}>✓ OTP resent successfully!</p>
            : <button className="btn btn-ghost" style={{ fontSize: '0.8125rem' }} onClick={handleResend}>
                <RefreshCw size={14} /> Resend OTP
              </button>
          }
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════ */
const Signup = () => {
  const [view, setView] = useState('signup'); // 'signup' | 'forgot' | 'otp'
  const [fpEmail, setFpEmail] = useState('');

  const handleSwitch = (target, email = '') => {
    if (email) setFpEmail(email);
    setView(target);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.88)),
                     url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '1.5rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '1.125rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Slide wrapper */}
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: view === 'signup'
              ? 'translateX(0%)'
              : view === 'forgot'
              ? 'translateX(-100%)'
              : 'translateX(-200%)',
            width: '300%',
          }}
        >
          {/* Slot 1: Signup */}
          <div style={{ width: '33.333%', flexShrink: 0 }}>
            <SignupView onSwitch={handleSwitch} />
          </div>

          {/* Slot 2: Forgot Password */}
          <div style={{ width: '33.333%', flexShrink: 0 }}>
            <ForgotView onSwitch={handleSwitch} />
          </div>

          {/* Slot 3: OTP */}
          <div style={{ width: '33.333%', flexShrink: 0 }}>
            <OTPView email={fpEmail} onSwitch={handleSwitch} />
          </div>
        </div>

        {/* Step indicator dots */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.5rem',
          paddingBottom: '1.5rem',
        }}>
          {['signup', 'forgot', 'otp'].map((v) => (
            <div key={v} style={{
              width: view === v ? '1.5rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '99px',
              background: view === v ? '#f59e0b' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

/* ─── shared style tokens ─── */
const viewStyle = { padding: '2.5rem 2.5rem 1rem' };

const headerStyle = { textAlign: 'center', marginBottom: '2rem' };

const titleStyle = { fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.4rem', color: '#f9fafb' };

const subtitleStyle = { color: '#9ca3af', fontSize: '0.925rem' };

const busIconStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '3.5rem', height: '3.5rem', borderRadius: '50%',
  background: '#f59e0b', marginBottom: '1rem',
  boxShadow: '0 0 20px rgba(245,158,11,0.5)',
};

const BusIcon = () => (
  <div style={busIconStyle}>
    <Bus size={26} color="#fff" />
  </div>
);

const backBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '0.25rem',
  background: 'transparent', border: 'none', color: '#9ca3af',
  cursor: 'pointer', fontSize: '0.8125rem', marginBottom: '1.25rem',
  padding: 0, fontFamily: "'Inter', sans-serif",
  transition: 'color 0.2s',
};

const footerLinksStyle = { textAlign: 'center', marginTop: '1.5rem' };

const otpHintStyle = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
  borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.25rem',
  color: '#d1d5db',
};

const successBoxStyle = {
  textAlign: 'center', padding: '2rem 0',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  animation: 'fadeIn 0.4s ease',
};

export default Signup;
