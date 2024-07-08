import React, { useEffect, useState } from 'react'
import ProfileNavigation from './ProfileNavigation'
import UserProfile from './UserProfile';
import { Route, Routes } from 'react-router-dom';
import Orders from './Orders';
import Address from './Address';
import Favorites from './Favorites';
import Events from './Events';
import { useMediaQuery, Box } from '@mui/material';
import Notification from './Notification';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../State/Authentication/Action';
import { getFavoritesEvents } from '../State/Event/Action';

const Profile = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const { auth, event } = useSelector(state => state);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [show, setShow] = useState(false);
    const count = event.favorites.length;

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt));
            dispatch(getFavoritesEvents(jwt)); // Dispatch hành động để lấy sự kiện yêu thích
        }
    }, [dispatch, jwt]);

    return (
        <Box className='lg:flex justify-between'>
            <Box className='sticky lg:h-[80vh] lg:w-[20%] h-auto mx-5'>
                <ProfileNavigation open={openSideBar} handleClose={() => setOpenSideBar(false)} setOpen={setOpenSideBar} count={count}/>
            </Box>
            <Box className='lg:w-[80%] w-full h-auto'>
                <Routes>
                    <Route path='/' element={<UserProfile />} />
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
