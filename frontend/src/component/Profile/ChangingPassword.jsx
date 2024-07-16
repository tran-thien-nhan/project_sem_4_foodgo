import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ChangingPassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [tokenRequested, setTokenRequested] = useState(false);

    const handleTokenRequest = async () => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.post('/auth/request-token', { userId });
            setTokenRequested(true);
            setSuccessMessage('Change password token sent to your email.');
        } catch (error) {
            setError('Failed to send code. Please try again after 15 mins.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('/auth/change', {
                userId: localStorage.getItem('userId'),
                currentPassword,
                newPassword,
                confirmPassword,
            });

            setSuccessMessage(response.data);
            setError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTokenRequested(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('Failed to change password. Please try again later.');
            }
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto mt-8">
            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {!tokenRequested ? (
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleTokenRequest}
                    style={{ marginBottom: '1rem' }}
                >
                    Request Password Reset Token
                </Button>
            ) : (
                <Typography variant="body2" gutterBottom>
                    Please check your email for the password reset token.
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    variant="outlined"
                    margin="normal"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    variant="outlined"
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Change Password
                </Button>
            </form>
        </div>
    );
};

export default ChangingPassword;
