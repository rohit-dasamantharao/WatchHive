import React, { useState, useEffect } from 'react';
import { entriesApi, Entry, GetEntriesParams } from '../../services/entries.service';
import './EntryList.css';

interface EntryListProps {
    onEdit?: (entry: Entry) => void;
    filters?: GetEntriesParams;
}

export const EntryList: React.FC<EntryListProps> = ({ onEdit, filters }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
    });

    const loadEntries = async (params?: GetEntriesParams) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await entriesApi.getEntries({ ...filters, ...params });
            setEntries(response.entries);
            setPagination(response.pagination);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load entries');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEntries();
    }, [filters]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        try {
            await entriesApi.deleteEntry(id);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete entry');
        }
    };

    const handleLoadMore = () => {
        loadEntries({ offset: pagination.offset + pagination.limit });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'MOVIE':
                return '🎬 Movie';
            case 'TV_SHOW':
                return '📺 TV Show';
            case 'EPISODE':
                return '📼 Episode';
            default:
                return type;
        }
    };

    if (isLoading && entries.length === 0) {
        return (
            <div className="entry-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading entries...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="entry-list-error">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
                <button onClick={() => loadEntries()} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="entry-list-empty">
                <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3>No entries yet</h3>
                <p>Start tracking your movie and TV show journey!</p>
            </div>
        );
    }

    return (
        <div className="entry-list-container">
            <div className="entry-list-header">
                <h2>Your Entries</h2>
                <p className="entry-count">{pagination.total} total</p>
            </div>

            <div className="entry-list">
                {entries.map((entry) => (
                    <div key={entry.id} className="entry-card">
                        <div className="entry-card-header">
                            <div className="entry-info">
                                <h3 className="entry-title">{entry.title}</h3>
                                <div className="entry-meta">
                                    <span className="entry-type">{getTypeLabel(entry.type)}</span>
                                    <span className="entry-date">
                                        {formatDate(entry.watchedAt)}
                                    </span>
                                    {entry.isRewatch && (
                                        <span className="entry-badge rewatch">Rewatch</span>
                                    )}
                                </div>
                            </div>
                            {entry.rating && (
                                <div className="entry-rating">
                                    <span className="rating-value">{entry.rating}</span>
                                    <span className="rating-max">/10</span>
                                </div>
                            )}
                        </div>

                        {entry.review && (
                            <p className="entry-review">{entry.review}</p>
                        )}

                        {entry.tags && entry.tags.length > 0 && (
                            <div className="entry-tags">
                                {entry.tags.map((tag: string) => (
                                    <span key={tag} className="entry-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {entry.watchLocation && (
                            <div className="entry-location">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{entry.watchLocation}</span>
                            </div>
                        )}

                        <div className="entry-card-footer">
                            <div className="entry-stats">
                                <span className="stat">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    {entry._count.likes}
                                </span>
                                <span className="stat">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    {entry._count.comments}
                                </span>
                            </div>
                            <div className="entry-actions">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(entry)}
                                        className="action-btn edit-btn"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="action-btn delete-btn"
                                >
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pagination.hasMore && (
                <div className="entry-list-footer">
                    <button
                        onClick={handleLoadMore}
                        className="load-more-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EntryList;
