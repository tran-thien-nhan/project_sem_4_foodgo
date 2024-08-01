import { Avatar, Badge, Box, Button, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { pink } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { cancelledRides, completedRides, getAllocatedRides, getDriverCurrentRide, getDriverProfile } from '../State/Driver/Action';

const ShipperNavbar = ({ toggleDrawer }) => {
    const { auth, ride, driver } = useSelector(store => store);
    const jwt = localStorage.getItem('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (driver?.data?.id) {
            dispatch(getDriverProfile(jwt));
            dispatch(getDriverCurrentRide({
                driverId: driver.data.id,
                token: jwt
            }));
            dispatch(getAllocatedRides({
                driverId: driver.data.id,
                token: jwt
            }));
            dispatch(completedRides({
                driverId: driver.data.id,
                token: jwt
            }));
            dispatch(cancelledRides({
                driverId: driver.data.id,
                token: jwt
            }))
        }
    }, [dispatch, jwt, driver?.data?.id]);

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
                            <Link to="/admin/shippers">FoodGo</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-10">
                <IconButton>
                    <Badge badgeContent={driver.allocated.length} color="secondary" onClick={()=>navigate("/admin/shippers")}>
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

export default ShipperNavbar
