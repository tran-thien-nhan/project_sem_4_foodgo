import React, { useEffect, useState } from 'react';
import { Button, Divider, Card, Modal, Box, Grid, TextField, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import AddressCard from './AddressCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getAllCartItems, clearCartAction, findCart } from '../State/Cart/Action';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

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

const initialValues = {
    streetAddress: '',
    state: '',
    pinCode: '',
    city: '',
};

const validationSchema = Yup.object().shape({
    streetAddress: Yup.string().required('Street Address Is Required'),
    state: Yup.string().required('State Is Required'),
    pinCode: Yup.string().required('Pin Code Is Required'),
    city: Yup.string().required('City Is Required'),
});

const HandleSubmit = (values) => {
    console.log('Address Added ', values);
};

const Cart = () => {
    const [open, setOpen] = useState(false);
    const { cart } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    //console.log("TOTAL PRICE: ", totalPrice);
    // console.log("CART 1: ", cart);
    // console.log("CART 1 ID: ", cart.cart?.id);

    useEffect(() => {
        //dispatch(getAllCartItems({ token }));
        dispatch(findCart(token));
    }, [dispatch, token]);

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

    return (
        <>
            <main className='lg:flex justify-between'>
                <section className='lg:w-[30%] space-y-6 lg:min-h-screen pt-10'>
                    {cart.cart?.cartItems.map((item) => (
                        <CartItem key={item.id} item={item}/>
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
                                {/* {totalPrice.toLocaleString('vi-VN')}đ */}
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
                    <Formik initialValues={initialValues} onSubmit={HandleSubmit} validationSchema={validationSchema}>
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
                                    <Button variant='contained' fullWidth type='submit' color='primary'>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    </Formik>
                </Box>
            </Modal>
        </>
    );
};

export default Cart;
