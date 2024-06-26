import React, { useEffect, useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "../helpers/firebase";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import TempOrdersDialog from "../mod/TempOrdersDialog";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import Profile from "./Profile";

const settings = ["Profile", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [nickName, setNickName] = useState("");
  const [tempOrdersCount, setTempOrdersCount] = useState(0);
  const [tempOrders, setTempOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const { clientID } = useParams();
  const { currentUser, dispatch } = useContext(AuthContext);
  const [openChangeProfile, setOpenChangeProfile] = useState(false);
  const navigate = useNavigate();

  const handleOpenChangeProfile = () => {
    setOpenChangeProfile(true);
  };

  const handleCloseChangeProfile = () => {
    setOpenChangeProfile(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenDialog = async () => {
    setDialogOpen(true);
    if (clientID) {
      const q = query(
        collection(db, "tempOrders"),
        where("clientId", "==", clientID)
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTempOrders(orders);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRemoveOrder = async (index) => {
    const order = tempOrders[index];
    await deleteDoc(doc(db, "tempOrders", order.id));
    setTempOrders(tempOrders.filter((_, i) => i !== index));
    setTempOrdersCount(tempOrdersCount - 1);
  };

  useEffect(() => {
    const findUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const querySnapshot = await getDocs(
            query(collection(db, "customers"), where("email", "==", userEmail))
          );

          const user = querySnapshot.docs[0];
          const nickName = user.data().nickName;
          setNickName(nickName);
          localStorage.setItem("nickName", nickName);
        }
      } catch (error) {
        console.log(error);
      }
    };
    findUser();
  }, [nickName]);

  useEffect(() => {
    if (clientID) {
      const q = query(
        collection(db, "tempOrders"),
        where("clientId", "==", clientID)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setTempOrdersCount(querySnapshot.size);
      });

      return () => unsubscribe();
    }
  }, [clientID]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scroll down
        setShowNavbar(false);
      } else {
        // Scroll up
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuItemClick = (setting) => {
    if (setting === "Logout") {
      handleLogout();
    } else if (setting === "Profile") {
      handleOpenChangeProfile();
    }
    handleCloseUserMenu();
  };

  return (
    <div className="top">
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "#333",
          alignItems: "center",
          top: showNavbar ? "0" : "-64px",
          transition: "top 0.3s",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LocalDiningIcon
              sx={{
                display: { xs: "none", md: "flex" },
                color: "#fac637",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={`/dashboard/${clientID}`}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "#fac637",
                textDecoration: "none",
              }}
            >
              DRACE
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#fcfbf7",
                      p: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      mr={2}
                      textAlign="center"
                      sx={{ fontWeight: "bold", fontSize: 12 }}
                    >
                      Hello{" "}
                      <span
                        style={{
                          marginLeft: "1px",
                          textTransform: "capitalize",
                        }}
                      >
                        {nickName}
                      </span>
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
            <LocalDiningIcon
              sx={{ display: { xs: "flex", md: "none" }, color: "#fac637" }}
            />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to={`/dashboard/${clientID}`}
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                color: "#fac637",
                textDecoration: "none",
              }}
            >
              DRACE
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fcfbf7",
                  p: 1,
                  borderRadius: 2,
                }}
              >
                <Typography
                  noWrap
                  component="div"
                  sx={{
                    color: "#333",
                    fontWeight: "bold",
                    mx: 1,
                    fontSize: 15,
                  }}
                >
                  Hello{" "}
                  <span
                    style={{
                      marginLeft: "1px",
                      textTransform: "capitalize",
                    }}
                  >
                    {nickName}
                  </span>{" "}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open Cart">
                <IconButton
                  onClick={handleOpenDialog}
                  sx={{ p: 0 }}
                  size="small"
                >
                  <Badge badgeContent={tempOrdersCount} color="primary">
                    <ShoppingCartIcon color="action" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="My Orders">
                <IconButton component={Link} to={"orders"}>
                  <PlaylistAddCheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={nickName}
                    sx={{ width: 27, height: 27, bgcolor: "#6439ff" }}
                  >
                    {nickName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuItemClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <TempOrdersDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        tempOrders={tempOrders}
        onRemoveOrder={handleRemoveOrder}
      />
      <Profile
        open={openChangeProfile}
        onOpen={handleOpenChangeProfile}
        onClose={handleCloseChangeProfile}
      />
      ;
    </div>
  );
}

export default Navbar;
