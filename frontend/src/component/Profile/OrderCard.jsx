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
    <Card className='flex justify-between items-center p-5'>
      <div className='flex items-center space-x-5'>
        <img className='h-16 w-16' src={item.food?.images[0]} alt="" />
        <div>
          <p>{item.food?.name}</p>
          <p className='font-semibold'>{item.totalPrice?.toLocaleString('vi-VN')}đ</p>
          <div className='flex flex-wrap'>
            {
              toppingsToShow.map((i, index) => (
                <Chip key={index} label={i} className='mx-1 my-1' />
              ))
            }
            {
              item.ingredients.length > maxToppingsToShow && (
                <Chip
                  label={showAll ? 'Ẩn bớt' : '...'}
                  onClick={handleToggle}
                  style={{ cursor: 'pointer', margin: '3px' }}
                />
              )
            }
          </div>
          <p className='text-gray-500'>
            {format(new Date(order.createdAt), "dd/MM/yy hh:mm a")}
          </p>
        </div>
      </div>
      <div>
        <Button className='cursor-not-allowed'>
          {order.orderStatus}
        </Button>
        {(order.orderStatus === 'PAID' && order.paymentMethod == "BY_CREDIT_CARD") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRefund}
          >
            Refund
          </Button>
        )}
      </div>
    </Card>
  );
}

export default OrderCard;
