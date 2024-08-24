import React, { useState } from 'react';
import "./ResetEmailPass.css";

export const ResetEmail = () => {
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');
    
    const handleEmailUpdate = async () => {
        if (!oldEmail || !newEmail) {
            setError("Both email fields are required.");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/users/${userId}/reset-email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
                body: JSON.stringify({ oldEmail, newEmail }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to update email.");
            }

            setMessage(result.message || "Email updated successfully!");
            setOldEmail('');
            setNewEmail('');
        } catch (error) {
            setError(error.message || "An error occurred while updating email.");
        }
    };

    return (
        <div className='cred'>
            <h2>Reset Email Address</h2>
            <input
                type="email"
                value={oldEmail}
                onChange={(e) => setOldEmail(e.target.value)}
                placeholder="Enter your current email"
                className='cred-input'
                required
            />
            <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email"
                className='cred-input'
                required
            />
            <button onClick={handleEmailUpdate}>Update Email Address</button>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
