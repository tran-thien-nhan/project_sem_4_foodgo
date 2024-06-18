import { Divider, FormControl, Grid, Radio, RadioGroup, Typography, FormControlLabel, getMenuItemUtilityClass } from '@mui/material'
import React, { useEffect } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from 'react';
import MenuCard from './MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../State/Menu/Action';

// const categories = [
//     "pizza",
//     "burger",
//     "noodles",
//     "rice",
//     "milk tea",
// ]

const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetarian" },
    { label: "Seasonal", value: "seasonal" },
]
const menu = [1, 1, 1, 1, 1, 1]

const RestaurantDetail = () => {
    const [foodType, setFoodType] = React.useState("all");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { auth, restaurant } = useSelector(store => store);
    const { id, city } = useParams();

    const handleFilter = (e) => {
        console.log(e.target.value, e.target.name);
    }

    console.log("restaurant", restaurant);

    useEffect(() => {
        dispatch(getRestaurantById({ jwt: jwt, restaurantId: id }));
        dispatch(getRestaurantsCategory({ jwt: jwt, restaurantId: id }));
        dispatch(getMenuItemsByRestaurantId({ 
            jwt: jwt, 
            restaurantId: id , 
            vegetarian: false, 
            nonveg: false, 
            seasonal: false, 
            foodCategory: "" 
        }));
        
    }, [])

    return (
        <div
            className='px-5 lg:px-20 pb-5'
        >
            <section>
                <h3
                    className='text-gray-500 py-2 mt-10'
                >Home/vietnam/vietnamese food/3</h3>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <img
                                className='w-full h-[40vh] object-cover object-center'
                                src={restaurant.restaurant?.images[0]} alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img
                                className='w-full h-[40vh] object-cover object-center'
                                src={restaurant.restaurant?.images[1]} alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img
                                className='w-full h-[40vh] object-cover object-center'
                                src={restaurant.restaurant?.images[2] || restaurant.restaurant?.images[0]} alt="" />
                        </Grid>
                    </Grid>
                </div>
                <div
                    className='pt-3 pb-5'
                >
                    <h1 className='text-4xl font-semibold'>{restaurant.restaurant?.name || restaurant.restaurant?.title}</h1>

                    <p
                        className='text-gray-500 mt-1'
                    >
                        {restaurant.restaurant?.description}
                    </p>

                    <div className='space-y-3 mt-3'>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <LocationOnIcon />
                            <span>
                                VietNam, Cam Ranh
                            </span>
                        </p>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <CalendarTodayIcon />
                            <span>
                                Mon-Sun: 9:00 AM - 9:00 PM (Open Now)
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            <Divider />
            <section className='pt-[2rem] lg:flex relative'>

                <div className='space-y-10 lg:w-[20%] filter'>
                    <div
                        className='box space-y-5 lg:sticky top-28'
                    >
                        <div>
                            <Typography
                                variant='h5'
                                sx={{ paddingBottom: '1rem' }}
                            >
                                Food Type
                            </Typography>

                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup name='food_type' value={foodType} onChange={handleFilter}>
                                    {
                                        foodTypes.map((item) => (
                                            <FormControlLabel
                                                key={item.value}
                                                value={item.value}
                                                control={<Radio />}
                                                label={item.label} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <Divider />

                        <div>
                            <Typography
                                variant='h5'
                                sx={{ paddingBottom: '1rem' }}
                            >
                                Food Category
                            </Typography>

                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup name='food_type' value={foodType} onChange={handleFilter}>
                                    {
                                        restaurant.categories.map((item) => (
                                            <FormControlLabel
                                                key={item}
                                                value={item}
                                                control={<Radio />}
                                                label={item.name}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className='space-y-10 lg:w-[80%] lg:pl-10'>
                    {
                        menu.map((item, index) => (
                            <MenuCard key={index} />
                        ))
                    }
                </div>

            </section>
        </div>
    )
}

export default RestaurantDetail
