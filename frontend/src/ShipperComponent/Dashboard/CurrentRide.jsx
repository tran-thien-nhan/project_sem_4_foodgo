import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { IconButton, Card, CardContent, Tooltip, Modal, Box, Typography, Divider } from '@mui/material';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import TimerIcon from '@mui/icons-material/Timer';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import WalletIcon from '@mui/icons-material/Wallet';
import AtmIcon from '@mui/icons-material/Atm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useDispatch } from 'react-redux';
import { getAllocatedRides, getDriverCurrentRide } from '../../component/State/Driver/Action';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { completeRide, startRide } from '../../component/State/Ride/Action';
import MapComponent from '../../component/util/MapComponent';

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

const CurrentRide = ({ ride }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpen = (ride) => {
    setSelectedOrder(ride);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (ride?.driverId) {
      dispatch(getDriverCurrentRide({
        driverId: ride.driverId,
        token: jwt
      }));
    }
  }, [dispatch, ride?.driverId, jwt]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const padZero = (num) => (num < 10 ? `0${num}` : num);
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  const handleStartRide = (rideId, driverId) => {
    dispatch(startRide({ id: rideId, jwt, driverId }));
  }

  const handleCompleteRide = (rideId, driverId) => {
    dispatch(completeRide({ id: rideId, jwt, driverId }));
  }

  const handleChangeRideStatus = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <Button variant="contained" color="primary" onClick={() => handleStartRide(ride.rideId, ride.driverId)}>START RIDE</Button>;
      case 'STARTED':
        return <Button variant="contained" color="success" onClick={() => handleCompleteRide(ride.rideId, ride.driverId)}>COMPLETE</Button>;
      case 'CANCELLED':
        return <FmdGoodIcon color="error" />;
      default:
        return <FmdGoodIcon />;
    }
  };

  const handlePaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'BY_CASH':
        return (
          <Tooltip title="pay by cash">
            <WalletIcon />
          </Tooltip>
        );
      case 'BY_VNPAY':
        return (
          <Tooltip title="paid by VNPay">
            <AtmIcon />
          </Tooltip>
        );
      case 'BY_CREDIT_CARD':
        return (
          <Tooltip title="paid by credit card">
            <CreditCardIcon />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  if (!ride) {
    return <p>No current ride available.</p>;
  }

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center">
        <img src='https://img.freepik.com/premium-vector/car-icon-car-icon-white-background-illustration_995545-84.jpg' alt="Car" className="w-24 h-24 mr-4 rounded" />
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="flex items-center mb-2">
              <IconButton>
                <LocalTaxiIcon className="text-green-600 h-5" />
              </IconButton>
              <p className="text-lg font-semibold ml-2">Current Ride</p>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              <IconButton>
                <TimerIcon />
              </IconButton>
              {formatDateTime(ride.startTime)}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <IconButton>
                <PersonPinCircleIcon />
              </IconButton>
              {ride.restaurantAddress}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <IconButton>
                <FmdGoodIcon />
              </IconButton>
              {ride.userAddress}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <IconButton>
                {handlePaymentIcon(ride.paymentMethod)}
              </IconButton>
              {ride.total.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
          <div>
            {
              handleChangeRideStatus(ride.status)
            }
          </div>
        </div>
        <div className='mx-2'>
          <Button variant="contained" color="info" onClick={() => handleOpen(ride)}>
            INFO
          </Button>
        </div>
      </CardContent>
      <CardContent>
        <MapComponent address1={ride.userAddress} address2={ride.restaurantAddress} />
      </CardContent>
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
                    <td>{selectedOrder.orderId}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Price:</strong></td>
                    <td>{selectedOrder.total.toLocaleString('vi-VN')}đ</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td>{selectedOrder.paymentMethod === "BY_CASH" ? "COD" : (selectedOrder.paymentMethod === "BY_CREDIT_CARD" ? "BY CREDIT CARD" : "BY VNPAY")}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>{selectedOrder.orderStatus}</td>
                  </tr>
                  <tr>
                    <td><strong>Ride Status:</strong></td>
                    <td>{selectedOrder.status}</td>
                  </tr>
                  <tr>
                    <td><strong>Delivery Address:</strong></td>
                    <td>{selectedOrder.userAddress}</td>
                  </tr>
                  <Divider className='py-2'/>
                  <tr>
                    <td><strong>Items:</strong></td>
                    <td>
                      {selectedOrder.orderItem.map((item, index) => (
                        <div key={index}>
                          <strong>{item.itemName} x</strong> {item.itemQuantity}<br />
                          <strong>Ingredients: </strong>
                          {
                            (item.ingredientsName.length > 0)
                              ? item.ingredientsName.join(', ')
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
            {/* {
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
            } */}
          </Box>
        </Modal>
      )}
    </Card>

  );
};

export default CurrentRide;
