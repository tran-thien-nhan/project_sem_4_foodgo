import React from "react";
import { IconButton, Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { Person, Facebook, Twitter, Instagram } from "@mui/icons-material";
import "./Footer.css";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box
      className="px-5 py-5 bg-[#e91e63] lg:px-20 flex flex-col md:flex-row justify-between items-center"
      sx={{ zIndex: 100 }}
    >
      <Typography
        variant="h6"
        color="white"
        className="font-semibold text-2xl mb-4 md:mb-0"
      >
        FoodGo
      </Typography>

      <Box className="flex space-x-4 mb-4 md:mb-0">
        <Link to="/about" className="text-white">
          About Us
        </Link>
        <Link to="/contact" className="text-white">
          Contact
        </Link>
        <Link to="/privacy" className="text-white">
          Privacy Policy
        </Link>
        <Link to="/terms" className="text-white">
          Terms of Service
        </Link>
      </Box>

      <Box className="flex space-x-2">
        <IconButton
          onClick={() => navigate("/account/login")}
          sx={{ color: "white" }}
        >
          <Person />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Facebook />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Twitter />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};
