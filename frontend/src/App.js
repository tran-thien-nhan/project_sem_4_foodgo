import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { Navbar } from './component/Navbar/Navbar';
import Home from './component/Home/Home';
import RestaurantDetail from './component/Restaurant/RestaurantDetail';
import Cart from './component/Cart/Cart';
import Profile from './component/Profile/Profile';
import CustomerRouter from './Routers/CustomerRouter';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './component/State/Authentication/Action';
import { findCart } from './component/State/Cart/Action';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routers from './Routers/Routers';
import { getRestaurantByUserId } from './component/State/Restaurant/Action';
import { darkTheme } from './Theme/DarkTheme';

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const { auth } = useSelector((store) => store); //nghĩa là lấy state từ store và lấy auth từ state

  useEffect(() => {
    dispatch(getUser(auth.jwt || jwt)); //nếu auth.jwt không có thì lấy jwt
    dispatch(findCart(jwt)) //tìm giỏ hàng của user
  }, [auth.jwt]); //nếu jwt thay đổi thì chạy lại useEffect

  useEffect(() => {
    dispatch(getRestaurantByUserId(auth.jwt || jwt));
  }, [auth.user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
