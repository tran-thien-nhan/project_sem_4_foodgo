import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateRestaurantForm from '../AdminComponent/CreateRestaurantForm/CreateRestaurantForm'
import Admin from '../AdminComponent/Admin/Admin'
import { useDispatch, useSelector } from 'react-redux'
import CreateShipperInFoForm from '../ShipperComponent/CreateShipperInFoForm/CreateShipperInFoForm'
import { getDriverProfile } from '../component/State/Driver/Action'
import AdminShipper from '../ShipperComponent/Admin/AdminShipper'

const ShipperRouter = () => {
    const { auth, driver } = useSelector(store => store)
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    useEffect(() => {
        dispatch(getDriverProfile(jwt));
    }, [jwt])
    return (
        <div>
            <Routes>
                <Route path="/*" element=
                    {
                        (!driver.data || auth.driver === null) ? <CreateShipperInFoForm /> : <AdminShipper />
                    }
                />
            </Routes>
        </div>
    )
}

export default ShipperRouter



