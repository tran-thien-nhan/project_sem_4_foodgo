import React, { useEffect } from 'react';
import CurrentRide from './CurrentRide';
import AllocatedRides from './AllocatedRides';
import { useDispatch, useSelector } from 'react-redux';
import { cancelledRides, completedRides, getAllocatedRides, getDriverCurrentRide, getDriverProfile, updateDriverLocation } from '../../component/State/Driver/Action';
import ShipperStatistic from './ShipperStatistic';
import DriverLocation from './DriverLocation';

const ShipperDashboard = () => {
  const { ride, driver } = useSelector(store => store);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();

  useEffect(() => {
    if (driver?.data?.id) {
      dispatch(getDriverProfile(jwt));

      // Hàm cập nhật tọa độ khi có thay đổi
      const updateLocation = (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Updated location: Latitude: ${latitude}, Longitude: ${longitude}`);

        const data = {
          latitude,
          longitude
        }

        dispatch(updateDriverLocation({
          driverId: driver.data.id,
          reqData: data,
          token: jwt
        }));
      };

      // Theo dõi sự thay đổi vị trí
      let watchId;
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updateLocation, (error) => {
          console.error('Error watching position:', error);
        });
      }

      return () => {
        if (watchId !== undefined) {
          navigator.geolocation.clearWatch(watchId); // Clear watch khi component bị unmount
        }
      };
    }
  }, [dispatch, jwt, driver?.data?.id]);

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
      dispatch(completedRides({
        driverId: driver.data.id,
        token: jwt
      }));
      dispatch(cancelledRides({
        driverId: driver.data.id,
        token: jwt
      }))
    }
  }, [dispatch, jwt, driver?.data?.id]);

  return (
    <div className="p-8 bg-gray-950 min-h-screen space-y-8">
      <div className="shadow-lg rounded-lg p-4">
        <ShipperStatistic
          rideSuccess={driver.completeRides}
          cancelledRides={driver.cancelledRides}
          currentRide={driver.currentRide ? 1 : 0}
          totalRevenue={driver.data.totalRevenue}
        />
      </div>
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
