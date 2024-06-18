import React from "react";
import Slideshow from "../components/SlideShow";
import Category from "../components/Category";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Settings, Person } from "@mui/icons-material";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import "../styles/rootLayout.css";

const Dashboard = () => {
  return (
    <>
      <Slideshow />
      <div className="container">
        <div className="links">
          <NavLink to="" className="navLink">
            <AllInclusiveIcon />
          </NavLink>

          <NavLink to="edit-student-dashboard" className="navLink">
            <Person />
          </NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
