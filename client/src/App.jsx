import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import DoctorsPage from './pages/public/DoctorsPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDepartments from './pages/admin/ManageDepartments';
import SystemAnalytics from './pages/admin/SystemAnalytics';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentsSchedule from './pages/doctor/AppointmentsSchedule';
import PatientEMR from './pages/doctor/PatientEMR';
import AvailabilityManager from './pages/doctor/AvailabilityManager';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import PatientRegistration from './pages/staff/PatientRegistration';
import AppointmentDesk from './pages/staff/AppointmentDesk';
import BillingManager from './pages/staff/BillingManager';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import MedicalHistory from './pages/patient/MedicalHistory';

// Shared Profile Settings
import ProfileSettings from './pages/common/ProfileSettings';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Module */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout title="System Administration" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="analytics" element={<SystemAnalytics />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>

      {/* Doctor Module */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DashboardLayout title="Doctor Workspace" />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<AppointmentsSchedule />} />
        <Route path="emr" element={<PatientEMR />} />
        <Route path="availability" element={<AvailabilityManager />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>

      {/* Staff / Receptionist Module */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <DashboardLayout title="Reception & Front Desk" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="patients" element={<PatientRegistration />} />
        <Route path="appointments" element={<AppointmentDesk />} />
        <Route path="billing" element={<BillingManager />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>

      {/* Patient Portal */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardLayout title="Patient Health Portal" />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="history" element={<MedicalHistory />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

