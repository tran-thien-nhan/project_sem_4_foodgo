import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRatings } from '../State/Rating/Action';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { pink } from '@mui/material/colors';
import Pagination from '@mui/material/Pagination';

const RatingsList = ({ restaurantId }) => {
    const dispatch = useDispatch();
    const ratings = useSelector(state => state.rating.ratings);
    const [currentPage, setCurrentPage] = useState(1);
    const ratingsPerPage = 3;

    useEffect(() => {
        dispatch(getRatings({ restaurantId }));
    }, [dispatch, restaurantId]);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfLastRating = currentPage * ratingsPerPage;
    const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
    const currentRatings = ratings.slice(indexOfFirstRating, indexOfLastRating);

    return (
        <Box className="p-4 shadow rounded-lg">
            <Typography variant="h5" className="mb-4 font-semibold text-gray-50">
                Customer Reviews
            </Typography>
            <Divider className="mb-4" />
            {currentRatings.map(rating => (
                <Box key={rating.id} className="mb-4 p-4 border border-gray-950 rounded-lg">
                    <div className="flex">
                        <div className='mr-5'>
                            <Avatar
                                sx={{ bgcolor: "white", color: pink.A400 }}
                            >
                                {rating.user?.fullName[0].toUpperCase()}
                            </Avatar>
                        </div>
                        <div>
                            <Rating value={rating.stars} readOnly className="mb-2" />
                            <Typography variant="body1" className="text-gray-50">
                                {rating.comment}
                            </Typography>
                        </div>
                    </div>
                </Box>
            ))}
            <Pagination
                count={Math.ceil(ratings.length / ratingsPerPage)}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                className="mt-4"
            />
        </Box>
    );
};

export default RatingsList;
