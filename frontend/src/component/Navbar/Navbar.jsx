import React, { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { Person } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { pink } from '@mui/material/colors';
import { getAllCartItems } from '../State/Cart/Action';

export const Navbar = () => {
    const { auth, cart } = useSelector(store => store);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('jwt');
    const cartCount = cart.cart?.cartItems?.length || 0;

    useEffect(() => {
        if (token && cart.id) {
            dispatch(getAllCartItems({ cartId: cart.id, token }));
        }
    }, [dispatch, token, cart.id]);

    const handleAvatarClick = () => {
        if (auth.user?.role === 'ROLE_CUSTOMER') {
            navigate('/my-profile');
        } else {
            navigate('/admin/restaurant');
        }
    };

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
                    {auth.user ? (
                        <Avatar sx={{ bgcolor: "white", color: pink.A400 }} onClick={handleAvatarClick} className='cursor-pointer'>
                            {auth.user?.fullName[0].toUpperCase()}
                        </Avatar>
                    ) : (
                        <IconButton onClick={() => navigate('/account/login')}>
                            <Person />
                        </IconButton>
                    )}
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
