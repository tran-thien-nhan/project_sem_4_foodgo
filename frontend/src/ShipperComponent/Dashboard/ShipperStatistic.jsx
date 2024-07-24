import React, { useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { completedRides, getDriverProfile, getDriverStatistics } from '../../component/State/Driver/Action';

const ShipperStatistic = ({rideSuccess, currentRide, totalRevenue, cancelledRides}) => {
    const dispatch = useDispatch();
    const { driver } = useSelector(store => store);
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (driver?.data?.id) {
            dispatch(getDriverProfile(jwt));
            dispatch(completedRides({
                driverId: driver.data.id,
                token: jwt
            }));
        }
    }, [dispatch, jwt, driver?.data?.id]);

    return (
        <div>
            <Card className="shadow-lg rounded-lg">
                <CardContent className="flex justify-around items-center">
                    <div className="text-center">
                        <img src="https://t3.ftcdn.net/jpg/01/71/13/24/360_F_171132449_uK0OO5XHrjjaqx5JUbJOIoCC3GZP84Mt.jpg" alt="Current" className="h-16 w-20 mx-auto" />
                        <Typography variant="body1" className="text-yellow-500 mt-2">
                            Current
                        </Typography>
                        <Typography variant="h6" className="text-yellow-500">
                            {currentRide ?? 0}
                        </Typography>
                    </div>
                    <div className="text-center">
                        <img src="https://t3.ftcdn.net/jpg/01/71/13/24/360_F_171132449_uK0OO5XHrjjaqx5JUbJOIoCC3GZP84Mt.jpg" alt="Cancel" className="h-16 w-20 mx-auto" />
                        <Typography variant="body1" className="text-red-500 mt-2">
                            Cancel
                        </Typography>
                        <Typography variant="h6" className="text-red-500">
                            {cancelledRides ?? 0}
                        </Typography>
                    </div>
                    <div className="text-center">
                        <img src="https://t3.ftcdn.net/jpg/01/71/13/24/360_F_171132449_uK0OO5XHrjjaqx5JUbJOIoCC3GZP84Mt.jpg" alt="Completed" className="h-16 w-20 mx-auto" />
                        <Typography variant="body1" className="text-green-500 mt-2">
                            Completed
                        </Typography>
                        <Typography variant="h6" className="text-green-500">
                            {rideSuccess ?? 0}
                        </Typography>
                    </div>
                    <div className="text-center">
                        <img src="https://static.vecteezy.com/system/resources/previews/005/048/374/original/gold-trophy-icon-on-transparent-background-free-vector.jpg" alt="Revenue" className="h-16 w-20 mx-auto" />
                        <Typography variant="body1" className="text-blue-500 mt-2">
                            Revenue
                        </Typography>
                        <Typography variant="h6" className="text-blue-500">
                            {totalRevenue.toLocaleString('vi-VN')} VNĐ
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShipperStatistic;
