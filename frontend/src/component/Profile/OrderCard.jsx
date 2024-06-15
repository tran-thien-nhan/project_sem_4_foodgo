import { Button, Card } from '@mui/material'
import React from 'react'

const OrderCard = () => {
    return (
        <Card
            className='flex justify-between items-center p-5'
        >
            <div
                className='flex items-center space-x-5'
            >
                <img
                    className='h-16 w-16'
                    src="https://img.dominos.vn/cach-lam-pizza-chay-0.jpg" alt=""
                />
                <div>
                    <p>Pizza Mushroom</p>
                    <p>300.000đ</p>
                </div>
            </div>
            <div>
                <Button
                    // disabled
                    className='cursor-not-allowed'
                >
                    completed
                </Button>
            </div>
        </Card>
    )
}

export default OrderCard
