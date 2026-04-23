import { useState } from 'react';
import SeatSelectionModal from './SeatSelectionModal';
import OTPVerification from './OTPVerification';
import './App.css';

function App() {
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isOtpStepOpen, setIsOtpStepOpen] = useState(false);
  const [pendingSeats, setPendingSeats] = useState([]);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  const handleSeatConfirmationRequest = (seats) => {
    setPendingSeats(seats);
    setIsSeatModalOpen(false);
    setIsOtpStepOpen(true);
  };

  const handleOtpSuccess = () => {
    setConfirmedSeats(pendingSeats);
    setPendingSeats([]);
    setIsOtpStepOpen(false);
  };

  const handleOtpCancel = () => {
    setIsOtpStepOpen(false);
    setPendingSeats([]);
  };

  const latestBooking =
    confirmedSeats.length > 0 ? confirmedSeats.join(', ') : 'No seats confirmed yet';

  const pendingBooking =
    pendingSeats.length > 0 ? pendingSeats.join(', ') : 'Select seats to continue';

  return (
    <>
      <main className="app-shell">
        <section className="booking-card">
          <p className="booking-kicker">Travel Comfort</p>
          <h1>Reserve your preferred bus seats</h1>
          <p className="booking-copy">
            Choose your seats first. When you confirm them, an OTP screen will
            appear to verify the booking before it is finalized.
          </p>

          <div className="booking-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => setIsSeatModalOpen(true)}
            >
              Open Seat Selection
            </button>
          </div>

          <div className="booking-summary">
            <p className="summary-label">Latest booking</p>
            <p className="summary-value">{latestBooking}</p>
          </div>

          <div className="booking-summary pending-summary">
            <p className="summary-label">Next OTP check</p>
            <p className="summary-value">{pendingBooking}</p>
          </div>
        </section>
      </main>

      <SeatSelectionModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        onConfirm={handleSeatConfirmationRequest}
      />

      {isOtpStepOpen ? (
        <OTPVerification
          selectedSeats={pendingSeats}
          onSuccess={handleOtpSuccess}
          onCancel={handleOtpCancel}
        />
      ) : null}
    </>
  );
}

export default App;
