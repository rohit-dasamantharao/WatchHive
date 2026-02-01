import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../common';
import './Navbar.css';

export const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/watch-hive/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar__content">
                    <Link to="/watch-hive/feed" className="navbar__logo">
                        <span className="gradient-text">WatchHive</span>
                    </Link>

                    {isAuthenticated && (
                        <div className="navbar__menu">
                            <Link to="/watch-hive/feed" className="navbar__link">
                                Feed
                            </Link>
                            <Link to="/watch-hive/entries" className="navbar__link">
                                Entries
                            </Link>
                            <Link to="/watch-hive/profile" className="navbar__link">
                                Profile
                            </Link>
                        </div>
                    )}

                    <div className="navbar__actions">
                        {isAuthenticated ? (
                            <div className="navbar__user">
                                <span className="navbar__username">{user?.displayName || user?.username}</span>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="navbar__auth">
                                <Link to="/watch-hive/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/watch-hive/signup">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
