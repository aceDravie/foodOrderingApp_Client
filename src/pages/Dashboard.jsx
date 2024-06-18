import React from "react";
import Slideshow from "../components/SlideShow";
import Category from "../components/Category";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -5,
    top: 7,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    width: "5px",
  },
}));

const Dashboard = () => {
  return (
    <>
      <Slideshow />
      <Outlet />
    </>
  );
};

export default Dashboard;
