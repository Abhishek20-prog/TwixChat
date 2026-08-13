import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Discover from "./pages/discover";
import Createpost from "./pages/createpost";
import Profile from "./pages/profile";
import Chatbox from "./pages/chatbox";
import Layout from "./pages/layout";
import Feed from "./pages/feed";
import Message from "./pages/message";
import Connections from "./pages/connections";

const App = () => {
  return (
    <Routes>

      {/* Authentication */}
      <Route path="/login/*" element={<Login />} />

      {/* Main application */}
      <Route path="/" element={<Layout />} />

      <Route path="/discover" element={<Discover />} />

      <Route path="/createpost" element={<Createpost />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/profile/:profileId" element={<Profile />} />

      <Route path="/message/:userId" element={<Chatbox />} />

      <Route path="/feed" element={<Feed />} />

      <Route path="/message" element={<Message />} />

      <Route path="/connections" element={<Connections />} />

    </Routes>
  );
};

export default App;