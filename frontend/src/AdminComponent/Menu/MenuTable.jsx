import {
    Avatar,
    Box,
    Card,
    CardHeader,
    Chip,
    IconButton,
    TablePagination,
    TextField,
    TableSortLabel,
    Checkbox,
    FormControlLabel,
    Grid
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItemsByRestaurantId, deleteFoodAction, updateMenuItemsAvailability } from '../../component/State/Menu/Action';


const MenuTable = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { restaurant, menu } = useSelector(store => store);
    const [showAll, setShowAll] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        vegetarian: false,
        nonVegetarian: false,
        seasonal: false,
        foodCategory: ""
    });

    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({
            jwt,
            restaurantId: restaurant.usersRestaurant?.id,
            vegetarian: false,
            nonVegetarian: false,
            seasonal: false,
            foodCategory: ""
        }));
    }, [dispatch, restaurant.usersRestaurant?.id, jwt]);

    const handleDelete = (foodId) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (confirmDelete) {
            dispatch(deleteFoodAction({
                foodId: foodId,
                jwt: localStorage.getItem('jwt')
            }));
        }
    };

    const handleUpdateAvailability = (foodId) => {
        dispatch(updateMenuItemsAvailability({
            foodId: foodId,
            jwt: localStorage.getItem('jwt')
        }));
    }

    const handleToggle = (id) => {
        setShowAll(prevShowAll => ({ ...prevShowAll, [id]: !prevShowAll[id] }));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.checked
        });
    };

    const filteredMenuItems = menu.menuItems
        .filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!filters.vegetarian || item.vegetarian) &&
            (!filters.nonVegetarian || !item.vegetarian) &&
            (!filters.seasonal || item.seasonal)
        )
        .sort((a, b) => {
            if (sortColumn === 'price') {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            } else {
                return 0;
            }
        });

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    title={"All Menu Items"}
                    sx={{ pt: 2, alignItems: 'center' }}
                    action={
                        <IconButton aria-label="settings" onClick={() => navigate("/admin/restaurants/add-menu")}>
                            <CreateIcon />
                        </IconButton>
                    }
                />
                <Box p={2} display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Search Menu Items"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.vegetarian}
                                        onChange={handleFilterChange}
                                        name="vegetarian"
                                    />
                                }
                                label="Vegetarian"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.nonVegetarian}
                                        onChange={handleFilterChange}
                                        name="nonVegetarian"
                                    />
                                }
                                label="Non-Vegetarian"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.seasonal}
                                        onChange={handleFilterChange}
                                        name="seasonal"
                                    />
                                }
                                label="Seasonal"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#e91e63" }}>
                            <TableRow>
                                <TableCell align="left">Images</TableCell>
                                <TableCell align="right">Title</TableCell>
                                <TableCell align="right">Ingredients</TableCell>
                                <TableCell align="right" sortDirection={sortColumn === 'price' ? sortOrder : false}>
                                    <TableSortLabel
                                        active={sortColumn === 'price'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('price')}
                                    >
                                        Price
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">Available</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMenuItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Avatar src={item.images[0]}></Avatar>
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {
                                            item.ingredients.slice(0, showAll[item.id] ? item.ingredients.length : 2).map((ingredient, index) => (
                                                <Chip
                                                    key={index}
                                                    label={ingredient.name}
                                                    className='m-1'
                                                />
                                            ))
                                        }
                                        {
                                            item.ingredients.length > 2 && (
                                                <Chip
                                                    label={showAll[item.id] ? 'Ẩn bớt' : '...'}
                                                    onClick={() => handleToggle(item.id)}
                                                    style={{ cursor: 'pointer', margin: '3px' }}
                                                />
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="right">{item.price.toLocaleString('vi-VN')}đ</TableCell>
                                    <TableCell align="right">
                                        {
                                            item.available
                                                ? <Chip
                                                    label={"in stock"}
                                                    style={{ cursor: 'pointer', margin: '3px' }}
                                                    onClick={() => handleUpdateAvailability(item.id)}
                                                    sx={{ backgroundColor: "green" }}
                                                />
                                                : <Chip
                                                    label={"out of stock"}
                                                    style={{ cursor: 'pointer', margin: '3px' }}
                                                    onClick={() => handleUpdateAvailability(item.id)}
                                                    sx={{ backgroundColor: "#e91e63" }}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="delete" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredMenuItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Card>
        </Box>
    );
};

export default MenuTable;
