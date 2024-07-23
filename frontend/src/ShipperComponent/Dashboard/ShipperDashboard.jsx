import React, { useEffect } from 'react';
import CurrentRide from './CurrentRide';
import AllocatedRides from './AllocatedRides';
import { useDispatch, useSelector } from 'react-redux';
import { getAllocatedRides, getDriverCurrentRide, getDriverProfile } from '../../component/State/Driver/Action';

const ShipperDashboard = () => {
  const { ride, driver } = useSelector(store => store);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();

  useEffect(() => {
    if (driver?.data?.id) {
      dispatch(getDriverProfile(jwt));
      dispatch(getDriverCurrentRide({
        driverId: driver.data.id,
        token: jwt
      }));
      dispatch(getAllocatedRides({
        driverId: driver.data.id,
        token: jwt
      }));
    }
  }, [dispatch, jwt, driver?.data?.id]);

  return (
    <div className="p-8 bg-gray-950 min-h-screen space-y-8">
      <div className="shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-green-700">Current Ride</h2>
        <CurrentRide ride={driver.currentRide} />
      </div>
      <div className="shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Allocated Rides</h2>
        <AllocatedRides rides={driver.allocated} />
      </div>
    </div>
  );
};

export default ShipperDashboard;
