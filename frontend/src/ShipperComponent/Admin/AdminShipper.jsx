import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDriverProfile } from '../../component/State/Driver/Action';
import { Drawer } from '@mui/material';
import AdminShipperSideBar from './AdminShipperSideBar';
import ShipperDashboard from '../Dashboard/ShipperDashboard';
import AdminNavBar from '../../component/Navbar/AdminNavBar';
import { Route, Routes } from 'react-router-dom';
import ShipperNavbar from '../../component/Navbar/ShipperNavbar';
import ShipperDetails from '../Details/ShipperDetails';

const AdminShipper = () => {
    const { driver } = useSelector(store => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleClose = (value) => {
        console.log(value)
        setOpen(false); // cập nhật trạng thái open
    }

    const handleToggleSidebar = () => {
        setOpen(!open);
    }

    useEffect(() => {
        dispatch(getDriverProfile(jwt));
    }, [jwt]);
    return (
        <div>
            <div className='lg:flex justify-between'>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    <AdminShipperSideBar toggleDrawer={toggleDrawer} />
                </Drawer>
                <div className='lg:w-[100%] '>
                    <ShipperNavbar toggleDrawer={toggleDrawer} />
                    <Routes>
                        <Route path="/" element={<ShipperDashboard />} />
                        <Route path="/details" element={<ShipperDetails />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default AdminShipper
