import React from 'react';
import { useState } from 'react';
import { Button, TextField, Typography, Box, Container } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../State/Authentication/Action';

const initialValues = {
    newPassword: '',
    confirmNewPassword: ''
};

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than or equal to 20 characters')
        .matches(/^\S*$/, 'Password cannot contain spaces')
        .required('New Password is required'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm New Password is required')
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [token, setToken] = useState(new URLSearchParams(location.search).get('token'));

    const handleSubmit = (values) => {
        dispatch(resetPassword({ token, newPassword: values.newPassword, navigate }));
    };

    return (
        <Container maxWidth="sm" className="mt-10">
            <Box className="p-8 rounded shadow-md">
                <Typography variant='h5' className='text-center mb-4'>
                    Reset Password
                </Typography>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    <Form>
                        <Field
                            as={TextField}
                            name='newPassword'
                            label='New Password'
                            fullWidth
                            variant='outlined'
                            margin='normal'
                            type='password'
                            className='mb-4'
                            helperText={<ErrorMessage name="newPassword" />}
                        />
                        <Field
                            as={TextField}
                            name='confirmNewPassword'
                            label='Confirm New Password'
                            fullWidth
                            variant='outlined'
                            margin='normal'
                            type='password'
                            className='mb-4'
                            helperText={<ErrorMessage name="confirmNewPassword" />}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            fullWidth
                            className="mt-4 py-2"
                        >
                            Reset Password
                        </Button>
                    </Form>
                </Formik>
            </Box>
        </Container>
    );
};

export default ResetPassword;
