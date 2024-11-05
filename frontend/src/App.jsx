import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import DashboardLayout from "./pages/DashboardPage";
import SupportDashboard from "./support/SupportDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import FieldDashboard from "./field/FieldDashboard"; // Import your FieldDashboard component
import TicketDetails from "./components/TicketDetails";
import About from "./components/About";
import AddEngineer from "./components/AddEngineer";
import Customers from "./components/Customers";
import FieldEngineerForm from "./pages/Engineer/FieldEngineerForm";
import SupportEngineerForm from "./pages/Engineer/SupportEngineerForm";
import SupportTickets from "./support/SupportTickets";
import SupportReports from "./support/SupportHistory.jsx";
import SupportFeedback from "./support/SupportAssign.jsx";
import AboutField from "./field/AboutFiled";
import CustomerTickets from "./customer/CustomerTickets";
import CustomerTicketHistory from "./customer/CustomerTicketHistory";
import CustomerTicketPending from "./customer/CustomerTicketPending";
import SupportAbout from "./support/SupportAbout.jsx";
import SupportHistory from "./support/SupportHistory.jsx";
import SupportAssign from "./support/SupportAssign.jsx";
import SupportClose from "./support/SupportClose.jsx";
import SupportVerify from "./support/SupportVerify.jsx";
import { Field } from "../../backend/models/field.model.js";
import FieldData from "./field/FieldData.jsx";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect support users to the Support Dashboard
  if (user.isSupport && window.location.pathname !== "/supports") {
    return <Navigate to="/supports" replace />;
  }

  // Redirect customer users to the Customer Dashboard
  if (user.isCustomer && window.location.pathname !== "/customer-dashboard") {
    return <Navigate to="/customer-dashboard" replace />;
  }

  // Redirect field engineers to the Field Dashboard
  if (user.isField && window.location.pathname !== "/field-dashboard") {
    return <Navigate to="/field-dashboard" replace />;
  }

  return children;
};

// Redirect authenticated users to the appropriate dashboard
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    if (user.isSupport) {
      return <Navigate to="/supports" replace />;
    } else if (user.isCustomer) {
      return <Navigate to="/customer-dashboard" replace />;
    } else if (user.isField) {
      return <Navigate to="/field-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-white flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-orange-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-orange-400"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-orange-300"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        {/* User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/tickets" replace />} />
          <Route path="tickets" element={<TicketDetails />} />
          <Route path="about" element={<About />} />
          {/* <Route path="add-engineer" element={<AddEngineer />} /> */}
          <Route path="customers" element={<Customers />} />
          <Route path="support" element={<SupportEngineerForm />} />
          <Route path="field" element={<FieldEngineerForm />} />
          {/* <Route path="*" element={<Outlet/>} /> */}
        </Route>

        {/* Support Dashboard Route */}
        <Route
          path="/supports"
          element={
            <ProtectedRoute>
              <SupportDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/supports/tickets" replace />} />
          <Route path="tickets" element={<SupportTickets />} />
          <Route path="history" element={<SupportHistory />} />
          
          <Route path="assign" element={<SupportAssign />} />
          <Route path="verify" element={<SupportVerify />} />
          <Route path="close" element={<SupportClose />} />
          <Route path="about" element={<SupportAbout />} />

          <Route path="customers" element={<Customers />} />
          <Route path="support" element={<SupportEngineerForm />} />
          <Route path="field" element={<FieldEngineerForm />} />
        <Route path="*" element={<Navigate to="/supports/tickets" replace />} /> {/* Fallback route */}

        </Route>

        <Route
          path="/field-dashboard"
          element={
            <ProtectedRoute>
              <FieldDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/field-dashboard/tickets" replace />}
          />
          <Route path="tickets" element={<FieldData />} />
          <Route path="about" element={<AboutField />} />
          {/* <Route path="history" element={<FieldHistory />} /> */}
          <Route path="*" element={<Navigate to="/field-dashboard/tickets" replace />} /> {/* Fallback route */}
        </Route>

        <Route 
          path="/customer-dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/customer-dashboard/tickets" replace />}
          />
          <Route path="tickets" element={<CustomerTickets />} />
          <Route path="about" element={<AboutField />} />
          <Route path="ticket-history" element={<CustomerTicketHistory></CustomerTicketHistory>} />
          <Route path="ticket-pending" element={<CustomerTicketPending />} />
          {/* <Route path="history" element={<FieldHistory />} /> */}
           <Route path="*" element={<Navigate to="/customer-dashboard/tickets" replace />} /> {/* Fallback route */}
        </Route>

        {/* Authentication Pages */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* Catch all routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}
