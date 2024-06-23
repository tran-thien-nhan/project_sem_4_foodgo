import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder, createOrder } from '../State/Order/Action';
import { Container, Typography, Button, Box, Card } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { findCart } from '../State/Cart/Action';

const PaymentSuccess = () => {

    return (
        <div className="bg-gray-100" style={{ minHeight: '100vh' }}>
            <Card maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
                <Box className="flex flex-col items-center p-6 rounded-lg shadow-md">
                    <CheckCircleOutlineIcon style={{ fontSize: 80 }} className="text-green-500" />
                    <Typography variant="h4" component="h1" className="pt-5 text-center">
                        Order Successfully !
                    </Typography>
                    <Typography variant="body1" className="py-5 text-center">
                        Thank you for shopping with us. Your order has been processed successfully.
                    </Typography>
                    <Button variant="contained" color="primary" className="mt-5" href="/">
                        Back to Home
                    </Button>
                </Box>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
