import React, { useEffect, useState } from 'react';
import {
    Avatar,
    AvatarGroup,
    Box,
    Card,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Modal,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsAllOrder, updateOrderStatus } from '../../component/State/Restaurant Order/Action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { green, red } from '@mui/material/colors'; // Để sử dụng màu sắc cho nút "Refund"
import { refundOrder } from '../../component/State/Order/Action';

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

const getButtonColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'warning';
        case 'CONFIRMED':
            return 'primary';
        case 'DELIVERING':
            return 'info';
        case 'COMPLETED':
            return 'success';
        case 'CANCELLED':
            return 'error';
        default:
            return 'default';
    }
};

const OrderTable = ({ filterValue }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { restaurant, restaurantOrder } = useSelector(store => store);
    const [showAll, setShowAll] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpen = (order) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    useEffect(() => {
        dispatch(fetchRestaurantsAllOrder({
            restaurantId: restaurant.usersRestaurant?.id,
            jwt: jwt,
        }));
    }, [dispatch, restaurant.usersRestaurant?.id, jwt]);

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

    const handlePaymentMethodFilterChange = (event) => {
        setPaymentMethodFilter(event.target.value);
        setPage(0);
    };

    const handleUpdateOrderStatus = (orderId) => {
        const confirmUpdate = window.confirm("Are you sure?");
        if (confirmUpdate) {
            dispatch(updateOrderStatus({
                orderId: orderId,
                jwt: localStorage.getItem('jwt')
            }));
        }
    };

    const handleRefund = (orderId) => {
        const confirmRefund = window.confirm("Are you sure you want to refund this order?");
        if (confirmRefund) {
            // Perform refund logic here, e.g., dispatch an action to handle refund
            console.log("Refunding order:", orderId);
            // You can dispatch an action to update order status or perform other refund-related actions
            dispatch(refundOrder({ orderId: orderId, jwt }));
        }
    };

    const filteredOrders = restaurantOrder.orders
        .filter(order =>
            order.isPaid &&
            order.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (paymentMethodFilter === '' || order.paymentMethod === paymentMethodFilter) &&
            (filterValue === 'ALL' || order.orderStatus === filterValue)
        )
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    title={"All Orders"}
                    sx={{ pt: 2, alignItems: 'center' }}
                />
                <Box p={2} display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Search Customer"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="payment-method-filter-label">Filter by Payment Method</InputLabel>
                        <Select
                            labelId="payment-method-filter-label"
                            value={paymentMethodFilter}
                            onChange={handlePaymentMethodFilterChange}
                            fullWidth
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="BY_CASH">BY_CASH</MenuItem>
                            <MenuItem value="BY_CREDIT_CARD">BY_CREDIT_CARD</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#e91e63" }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Images</TableCell>
                                <TableCell align="right">Customer</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Method</TableCell>
                                <TableCell align="right">Ingredients</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Detail</TableCell>
                                <TableCell align="right">Refund</TableCell> {/* Thêm cột cho nút Refund */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow>
                                        <TableCell component="th" scope="row" rowSpan={order.items.length}>
                                            {order.id}
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            <AvatarGroup>
                                                {order.items.map((orderItem, index) => (
                                                    <Avatar key={index} src={orderItem.food?.images[0]} />
                                                ))}
                                            </AvatarGroup>
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            {order.customer?.fullName}
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            {order.totalPrice.toLocaleString('vi-VN')}đ
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.items[0]?.food?.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                order.paymentMethod === "BY_CASH"
                                                    ? "COD"
                                                    : "By credit card"
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.items[0]?.ingredients.slice(0, showAll[order.id] ? order.items[0]?.ingredients.length : 2).map((ingredient, index) => (
                                                <Chip
                                                    key={index}
                                                    label={ingredient}
                                                    className='m-1'
                                                />
                                            ))}
                                            {order.items[0]?.ingredients.length > 2 && (
                                                <Chip
                                                    label={showAll[order.id] ? 'Ẩn bớt' : '...'}
                                                    onClick={() => handleToggle(order.id)}
                                                    style={{ cursor: 'pointer', margin: '3px' }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            <Button
                                                variant="contained"
                                                color={getButtonColor(order.orderStatus)}
                                                onClick={() => handleUpdateOrderStatus(order.id)}
                                                disabled={(order.paymentIntentId !== null) ? true : false}
                                            >
                                                {order.orderStatus}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            <IconButton aria-label="view" onClick={() => handleOpen(order)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            {
                                                order.orderStatus === "CANCELLED"
                                                    ?
                                                    <Button
                                                        variant="contained"
                                                        color="error" // Sử dụng màu error cho nút Refund
                                                        onClick={() => handleRefund(order.id)}
                                                    >
                                                        Refund
                                                    </Button>
                                                    :
                                                    ""
                                            }
                                        </TableCell>

                                    </TableRow>
                                    {order.items.slice(1).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="right">
                                                {item.food?.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.ingredients.slice(0, showAll[order.id] ? item.ingredients.length : 2).map((ingredient, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={ingredient}
                                                        className='m-1'
                                                    />
                                                ))}
                                                {item.ingredients.length > 2 && (
                                                    <Chip
                                                        label={showAll[order.id] ? 'Ẩn bớt' : '...'}
                                                        onClick={() => handleToggle(order.id)}
                                                        style={{ cursor: 'pointer', margin: '3px' }}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredOrders.length}
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
                    {selectedOrder && (
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Order Detail
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <strong>ID:</strong> {selectedOrder.id}<br />
                                <strong>Customer Email:</strong> {selectedOrder.customer?.email}<br />
                                <strong>Customer Name:</strong> {selectedOrder.customer?.fullName}<br />
                                <strong>Total Price:</strong> {selectedOrder.totalPrice}<br />
                                <strong>Status:</strong> {selectedOrder.orderStatus}<br />
                                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}<br />
                                <strong>Delivery Address:</strong> {selectedOrder.customer?.addresses[0]?.streetAddress}, {selectedOrder.customer?.addresses[0]?.city}, {selectedOrder.customer?.addresses[0]?.state}, {selectedOrder.customer?.addresses[0]?.country}<br />
                                <strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}<br />
                                <strong>Items:</strong> {selectedOrder.items.map(item => item.food?.name).join(', ')}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default OrderTable;
