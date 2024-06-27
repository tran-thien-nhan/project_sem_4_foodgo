import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import OrderTable from './OrderTable'

const OrderStatus = [
  {
    value: "ALL",
    label: "All"
  },
  {
    value: "DELIVERY",
    label: "delivery"
  },
  {
    value: "PENDING",
    label: "Pending"
  },
  {
    value: "COMPLETED",
    label: "Completed"
  },
  {
    value: "CANCELLED",
    label: "Cancelled"
  }
]

const Orders = () => {
  const [filterValue, setFilterValue] = useState("all")
  const handleFilter = (e, value) => {
    setFilterValue(value)
  }
  return (
    <div className='px-2'>
      <Card className='p-5'>
        <Typography sx={{ paddingBottom: "1rem" }} variant='h5'>
          Order Status
        </Typography>
        <FormControl>
          <RadioGroup row name='category' value={filterValue || "all"} onChange={handleFilter}>
            {
              OrderStatus.map((item) => (
                <FormControlLabel
                  key={item.label}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                  sx={{ color: "gray" }}
                />
              ))
            }
          </RadioGroup>
        </FormControl>
      </Card>
      <OrderTable filterValue={filterValue} />
    </div>
  )
}

export default Orders
