import { Drawer } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import SuperAdminSideBar from './SuperAdminSideBar';
import Dashboard from '../Dashboard/Dashboard';
import SuperAdminNavbar from '../../component/Navbar/SuperAdminNavbar';
import AdvertiseManager from '../Advertise/AdvertiseManager';

const SuperAdminHome = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <div>
    <div className='lg:flex justify-between'>
        <Drawer open={open} onClose={toggleDrawer(false)}>
            <SuperAdminSideBar toggleDrawer={toggleDrawer} />
        </Drawer>
        <div className='lg:w-[100%] '>
            <SuperAdminNavbar toggleDrawer={toggleDrawer} />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/advertise" element={<AdvertiseManager />} />
            </Routes>
        </div>
    </div>
</div>
  )
}

export default SuperAdminHome
