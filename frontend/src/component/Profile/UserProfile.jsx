import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';

const UserProfile = () => {
    const handleLogout = () => {
        console.log('logout');
    }
    return (
        <div
            className='min-h-[80vh] flex flex-col justify-center items-center'
        >
            <div
                className='flex flex-col justify-center items-center'
            >
                <AccountCircleIcon sx={{ fontSize: "9rem" }} />
                <h1
                    className='py-5 text-2xl font-semibold'
                >
                    nhan thien tran
                </h1>
                <p>Email: nhan@gmail.com</p>
                <Button
                    variant='contained'
                    onClick={handleLogout}
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
    )
}

export default UserProfile
