import { Chip, IconButton } from '@mui/material'
import React, { useState } from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CartItem = () => {
    const [quantity, setQuantity] = useState(1);
    const handleRemove = () => {
        if(quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleAdd = () => {
        setQuantity(quantity + 1);
    }
    
    return (
        <div className='px-5'>
            <div className='lg:flex items-center lg:space-x-5'>
                <div>
                    <img
                        className='w-[5rem] h-[5rem] object-cover'
                        src="https://img.dominos.vn/cach-lam-pizza-chay-0.jpg"
                        alt=""
                    />
                </div>
                <div
                    className='flex items-center justify-between lg:w-[70%]'
                >
                    <div
                        className='space-y-1 lg:space-y-3 w-full'
                    >
                        <p>Pizza Mushroom</p>
                        <div
                            className='flex justify-between items-center'
                        >
                            <div
                                className='flex items-center space-x-1'
                            >
                                <IconButton>
                                    <RemoveCircleOutlineIcon onClick={handleRemove} />
                                </IconButton>
                                <div
                                    className='w-5 h-5 text-xs flex items-center justify-center'
                                >
                                    {quantity}
                                </div>
                                <IconButton>
                                    <AddCircleOutlineIcon onClick={handleAdd}/>
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <p>300.000đ</p>
                </div>
            </div>
            <div
                className='pt-3 space-x-2'
            >
                {
                    [1,1,1].map((item, index) => 
                        <Chip
                            label={"bread"}

                        />
                    )
                }
            </div>
        </div>
    )
}

export default CartItem
