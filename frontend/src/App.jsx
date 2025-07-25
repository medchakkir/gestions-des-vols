import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* Protected routes with layout */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Layout>
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
