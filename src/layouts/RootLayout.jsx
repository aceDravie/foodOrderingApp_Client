import React from "react";
import { Container, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <Box>
      <Navbar />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
};

export default RootLayout;
