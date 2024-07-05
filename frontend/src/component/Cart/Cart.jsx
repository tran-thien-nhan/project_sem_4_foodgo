import React, { useEffect, useState } from 'react';
import { Button, Divider, Card, Modal, Box, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import AddressCard from './AddressCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getAllCartItems, clearCartAction, findCart } from '../State/Cart/Action';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { createOrder, sendOtp, sendOtpViaEmail, verifyOtp, verifyOtpViaEmail } from '../State/Order/Action';

const initialValues = {
    streetAddress: '',
    state: '',
    pinCode: '',
    city: '',
    paymentMethod: 'BY_CASH',
};

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    outline: 'none',
    boxShadow: 24,
    p: 4,
};

const Cart = () => {
    const [open, setOpen] = useState(false);
    const { auth, cart } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpMethod, setOtpMethod] = useState('email');

    useEffect(() => {
        dispatch(findCart(token));
    }, [dispatch, token]);

    const validationSchema = Yup.object().shape({
        streetAddress: Yup.string().required('Street Address Is Required'),
        state: Yup.string().required('State Is Required'),
        pinCode: Yup.string().required('Pin Code Is Required'),
        city: Yup.string().required('City Is Required'),
        paymentMethod: Yup.string().required('Payment Method Is Required'),
    });

    const handleSubmitOrder = (values) => {
        if (!otpVerified) {
            alert("You need to verify the OTP before placing the order.");
            return;
        }

        const data = {
            jwt: localStorage.getItem('jwt'),
            order: {
                restaurantId: cart.cart?.cartItems[0].food?.restaurant?.id,
                deliveryAddress: {
                    fullName: auth.user?.fullName,
                    streetAddress: values.streetAddress,
                    city: values.city,
                    state: values.state,
                    pinCode: values.pinCode,
                    country: "vietnam"
                },
                paymentMethod: values.paymentMethod,
            }
        }
        console.log("DATA:", data);
        dispatch(createOrder(data));

        if (values.paymentMethod === 'BY_CASH') {
            window.location.href = '/';
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectAddress = () => {
        console.log('Address Selected');
    };

    const createOrderUsingSelectedAddress = () => {
        console.log('Order Created Using Selected Address');
    };

    const handleOpenAddressModal = () => {
        handleOpen();
    };

    const handleClearCart = () => {
        dispatch(clearCartAction(token));
        navigate("/")
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (otpMethod === "email") {
            if (!mail) {
                alert("Email is required!");
                return;
            }
            dispatch(sendOtpViaEmail({ email: mail, jwt: token }));
            setVerifying(true);
        }
        else {
            if (!phone) {
                alert("Phone is required!");
                return;
            }
            dispatch(sendOtp({ phoneNumber: phone, jwt: token }));
            setVerifying(true);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otpMethod === "email") {
            const result = await dispatch(verifyOtpViaEmail({ email: mail, otp, jwt: token }));
            if (result == true) {
                console.log(result);
                setOtpVerified(true); // Xác nhận OTP thành công
                setVerifying(false);
                // alert("OTP verified successfully!");
            } else {
                console.log(result);
                setOtpVerified(false); // Xác nhận OTP thất bại
                setVerifying(false);
                // alert("OTP verification failed!");
            }
        }
        else {
            const result = await dispatch(verifyOtp({ phoneNumber: phone, otp, jwt: token }));
            if (result == true) {
                console.log(result);
                setOtpVerified(true); // Xác nhận OTP thành công
                setVerifying(false);
                // alert("OTP verified successfully!");
            } else {
                console.log(result);
                setOtpVerified(false); // Xác nhận OTP thất bại
                setVerifying(false);
                // alert("OTP verification failed!");
            }
        }

    };

    return (
        <>
            <main className='lg:flex justify-between'>
                <section className='lg:w-[30%] space-y-6 lg:min-h-screen pt-10'>
                    {cart.cart?.cartItems?.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                    <div className="flex justify-end w-full px-3">
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={handleClearCart}
                            startIcon={<ClearIcon />}
                        >
                            Clear Cart
                        </Button>
                    </div>
                    <Divider />
                    <div className='billDetails px-5 text-sm'>
                        <p className='font-extrabold py-5'>Bill Detail</p>
                        <div className='space-y-3'>
                            <div className='flex justify-between text-gray-400'>
                                <p>Item Total</p>
                                <p>{cart.cart?.total.toLocaleString('vi-VN')}đ</p>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <p>Delivery Fee</p>
                                <p>10.000đ</p>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <p>Platform Fee</p>
                                <p>1.000đ</p>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <p>GST and Restaurant Charge</p>
                                <p>7.100đ</p>
                            </div>
                            <Divider />
                        </div>
                        <div className='flex justify-between text-gray-400 mb-8'>
                            <p>Total Pay</p>
                            <p>{(cart.cart?.total + 10000 + 1000 + 7100).toLocaleString('vi-VN')}đ</p>
                        </div>
                    </div>
                </section>
                <Divider orientation='vertical' flexItem />
                <section className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'>
                    <div>
                        <h1 className='text-center font-semibold text-2xl py-10'>Choose Delivery Address</h1>
                        <div className='flex flex-wrap items-center gap-5 justify-center'>
                            {[1, 1, 1].map((item, index) => (
                                <AddressCard key={index} showButton={true} handleSelectAddress={createOrderUsingSelectedAddress} />
                            ))}
                            <Card className='flex gap-5 w-64 p-5'>
                                <AddLocationAltIcon />
                                <div className='space-y-3 text-gray-500'>
                                    <h1 className='font-semibold text-lg text-white'>Add New Address</h1>
                                    <Button variant='contained' fullWidth onClick={handleOpenAddressModal}>
                                        Add
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style}>
                    <Formik initialValues={initialValues} onSubmit={handleSubmitOrder} validationSchema={validationSchema}>
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name='streetAddress'
                                        label='Street Address'
                                        fullWidth
                                        variant='outlined'
                                        error={!Boolean(ErrorMessage('streetAddress'))}
                                        helperText={
                                            <ErrorMessage name='streetAddress'>
                                                {(msg) => <span className='text-red-600'>{msg}</span>}
                                            </ErrorMessage>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Field
                                                as={TextField}
                                                name='state'
                                                label='State'
                                                fullWidth
                                                variant='outlined'
                                                error={!Boolean(ErrorMessage('state'))}
                                                helperText={
                                                    <ErrorMessage name='state'>
                                                        {(msg) => <span className='text-red-600'>{msg}</span>}
                                                    </ErrorMessage>
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                as={TextField}
                                                name='pinCode'
                                                label='Pin Code'
                                                fullWidth
                                                variant='outlined'
                                                error={!Boolean(ErrorMessage('pinCode'))}
                                                helperText={
                                                    <ErrorMessage name='pinCode'>
                                                        {(msg) => <span className='text-red-600'>{msg}</span>}
                                                    </ErrorMessage>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name='city'
                                        label='City'
                                        fullWidth
                                        variant='outlined'
                                        error={!Boolean(ErrorMessage('city'))}
                                        helperText={
                                            <ErrorMessage name='city'>
                                                {(msg) => <span className='text-red-600'>{msg}</span>}
                                            </ErrorMessage>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl component='fieldset'>
                                        <FormLabel component='legend'>Payment Method</FormLabel>
                                        <Field as={RadioGroup} name="paymentMethod">
                                            <FormControlLabel value='BY_CASH' control={<Radio />} label='By Cash' />
                                            <FormControlLabel value='BY_CREDIT_CARD' control={<Radio />} label='By Bank' />
                                            <FormControlLabel value='BY_VNPAY' control={<Radio />} label='By VNPay' />
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type='submit' variant='contained' color='primary' fullWidth disabled={!otpVerified}>
                                        Submit Order
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Formik>
                    <Divider sx={{ my: 2 }} />
                    <FormControl component="fieldset" className='mb-3'>
                        <FormLabel component="legend">Choose OTP method</FormLabel>
                        <RadioGroup
                            aria-label="otp-method"
                            name="otpMethod"
                            value={otpMethod}
                            onChange={(e) => setOtpMethod(e.target.value)}
                        >
                            <div className='flex'>
                                <FormControlLabel value="email" control={<Radio />} label="Email" />
                                <FormControlLabel value="sms" control={<Radio />} label="SMS" />
                            </div>
                        </RadioGroup>
                    </FormControl>

                    {verifying ? (
                        <>
                            <TextField
                                label='Enter OTP'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                fullWidth
                            />
                            <Button onClick={handleVerifyOtp} variant='contained' color='success' fullWidth sx={{ mt: 2 }}>
                                Verify OTP
                            </Button>
                        </>
                    ) : (
                        <>
                            <TextField
                                label={otpMethod === 'email' ? 'Email' : 'Phone Number'}
                                value={otpMethod === 'email' ? mail : phone}
                                onChange={
                                    otpMethod === 'email'
                                        ? (e) => setMail(e.target.value)
                                        : (e) => setPhone(e.target.value)
                                }
                                fullWidth
                            />
                            <Button onClick={handleSendOtp} variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
                                Send OTP
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Cart;
