import { useEffect, useMemo, useState } from 'react'
import heroImage from './assets/bus-hero.svg'
import './App.css'

const defaultBooking = {
  from: '',
  to: '',
  date: '',
  passengers: 1,
}

const buses = [
  {
    id: 1,
    name: 'Night Rider Express',
    company: 'BlueLine Travels',
    type: 'AC Sleeper',
    features: ['AC', 'Sleeper'],
    departure: '06:15',
    arrival: '12:45',
    duration: '6h 30m',
    price: 899,
  },
  {
    id: 2,
    name: 'City Cruiser',
    company: 'SkyRoute Bus Co.',
    type: 'Non-AC Seater',
    features: ['Non-AC'],
    departure: '09:30',
    arrival: '15:00',
    duration: '5h 30m',
    price: 540,
  },
  {
    id: 3,
    name: 'Sunrise Elite',
    company: 'Metro Connect',
    type: 'AC Seater',
    features: ['AC'],
    departure: '13:00',
    arrival: '19:20',
    duration: '6h 20m',
    price: 760,
  },
  {
    id: 4,
    name: 'Moonlight Comfort',
    company: 'Swift Wheels',
    type: 'Sleeper',
    features: ['Sleeper'],
    departure: '18:45',
    arrival: '01:00',
    duration: '6h 15m',
    price: 680,
  },
  {
    id: 5,
    name: 'RapidGo Deluxe',
    company: 'InterCity Transit',
    type: 'AC Seater',
    features: ['AC'],
    departure: '22:15',
    arrival: '04:30',
    duration: '6h 15m',
    price: 950,
  },
]

