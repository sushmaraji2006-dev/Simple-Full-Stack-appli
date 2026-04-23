import { useEffect, useRef, useState } from 'react';
import './OTPVerification.css';

const OTP_LENGTH = 4;
const DEMO_OTP = '1234';

const OTPVerification = ({ selectedSeats = [], onSuccess, onCancel }) => {
  const [otp, setOtp] = useState(() => Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [activeIndex, setActiveIndex] = useState(0);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const canResend = countdown === 0;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!success) {
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
    }
  }, [success]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleInputChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '');

    if (!sanitizedValue) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (error) {
        setError('');
      }
      return;
    }

    const nextOtp = [...otp];
    sanitizedValue
      .slice(0, OTP_LENGTH - index)
      .split('')
      .forEach((digit, offset) => {
        nextOtp[index + offset] = digit;
      });

    const nextIndex = Math.min(index + sanitizedValue.length, OTP_LENGTH - 1);
    setOtp(nextOtp);
    focusInput(nextIndex);

    if (error) {
      setError('');
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    const newOtp = Array(OTP_LENGTH).fill('');
    pastedValue.split('').forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    focusInput(Math.min(pastedValue.length, OTP_LENGTH) - 1);

    if (error) {
      setError('');
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        return;
      }

      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        focusInput(index - 1);
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === DEMO_OTP) {
      const verifiedUser = {
        email: 'demo@example.com',
        verified: true,
        verifiedAt: new Date().toISOString(),
        seats: selectedSeats,
      };

      localStorage.setItem(
        'user',
        JSON.stringify(verifiedUser),
      );
      setVerifiedUser(verifiedUser);
      setSuccess(true);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setSuccess(false);
    setVerifiedUser(null);
  };

  if (success) {
    return (
      <div className="otp-container otp-overlay">
        <div className="otp-card otp-success-card">
          <p className="otp-badge">Bus Ticket Booking</p>
          <h2>Verification Successful!</h2>
          <p className="otp-message">
            Your booking has been verified and saved in localStorage.
          </p>
          <div className="success-panel">
            <p className="success-title">Seats Confirmed</p>
            <p className="success-copy">
              {selectedSeats.length > 0
                ? `Confirmed seats: ${selectedSeats.join(', ')}`
                : 'Your selected seats are ready for travel.'}
            </p>
          </div>
          <button
            type="button"
            className="verify-btn"
            onClick={() => {
              onSuccess?.(verifiedUser);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-container otp-overlay">
      <div className="otp-card">
        <p className="otp-badge">Bus Ticket Booking</p>
        <h2>Verify OTP</h2>
        <p className="otp-message">OTP sent to your email</p>
        <p className="demo-otp">Demo OTP: {DEMO_OTP}</p>
        {selectedSeats.length > 0 ? (
          <div className="otp-seat-summary">
            <p className="otp-seat-label">Seats waiting for confirmation</p>
            <p className="otp-seat-value">{selectedSeats.join(', ')}</p>
          </div>
        ) : null}

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={() => setActiveIndex(index)}
              maxLength="1"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`OTP digit ${index + 1}`}
              className={`otp-input ${activeIndex === index ? 'otp-input-active' : ''} ${
                digit ? 'otp-input-filled' : ''
              }`}
            />
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          type="button"
          className="verify-btn"
          onClick={handleVerify}
          disabled={otp.some((digit) => digit === '')}
        >
          Verify OTP
        </button>

        <div className="resend-section">
          {canResend ? (
            <div className="otp-secondary-actions">
              <button
                type="button"
                className="secondary-btn resend-btn"
                onClick={onCancel}
              >
                Back
              </button>
              <button type="button" className="resend-btn" onClick={handleResend}>
                Resend OTP
              </button>
            </div>
          ) : (
            <>
              <p className="countdown">Resend OTP in {countdown}s</p>
              <div className="otp-secondary-actions">
                <button
                  type="button"
                  className="secondary-btn resend-btn"
                  onClick={onCancel}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
