import { Divider } from '@mui/material'
import React from 'react'
import CartItem from './CartItem'

const items = [1, 1]

const Cart = () => {
    return (
        <div>
            <main
                className='lg:flex justify-between'
            >
                <section
                    className='lg:w-[30%] space-y-6 lg:min-h-screen pt-10'
                >
                    {
                        items.map((item, index) =>
                            <CartItem key={index} />
                        )
                    }
                    <Divider />
                    <div
                        className='billDetails px-5 text-sm'
                    >
                        <p
                            className='font-extrabold py-5'
                        >
                            Bill Detail
                        </p>
                        <div
                            className='space-y-3'
                        >
                            <div
                                className='flex justify-between text-gray-400'
                            >
                                <p>Item Total</p>
                                <p>60.000đ</p>
                            </div>
                            <div
                                className='flex justify-between text-gray-400'
                            >
                                <p>Delivery Fee</p>
                                <p>10.000đ</p>
                            </div>
                            <div
                                className='flex justify-between text-gray-400'
                            >
                                <p>Platform Fee</p>
                                <p>1.000đ</p>
                            </div>
                            <div
                                className='flex justify-between text-gray-400'
                            >
                                <p>GST and Restaurant Charge</p>
                                <p>31.000đ</p>
                            </div>
                            <Divider />
                        </div>
                        <div
                            className='flex justify-between text-gray-400'
                        >
                            <p>Total Pay</p>
                            <p>102.000đ</p>
                        </div>


                    </div>
                </section>
                <Divider
                    orientation='vertical'
                    flexItem
                />
                <section
                    className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'
                >
                    <div>
                        <h1
                            className='text-center font-semibold text-2xl py-10'
                        >
                            Choose Delivery Address
                        </h1>
                        <div
                            className='flex flex-wrap items-center gap-5'
                        >
                           
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Cart
