import {
  Routes,
  Route,
  Navigate,
  Router,
} from "react-router-dom";

import AdminLayout
from "./components/Layout/AdminLayout";

import ProtectedRoute
from "./routes/ProtectedRoute";

// PAGES

import Dashboard
from "./pages/Dashboard";

import Projects
from "./pages/Projects";

import Enquiries
from "./pages/Enquiries";

import Users
from "./pages/Users";

import Settings
from "./pages/Settings";

import Notifications
from "./pages/Notifications";

import AllUsers
from "./pages/AllUsers";

import Roles
from "./pages/Roles";

import UserActivity
from "./pages/UserActivity";

import Login
from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (

    <Routes>

      {/* PUBLIC ROUTE */}

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
      path="/register"
      element={<Register/>}/>

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

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/enquiries"
          element={<Enquiries />}
        />

        <Route
          path="/users"
          element={<Users />}
        />

        <Route
          path="/users/all-users"
          element={<AllUsers />}
        />

        <Route
          path="/users/roles"
          element={<Roles />}
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
          path="/settings"
          element={<Settings />}
        />

      </Route>

      {/* DEFAULT ROUTE */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;