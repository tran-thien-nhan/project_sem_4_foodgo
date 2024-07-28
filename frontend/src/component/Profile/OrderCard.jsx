import React, { useState } from 'react';
import { Button, Card, Chip } from '@mui/material';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { refundOrder } from '../State/Order/Action'; // Import action refundOrder

const OrderCard = ({ item, order, jwt }) => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const maxToppingsToShow = 2;
  const toppingsToShow = showAll ? item.ingredients : item.ingredients.slice(0, maxToppingsToShow);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  const handleRefund = () => {
    dispatch(refundOrder({ orderId: order.id, jwt }));
  };

  return (
    <Card className="flex justify-between items-center p-5 m-3 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-5">
        <img className="h-16 w-16 object-cover rounded-lg" src={item.food?.images[0]} alt="" />
        <div>
          <p className="text-lg font-semibold">{item.food?.name}</p>
          <p className="text-primary font-bold">{item.totalPrice?.toLocaleString('vi-VN')}đ</p>
          <div className="flex flex-wrap mt-2">
            {
              toppingsToShow.map((i, index) => (
                <Chip key={index} label={i} className="mx-1 my-1" />
              ))
            }
            {
              item.ingredients.length > maxToppingsToShow && (
                <Chip
                  label={showAll ? 'Ẩn bớt' : '...'}
                  onClick={handleToggle}
                  className="cursor-pointer mx-1 my-1"
                />
              )
            }
          </div>
          <p className="text-gray-500 mt-2">
            {format(new Date(order.createdAt), "dd/MM/yy hh:mm a")}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Button variant="outlined" className="cursor-not-allowed">
          {order.orderStatus}
        </Button>
        {/* {(order.orderStatus === 'CANCELLED' && order.paymentMethod == "BY_CREDIT_CARD") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRefund}
          >
            Refund
          </Button>
        )} */}
        {order.driverdto && (
          <div className="mt-3 p-3 border border-gray-950 rounded-lg bg-gray-950">
            <p className="text-sm font-semibold">Shipper:</p>
            <div className="flex items-center mt-2">
              <img className="h-12 w-12 rounded-full object-cover" src={order.driverdto.image} alt="" />
              <div className="ml-3">
                <p className="text-sm font-semibold">{order.driverdto.name}</p>
                <p className="text-sm text-gray-600">{order.driverdto.phone}</p>
                <p className="text-sm text-gray-600">{order.driverdto.licenseNumber}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default OrderCard;
