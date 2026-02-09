import React, { useState } from 'react';
import { entriesApi, CreateEntryData, Entry } from '../../services/entries.service';
import './EntryForm.css';


interface EntryFormProps {
    entry?: Entry; // If provided, we're editing; otherwise, creating
    onSuccess?: (entry: Entry) => void;
    onCancel?: () => void;
}


export const EntryForm: React.FC<EntryFormProps> = ({ entry, onSuccess, onCancel }) => {
    const isEditing = !!entry;


    const [formData, setFormData] = useState<CreateEntryData>({
        tmdbId: entry?.tmdbId || 0,
        title: entry?.title || '',
        type: entry?.type || 'MOVIE',
        watchedAt: entry?.watchedAt ? new Date(entry.watchedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        rating: entry?.rating || undefined,
        review: entry?.review || '',
        tags: entry?.tags || [],
        isRewatch: entry?.isRewatch || false,
        watchLocation: entry?.watchLocation || '',
    });


    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;


        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name === 'rating') {
