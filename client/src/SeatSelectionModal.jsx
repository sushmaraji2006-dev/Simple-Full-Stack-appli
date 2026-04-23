import { useEffect, useMemo, useState } from 'react';

const defaultSeatLayout = [
  [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'available' },
    null,
    { id: 'A3', status: 'booked' },
  ],
  [
    { id: 'B1', status: 'available' },
    { id: 'B2', status: 'booked' },
    null,
    { id: 'B3', status: 'available' },
  ],
  [
    { id: 'C1', status: 'available' },
    { id: 'C2', status: 'available' },
    null,
    { id: 'C3', status: 'available' },
  ],
  [
    { id: 'D1', status: 'booked' },
    { id: 'D2', status: 'available' },
    null,
    { id: 'D3', status: 'available' },
  ],
];

function SeatSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  seatLayout = defaultSeatLayout,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeats([]);
    }
  }, [isOpen]);

  const availableSeatCount = useMemo(
    () =>
      seatLayout.flat().filter((seat) => seat && seat.status === 'available')
        .length,
    [seatLayout],
  );

  const toggleSeatSelection = (seat) => {
    if (!seat || seat.status === 'booked') {
      return;
    }

    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seat.id)
        ? currentSeats.filter((seatId) => seatId !== seat.id)
        : [...currentSeats, seat.id],
    );
  };

  const handleConfirm = () => {
    onConfirm?.(selectedSeats);
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="seat-modal-overlay" onClick={onClose}>
      <div
        className="seat-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-modal-title"
      >
        <button
          type="button"
          className="seat-modal-close"
          onClick={onClose}
          aria-label="Close seat selection"
        >
          x
        </button>

        <p className="seat-modal-kicker">Bus Ticket Booking</p>
        <h2 id="seat-modal-title">Choose Your Seats</h2>
        <p className="seat-modal-subtitle">
          Tap seats to select or deselect them before confirming your booking.
        </p>

        <div className="seat-modal-board">
          <div className="seat-modal-screen">Driver</div>
          <div className="seat-grid" aria-label="Bus seat layout">
            {seatLayout.map((row, rowIndex) => (
              <div className="seat-row" key={`row-${rowIndex}`}>
                {row.map((seat, seatIndex) => {
                  if (!seat) {
                    return (
                      <div
                        className="seat-gap"
                        key={`gap-${rowIndex}-${seatIndex}`}
                        aria-hidden="true"
                      />
                    );
                  }

                  const isSelected = selectedSeats.includes(seat.id);
                  const seatClassName = [
                    'seat',
                    `seat-${seat.status}`,
                    isSelected ? 'seat-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      className={seatClassName}
                      onClick={() => toggleSeatSelection(seat)}
                      disabled={seat.status === 'booked'}
                      aria-pressed={isSelected}
                      aria-label={
                        seat.status === 'booked'
                          ? `Seat ${seat.id} is booked`
                          : `Seat ${seat.id} ${
                              isSelected ? 'selected' : 'available'
                            }`
                      }
                    >
                      <span className="seat-label">
                        {seat.status === 'booked' ? 'X' : seat.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="seat-modal-footer">
          <div className="seat-selection-summary">
            <p className="seat-count">{selectedSeats.length} seat(s) selected</p>
            <p className="seat-help">
              {availableSeatCount} seats available for this trip
            </p>
          </div>

          <div className="seat-legend" aria-label="Seat status legend">
            <span>
              <i className="legend-swatch legend-available" />
              Available
            </span>
            <span>
              <i className="legend-swatch legend-selected" />
              Selected
            </span>
            <span>
              <i className="legend-swatch legend-booked" />
              Booked
            </span>
          </div>

          <div className="seat-modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionModal;
