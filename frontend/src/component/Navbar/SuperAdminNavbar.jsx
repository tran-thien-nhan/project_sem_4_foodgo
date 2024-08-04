import { Avatar, Badge, Box, IconButton } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { pink } from '@mui/material/colors';

const SuperAdminNavbar = ({ toggleDrawer }) => {
    const { auth, ride, driver } = useSelector(store => store);
    const jwt = localStorage.getItem('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <Box className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between' sx={{ zIndex: 100 }}>
            <div className="flex items-center space-x-4">
                <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                    <ul className="flex items-center space-x-4">
                        <li className="logo text-gray-300 text-2xl">
                            <Avatar
                                sx={{ bgcolor: "white", color: pink.A400 }}
                            >
                                {/* {auth.user?.fullName[0].toUpperCase()} */}
                                T
                            </Avatar>
                        </li>
                        <li className="logo font-semibold text-gray-300 text-2xl">
                            <Link to="/sup-admin">FoodGo</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-10">
                <IconButton>
                    <Badge badgeContent={0} color="secondary" onClick={() => navigate("/sup-admin")}>
                        <NotificationsIcon sx={{ color: 'white' }} />
                    </Badge>
                </IconButton>
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
            </div>
        </Box>
    )
}

export default SuperAdminNavbar
