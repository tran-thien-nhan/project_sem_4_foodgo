import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { getRestaurantById, getRestaurantsCategory } from '../../component/State/Restaurant/Action'
import { getMenuItemsByRestaurantId } from '../../component/State/Menu/Action'
import { getUsersOrders } from '../../component/State/Order/Action'
import { fetchRestaurantsAllOrder, fetchRestaurantsOrder } from '../../component/State/Restaurant Order/Action'

const Admin = () => {
    const { restaurant } = useSelector(store => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [open, setOpen] = useState(false);



    const handleClose = (value) => {
        console.log(value)
        setOpen(false); // cập nhật trạng thái open
    }

    const handleToggleSidebar = () => {
        setOpen(!open);
    }

    useEffect(() => {
        dispatch(getRestaurantsCategory({ 
            jwt, 
            restaurantId: restaurant.usersRestaurant?.id 
        }));
        dispatch(fetchRestaurantsAllOrder({
            restaurantId: restaurant.usersRestaurant?.id,
            jwt
        }))
        // dispatch(getMenuItemsByRestaurantId());
        // dispatch(getRestaurantById()); 
        // dispatch(getUsersOrders())
    }, [])

    return (
        <div>
            <div className='lg:flex justify-between'>
                <div>
                    <AdminSidebar handleClose={(value) => handleClose(value)} />
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


