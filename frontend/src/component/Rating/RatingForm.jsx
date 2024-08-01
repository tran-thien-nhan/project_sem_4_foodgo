// src/components/RatingForm.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, getRatings } from '../State/Rating/Action';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const RatingForm = ({ restaurantId, onSuccess }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { auth } = useSelector(store => store);
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");
    const ratings = useSelector(state => state.rating.ratings);

    useEffect(() => {
        console.log(ratings);
        dispatch(getRatings({ restaurantId }));
    }, [dispatch, restaurantId]);

    const handleStarsChange = (event, newValue) => {
        setStars(newValue);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addRating(
            {
                jwt,
                restaurantId,
                userId: auth.user?.id,
                stars,
                comment
            }
        ));
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Rating
                    name="simple-controlled"
                    value={stars}
                    onChange={handleStarsChange}
                />
            </div>
            <div className="mb-4">
                <TextField
                    label="Comment"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={comment}
                    onChange={handleCommentChange}
                />
            </div>
            <div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={jwt ? false : true}
                >
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default RatingForm;
