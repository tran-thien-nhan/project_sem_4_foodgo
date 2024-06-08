import React from 'react'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Badge } from '@mui/material';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import "./Navbar.css"

export const Navbar = () => {
    return (
        <div className='px-5 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between'>
            <div className="flex items-center space-x-4">
                <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                    <li className="logo font-semibold text-gray-300 text-2xl">
                        FoodGo
                    </li>
                </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-10">
                <div className=''>
                    <IconButton>
                        <SearchIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </div>

                <div className=''>
                    <Avatar sx={{ bgcolor: "white", color: pink.A400 }}>
                        N
                    </Avatar>
                </div>

                <div className=''>
                    <IconButton>
                        <Badge badgeContent={4} color="secondary">
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                        </Badge>
                    </IconButton>
                </div>

            </div>
        </div>
    )
}
