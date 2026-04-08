import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import Bookings from '../pages/Bookings';
import Events from '../pages/Events';
import AdminLogin from './AdminLogin';
import { NotificationProvider } from '../context/NotificationContext';

// New module pages
import StudentsPage     from '../pages/admin/StudentsPage';
import CoachesPage      from '../pages/admin/CoachesPage';
import SportsPage       from '../pages/admin/SportsPage';
import BatchesPage      from '../pages/admin/BatchesPage';
import FeesPage         from '../pages/admin/FeesPage';
import AttendancePage   from '../pages/admin/AttendancePage';
import PerformancePage  from '../pages/admin/PerformancePage';
import InventoryPage    from '../pages/admin/InventoryPage';
import ReportsPage      from '../pages/admin/ReportsPage';
import NotificationsPage from '../pages/admin/NotificationsPage';
import SettingsPage     from '../pages/admin/SettingsPage';

const Guard = ({ children }) => (
  <ProtectedRoute roles={['admin']}>{children}</ProtectedRoute>
);

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'var(--card)', color: 'var(--text-main)', border: '1px solid rgba(255, 255, 255, 0.7)', borderRadius: '10px' },
          }}
        />
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />

            {/* Dashboard */}
            <Route path="/"             element={<Guard><AdminDashboard /></Guard>} />

            {/* People */}
            <Route path="/students"     element={<Guard><StudentsPage /></Guard>} />
            <Route path="/coaches"      element={<Guard><CoachesPage /></Guard>} />

            {/* Academy */}
            <Route path="/sports"       element={<Guard><SportsPage /></Guard>} />
            <Route path="/batches"      element={<Guard><BatchesPage /></Guard>} />

            {/* Operations */}
            <Route path="/bookings"     element={<Guard><Bookings /></Guard>} />
            <Route path="/events"       element={<Guard><Events /></Guard>} />

            {/* Finance */}
            <Route path="/fees"         element={<Guard><FeesPage /></Guard>} />
            <Route path="/payments"     element={<Guard><FeesPage /></Guard>} />

            {/* Tracking */}
            <Route path="/attendance"   element={<Guard><AttendancePage /></Guard>} />
            <Route path="/performance"  element={<Guard><PerformancePage /></Guard>} />

            {/* Resources */}
            <Route path="/inventory"    element={<Guard><InventoryPage /></Guard>} />

            {/* Admin */}
            <Route path="/reports"      element={<Guard><ReportsPage /></Guard>} />
            <Route path="/notifications" element={<Guard><NotificationsPage /></Guard>} />
            <Route path="/settings"     element={<Guard><SettingsPage /></Guard>} />

            {/* Legacy redirect */}
            <Route path="/users"        element={<Navigate to="/students" replace />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
