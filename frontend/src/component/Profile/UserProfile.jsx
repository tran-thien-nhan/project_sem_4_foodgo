import React, { useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../State/Authentication/Action';
import { getAllRestaurantsAction } from '../State/Restaurant/Action';
import { useClerk, useUser } from '@clerk/clerk-react';
import { pink } from '@mui/material/colors';

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { auth } = useSelector(store => store);
    const { signOut } = useClerk();
    const { user } = useUser();
    const userLoggedIn = localStorage.getItem('clerk_telemetry_throttler');

    console.log(auth);

    const handleNavigate = (itemName) => {
        if (itemName === "Logout") {
            dispatch(logOut());
            signOut();
            navigate("/");
        } else {
            navigate(`/my-profile/${itemName.toLowerCase()}`);
        }
    }

    return (
        <div className='min-h-[80vh] flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                {/* <AccountCircleIcon
                    sx={{ fontSize: "9rem" }}
                /> */}
                {
                    auth.user
                    &&
                    (
                        <Avatar
                            sx={{ bgcolor: "white", color: pink.A400, width: 120, height: 120 }}
                            className='cursor-pointer'
                            src={(auth.user || userLoggedIn) ? user?.imageUrl : ""}
                        >
                            {auth.user?.fullName[0].toUpperCase()}
                        </Avatar>
                    )
                }
                <h1 className='py-5 text-2xl font-semibold'>
                    {auth.user?.fullName}
                </h1>
                <p>Email: {auth.user?.email}</p>
                <Button
                    variant='contained'
                    onClick={() => handleNavigate("Logout")}
                    sx={{ margin: "2rem 0rem" }}
                >
                    <LogoutIcon
                        sx={{ fontSize: "1.5rem" }}
                        className='mr-2'
                    />
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default UserProfile;
