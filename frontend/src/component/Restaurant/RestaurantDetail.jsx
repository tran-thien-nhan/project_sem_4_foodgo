import { Divider, FormControl, Grid, Radio, RadioGroup, Typography, FormControlLabel } from '@mui/material'
import React from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from 'react';
import MenuCard from './MenuCard';

const categories = [
    "pizza",
    "burger",
    "noodles",
    "rice",
    "milk tea",
]

const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetarian" },
    { label: "Seasonal", value: "seasonal" },
]
const menu = [1,1,1,1,1,1]

const RestaurantDetail = () => {
    const [foodType, setFoodType] = React.useState("all");
    const handleFilter = (e) => {
        console.log(e.target.value, e.target.name);
    }
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
                                src="https://cdn.vox-cdn.com/thumbor/5d_RtADj8ncnVqh-afV3mU-XQv0=/0x0:1600x1067/1200x900/filters:focal(672x406:928x662)/cdn.vox-cdn.com/uploads/chorus_image/image/57698831/51951042270_78ea1e8590_h.7.jpg" alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img
                                className='w-full h-[40vh] object-cover object-center'
                                src="https://cdn.concreteplayground.com/content/uploads/2023/11/the-dry-dock-balmain-supplied.jpg" alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img
                                className='w-full h-[40vh] object-cover object-center'
                                src="https://cdn.britannica.com/02/239402-050-ACC075DB/plates-of-vegan-foods-ready-serve-restaurant-London.jpg" alt="" />
                        </Grid>
                    </Grid>
                </div>
                <div
                    className='pt-3 pb-5'
                >
                    <h1 className='text-4xl font-semibold'>Alma Lounge</h1>

                    <p
                        className='text-gray-500 mt-1'
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nostrum nobis architecto repellendus ad ex hic aperiam, quidem, veniam maxime modi saepe similique mollitia eligendi libero fuga. Et, recusandae dignissimos?
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
                                        categories.map((item) => (
                                            <FormControlLabel
                                                key={item}
                                                value={item}
                                                control={<Radio />}
                                                label={item} 
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
