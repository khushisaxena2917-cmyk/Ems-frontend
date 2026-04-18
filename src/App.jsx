/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import Showcase from "./pages/Showcase.jsx";
import Login from "./pages/Login.jsx";
import EmployeeRegister from "./pages/EmployeeRegister.jsx";

// Admin
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AddTask from "./pages/admin/AddTask.jsx";
import Administration from "./pages/admin/Administration.jsx";
import AdminAttendance from "./pages/admin/Attendance.jsx";
import LeaveManagement from "./pages/admin/LeaveManagement.jsx";
import LeavesAttendance from "./pages/admin/LeavesAttendance.jsx";
import Queries from "./pages/admin/Queries.jsx";
import Reports from "./pages/admin/Reports.jsx";
import SettingsAdmin from "./pages/admin/Settings.jsx";
import NotificationsAdmin from "./pages/admin/Notifications.jsx";
import AdminProfile from "./pages/admin/Profile.jsx";
import Departments from "./pages/admin/Departments.jsx";
import Positions from "./pages/admin/Positions.jsx";
import Payroll from "./pages/admin/Payroll.jsx";
import Users from "./pages/admin/Users.jsx";
import Employees from "./pages/admin/Employees.jsx";

// Employee
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";
import EmployeeDashboard from "./pages/employee/Dashboard.jsx";
import EmployeeAttendance from "./pages/employee/Attendance.jsx";
import EmployeeProfile from "./pages/employee/Profile.jsx";
import LeaveStatus from "./pages/employee/LeaveStatus.jsx";
import ApplyLeave from "./pages/employee/ApplyLeave.jsx";
import Settings from "./pages/employee/Settings.jsx";

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // If we have a user but no role (common after login mismatch),
    // we might need to handle it. For now, assume admin if it's Khushi.
    const role =
      user.role ||
      (user.email === "admin@saxenagroup.com" ? "admin" : "employee");

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch (err) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

const PublicRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const role =
        user.role ||
        (user.email === "admin@saxenagroup.com" ? "admin" : "employee");
      return (
        <Navigate
          to={role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
          replace
        />
      );
    } catch (e) {
      localStorage.removeItem("user");
    }
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/register" element={<EmployeeRegister />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="queries" element={<Queries />} />
            <Route path="leaves-attendance" element={<LeavesAttendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="users" element={<Users />} />
            <Route path="notifications" element={<NotificationsAdmin />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="departments" element={<Departments />} />
            <Route path="positions" element={<Positions />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="administration" element={<Administration />} />
            <Route path="add-task" element={<AddTask />} />
          </Route>
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route
              index
              element={<Navigate to="/employee/dashboard" replace />}
            />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeDashboard />} />{" "}
            {/* Placeholder */}
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="leave-status" element={<LeaveStatus />} />
            <Route path="apply-leave" element={<ApplyLeave />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
