import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../State/Order/Action';
import { format } from 'date-fns';
import { Divider, Button } from '@mui/material';

const Orders = () => {
  const { auth, cart, order } = useSelector(store => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  // const orderCount = order.orders.length;

  // console.log("order", order.orders);
  // console.log("Order count", orderCount);

  useEffect(() => {
    dispatch(getUsersOrders(jwt));
  }, [auth.jwt, dispatch, jwt]);

  // Sắp xếp các đơn hàng theo thời gian tạo mới nhất lên trên cùng
  const sortedOrders = order.orders ? [...order.orders].filter(o => o.isPaid || o.orderStatus == "REFUNDED").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Calculate the orders to display for the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  return (
    <div className='flex items-center flex-col py-5'>
      <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
      <div className='space-y-5 w-full lg:w-1/2'>
        {
          currentOrders.map((order) => (
            <div key={order.id} className='order-container'>
              <h2 className='text-lg font-semibold'>
                Order placed on: {format(new Date(order.createdAt), "dd/MM/yy hh:mm a")}
              </h2>
              <p className='text-md font-semibold text-gray-500'>
                Total Price: {order.totalPrice.toLocaleString('vi-VN')}đ
              </p>
              <p className='text-md font-semibold text-gray-500'>
                Payment Method: {(order.paymentMethod === 'BY_CASH') ? 'Cash on delivery' :
                  (order.paymentMethod === 'BY_CREDIT_CARD')
                    ? 'Bank Card'
                    : 'VN Pay'
                }
              </p>
              {
                order.items.map((item) => (
                  <OrderCard key={item.id} item={item} order={order} jwt={jwt} />
                ))
              }
            </div>
          ))
        }
        <Divider />
      </div>
      <div className='flex justify-center my-5'>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Orders;
