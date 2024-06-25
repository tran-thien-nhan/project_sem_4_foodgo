import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateOrderIsPay } from '../State/Order/Action';
import { Container, Typography, Button, Box, Card } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderId } = useParams();

    useEffect(() => {
        if (orderId) {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                console.error("JWT is missing");
                return;
            }
            const data = {
                jwt: jwt,
                orderId: orderId
            }
            console.log("Dispatching updateOrderIsPay with data:", data);
            dispatch(updateOrderIsPay(data));
        } else {
            console.error("Order ID is missing");
        }
    }, [dispatch, orderId]);

    return (
        <div className="bg-gray-100" style={{ minHeight: '100vh' }}>
            <Card maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
                <Box className="flex flex-col items-center p-6 rounded-lg shadow-md">
                    <CheckCircleOutlineIcon style={{ fontSize: 80 }} className="text-green-500" />
                    <Typography variant="h4" component="h1" className="pt-5 text-center">
                        Order Successfully!
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
