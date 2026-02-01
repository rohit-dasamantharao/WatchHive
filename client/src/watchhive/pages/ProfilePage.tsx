import React from 'react';
import { useAuth } from '../contexts';
import { Card } from '../components/common';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-page__header">
                    <h1>Profile</h1>
                </div>

                <div className="profile-page__content">
                    <Card variant="glass" className="profile-card">
                        <div className="profile-card__header">
                            <div className="profile-avatar">
                                {user.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt={user.displayName || user.username} />
                                ) : (
                                    <div className="profile-avatar__placeholder">
                                        {(user.displayName || user.username).charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <h2>{user.displayName || user.username}</h2>
                                <p className="profile-username">@{user.username}</p>
                            </div>
                        </div>

                        <div className="profile-card__body">
                            <div className="profile-field">
                                <label>Email</label>
                                <p>{user.email}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
