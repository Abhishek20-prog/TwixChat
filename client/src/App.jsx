import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useUser } from "@clerk/react";

import Login from "./pages/login";
import Layout from "./pages/layout";

import Feed from "./pages/feed";
import Discover from "./pages/discover";
import Createpost from "./pages/createpost";
import Profile from "./pages/profile";
import Chatbox from "./pages/chatbox";
import Message from "./pages/message";
import Connections from "./pages/connections";

const App = () => {
  const { user, isLoaded } = useUser();

  // Clerk is still checking authentication
  if (!isLoaded) {
    return null;
  }

  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/login"
        element={user ? <Navigate to="/feed" replace /> : <Login />}
      />

      {/* ================= PROTECTED APP ================= */}

      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/feed" replace />} />

        <Route path="feed" element={<Feed />} />

        <Route path="message" element={<Message />} />

        <Route
          path="message/:userId"
          element={<Chatbox />}
        />

        <Route
          path="connections"
          element={<Connections />}
        />

        <Route
          path="discover"
          element={<Discover />}
        />

        <Route
          path="createpost"
          element={<Createpost />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="profile/:profileId"
          element={<Profile />}
        />
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to={user ? "/feed" : "/login"} replace />}
      />

    </Routes>
  );
};

export default App;