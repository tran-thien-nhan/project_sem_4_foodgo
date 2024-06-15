import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';
import { Navbar } from './component/Navbar/Navbar';
import Home from './component/Home/Home';
import RestaurantDetail from './component/Restaurant/RestaurantDetail';
import Cart from './component/Cart/Cart';
import Profile from './component/Profile/Profile';
import CustomerRouter from './Routers/CustomerRouter';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './component/State/Authentication/Action';

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const { auth } = useSelector((store) => store); //nghĩa là lấy state từ store và lấy auth từ state

  useEffect(() => {
    dispatch(getUser(auth.jwt || jwt)); //nếu auth.jwt không có thì lấy jwt
  }, [auth.jwt]); //nếu jwt thay đổi thì chạy lại useEffect

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CustomerRouter />
    </ThemeProvider>
  );
}

export default App;
