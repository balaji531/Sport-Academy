import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
// Public pages
import Home       from './pages/Home';
import Login      from './pages/auth/Login';
import Register            from './pages/auth/Register';
import RegistrationPayment from './pages/auth/RegistrationPayment';
import Badminton  from './pages/sports/Badminton';
import Skating    from './pages/sports/Skating';
import Pickleball from './pages/sports/Pickleball';
import Events     from './pages/Events';
import Membership from './pages/Membership';
import Bookings   from './pages/Bookings';
import Contact    from './pages/Contact';

// Dashboards
import StudentDashboard from './pages/dashboard/StudentDashboard';
import MemberDashboard  from './pages/dashboard/MemberDashboard';
// AdminDashboard is now part of the separate /admin/ entry point
import Notifications    from './pages/Notifications';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#ffffff', color: '#0f172a', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <AnimatePresence mode="wait">
            {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
          </AnimatePresence>

          <Routes>
            {/* Public */}
            <Route path="/"                  element={<Home />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/register"          element={<Register />} />
            <Route path="/register/payment"  element={
              <ProtectedRoute roles={['student']}>
                <RegistrationPayment />
              </ProtectedRoute>
            } />
            <Route path="/sports/badminton"  element={<Badminton />} />
            <Route path="/sports/skating"    element={<Skating />} />
            <Route path="/sports/pickleball" element={<Pickleball />} />
            <Route path="/events"            element={<Events />} />
            <Route path="/membership"        element={<Membership />} />
            <Route path="/bookings"          element={<Bookings />} />
            <Route path="/contact"           element={<Contact />} />

            {/* Protected — Student */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/profile" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/fees" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/attendance" element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            {/* Protected — Member */}
            <Route path="/dashboard/member" element={
              <ProtectedRoute roles={['member']}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/profile" element={
              <ProtectedRoute roles={['member']}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/membership" element={
              <ProtectedRoute roles={['member']}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/payments" element={
              <ProtectedRoute roles={['member']}>
                <MemberDashboard />
              </ProtectedRoute>
            } />

            {/* Admin routes have been moved to the separate /admin/ entry point. 
                Any accidental hits here will be ignored by the main app to avoid redirection loops. */}
            <Route path="/admin/*" element={<div />} />


            {/* Shared dashboard pages */}
            <Route path="/dashboard/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
