import { Card, CardActions, CardContent, CardMedia, Chip, Grid, IconButton, Typography, CircularProgress, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { isPresentInEventDtoFavorites } from '../Config/logic';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onAddEventToFavorites, eventsFavorites, onShow, onEdit, showEdit, onUpdateAvailability, showCheckIn }) => {
    const [isEventLoading, setIsEventLoading] = useState(false);
    const isLoading = useSelector(state => state.event.loading);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            setIsEventLoading(false);
        }
    }, [isLoading]);

    const handleUpdateAvailability = async (event) => {
        setIsEventLoading(true);
        await onUpdateAvailability(event);
    };

    const handleCheckIn = (eventId) => {
        if (showCheckIn === true) {
            navigate(`/admin/restaurants/check-in/${eventId}`);
        }
    }

    return (
        <div>
            <Card sx={{ width: 345, height: 690 }}>
                <CardMedia
                    sx={{ height: 345 }}
                    image={event.images[0]}
                    className='object-cover'
                    onClick={() => handleCheckIn(event.id)}
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
                                <p className='text-sm text-yellow-500 italic'>
                                    {
                                        event.available
                                            ?
                                            <>
                                                {
                                                    event.full
                                                        ? <Chip label="Full" sx={{ backgroundColor: "red" }} />
                                                        : <Chip label="Available" sx={{ backgroundColor: "green" }} />
                                                }
                                            </>
                                            :
                                            <>
                                                <Chip label="Cancelled" sx={{ backgroundColor: "orange", color: "black", fontWeight: "bold" }} />
                                            </>
                                    }
                                </p>
                            }
                        </Grid>
                        <Grid container spacing={2} className='pl-4'>
                            <Grid item sx={12}>
                                <Grid item sx={9}>
                                    {
                                        (event.ofRestaurant || event.restaurant.name)
                                            ?
                                            <>
                                                <p className='text-sm text-green-500 italic flex gap-1'>
                                                    <span>-</span>
                                                    <p>{event.ofRestaurant || event.restaurant.name}</p>
                                                    <span>-</span>
                                                </p>
                                            </>
                                            :
                                            ''
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={12}>
                            <>
                                <Chip label=
                                    {
                                        <IconButton className='flex gap-1'>
                                            <p className='text-sm'>{event.totalFavorites} / {event.eventLimit}</p>
                                            <PersonIcon
                                                sx={{ fontSize: "1.25rem" }}
                                            />
                                        </IconButton>
                                    }
                                    className='my-1' sx={{ backgroundColor: "green" }} />
                            </>
                            {
                                showEdit &&
                                <IconButton onClick={() => handleUpdateAvailability(event)}>
                                    {
                                        isEventLoading
                                            ? <CircularProgress size={24} />
                                            : event.available
                                                ? <VisibilityIcon />
                                                : <VisibilityOffIcon />
                                    }
                                </IconButton>
                            }
                            {
                                (onShow === true)
                                &&
                                <>
                                    <Grid item xs={3}>
                                        <CardActions className='flex justify-between'>
                                            <IconButton onClick={() => onAddEventToFavorites(event)}>
                                                {
                                                    isPresentInEventDtoFavorites(eventsFavorites || [], event)
                                                        ? <AddCircleIcon className='text-red-500' />
                                                        : <AddCircleOutlineIcon />
                                                }
                                            </IconButton>
                                        </CardActions>
                                    </Grid>
                                </>
                            }
                            {
                                showCheckIn &&
                                <>
                                    <Grid item>
                                        <CardActions className='flex justify-between'>
                                            <Button variant="contained" color="primary" onClick={() => handleCheckIn(event.id)}>
                                                Check In
                                            </Button>
                                        </CardActions>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default EventCard;
