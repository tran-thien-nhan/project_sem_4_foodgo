import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../State/Authentication/Action';
import { useDispatch } from 'react-redux';

const initialValues = {
    fullName: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER"
};

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        if (!values.fullName || !values.email || !values.password || !values.role) {
            alert("All fields are required");
            return;
        }
        console.log('form values', values);
        dispatch(registerUser({ userData: values, navigate }));
    };

    return (
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
                        </Field>
                    </FormControl>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 2, padding: '1rem' }}
                    >
                        Register
                    </Button>
                </Form>
            </Formik>
            <Typography
                variant='body2'
                align='center'
                sx={{ mt: 3 }}
            >
                Already have an account?
                <Button
                    size='small'
                    onClick={() => navigate('/account/login')}
                >
                    Login
                </Button>
            </Typography>
        </div>
    );
};

export default RegisterForm;
