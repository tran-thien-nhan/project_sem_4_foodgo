import React from 'react'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Badge, Box } from '@mui/material';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css"
import { Person } from '@mui/icons-material';

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <Box className='px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between' sx={{ zIndex: 100 }}>
            <div className="flex items-center space-x-4">
                <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                    <ul className="flex items-center space-x-4">
                        <li className="logo font-semibold text-gray-300 text-2xl">
                            FoodGo
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
                    {false ? (
                        <Avatar sx={{ bgcolor: "white", color: 'pink.A400' }}>
                            N
                        </Avatar>
                    ) : (
                        <IconButton
                            onClick={() => navigate('/account/login')}
                        >
                            <Person />
                        </IconButton>
                    )}
                </div>

                <div className=''>
                    <IconButton>
                        <Badge badgeContent={4} color="secondary">
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                        </Badge>
                    </IconButton>
                </div>

            </div>
        </Box>
    )
}
