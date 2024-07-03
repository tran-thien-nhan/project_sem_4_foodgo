import { Dashboard, ShoppingBag } from '@mui/icons-material'
import React, { useState } from 'react'
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventIcon from '@mui/icons-material/Event';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../component/State/Authentication/Action';
import { useClerk } from '@clerk/clerk-react';

const menu = [
    { title: 'Dashboard', icon: <Dashboard />, path: '/' },
    { title: 'Orders', icon: <ShoppingBag />, path: '/orders' },
    { title: 'Menu', icon: <ShopTwoIcon />, path: '/menu' },
    { title: 'Food Category', icon: <CategoryIcon />, path: '/category' },
    { title: 'Ingredients', icon: <FastfoodIcon />, path: '/ingredients' },
    { title: 'Events', icon: <EventIcon />, path: '/event' },
    { title: 'Restaurant Details', icon: <AdminPanelSettingsIcon />, path: '/details' },
    { title: 'Log out', icon: <LogoutIcon />, path: '/' },
]

const AdminSidebar = ({ handleClose }) => {
    const isSmallScreen = useMediaQuery('(max-width: 1080px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { signOut } = useClerk();

    const handleNavigate = (item) => {
        navigate(`/admin/restaurants${item.path}`);
        if (item.title === 'Log out') {
            signOut();
            navigate('/');
            dispatch(logOut());
        }
    }

    return (
        <div>
            <>
                <Drawer
                    variant={isSmallScreen ? 'temporary' : 'permanent'}
                    onClose={handleClose}
                    open={true}
                    anchor='left'
                    sx={{ zIndex: 1 }}
                >

                    <div className='w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-x
                     space-y-[1.65rem]'>
                        {
                            menu.map((item, i) =>
                                <>
                                    <div onClick={()=>handleNavigate(item)} className='px-5 flex items-center gap-5 cursor-pointer mt-8'>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    {i !== menu.length - 1 && <Divider />}
                                </>
                            )
                        }
                    </div>

                </Drawer>
            </>
        </div>
    )
}

export default AdminSidebar
