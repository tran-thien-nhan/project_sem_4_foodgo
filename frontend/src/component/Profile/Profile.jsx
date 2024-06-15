import React from 'react'
import ProfileNavigation from './ProfileNavigation'
import UserProfile from './UserProfile';
import { Route, Routes } from 'react-router-dom';
import Orders from './Orders';
import Address from './Address';
import Favorites from './Favorites';
import Events from './Events';

const Profile = () => {
    const [openSideBar, setOpenSideBar] = React.useState(false);
    return (
        <div className='lg:flex justify-between'>
            <div className='sticky h-[80vh] lg:w-[20%]'>
                <ProfileNavigation open={openSideBar} />
            </div>
            <div className='lg:w-[80%]'>
                <Routes>
                    <Route path='/' element={<UserProfile />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/address' element={<Address />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/events' element={<Events />} />
                </Routes>
            </div>
        </div>
    )
}

export default Profile
