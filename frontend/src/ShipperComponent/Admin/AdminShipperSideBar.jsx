import React from 'react'
import { Dashboard } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useClerk } from '@clerk/clerk-react';
import { logOut } from '../../component/State/Authentication/Action';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, useMediaQuery } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const menu = [
    { title: 'Dashboard', icon: <Dashboard />, path: '/' },
    { title: 'Rides History', icon: <WorkHistoryIcon />, path: '/' },
    { title: 'Shipper Details', icon: <AdminPanelSettingsIcon />, path: '/details' },
    { title: 'Log out', icon: <LogoutIcon />, path: '/' }
]

const AdminShipperSideBar = ({ toggleDrawer }) => {
    const isSmallScreen = useMediaQuery('(max-width: 1080px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { signOut } = useClerk();

    const handleNavigate = (item) => {
        navigate(`/admin/shippers${item.path}`);
        if (item.title === 'Log out') {
            signOut();
            navigate('/');
            dispatch(logOut());
        }
    }
    return (
        <div onClick={toggleDrawer(false)}>
            <div className='w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-x
                     space-y-[1.65rem]'>
                {
                    menu.map((item, i) =>
                        <>
                            <div onClick={() => handleNavigate(item)} className='px-5 flex items-center gap-5 cursor-pointer mt-8'>
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                            {i !== menu.length - 1 && <Divider />}
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default AdminShipperSideBar
