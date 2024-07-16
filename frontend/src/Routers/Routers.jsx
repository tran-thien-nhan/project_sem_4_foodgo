import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminRouter from './AdminRouter'
import CustomerRouter from './CustomerRouter'
import ShipperRouter from './ShipperRouter'

const Routers = () => {
    return (
        <div>
            <Routes>
                <Route path="/admin/restaurants/*" element={<AdminRouter />} />
                <Route path="/*" element={<CustomerRouter />} />
                <Route path="/admin/shippers/*" element={<ShipperRouter />} />
            </Routes>
        </div>
    )
}

export default Routers