function App() {
  const [route, setRoute] = useState(() => window.location.pathname || '/')
  const [bookingData, setBookingData] = useState(
    () => window.history.state?.bookingData ?? defaultBooking,
  )

  useEffect(() => {
    const syncRoute = () => {
      setRoute(window.location.pathname || '/')
      setBookingData(window.history.state?.bookingData ?? defaultBooking)
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const navigate = (path, state = {}) => {
    window.history.pushState(state, '', path)
    setRoute(path)
    setBookingData(state.bookingData ?? defaultBooking)
  }

  if (route === '/results') {
    return (
      <ResultsPage
        bookingData={bookingData}
        onBack={() => navigate('/', { bookingData })}
      />
    )
  }

  return (
    <DashboardPage
      initialData={bookingData}
      onSearch={(formData) => navigate('/results', { bookingData: formData })}
    />
  )
}

function DashboardPage({ initialData, onSearch }) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: name === 'passengers' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(formData)
  }

  return (
    <div className="app-shell dashboard-shell">
      <header className="topbar">
        <div className="brand-mark">B</div>
        <div>
          <p className="brand-eyebrow">Travel made simple</p>
          <h1>BusBooking</h1>
        </div>
      </header>

      <main className="dashboard-layout">
        <section className="booking-panel">
          <div className="section-copy">
            <span className="section-badge">Smart bus ticket search</span>
            <h2>Plan your next ride in a few quick taps.</h2>
            <p>
              Compare routes, pick your travel date, and move straight to seat
              selection with a cleaner booking flow.
            </p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              <span>From</span>
              <input
                type="text"
                name="from"
                placeholder="Enter departure city"
                value={formData.from}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>To</span>
              <input
                type="text"
                name="to"
                placeholder="Enter destination city"
                value={formData.to}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-row">
              <label>
                <span>Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Passengers</span>
                <input
                  type="number"
                  name="passengers"
                  min="1"
                  max="8"
                  value={formData.passengers}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button type="submit" className="primary-button">
              Search Buses
            </button>
          </form>
        </section>

        <section className="visual-panel" aria-label="Bus travel illustration">
          <div className="visual-card">
            <img src={heroImage} alt="Bus illustration for the booking dashboard" />
            <div className="visual-details">
              <p className="visual-kicker">Smooth journeys</p>
              <h3>Comfortable routes with fast booking and simple search.</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ResultsPage({ bookingData, onBack }) {
  const [maxPrice, setMaxPrice] = useState(1000)
  const [busTypes, setBusTypes] = useState([])
  const [departureWindow, setDepartureWindow] = useState('Any time')
  const [selectedBus, setSelectedBus] = useState(null)

  const filteredBuses = useMemo(
    () =>
      buses.filter((bus) => {
        const matchesPrice = bus.price <= maxPrice
        const matchesType =
          busTypes.length === 0 ||
          busTypes.every((type) => bus.features.includes(type))
        const matchesDeparture =
          departureWindow === 'Any time' ||
          isWithinDepartureWindow(bus.departure, departureWindow)

        return matchesPrice && matchesType && matchesDeparture
      }),
    [busTypes, departureWindow, maxPrice],
  )

  const toggleBusType = (type) => {
    setBusTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    )
  }

  return (
    <div className="app-shell results-shell">
      <header className="topbar topbar-results">
        <div className="brand-group">
          <div className="brand-mark">B</div>
          <div>
            <p className="brand-eyebrow">Bus search results</p>
            <h1>BusBooking</h1>
          </div>
        </div>

        <button type="button" className="ghost-button" onClick={onBack}>
          Back to search
        </button>
      </header>

      <section className="results-hero">
        <div>
          <p className="results-label">Current trip</p>
          <h2>
            {bookingData.from || 'Your city'} to {bookingData.to || 'Destination'}
          </h2>
        </div>
        <div className="trip-summary">
          <span>{bookingData.date || 'Select a travel date'}</span>
          <span>{bookingData.passengers || 1} passenger(s)</span>
        </div>
      </section>

      <main className="results-layout">
        <aside className="filters-panel">
          <div className="panel-card">
            <h3>Filters</h3>

            <div className="filter-group">
              <div className="filter-head">
                <span>Price Range</span>
                <strong>Up to Rs. {maxPrice}</strong>
              </div>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </div>

            <div className="filter-group">
              <span>Bus Type</span>
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={busTypes.includes('AC')}
                  onChange={() => toggleBusType('AC')}
                />
                <span>AC</span>
              </label>
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={busTypes.includes('Non-AC')}
                  onChange={() => toggleBusType('Non-AC')}
                />
                <span>Non-AC</span>
              </label>
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={busTypes.includes('Sleeper')}
                  onChange={() => toggleBusType('Sleeper')}
                />
                <span>Sleeper</span>
              </label>
            </div>

            <div className="filter-group">
              <span>Departure Time</span>
              {['Any time', 'Morning', 'Afternoon', 'Evening', 'Night'].map(
                (slot) => (
                  <label className="radio-option" key={slot}>
                    <input
                      type="radio"
                      name="departureWindow"
                      checked={departureWindow === slot}
                      onChange={() => setDepartureWindow(slot)}
                    />
                    <span>{slot}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        </aside>

        <section className="results-panel">
          <div className="results-meta">
            <h3>Available buses</h3>
            <span>{filteredBuses.length} options found</span>
          </div>

          <div className="results-list">
            {filteredBuses.map((bus) => (
              <article className="bus-card" key={bus.id}>
                <div className="bus-card-main">
                  <div>
                    <p className="bus-type">{bus.type}</p>
                    <h4>{bus.name}</h4>
                    <p className="company-name">{bus.company}</p>
                  </div>
                  <div className="timing-block">
                    <strong>
                      {bus.departure} - {bus.arrival}
                    </strong>
                    <span>{bus.duration}</span>
                  </div>
                </div>

                <div className="bus-card-side">
                  <div className="price-tag">Rs. {bus.price}</div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setSelectedBus(bus)}
                  >
                    Select Seat
                  </button>
                </div>
              </article>
            ))}

            {filteredBuses.length === 0 ? (
              <div className="empty-state">
                No buses match the selected filters. Try widening your search.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {selectedBus ? (
        <SeatModal bus={selectedBus} onClose={() => setSelectedBus(null)} />
      ) : null}
    </div>
  )
}

function SeatModal({ bus, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="modal-label">Seat selection</p>
        <h3 id="seat-modal-title">{bus.name}</h3>
        <p>
          {bus.company} | {bus.departure} to {bus.arrival}
        </p>

        <div className="seat-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <button type="button" className="seat" key={index + 1}>
              {index + 1}
            </button>
          ))}
        </div>

        <button type="button" className="primary-button modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

function isWithinDepartureWindow(time, windowLabel) {
  const hour = Number(time.split(':')[0])

  if (windowLabel === 'Morning') return hour >= 5 && hour < 12
  if (windowLabel === 'Afternoon') return hour >= 12 && hour < 17
  if (windowLabel === 'Evening') return hour >= 17 && hour < 21
  if (windowLabel === 'Night') return hour >= 21 || hour < 5

  return true
}

export default App
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
