import React from 'react'
import ProfileNavigation from './ProfileNavigation'
import UserProfile from './UserProfile';
import { Route, Routes } from 'react-router-dom';
import Orders from './Orders';
import Address from './Address';
import Favorites from './Favorites';
import Events from './Events';
import { useMediaQuery, Box } from '@mui/material';

const Profile = () => {
    const [openSideBar, setOpenSideBar] = React.useState(false);
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    return (
        <Box className='lg:flex justify-between'>
            <Box className='sticky lg:h-[80vh] lg:w-[20%] h-auto mx-5'>
                <ProfileNavigation open={openSideBar} handleClose={() => setOpenSideBar(false)} />
            </Box>
            <Box className='lg:w-[80%] w-full h-auto'>
                <Routes>
                    <Route path='/' element={<UserProfile />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/address' element={<Address />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/events' element={<Events />} />
                </Routes>
            </Box>
        </Box>
    )
}

export default Profile;
