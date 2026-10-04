import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

import Login from "./pages/login";
import Layout from "./pages/layout";
import Feed from "./pages/feed";
import Discover from "./pages/discover";
import Createpost from "./pages/createpost";
import Profile from "./pages/profile";
import Chatbox from "./pages/chatbox";
import Message from "./pages/message";
import Connections from "./pages/connections";

import { fetchCurrentUser } from "./features/user/userslice";
import { fetchRecentMessages } from "./features/messages/messageslice";
import { fetchConnections } from "./features/connections/connectionslice";

const App = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    // ======================================================
    // FETCH INITIAL DATA
    // ======================================================
useEffect(() => {
    const fetchInitialData = async () => {
        if (!user) return;

        try {
            const token = await getToken();

            if (!token) {
                console.error("No Clerk token received");
                return;
            }

            dispatch(fetchCurrentUser(token));
            dispatch(fetchRecentMessages(token));
            dispatch(fetchConnections(token));
        } catch (error) {
            console.error(
                "INITIAL DATA ERROR:",
                error
            );
        }
    };

    if (isLoaded) {
        fetchInitialData();
    }
}, [user, isLoaded, getToken, dispatch]);

    // ======================================================
    // CLERK LOADING
    // ======================================================

    if (!isLoaded) {
        return null;
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#17383A",
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "12px 16px",
                    },
                }}
            />

            <Routes>
                {/* ==================================================
                    LOGIN
                ================================================== */}

                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate
                                to="/feed"
                                replace
                            />
                        ) : (
                            <Login />
                        )
                    }
                />

                {/* ==================================================
                    MAIN APP
                ================================================== */}

                <Route
                    path="/"
                    element={
                        user ? (
                            <Layout />
                        ) : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                    }
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="/feed"
                                replace
                            />
                        }
                    />

                    <Route
                        path="feed"
                        element={<Feed />}
                    />

                    <Route
                        path="message"
                        element={<Message />}
                    />

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

                {/* ==================================================
                    FALLBACK
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                user
                                    ? "/feed"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
};

export default App;