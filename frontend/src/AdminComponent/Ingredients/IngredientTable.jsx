import { Box, Card, CardHeader, Chip, IconButton, Modal, TablePagination, TextField, MenuItem, Select, InputLabel, FormControl, TableSortLabel, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientsOfRestaurant, updateStockOfIngredient } from '../../component/State/Ingredients/Action';
import CreateIngredientForm from './CreateIngredientForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const IngredientTable = () => {
    const { restaurant, ingredients } = useSelector(store => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        dispatch(getIngredientsOfRestaurant({
            id: restaurant.usersRestaurant?.id,
            jwt: jwt
        }))
    }, [dispatch, restaurant.usersRestaurant?.id, jwt]);

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

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
        setPage(0);
    };

    const handleStockFilterChange = (event) => {
        setStockFilter(event.target.value);
        setPage(0);
    };

    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const handleReset = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setStockFilter('');
        setSortOrder('asc');
        setSortColumn('');
        setPage(0);
        setRowsPerPage(5);
    };

    const filteredIngredients = ingredients.ingredients
        .filter(ingredient =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(ingredient =>
            categoryFilter === '' || ingredient.category.name === categoryFilter
        )
        .filter(ingredient =>
            stockFilter === '' || (stockFilter === 'in' ? ingredient.inStoke : !ingredient.inStoke)
        )
        .sort((a, b) => {
            if (sortColumn === 'price') {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            } else {
                return 0;
            }
        });

    const uniqueCategories = Array.from(new Set(ingredients.ingredients.map(ingredient => ingredient.category.name)));

    const handleUpdateStock = (id) => {
        dispatch(updateStockOfIngredient({ id, jwt }));
    }

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    title={"Ingredients"}
                    sx={{ pt: 2, alignItems: 'center' }}
                    action={
                        <IconButton aria-label="settings" onClick={handleOpen}>
                            <CreateIcon />
                        </IconButton>
                    }
                />
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                        label="Search Ingredients"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 200, mx: 2 }}>
                        <InputLabel>Filter by Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                            label="Filter by Category"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {uniqueCategories.map(category => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>Filter by Stock</InputLabel>
                        <Select
                            value={stockFilter}
                            onChange={handleStockFilterChange}
                            label="Filter by Stock"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="in">In Stock</MenuItem>
                            <MenuItem value="out">Out of Stock</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleReset}
                        sx={{ marginLeft: "10px" }}
                    >
                        Reset
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#e91e63" }}>
                            <TableRow>
                                <TableCell align="left">Id</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Category</TableCell>
                                <TableCell align="left" sortDirection={sortColumn === 'price' ? sortOrder : false}>
                                    <TableSortLabel
                                        active={sortColumn === 'price'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('price')}
                                    >
                                        Price
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">Quantity</TableCell>
                                <TableCell align="left">Available</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {item.id}
                                    </TableCell>
                                    <TableCell align="left">{item.name}</TableCell>
                                    <TableCell align="left">{item.category.name}</TableCell>
                                    <TableCell align="left">{item.price}</TableCell>
                                    <TableCell align="left">{item.quantity}</TableCell>
                                    <TableCell align="left">
                                        <Button onClick={() => handleUpdateStock(item.id)}>
                                            {item.inStoke ? (
                                                <div className='pt-3 space-x-2'>
                                                    <Chip label="in stock" className='my-1' sx={{ backgroundColor: "green" }} />
                                                </div>
                                            ) : (
                                                <div className='pt-3 space-x-2'>
                                                    <Chip label="out of stock" className='my-1' sx={{ backgroundColor: "#e91e63" }} />
                                                </div>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredIngredients.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateIngredientForm handleClose={handleClose} />
                </Box>
            </Modal>
        </Box>
    );
}

export default IngredientTable;
