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
    Divider,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsAllOrder, updateOrderStatus } from '../../component/State/Restaurant Order/Action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { refundOrder } from '../../component/State/Order/Action';
import PrintIcon from '@mui/icons-material/Print';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import Fade from '@mui/material/Fade';
import * as XLSX from 'xlsx';

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
        case 'CANCELLED_REFUNDED':
            return 'grey';
        default:
            return 'default';
    }
};

const OrderTable = ({ filterValue, setFilterValue }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const { restaurant, restaurantOrder } = useSelector(store => store);
    const [showAll, setShowAll] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOrderTerm, setSearchOrderTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [localRestaurantOrder, setLocalRestaurantOrder] = useState(restaurantOrder.orders);
    const [checked, setChecked] = useState(false);

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

    const handleSearchOrderChange = (event) => {
        setSearchOrderTerm(event.target.value);
        setPage(0);
    };

    const handlePaymentMethodFilterChange = (event) => {
        setPaymentMethodFilter(event.target.value);
        setPage(0);
    };

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const handleUpdateOrderStatusDelivering = (orderId, currentStatus, newStatus) => {
        const isValidTransition = (currentStatus, newStatus) => {
            switch (currentStatus) {
                case 'PENDING':
                    return newStatus === 'CONFIRMED';
                case 'CONFIRMED':
                    return newStatus === 'DELIVERING';
                case 'DELIVERING':
                    return newStatus === 'COMPLETED' || newStatus === 'CANCELLED';
                case 'CANCELLED':
                    return newStatus === 'CANCELLED_REFUNDED';
                default:
                    return false;
            }
        };

        dispatch(updateOrderStatus({
            orderId: orderId,
            jwt: localStorage.getItem('jwt'),
            newStatus: newStatus,
            restaurantId: restaurant.usersRestaurant?.id,
        }));
    };

    const handleUpdateOrderStatus = (orderId, currentStatus) => {
        let newStatus;

        switch (currentStatus) {
            case 'PENDING':
                newStatus = 'CONFIRMED';
                break;
            case 'CONFIRMED':
                newStatus = 'DELIVERING';
                break;
            case 'DELIVERING':
                newStatus = window.confirm("Mark as Completed?") ? 'COMPLETED' : 'CANCELLED';
                break;
            case 'CANCELLED':
                newStatus = 'CANCELLED_REFUNDED';
                break;
            default:
                return;
        }

        dispatch(updateOrderStatus({
            orderId: orderId,
            jwt: localStorage.getItem('jwt'),
            newStatus: newStatus,
            restaurantId: restaurant.usersRestaurant?.id,
        }));
    };


    const handleRefund = (orderId) => {

        dispatch(refundOrder({
            orderId: orderId,
            jwt: jwt,
            restaurantId: restaurant.usersRestaurant?.id,
        })).then(() => {
            setLocalRestaurantOrder(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
                )
            );
        });
    };

    const handlePrintInvoiceModal = () => {
        const printContents = document.getElementById("invoice-details").innerHTML;
        const originalContents = document.body.innerHTML;

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<style>@page { size: A5; margin: 0; } body { margin: 1cm; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();

        document.body.innerHTML = originalContents;
        window.location.reload();
    };


    const filteredOrders = restaurantOrder.orders
        .filter(order =>
            order.isPaid &&
            order.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            order.id.toString().includes(searchOrderTerm) &&
            (paymentMethodFilter === '' || order.paymentMethod === paymentMethodFilter) &&
            (filterValue === 'ALL' || order.orderStatus === filterValue)
        )
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(restaurantOrder.orders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "Orders.xlsx");
    };

    const handleReset = () => {
        setSearchTerm('');
        setSearchOrderTerm('');
        setSortOrder('desc');
        setPage(0);
        setRowsPerPage(5);
        setPaymentMethodFilter('');
        setChecked(false);
        setFilterValue("ALL");
    };

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
                        sx={{ marginBottom: "1rem" }}
                    />
                    <TextField
                        label="Search Order Id"
                        variant="outlined"
                        value={searchOrderTerm}
                        onChange={handleSearchOrderChange}
                        fullWidth
                        sx={{ marginBottom: "1rem" }}
                    />
                    <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
                        <InputLabel id="payment-method-filter-label">Filter by Payment Method</InputLabel>
                        <Select
                            labelId="payment-method-filter-label"
                            value={paymentMethodFilter}
                            onChange={handlePaymentMethodFilterChange}
                            fullWidth
                        >
                            <MenuItem value=""><em>ALL</em></MenuItem>
                            <MenuItem value="BY_CASH">CASH</MenuItem>
                            <MenuItem value="BY_CREDIT_CARD">BANKCARD</MenuItem>
                            <MenuItem value="BY_VNPAY">VNPAY</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="space-between">
                        <Button variant="contained" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button
                            onClick={handleExportExcel}
                            variant="contained"
                            color="primary"
                            sx={{ alignSelf: "flex-start" }}
                        >
                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1.8 18H14l-2-3.4l-2 3.4H8.2l2.9-4.5L8.2 11H10l2 3.4l2-3.4h1.8l-2.9 4.5zM13 9V3.5L18.5 9z" /></svg>
                                <p className='m-1'>Export to Excel</p>
                            </div>
                        </Button>
                    </Box>
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
                                <TableCell align="right">Ingredients</TableCell>
                                <TableCell align="right">Method</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Detail</TableCell>
                                <TableCell align="right">Actions</TableCell>
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
                                            {order.paymentMethod === "BY_CASH" ? "COD" : (
                                                order.paymentMethod === "BY_CREDIT_CARD"
                                                ? 'BANK CARD' : 'VN PAY'
                                            )}
                                        </TableCell>
                                        <TableCell align="right" rowSpan={order.items.length}>
                                            <Button
                                                variant="contained"
                                                color={getButtonColor(order.orderStatus)}
                                                onClick={() => handleUpdateOrderStatus(order.id, order.orderStatus)}
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
                                                order.orderStatus === "PENDING" && (
                                                    <Button
                                                        //variant="contained"
                                                        color="error"
                                                        onClick={() => handleOpen(order)}
                                                    >
                                                        <IconButton aria-label="view">
                                                            <PrintIcon />
                                                        </IconButton>
                                                    </Button>
                                                )
                                            }
                                            {
                                                order.orderStatus === "CANCELLED" && (
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => handleRefund(order.id)}
                                                    >
                                                        Refund
                                                    </Button>
                                                )
                                            }
                                            {order.orderStatus === "DELIVERING" && (
                                                <Box display="flex" flexDirection="column" alignItems="center">
                                                    <Button
                                                        //variant="contained"
                                                        color="primary"
                                                        onClick={() => handleUpdateOrderStatusDelivering(order.id, order.orderStatus, "COMPLETED")}
                                                        sx={{ mb: 1 }}
                                                    >
                                                        <IconButton aria-label="view">
                                                            <DoneIcon />
                                                        </IconButton>
                                                    </Button>
                                                    <Button
                                                        //variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleUpdateOrderStatusDelivering(order.id, order.orderStatus, "CANCELLED")}
                                                    >
                                                        <IconButton aria-label="view">
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Button>
                                                </Box>
                                            )}
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
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Card>
            {selectedOrder && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Order Details
                        </Typography>
                        <Typography
                            sx={{ mt: 2 }}
                            id='invoice-details'
                        >
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Order ID:</strong></td>
                                        <td>{selectedOrder.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Customer:</strong></td>
                                        <td>{selectedOrder.customer?.fullName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Price:</strong></td>
                                        <td>{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Payment Method:</strong></td>
                                        <td>{selectedOrder.paymentMethod === "BY_CASH" ? "COD" : "By credit card"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status:</strong></td>
                                        <td>{selectedOrder.orderStatus}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Delivery Address:</strong></td>
                                        <td>{selectedOrder.deliveryAddress.streetAddress}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}, {selectedOrder.deliveryAddress.country}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Items:</strong></td>
                                        <td>
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index}>
                                                    <strong>{item.food?.name}:</strong> {item.quantity} x {item.totalPrice.toLocaleString('vi-VN')}đ<br />
                                                    <strong>Ingredients: </strong>
                                                    {
                                                        (item.ingredients.length > 0)
                                                            ? item.ingredients.join(', ')
                                                            : 'No ingredients'
                                                    }
                                                    <br />
                                                    <Divider className='py-3' />
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </Typography>
                        {
                            selectedOrder.orderStatus === "PENDING" && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePrintInvoiceModal()}
                                    className='justify-center items-center'
                                    fullWidth
                                >
                                    <IconButton>
                                        <PrintIcon />
                                    </IconButton>
                                </Button>)
                        }
                    </Box>
                </Modal>
            )}

        </Box>
    );
};

export default OrderTable;
