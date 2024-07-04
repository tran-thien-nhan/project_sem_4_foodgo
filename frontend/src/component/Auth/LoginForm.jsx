import React from 'react';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../State/Authentication/Action';
import { SignInButton, useUser } from '@clerk/clerk-react';
import GoogleIcon from '@mui/icons-material/Google';

const initialValues = {
    email: "",
    password: "",
    provider: "NORMAL"
};

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useUser();

    const handleSubmit = (values) => {
        dispatch(loginUser({ userData: values, navigate }));
    };

    return user ? (
        <Typography variant='h6' className='text-center'>
            You are already logged in.
        </Typography>
    ) : (
        <div>
            <Typography variant='h5' className='text-center'>
                Login</Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                </Form>
            </Formik>
            <SignInButton
                mode='modal'
                redirectUrl="/"
                children={
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <div className='flex'>
                            <span>
                                <IconButton>
                                    <GoogleIcon />
                                </IconButton>
                            </span>
                        </div>
                        <p>Sign in with Google</p>
                    </Button>
                }
            />
            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                Don't have an account?
                <Button size='small' onClick={() => navigate('/account/register')}>
                    Register
                </Button>
            </Typography>
        </div>
    );
};

export default LoginForm;