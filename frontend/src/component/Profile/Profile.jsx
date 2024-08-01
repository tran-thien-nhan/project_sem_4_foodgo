import React, { useEffect, useState } from 'react'
import ProfileNavigation from './ProfileNavigation'
import UserProfile from './UserProfile';
import { Route, Routes } from 'react-router-dom';
import Orders from './Orders';
import Address from './Address';
import Favorites from './Favorites';
import Events from './Events';
import ChangingPassword from './ChangingPassword';
import { useMediaQuery, Box } from '@mui/material';
import Notification from './Notification';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../State/Authentication/Action';
import { getAllFavoritedRestaurantsEvents, getFavoritesEvents } from '../State/Event/Action';
import { getUsersOrders } from '../State/Order/Action';

const Profile = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const { auth, event, order } = useSelector(state => state);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [show, setShow] = useState(false);
    // const count = event.favorites.length || event.count;
    let count = event.count;
    // console.log("event.favorites: ",event);

    // const count = event.favorites.filter(favorite => favorite.available).length;

    let orderCount = order.orders.filter(order =>
        order.orderStatus !== "COMPLETED" &&
        order.orderStatus !== "CANCELLED" &&
        order.orderStatus !== "CANCELLED_REFUNDED" &&
        order.isPaid == true
    ).length;

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt));
            dispatch(getFavoritesEvents(jwt)); // Dispatch hành động để lấy sự kiện yêu thích
            dispatch(getUsersOrders(jwt));
            dispatch(getAllFavoritedRestaurantsEvents(jwt));
        }
    }, [dispatch, jwt]);

    return (
        <Box className='lg:flex justify-between'>
            <Box className='sticky lg:h-[80vh] lg:w-[20%] h-auto mx-5'>
                <ProfileNavigation open={openSideBar} handleClose={() => setOpenSideBar(false)}
                    setOpen={setOpenSideBar}
                    count={count}
                    orderCount={orderCount}
                />
            </Box>
            <Box className='lg:w-[80%] w-full h-auto'>
                <Routes>
                    <Route path='/' element={<UserProfile />} />
                    <Route path='/ChangePassword' element={<ChangingPassword/>}/>
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/address' element={<Address />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/events' element={<Events />} />
                    <Route path='/notification' element={<Notification />} />
                </Routes>
            </Box>
        </Box>
    )
}

export default Profile;
