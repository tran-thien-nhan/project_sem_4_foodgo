import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelledRides, completedRides } from '../../component/State/Driver/Action';
import ShipperCompletedRides from './ShipperCompletedRides';
import ShipperCancelledRides from './ShipperCancelledRides';

const ShipperHistory = () => {
    const { driver, completeRides, cancelledRides: cancelledRidesData } = useSelector(store => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (driver?.data?.id) {
            dispatch(completedRides(
                {
                    driverId: driver.data.id,
                    token: jwt
                }
            ));
            dispatch(cancelledRides(
                {
                    driverId: driver.data.id,
                    token: jwt
                }
            ));
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Driver History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ShipperCompletedRides rides={driver.listCompletedRides} />
                <ShipperCancelledRides rides={driver.listCancelledRides} />
            </div>
        </div>
    );
};

export default ShipperHistory;
