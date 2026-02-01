import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts';
import { Navbar } from './components/layout';
import { LoginPage, SignupPage, ProfilePage, FeedPage, EntriesPage } from './pages';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">
                    <svg className="wh-spinner" viewBox="0 0 24 24">
                        <circle
                            className="wh-spinner__circle"
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            strokeWidth="3"
                        />
                    </svg>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/watch-hive/login" replace />;
};

// Public Route Component (redirect to feed if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">
                    <svg className="wh-spinner" viewBox="0 0 24 24">
                        <circle
                            className="wh-spinner__circle"
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            strokeWidth="3"
                        />
                    </svg>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    return !isAuthenticated ? <>{children}</> : <Navigate to="/watch-hive/feed" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/watch-hive/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/watch-hive/signup"
                    element={
                        <PublicRoute>
                            <SignupPage />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/watch-hive/feed"
                    element={
                        <ProtectedRoute>
                            <FeedPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/watch-hive/entries"
                    element={
                        <ProtectedRoute>
                            <EntriesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/watch-hive/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Default Redirect */}
                <Route path="/watch-hive" element={<Navigate to="/watch-hive/feed" replace />} />
                <Route path="*" element={<Navigate to="/watch-hive/feed" replace />} />
            </Routes>
        </>
    );
};

// Main WatchHive App Component
export const WatchHiveApp: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default WatchHiveApp;
