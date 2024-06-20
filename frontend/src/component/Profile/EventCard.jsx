import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const EventCard = () => {
    return (
        <div>
            <Card sx={{ width: 345 }}>
                <CardMedia
                    sx={{ height: 345 }}
                    image='https://static.vinwonders.com/production/buffet-hai-san-ha-noi-25.jpg'
                    className='object-cover'
                />
                <CardContent>
                    <Typography variant='h5'>
                        Seafood Buffet
                    </Typography>
                    <Typography variant='body2' className='space-y-2'>
                        50% discount on first order
                    </Typography>
                    <div
                        className='py-2 space-y-2'
                    >
                        <p>Nha Trang, Khanh Hoa</p>
                        <p
                            className='text-sm text-blue-500'
                        >
                            June 14, 2024
                        </p>
                        <p
                            className='text-sm text-red-500'
                        >
                            July 14, 2024
                        </p>
                    </div>
                </CardContent>
                {
                    false &&
                    <>
                        <CardActions className='flex justify-between'>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </>
                }
            </Card>
        </div>
    )
}

export default EventCard
