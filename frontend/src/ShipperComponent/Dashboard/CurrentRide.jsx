import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { IconButton, Card, CardContent, Tooltip, Modal, Box, Typography, Divider, Grid, CircularProgress, TextField, Accordion, AccordionSummary, CardHeader, AccordionDetails } from '@mui/material';
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
import { uploadImageToCloudinary } from '../../AdminComponent/util/UploadToCloudinary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { Bounce, toast } from "react-toastify";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState('');

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
    if (images.length === 0) {
      toast.error("Please upload image before completing", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    const data = {
      rideId,
      driverId,
      images: images.map((image) => ({ public_id: image.public_id })),
      comment,
    }
    console.log("data: ",data);
    dispatch(completeRide({ id: rideId, jwt, driverId, images, comment }));
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

  const handleImageChange = async (e) => {
    const files = e.target.files;
    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      uploadPromises.push(uploadImageToCloudinary(files[i]));
    }
    setUploading(true);
    const uploadedImages = await Promise.all(uploadPromises);
    setImages([...images, ...uploadedImages]);
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
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
      {
        ride.status === "STARTED" &&
        <>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="rideImageInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  type="file"
                  multiple
                />
                <label htmlFor="rideImageInput" className="relative">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                    <Tooltip title="Add ride image" placement="bottom" arrow>
                      <AddPhotoAlternateIcon />
                    </Tooltip>
                  </span>
                  {uploading && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  )}
                </label>
                <div className="flex">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img className="w-24 h-24 object-cover m-2" src={image} alt={`Ride ${index + 1}`} />
                      <IconButton onClick={() => handleRemoveImage(index)} size="small" sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <Tooltip title="Remove ride image" placement="bottom" arrow>
                          <CloseIcon sx={{ fontSize: '1rem' }} />
                        </Tooltip>
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} lg={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <CardHeader title="Order Cancelled Comment" />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <TextField
                        label="Comment cancel order"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} // Cập nhật state comment
                      />
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </CardContent>
        </>
      }
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
                    <td><strong>Order Price:</strong></td>
                    <td>{(selectedOrder.total - selectedOrder.fare).toLocaleString('vi-VN')}đ</td>
                  </tr>
                  <tr>
                    <td><strong>Fare:</strong></td>
                    <td>{selectedOrder.fare.toLocaleString('vi-VN')}đ</td>
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
                  <Divider className='py-2' />
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
          </Box>
        </Modal>
      )}
    </Card>

  );
};

export default CurrentRide;
