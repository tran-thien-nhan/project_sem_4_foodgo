import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRouter from './AdminRouter'
import CustomerRouter from './CustomerRouter'
import ShipperRouter from './ShipperRouter'
import SuperAdminHome from '../SuperAdmin/Admin/SuperAdminHome'

const Routers = () => {
    return (
        <div>
            <Routes>
                <Route path="/admin/restaurants/*" element={<AdminRouter />} />
                <Route path="/*" element={<CustomerRouter />} />
                <Route path="/admin/shippers/*" element={<ShipperRouter />} />
                <Route path="/sup-admin/*" element={<SuperAdminHome />} />
            </Routes>
        </div>
    )
}

export default Routers
