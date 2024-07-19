import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordChangingToken, changePassword } from '../State/Authentication/Action';
import { TextField, Button, Typography, Grid } from '@mui/material';

const ChangingPassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [tokenRequested, setTokenRequested] = useState(false);
    const [timer, setTimer] = useState(60);
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    useEffect(() => {
        let interval;
        if (tokenRequested && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setTokenRequested(false);
            setTimer(60); 
        }

        return () => clearInterval(interval);
    }, [timer, tokenRequested]);

    const handleTokenRequest = () => {
        dispatch(requestPasswordChangingToken(auth.user?.id));
        setTokenRequested(true);
        setTimer(60); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(changePassword({
            userId: auth.user?.id,
            currentPassword,
            newPassword,
            confirmPassword,
            token,
        }));
    };

    return (
        <div className="w-full max-w-xs mx-auto mt-8">
            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>
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
                <Grid container spacing={2} alignItems="center">
                    {!tokenRequested ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleTokenRequest}
                                style={{ marginTop: '1rem' }}
                            >
                                Get Code
                            </Button>
                        </Grid>
                    ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled
                                style={{ marginTop: '1rem' }}
                            >
                                {timer > 0 ? `Resend in ${timer} sec` : 'Get Code'}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={10} md={7}>
                        <TextField
                            fullWidth
                            type="text"
                            label="Code"
                            variant="outlined"
                            margin="normal"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>
                </Grid>
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
