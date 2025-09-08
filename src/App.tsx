import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Booking from './pages/Booking'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import Hiring from './pages/Hiring'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/hiring" element={<Hiring />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App