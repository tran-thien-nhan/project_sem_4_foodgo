import { Card, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';

const RestaurantCard = () => {
    return (
        <Card className='w-[18rem]'>
            <div className={`${true ? 'cursor-pointer' : 'cursor-not-allowed'} relative`}>

                <img
                    className='w-full h-[10rem] object-cover object-center rounded-t-md'
                    src='https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg' alt="" />
                <Chip
                    size='small'
                    className='absolute top-2 right-2'
                    color={true ? 'success' : 'error'}
                    label={true ? 'Open' : 'Closed'}
                />

            </div>
            <div
                className='p-4 textPart lg:flex w-full justify-between'
            >
                <div
                    className='space-y-1'
                >

                    <p
                        className='text-lg font-semibold'
                    >
                        Alma Lounge
                    </p>

                    <p
                        className='text-gray-500 text-sm'
                    >
                        Craving it all? Order from this restaurant
                    </p>

                </div>
                <div>
                    <IconButton>
                        {true ? <FavoriteIcon className='text-red-500' /> : <FavoriteBorderIcon />}
                    </IconButton>
                </div>

            </div>
        </Card>
    )
}

export default RestaurantCard
