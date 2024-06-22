import React from "react";
import Slideshow from "../components/SlideShow";
import { Typography } from "@mui/material";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rootLayout.css";

const Dashboard = () => {
  const { clientID } = useParams();
  const location = useLocation();

  return (
    <>
      <Slideshow />
      <div className="">
        <div className="links">
          <NavLink to={`/dashboard/${clientID}`} className="navLink" end>
            <Typography sx={{ fontWeight: "bold" }}>Category</Typography>
          </NavLink>

          <NavLink
            to={`/dashboard/${clientID}/all`}
            className={({ isActive }) =>
              isActive && location.pathname.endsWith("/all")
                ? "navLink active"
                : "navLink"
            }
          >
            <Typography sx={{ fontWeight: "bold" }}>All Foods</Typography>
          </NavLink>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
