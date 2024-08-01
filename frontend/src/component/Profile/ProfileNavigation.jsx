import React, { useEffect, useState } from 'react';
import Lock from '@mui/icons-material/Lock';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventIcon from '@mui/icons-material/Event';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Divider, Drawer, useMediaQuery, MenuItem, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logOut } from '../State/Authentication/Action';
import { useClerk } from '@clerk/clerk-react';

const ProfileNavigation = ({ open, handleClose, setOpen, count, orderCount }) => {
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const { signOut } = useClerk();
    const { auth } = useSelector(store => store);
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (jwt) {
            console.log("auth: ", auth);
            dispatch(getUser(jwt));
        }
    }, [dispatch, jwt]);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (item) => {
        handleMenuClose();
        if (item.title === "Logout") {
            dispatch(logOut());
            signOut();
            navigate("/");
        } else if (item.title === "Change Password") {
            navigate("/my-profile/ChangePassword");
        } else {
            navigate(`/my-profile/${item.title.toLowerCase()}`);
        }
    };

    const renderTitle = (title) => {
        switch (title) {
            case 'Notification':
                return (
                    <span className='flex gap-1'>
                        <p>{title}</p>
                        <p className='font-semibold text-pink-300'>
                            {count > 0 ? <span>({count})</span> : ''}
                        </p>
                    </span>
                );
            case 'Orders':
                return (
                    <span className='flex gap-1'>
                        <p>{title}</p>
                        <p className='font-semibold text-pink-300'>
                            {orderCount > 0 ? <span>({orderCount})</span> : ''}
                        </p>
                    </span>
                );
            default:
                return title;
        }
    };

    const menu = [
        {
            title: "Change Password",
            icon: <Lock />,
        },
        {
            title: "Orders",
            icon: <ShoppingBagIcon />,
        },
        {
            title: "Favorites",
            icon: <FavoriteIcon />,
        },
        {
            title: "Address",
            icon: <FmdGoodIcon />,
        },
        {
            title: "Notification",
            icon: <NotificationsActiveIcon />,
        },
        {
            title: "Events",
            icon: <EventIcon />,
        },
        {
            title: "Logout",
            icon: <ExitToAppIcon />,
        }
    ];

    const filteredMenu = menu.filter(item => {
        if (item.title === "Change Password" && auth.user?.provider === "GOOGLE") {
            return false;
        }
        return true;
    });

    return (
        <div>
            {isSmallScreen ? (
                <>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        <Box
                            className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-x gap-8"
                            role="presentation"
                            onClick={toggleDrawer(false)}
                        >
                            {
                            filteredMenu.map((item, i) => (
                                <MenuItem
                                    onClick={() => handleNavigate(item)}
                                    key={i}
                                >
                                    {item.icon}
                                    <span style={{ marginLeft: 10 }}>
                                        {renderTitle(item.title)}
                                    </span>
                                </MenuItem>
                            ))
                            || <p>waiting....</p>
                            }
                        </Box>
                    </Drawer>
                </>
            ) : (
                <Drawer
                    sx={{ zIndex: 1 }}
                    anchor="left"
                    open={isSmallScreen ? open : true}
                    onClose={handleClose}
                    variant={isSmallScreen ? "temporary" : "permanent"}
                >
                    <div
                        className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-x gap-8 pt-16"
                    >
                        {filteredMenu.map((item, i) =>
                            <>
                                <div
                                    onClick={() => handleNavigate(item)}
                                    key={i}
                                    className="px-5 flex items-center space-x-5 cursor-pointer"
                                >
                                    {item.icon}
                                    <span style={{ marginLeft: 10 }}>
                                        {renderTitle(item.title)}
                                    </span>
                                </div>
                                {
                                    i !== filteredMenu.length - 1 && <Divider />
                                }
                            </>
                        )}
                    </div>
                </Drawer>
            )}
        </div>
    );
};

export default ProfileNavigation;
