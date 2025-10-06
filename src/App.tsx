import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './contexts/AdminContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import Hiring from './pages/Hiring'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/hiring" element={<Hiring />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  )
}

export default App