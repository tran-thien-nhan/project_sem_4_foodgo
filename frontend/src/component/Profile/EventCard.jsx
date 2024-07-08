import { Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { isPresentInEventDtoFavorites } from '../Config/logic';

const EventCard = ({ event, onAddEventToFavorites, eventsFavorites, onShow }) => {
    return (
        <div>
            <Card sx={{ width: 345 }}>
                <CardMedia
                    sx={{ height: 345 }}
                    image={event.images[0]}
                    className='object-cover'
                />
                <CardContent>
                    <Typography variant='h5'>
                        {event.name}
                    </Typography>
                    <Typography variant='body2' className='pt-2'>
                        {event.description}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item className='py-2 space-y-2' xs={12}>
                            <p className='text-sm pt-2'>{event.location}</p>
                            <p className='text-sm text-blue-500'>{event.startedAt}</p>
                            <p className='text-sm text-red-500'>{event.endsAt}</p>
                            {
                                (onShow === false)
                                &&
                                <p className='text-sm text-yellow-500 italic'>On Going</p>
                            }
                        </Grid>
                        <Grid container spacing={2} className='pl-4'>
                            <Grid item sx={12}>
                                <Grid item sx={9}>
                                    {
                                        event.ofRestaurant
                                            ?
                                            <>
                                                <p className='text-sm text-green-500 italic flex gap-1'>
                                                    <span>-</span>
                                                    <p>{event.ofRestaurant}</p>
                                                    <span>-</span>
                                                </p>
                                            </>
                                            :
                                            ''
                                    }

                                </Grid>
                                {
                                    (onShow === true)
                                    &&
                                    <>
                                        <Grid item xs={3}>
                                            <CardActions className='flex justify-between'>
                                                <IconButton onClick={() => onAddEventToFavorites(event)}>
                                                    {
                                                        isPresentInEventDtoFavorites(eventsFavorites || [], event) // Đảm bảo eventsFavorites là một mảng
                                                            ? <FavoriteIcon className='text-red-500' />
                                                            : <FavoriteBorderIcon />
                                                    }
                                                </IconButton>
                                            </CardActions>
                                        </Grid>
                                    </>
                                }

                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default EventCard;
