import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Button, Card, Typography } from '@mui/material';


const AddressCard = ({ item, showButton, onSelectAddress, address }) => {
  const handleSelect = () => {
    onSelectAddress(address);
  };
  return (
    <Card className='flex gap-5 w-64 p-5'>
      <HomeIcon />
      <div
        className='space-y-3 text-gray-500'
      >
        <h1
          className='font-semibold text-lg text-white'
        >
          Home
        </h1>
        <p>
          {address.streetAddress}
        </p>
        <div className='hidden'>
          <p>
            {address.state}
          </p>
          <p>
            {address.pinCode}
          </p>
          <p>
            {address.city}
          </p>
        </div>
        {showButton && (
          <Button variant="contained" fullWidth color="primary" onClick={handleSelect}>
            Select
          </Button>
        )}
      </div>
    </Card>
  )
}

export default AddressCard

