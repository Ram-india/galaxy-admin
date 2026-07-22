import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { PERMISSIONS } from "./constants/permissions";

// AUTH PAGES

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AcceptInvite from "./pages/auth/AcceptInvite";

// APP PAGES

import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/projects/ProjectList";
import ProjectDetails from "./pages/projects/ProjectDetails";
import BlogList from "./pages/blogs/BlogList";
import BlogEditor from "./pages/blogs/BlogEditor";
import EnquiryList from "./pages/enquiry/EnquiryList";
import EnquiryDetails from "./pages/enquiry/EnquiryDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/profile/Profile";
import TeamMembers from "./pages/team/TeamMembers";
import RolesPermissions from "./pages/team/RolesPermissions";
import SiteSettings from "./pages/settings/SiteSettings";
import WebsiteContent from "./pages/content/WebsiteContent";
import UserActivity from "./pages/UserActivity";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES — redirect away when already signed in */}

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />

      {/* Reset and invite links must work even while another session is open */}

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/accept-invite/:token"
        element={<AcceptInvite />}
      />

      {/* PROTECTED ROUTES */}

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* PROJECTS */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute permission={PERMISSIONS.PROJECT_VIEW}>
              <ProjectList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute permission={PERMISSIONS.PROJECT_VIEW}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        {/* BLOG */}

        <Route
          path="/blogs"
          element={
            <ProtectedRoute permission={PERMISSIONS.BLOG_VIEW}>
              <BlogList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute permission={PERMISSIONS.BLOG_CREATE}>
              <BlogEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/:id/edit"
          element={
            <ProtectedRoute permission={PERMISSIONS.BLOG_UPDATE}>
              <BlogEditor />
            </ProtectedRoute>
          }
        />

        {/* ENQUIRIES */}

        <Route
          path="/enquiries"
          element={
            <ProtectedRoute permission={PERMISSIONS.ENQUIRY_VIEW}>
              <EnquiryList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enquiries/:id"
          element={
            <ProtectedRoute permission={PERMISSIONS.ENQUIRY_VIEW}>
              <EnquiryDetails />
            </ProtectedRoute>
          }
        />

        {/* ACCOUNT */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* TEAM */}

        <Route
          path="/users"
          element={<Navigate to="/users/all-users" replace />}
        />

        <Route
          path="/users/all-users"
          element={
            <ProtectedRoute permission={PERMISSIONS.TEAM_VIEW}>
              <TeamMembers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/roles"
          element={
            <ProtectedRoute permission={PERMISSIONS.TEAM_VIEW}>
              <RolesPermissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/activity"
          element={<UserActivity />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/website-content"
          element={<WebsiteContent />}
        />

        <Route
          path="/settings"
          element={<SiteSettings />}
        />

      </Route>

      {/* DEFAULT ROUTE */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* 404 */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}

export default App;
