import { Avatar, Box, Button, IconButton } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { pink } from '@mui/material/colors';
import { useSelector } from 'react-redux';

const AdminNavBar = ({ toggleDrawer }) => {
    const { auth } = useSelector(store => store);

    return (
        <Box className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between' sx={{ zIndex: 100 }}>
            <div className="flex items-center space-x-4">
                <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                    <ul className="flex items-center space-x-4">
                        <li className="logo text-gray-300 text-2xl">
                            <Avatar
                                sx={{ bgcolor: "white", color: pink.A400 }}
                            >
                                {auth.user?.fullName[0].toUpperCase()}
                            </Avatar>
                        </li>
                        <li className="logo font-semibold text-gray-300 text-2xl">
                            <Link to="/admin/restaurants/">FoodGo</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-10">
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
            </div>
        </Box>
    )
}

export default AdminNavBar
