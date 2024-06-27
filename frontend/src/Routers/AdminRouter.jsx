import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreateRestaurantForm'
import Admin from '../AdminComponent/Admin/Admin'

const AdminRouter = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={!true ? <CreateRestaurantForm /> : <Admin />} />
            </Routes>
        </div>
    )
}

export default AdminRouter
