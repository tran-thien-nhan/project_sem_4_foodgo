import React from 'react';
import { Card, Typography } from '@mui/material';
import OrderBarChart from './OrderBarChart';

const RestaurantDashboard = () => {
  return (
    <div>
      <Card className='p-5'>
        <Typography sx={{ paddingBottom: "1rem" }} variant='h5'>
          DASHBOARD
        </Typography>
        <OrderBarChart />
      </Card>
    </div>
  );
};

export default RestaurantDashboard;
