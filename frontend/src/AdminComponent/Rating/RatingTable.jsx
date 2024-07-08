import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRatings, updateRatingVisibility } from '../../component/State/Rating/Action';
import { Avatar, Box, Pagination, Rating as MuiRating, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardHeader, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { pink } from '@mui/material/colors';

const RatingTable = ({ restaurantId }) => {
    const dispatch = useDispatch();
    const ratings = useSelector(state => state.rating.ratings);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [starFilter, setStarFilter] = useState('');
    const ratingsPerPage = 5;
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        dispatch(getRatings({ jwt, restaurantId }));
    }, [dispatch, restaurantId]);

    const indexOfLastRating = currentPage * ratingsPerPage;
    const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
    const filteredRatings = ratings.filter(rating =>
        (rating.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         rating.comment.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (starFilter ? rating.stars === starFilter : true)
    );
    const currentRatings = filteredRatings.slice(indexOfFirstRating, indexOfLastRating);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeVisibility = (id) => {
        const data = {
            ratingId: id,
            jwt: localStorage.getItem('jwt')
        }
        dispatch(updateRatingVisibility(data));
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStarFilterChange = (event) => {
        setStarFilter(event.target.value);
        setCurrentPage(1);
    };

    const calculateAverageRating = () => {
        if (filteredRatings.length === 0) return 0;
        const totalStars = filteredRatings.reduce((total, rating) => total + rating.stars, 0);
        return (totalStars / filteredRatings.length).toFixed(1);
    };

    return (
        <Box>
            <Card className='mt-1 px-5'>
                <CardHeader
                    title={"All Ratings"}
                    sx={{ pt: 2, alignItems: 'center' }}
                />
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Average Rating: {calculateAverageRating()} <MuiRating value={calculateAverageRating()} precision={0.1} readOnly />
                    </Typography>
                    <TextField
                        label="Search by User or Comment"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        sx={{ marginRight: 2 }}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel>Stars</InputLabel>
                        <Select
                            value={starFilter}
                            onChange={handleStarFilterChange}
                            label="Stars"
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {[1, 2, 3, 4, 5].map(star => (
                                <MenuItem key={star} value={star}>{star}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#e91e63" }}>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell align="left">Rating</TableCell>
                                <TableCell align="left">Comment</TableCell>
                                <TableCell align="left">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRatings.map((rating) => (
                                <TableRow key={rating.id}>
                                    <TableCell component="th" scope="row">
                                        <div className="flex">
                                            <Avatar sx={{ bgcolor: "white", color: pink.A400 }}>
                                                {rating.user?.fullName[0].toUpperCase()}
                                            </Avatar>
                                            <p className='m-2'>
                                                {rating.user?.fullName}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <MuiRating value={rating.stars} readOnly />
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography variant="body1" className="text-gray-50">
                                            {rating.comment}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Button
                                            variant="contained"
                                            sx={rating.visible ? {backgroundColor: "#e91e63"} : {backgroundColor: "green"}}
                                            onClick={() => handleChangeVisibility(rating.id)}
                                        >
                                            {rating.visible ? "Hide" : "Show"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={Math.ceil(filteredRatings.length / ratingsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                    className="mt-4"
                />
            </Card>
        </Box>
    );
};

export default RatingTable;
