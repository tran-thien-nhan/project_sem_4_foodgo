import React from 'react';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../State/Authentication/Action';
import { SignInButton, SignUpButton, useSignUp, useUser } from '@clerk/clerk-react';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from "react";


const initialValues = {
    fullName: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER",
    phone: "",
};

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { signUp } = useSignUp();
    const { user } = useUser();
    const [roleUser, setRoleUser] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignUp = async () => {
        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `/signup-google-success`,
            });
        } catch (error) {
            console.error("Google sign up failed", error);
        }
    };

    const handleSubmit = async (values) => {
        if (!values.fullName || !values.email || !values.password || !values.phone || !values.role) {
            alert("All fields are required");
            return;
        }
        setIsLoading(true);
        try {
            await dispatch(registerUser({ userData: values, navigate }));
        } finally {
            setIsLoading(false);
        }
    };

    return user ? (
        <Typography variant='h6' className='text-center'>
            You are already registered.
        </Typography>
    ) : (
        <div>
            <Typography variant='h5' className='text-center'>Register</Typography>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                    <Field
                        as={TextField}
                        name='fullName'
                        label='Full Name'
                        fullWidth
                        variant='outlined'
                        margin='normal'
                    />
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
                        name='phone'
                        label='Phone'
                        fullWidth
                        variant='outlined'
                        margin='normal'
                    />
                    <FormControl fullWidth margin='normal'>
                        <InputLabel id="role-simple-select-label">Role</InputLabel>
                        <Field
                            as={Select}
                            labelId="role-simple-select-label"
                            id="role-simple-select"
                            name='role'
                            label='Role'
                        >
                            <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
                            <MenuItem value={"ROLE_RESTAURANT_OWNER"}>Restaurant Owner</MenuItem>
                            <MenuItem value={"ROLE_SHIPPER"}>Shipper</MenuItem>
                        </Field>
                    </FormControl>
                    <Field type='hidden' name='provider' />
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 2, padding: '1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
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
                    //onClick={handleGoogleSignUp}
                    >
                        <div className='flex'>
                            <span>
                                <IconButton>
                                    <GoogleIcon />
                                </IconButton>
                            </span>
                        </div>
                        <p>Sign up with Google</p>
                    </Button>
                }
            />
            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                Already have an account?
                <Button size='small' onClick={() => navigate('/account/login')}>
                    Login
                </Button>
            </Typography>
        </div>
    );
};

export default RegisterForm;
