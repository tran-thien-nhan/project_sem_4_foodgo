import React, { useEffect, useState } from 'react'
import RatingTable from './RatingTable'
import { useSelector } from 'react-redux';

const Rating = () => {
    const { auth, restaurant, menu } = useSelector(store => store);
    const [restaurantId, setRestaurantId] = useState('');
    useEffect(() => {
        const id = restaurant.usersRestaurant.id;
        setRestaurantId(id);
    }, [restaurant]);
    return (
        <div>
            <RatingTable restaurantId={restaurantId} />
        </div>
    )
}

export default Rating
