import { Card, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../State/Authentication/Action';
import { isPresentInFavorite } from '../Config/logic';
import { getRestaurantById } from '../State/Restaurant/Action';
import { Bounce, toast } from 'react-toastify';

const RestaurantCard = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { auth } = useSelector(store => store);

    const handleAddToFavorite = () => {
        if(jwt){
            dispatch(addToFavorite({ jwt: jwt, restaurantId: item.id }));
        }
        else{
            toast.warn('Please login to add to favorites !', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                });
            navigate('/account/login');
        }
    }

    console.log("item", item);

    const handleNavigateToRestaurant = () => {
        //let newItem = dispatch(getRestaurantById({ jwt: jwt, restaurantId: item.id }));
        
        navigate(`/restaurant/${item.address?.city || item.city}/${item.name || item.title}/${item.id}`);
    }

    return (
        <Card className='w-[18rem]'>
            <div className={`${true ? 'cursor-pointer' : 'cursor-not-allowed'} relative`}>

                <img
                    onClick={handleNavigateToRestaurant}
                    className='w-full h-[10rem] object-cover object-center rounded-t-md'
                    src={item.images[0]} alt="" />
                <Chip
                    size='small'
                    className='absolute top-2 right-2'
                    color={item.open ? 'success' : 'error'}
                    label={item.open ? 'Open' : 'Closed'}
                />

            </div>
            <div
                className='p-4 textPart lg:flex w-full justify-between'
            >
                <div
                    className='space-y-1'
                >

                    <p
                        className='text-lg font-semibold cursor-pointer'
                        onClick={handleNavigateToRestaurant}
                    >
                        {item.name || item.title}
                    </p>

                    <p
                        className='text-gray-500 text-sm'
                    >
                        {item.description}
                    </p>

                </div>
                <div>
                    <IconButton onClick={handleAddToFavorite}>
                        {isPresentInFavorite(auth.favorites, item) ? <FavoriteIcon className='text-red-500' /> : <FavoriteBorderIcon />}
                    </IconButton>
                </div>

            </div>
        </Card>
    )
}

export default RestaurantCard;
