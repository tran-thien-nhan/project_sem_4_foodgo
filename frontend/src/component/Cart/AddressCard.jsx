import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Button, Card } from '@mui/material';


const AddressCard = ({item, showButton, handleSelectAddress}) => {

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
          391A Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, TP.HCM
        </p>
        {showButton && (
          <Button
            onClick={() => handleSelectAddress(item)}
            variant='outlined'
            fullWidth
          >
            Select
          </Button>
        )}
      </div>
    </Card>
  )
}

export default AddressCard
