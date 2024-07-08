import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Badge, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { Person } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { pink } from '@mui/material/colors';
import { getAllCartItems } from '../State/Cart/Action';
import { SignedIn, SignedOut, UserButton, useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { getUser, logOut, registerUser } from '../State/Authentication/Action';
import axios from 'axios';
import { API_URL } from '../Config/api';
import { getFavoritesEvents } from '../State/Event/Action';

export const Navbar = () => {
    const { auth, cart, event } = useSelector(store => store);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('jwt');
    const cartCount = cart.cart?.cartItems?.length || 0;
    const { signOut } = useClerk();
    const userLoggedIn = localStorage.getItem('clerk_telemetry_throttler');
    const { user } = useUser();
    const [isGoogleRegistered, setIsGoogleRegistered] = useState(false);
    const { userId, getToken } = useAuth();
    const count = event.favorites.length;

    if (token && cart.id) {
        dispatch(getAllCartItems({ cartId: cart.id, token }));
    }

    useEffect(() => {
        if (token) {
            dispatch(getUser(token));
            dispatch(getFavoritesEvents(token)); // Dispatch hành động để lấy sự kiện yêu thích
        }
    }, [dispatch, token]);

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (userId) {
                try {
                    const token = await getToken();
                    console.log(token);
                    console.log("USER: ", user);
                    dispatch(registerUser({
                        userData: {
                            fullName: user.fullName || "",
                            email: user.emailAddresses[0]?.emailAddress || "",
                            password: "123", // You might not have access to password from OAuth sign-up
                            role: "ROLE_CUSTOMER", // Default role or adjust based on your logic
                            provider: "GOOGLE", // Indicate the provider here
                        },
                        navigate,
                    }))

                } catch (error) {
                    console.error('Failed to fetch OAuth access token:', error);
                }
            }
        };

        fetchAccessToken();
    }, [userId]);

    const handleAvatarClick = () => {
        if (auth.user?.role === 'ROLE_CUSTOMER') {
            navigate('/my-profile');
        } else {
            navigate('/admin/restaurants');
        }
    };

    const handleLogOut = () => {
        navigate('/');
        dispatch(logOut());
    }

    const handleNavigateToCart = () => {
        if (cartCount === 0) {
            navigate('/');
        } else {
            navigate('/cart');
        }
    };

    return (
        <Box className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between' sx={{ zIndex: 100 }}>
            <div className="flex items-center space-x-4">
                <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                    <ul className="flex items-center space-x-4">
                        <li className="logo font-semibold text-gray-300 text-2xl">
                            <Link to="/">FoodGo</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-10">
                <div className=''>
                    <IconButton>
                        <SearchIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </div>
                <div className=''>
                    {
                        (auth.user || userLoggedIn || user) ? (
                            <>
                                {
                                    auth.user
                                    &&
                                    (
                                        <Badge badgeContent={count} color="secondary">
                                            <Avatar
                                                sx={{ bgcolor: "white", color: pink.A400 }}
                                                onClick={handleAvatarClick}
                                                className='cursor-pointer'
                                                src={(auth.user || userLoggedIn) ? user?.imageUrl : ""}
                                            >
                                                {auth.user?.fullName[0].toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    )
                                }
                                {
                                    <>
                                        {/* <SignedIn>
                                            <UserButton />
                                        </SignedIn> */}
                                        {
                                            auth.user ?
                                                ""
                                                :
                                                <SignedOut>
                                                    <IconButton onClick={() => navigate('/account/login')}>
                                                        <Person />
                                                    </IconButton>
                                                </SignedOut>

                                        }
                                    </>
                                }
                            </>
                        )
                            :
                            (
                                (!auth.user || !userLoggedIn)
                                &&
                                <IconButton onClick={() => navigate('/account/login')}>
                                    <Person />
                                </IconButton>
                            )
                    }

                </div>

                <div className=''>
                    <IconButton onClick={handleNavigateToCart}>
                        <Badge badgeContent={cartCount} color="secondary">
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                        </Badge>
                    </IconButton>
                </div>
            </div>
        </Box>
    );
};
