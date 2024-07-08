import React, { useEffect, useState } from 'react';
import { Divider, FormControl, Grid, Radio, RadioGroup, Typography, FormControlLabel, Modal, Box, Button, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantPublicById, getRestaurantsCategory, getRestaurantsCategoryPublic } from '../State/Restaurant/Action';
import { getMenuItemsByRestaurantId, getMenuItemsByRestaurantIdPublic } from '../State/Menu/Action';
import NotFound from '../pages/NotFound';
import RatingsList from '../../component/Rating/RatingsList';
import RatingForm from '../../component/Rating/RatingForm';
import { getRatings } from '../State/Rating/Action';
import ReviewsIcon from '@mui/icons-material/Reviews';

const foodTypes = [
    { label: "All", value: "all" },
    { label: "Vegetarian only", value: "vegetarian" },
    { label: "Non-Vegetarian", value: "non_vegetarian" },
    { label: "Seasonal", value: "seasonal" },
];

const RestaurantDetail = () => {
    const [foodType, setFoodType] = useState("all");
    const [hasMenuItems, setHasMenuItems] = useState(true); // State để kiểm tra có menu items hay không
    const [showRatingFormModal, setShowRatingFormModal] = useState(false); // State để điều khiển hiển thị modal
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { auth, restaurant, menu } = useSelector(store => store);
    const { id, city } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleFilter = (e) => {
        setFoodType(e.target.value);
    };

    const handleFilterCategory = (e) => {
        setSelectedCategory(e.target.value);
    };

    useEffect(() => {
        dispatch(getRestaurantById({ jwt, restaurantId: id }));
        dispatch(getRestaurantPublicById({ restaurantId: id }));
        dispatch(getRestaurantsCategory({ jwt, restaurantId: id }));
        dispatch(getRestaurantsCategoryPublic({ restaurantId: id }));
        dispatch(getRatings({ jwt, restaurantId: id }));
    }, [dispatch, id, jwt]);

    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({
            jwt,
            restaurantId: id,
            vegetarian: foodType === "vegetarian",
            nonveg: foodType === "non_vegetarian",
            seasonal: foodType === "seasonal",
            foodCategory: selectedCategory,
        }));
        dispatch(getMenuItemsByRestaurantIdPublic({
            restaurantId: id,
            vegetarian: foodType === "vegetarian",
            nonveg: foodType === "non_vegetarian",
            seasonal: foodType === "seasonal",
            foodCategory: selectedCategory,
        }));
    }, [selectedCategory, foodType, dispatch, jwt, id]);

    useEffect(() => {
        // Kiểm tra nếu menu.menuItems không có phần tử nào thì set hasMenuItems thành false
        setHasMenuItems(menu.menuItems.length > 0);
    }, [menu.menuItems]);

    const handleOpenRatingFormModal = () => {
        setShowRatingFormModal(true);
    };

    const handleCloseRatingFormModal = () => {
        setShowRatingFormModal(false);
    };

    return (
        <div className='px-5 lg:px-20 pb-5'>
            <section>
                <h3 className='text-gray-500 py-2 mt-10'>
                    Home/{restaurant.restaurant?.address.city}/{restaurant.restaurant?.cuisineType}/{restaurant.restaurant?.name || restaurant.restaurant?.title}
                </h3>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <img className='w-full h-[40vh] object-cover object-center' src={restaurant.restaurant?.images[0]} alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img className='w-full h-[40vh] object-cover object-center' src={restaurant.restaurant?.images[1]} alt="" />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <img className='w-full h-[40vh] object-cover object-center' src={restaurant.restaurant?.images[2] || restaurant.restaurant?.images[0]} alt="" />
                        </Grid>
                    </Grid>
                </div>
                <div className='pt-3 pb-5'>
                    <h1 className='text-4xl font-semibold'>
                        {restaurant.restaurant?.name || restaurant.restaurant?.title}
                    </h1>
                    <p className='text-gray-500 mt-1'>
                        {restaurant.restaurant?.description}
                    </p>
                    <div className='space-y-3 mt-3'>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <LocationOnIcon />
                            <span>{restaurant.restaurant?.address?.city}</span>
                        </p>
                        <p className='text-gray-500 flex items-center gap-3'>
                            <CalendarTodayIcon />
                            <span>{restaurant.restaurant?.openingHours}</span>
                        </p>
                    </div>
                </div>
            </section>
            <Divider />
            <section className='pt-[2rem] lg:flex relative'>
                <div className='space-y-10 lg:w-[20%] filter'>
                    <div className='box space-y-5 lg:sticky top-28'>
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: '1rem' }}>
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
                                                label={item.label}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Divider />
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: '1rem' }}>
                                Food Category
                            </Typography>
                            <FormControl className='py-10 space-y-5' component={"fieldset"}>
                                <RadioGroup name='food_category' value={selectedCategory} onChange={handleFilterCategory}>
                                    {
                                        restaurant.categories.map((item) => (
                                            <FormControlLabel
                                                key={item}
                                                value={item.name}
                                                control={<Radio />}
                                                label={item.name}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <Divider />
                        <div>
                            <Typography variant='h5' sx={{ paddingBottom: '1rem' }}>
                                Reviews
                            </Typography>
                            <RatingsList restaurantId={id} />
                            <Button variant="contained" color="primary" onClick={handleOpenRatingFormModal} className='flex'>
                                <IconButton variant="contained">
                                    <ReviewsIcon />
                                </IconButton>
                                <p>Add Rating</p>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='space-y-10 lg:w-[80%] lg:pl-10'>
                    {hasMenuItems ? (
                        menu.menuItems.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))
                    ) : (
                        <NotFound />
                    )}
                </div>
            </section>
            <Divider className='py-3' /> {/* Thêm Divider để tách phần review */}
            <section className='pt-[2rem]'>
                <Modal
                    open={showRatingFormModal}
                    onClose={handleCloseRatingFormModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                        <RatingForm restaurantId={id} onSuccess={handleCloseRatingFormModal} />
                    </Box>
                </Modal>
            </section>
        </div>
    );
};

export default RestaurantDetail;
