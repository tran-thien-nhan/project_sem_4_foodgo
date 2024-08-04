import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, forgotPassword, loginSuperAdmin } from '../State/Authentication/Action';
import { useUser } from '@clerk/clerk-react';

const initialValues = {
    email: "",
    password: "",
    code: "",
    provider: "NORMAL"
};

const SuperAdminLoginForm = () => {
    const { auth } = useSelector(store => store);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const jwt = localStorage.getItem('jwt');

    const handleSubmit = (values) => {
        console.log("values login: ", values);
        dispatch(loginSuperAdmin({ userData: values, navigate }));
    };

    const handleForgotPassword = () => {
        dispatch(forgotPassword({ email: email }));
        setShowForgotPassword(false);
    };

    return jwt ? (
        <Typography variant='h6' className='text-center'>
            You are already logged in.
        </Typography>
    ) : (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={3}
        >
            <Box
                width="100%"
                maxWidth="400px"
                bgcolor="rgba(255, 255, 255, 0.8)"
                p={4}
                borderRadius={2}
            >
                <Typography variant='h5' className='text-center' mb={3}>
                    Admin Login
                </Typography>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {() => (
                        <Form>
                            <Field
                                as={TextField}
                                name='email'
                                label='Email'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                            />
                            <Field
                                as={TextField}
                                name='password'
                                label='Password'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type='password'
                            />
                            <Field
                                as={TextField}
                                name='code'
                                label='Code'
                                fullWidth
                                variant='outlined'
                                margin='normal'
                                type='code'
                            />
                            <Field
                                type="hidden"
                                name="provider"
                                value="NORMAL"
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                sx={{ mt: 2, padding: '1rem' }}
                            >
                                Login
                            </Button>
                            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                                <Button size='small' onClick={() => setShowForgotPassword(true)}>
                                    Forgot Password?
                                </Button>
                            </Typography>
                        </Form>
                    )}
                </Formik>
                {showForgotPassword && (
                    <Box mt={3}>
                        <TextField
                            label='Email'
                            fullWidth
                            variant='outlined'
                            margin='normal'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            fullWidth
                            sx={{ mt: 2, padding: '1rem' }}
                            onClick={handleForgotPassword}
                        >
                            Submit
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default SuperAdminLoginForm;
