import React from 'react'
import AdminSidebar from './AdminSidebar'
import Orders from '../Orders/Orders'   
import Menu from '../Menu/Menu'
import { Route, Routes } from 'react-router-dom'
import FoodCategory from '../FoodCategory/FoodCategory'
import Ingredients from '../Ingredients/Ingredients'
import Events from '../Events/Events'
import RestaurantDetails from './RestaurantDetails'
import RestaurantDashboard from '../Dashboard/RestaurantDashboard'
import CreateMenuForm from '../Menu/CreateMenuForm'

const Admin = () => {
    const handleClose = () => {
        console.log('close')
    }
    return (
        <div>
            <div className='lg:flex justify-between'>
                <div>
                    <AdminSidebar handleClose={handleClose} />
                </div>
                <div className='lg:w-[80%] '>
                    <Routes>
                        <Route path="/" element={<RestaurantDashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/category" element={<FoodCategory />} />
                        <Route path="/ingredients" element={<Ingredients />} />
                        <Route path="/event" element={<Events />} />
                        <Route path="/details" element={<RestaurantDetails />} />
                        <Route path="/add-menu" element={<CreateMenuForm />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Admin


