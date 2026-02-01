import React from 'react';
import { useAuth } from '../contexts';
import './FeedPage.css';

export const FeedPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="feed-page">
            <div className="container">
                <div className="feed-page__header">
                    <h1>
                        Welcome back, <span className="gradient-text">{user?.displayName || user?.username}</span>!
                    </h1>
                    <p>Your personalized feed of movie and TV show activity</p>
                </div>

                <div className="feed-page__content">
                    <div className="feed-empty">
                        <div className="feed-empty__icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h2>Your feed is empty</h2>
                        <p>Start logging movies and TV shows, or follow other users to see their activity here!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
