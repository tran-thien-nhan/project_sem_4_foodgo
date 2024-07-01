import React, { useState } from 'react'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventIcon from '@mui/icons-material/Event';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Divider, Drawer, useMediaQuery, MenuItem, Menu, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../State/Authentication/Action';

const menu = [
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
        title: "Payment",
        icon: <PaymentIcon />,
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
]

const ProfileNavigation = ({ open, handleClose }) => {
    const isSmallScreen = useMediaQuery('(max-width:900px)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

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
            navigate("/");
        } else {
            navigate(`/my-profile/${item.title.toLowerCase()}`);
        }
    };

    return (
        <div>
            {isSmallScreen ? (
                <>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {menu.map((item, i) => (
                            <MenuItem
                                onClick={() => handleNavigate(item)}
                                key={i}
                            >
                                {item.icon}
                                <span style={{ marginLeft: 10 }}>{item.title}</span>
                            </MenuItem>
                        ))}
                    </Menu>
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
                        {menu.map((item, i) =>
                            <>
                                <div
                                    onClick={() => handleNavigate(item)}
                                    key={i}
                                    className="px-5 flex items-center space-x-5 cursor-pointer"
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {
                                    i !== menu.length - 1 && <Divider />
                                }
                            </>
                        )}
                    </div>
                </Drawer>
            )}
        </div>
    )
}

export default ProfileNavigation;


