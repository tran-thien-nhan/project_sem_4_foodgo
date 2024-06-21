import { Button, Card, Chip } from '@mui/material'
import React from 'react'
import { format } from 'date-fns';

const OrderCard = ({item,order}) => {
    return (
        <Card
            className='flex justify-between items-center p-5'
        >
            <div
                className='flex items-center space-x-5'
            >
                <img
                    className='h-16 w-16'
                    src={item.food?.images[0]} alt=""
                />
                <div>
                    <p>{item.food?.name}</p>
                    <p>{item.totalPrice?.toLocaleString('vi-VN')}đ</p>
                    <div>
                        {
                            item.ingredients.map((i) => <Chip label={i} className='my-1 mx-1' />)
                        }
                    </div>
                    <p
                        className='text-gray-500'
                    >
                        {format(new Date(order.createdAt), "dd/MM/yy hh:mm a")}
                    </p>
                </div>
            </div>
            <div>
                <Button
                    // disabled
                    className='cursor-not-allowed'
                >
                    {order.orderStatus}
                </Button>
            </div>
        </Card>
    )
}

export default OrderCard
