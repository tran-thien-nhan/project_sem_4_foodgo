import React from "react";
import { Navbar } from "../component/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../component/Home/Home";
import RestaurantDetail from "../component/Restaurant/RestaurantDetail";
import Cart from "../component/Cart/Cart";
import Profile from "../component/Profile/Profile";
import Auth from "../component/Auth/Auth";
import PaymentSuccess from "../component/pages/PaymentSuccess";
import GoogleSignIn from "../component/Auth/GoogleSignIn";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import ProtectedPage from "../component/Auth/ProtectedPage";
import GoogleSignUp from "../component/Auth/GoogleSignUp";
import GoogleSignUpSuccess from "../component/Auth/GoogleSignUpSuccess";

const CustomerRouter = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />
        <Route path="/account/:login" element={<Home />} />
        <Route path="/login-google" element={<GoogleSignIn />} />
        <Route path="/signup-google" element={<GoogleSignUp />} />
        <Route
          path="/signup-google-success"
          element={<GoogleSignUpSuccess />}
        />
        <Route
          path="/restaurant/:city/:title/:id"
          element={<RestaurantDetail />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-profile/*" element={<Profile />} />
        <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
      </Routes>
      <Auth />
    </div>
  );
};

export default CustomerRouter;
