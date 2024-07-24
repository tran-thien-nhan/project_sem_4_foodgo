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
    Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsAllOrder, updateOrderStatus } from '../../component/State/Restaurant Order/Action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { refundOrder } from '../../component/State/Order/Action';
import PrintIcon from '@mui/icons-material/Print';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Fade from '@mui/material/Fade';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UndoIcon from '@mui/icons-material/Undo';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { findAllRide, requestRide } from '../../component/State/Ride/Action';
import { Bounce, toast } from "react-toastify";

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
    const { restaurant, restaurantOrder, ride } = useSelector(store => store);
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
    const [previousStatuses, setPreviousStatuses] = useState({});

    const pendingOrderss = restaurantOrder.orders.filter(order => order.orderStatus === 'PENDING' && order.isPaid).length;
    // console.log("Pending orders: ", pendingOrderss);

    const handleOpen = (order) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    useEffect(() => {
        console.log("all rides: ", ride);
        dispatch(fetchRestaurantsAllOrder({
            restaurantId: restaurant.usersRestaurant?.id,
            jwt: jwt,
        }));
    }, [dispatch, restaurant.usersRestaurant?.id, jwt, restaurant, ride]);

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
            case 'CANCELLED_REFUNDED':
                newStatus = 'CANCELLED';
                break;
            case 'COMPLETED':
                newStatus = 'DELIVERING';
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

    const handleRevertStatus = (orderId, currentStatus) => {
        let previousStatus;

        switch (currentStatus) {
            case 'CONFIRMED':
                previousStatus = 'PENDING';
                break;
            case 'DELIVERING':
                previousStatus = 'CONFIRMED';
                break;
            case 'COMPLETED':
                previousStatus = 'DELIVERING';
                break;
            case 'CANCELLED':
                previousStatus = 'DELIVERING';
                break;
            case 'CANCELLED_REFUNDED':
                previousStatus = 'CANCELLED';
                break;
            default:
                return;
        }

        dispatch(updateOrderStatus({
            orderId: orderId,
            jwt: localStorage.getItem('jwt'),
            newStatus: previousStatus,
            restaurantId: restaurant.usersRestaurant?.id,
        }));
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
                case 'CANCELLED_REFUNDED':
                    return newStatus === 'CANCELLED';
                case 'COMPLETED':
                    return newStatus === 'DELIVERING';
                default:
                    return false;
            }
        };

        if (isValidTransition(currentStatus, newStatus)) {
            dispatch(updateOrderStatus({
                orderId: orderId,
                jwt: localStorage.getItem('jwt'),
                newStatus: newStatus,
                restaurantId: restaurant.usersRestaurant?.id,
            }));
        }
    };

    const handleCancelOrder = (orderId, currentStatus) => {
        let newStatus;

        switch (currentStatus) {
            case 'PENDING':
                newStatus = 'CANCELLED';
                break;
            case 'CONFIRMED':
                newStatus = 'CANCELLED';
                break;
            case 'DELIVERING':
                newStatus = 'CANCELLED';
                break;
            case 'COMPLETED':
                newStatus = 'CANCELLED';
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
                    order.id === orderId ? { ...order, orderStatus: 'CANCELLED_REFUNDED' } : order
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

    const handlePrintPendingOrders = () => {
        const doc = new jsPDF();

        const pendingOrders = restaurantOrder.orders.filter(order => order.orderStatus === 'PENDING');

        const convertToNonAccentVietnamese = (str) => {
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/Đ/g, "D");
            str = str.replace(/đ/g, "d");
            return str;
        }

        pendingOrders.forEach((order, index) => {
            doc.setFontSize(16);
            doc.text(`Order ID: ${order.id}`, 10, 10);

            doc.autoTable({
                startY: 20,
                head: [['Customer', 'Total Price', 'Payment Method', 'Status', 'Delivery Address']],
                body: [[
                    convertToNonAccentVietnamese(order.customer?.fullName),
                    `${order.totalPrice.toLocaleString('vi-VN')}đ`,
                    order.paymentMethod === "BY_CASH" ? "COD" : order.paymentMethod === "BY_CREDIT_CARD" ? "BY BANK" : "BY VNPAY",
                    order.orderStatus,
                    convertToNonAccentVietnamese(`${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country}`)
                ]],
                theme: 'grid',
                styles: { fontSize: 12, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 30 }, // Customer
                    1: { cellWidth: 30 }, // Total Price
                    2: { cellWidth: 30 }, // Payment Method
                    3: { cellWidth: 20 }, // Status
                    4: { cellWidth: 80 }, // Delivery Address
                },
                didParseCell: (data) => {
                    if (data.column.index === 4) {
                        data.cell.styles.cellPadding = 2;
                        data.cell.styles.overflow = 'linebreak';
                    }
                }
            });

            const items = order.items.map((item, itemIndex) => [
                itemIndex + 1,
                convertToNonAccentVietnamese(item.food?.name),
                item.quantity,
                `${item.totalPrice.toLocaleString('vi-VN')}đ`,
                item.ingredients.map(ingredient => convertToNonAccentVietnamese(ingredient)).join(', ')
            ]);

            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [['#', 'Item', 'Quantity', 'Price', 'Ingredients']],
                body: items,
                theme: 'grid',
                styles: { fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 10 }, // #
                    1: { cellWidth: 50 }, // Item
                    2: { cellWidth: 20 }, // Quantity
                    3: { cellWidth: 30 }, // Price
                    4: { cellWidth: 70 }, // Ingredients
                }
            });

            if (index < pendingOrders.length - 1) {
                doc.addPage();
            }
        });

        doc.save('PendingOrders.pdf');
    };

    const handleRequestRide = (order) => {
        // if (order.orderStatus !== "DELIVERING") {
        //     toast.error("Order must be in 'DELIVERING' status to request a ride", {
        //         position: "top-center",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "colored",
        //     });
        //     return;
        // }
        const rideRequest = {
            restaurantLatitude: restaurant.usersRestaurant.latitude,
            restaurantLongitude: restaurant.usersRestaurant.longitude,
            destinationLatitude: order.latitude,
            destinationLongitude: order.longitude,
            userId: order.customer.id,
            restaurantId: restaurant.usersRestaurant.id,
            orderId: order.id,
        }
        dispatch(requestRide(rideRequest, jwt));
    }

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
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrintPendingOrders}
                            sx={{ mt: 2 }}
                        >
                            EXPORT ORDER PENDING
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
                                {/* <TableCell align="right">Ingredients</TableCell> */}
                                <TableCell align="right">Method</TableCell>
                                <TableCell align="right">Status</TableCell>
                                {/* <TableCell align="right">Detail</TableCell> */}
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
                                        <TableCell align="center" rowSpan={order.items.length}>
                                            <IconButton onClick={() => handleOpen(order)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleUpdateOrderStatus(order.id, order.orderStatus)}>
                                                <DoneIcon />
                                            </IconButton>
                                            {
                                                (order.orderStatus === "CANCELLED")
                                                    ?
                                                    (
                                                        <IconButton onClick={() => handleRefund(order.id)}>
                                                            <HighlightOffIcon />
                                                        </IconButton>
                                                    )
                                                    :
                                                    (
                                                        <IconButton onClick={() => handleCancelOrder(order.id, order.orderStatus)}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    )
                                            }

                                            <IconButton onClick={() => handleRevertStatus(order.id, order.orderStatus)}>
                                                <UndoIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleRequestRide(order)}>
                                                <LocalShippingIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {order.items.slice(1).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="right">
                                                {item.food?.name}
                                            </TableCell>
                                            {/* <TableCell align="right">
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
                                            </TableCell> */}
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
                                        <td><strong>latitude:</strong></td>
                                        <td>{selectedOrder.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>longtitude:</strong></td>
                                        <td>{selectedOrder.longitude}</td>
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
