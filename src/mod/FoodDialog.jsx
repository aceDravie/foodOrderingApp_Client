import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Rating,
  Grid,
  Box,
  Tooltip,
  TextField,
  Alert,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { db } from "../helpers/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const FoodDialog = ({
  open,
  onClose,
  title,
  rating,
  price,
  imageSrc,
  description,
  id,
}) => {
  const [toppings, setToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(price);
  const [quantities, setQuantities] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { clientID } = useParams();

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const q = query(collection(db, "toppings"), where("foodID", "==", id));
        const querySnapshot = await getDocs(q);
        let toppingsList = [];
        querySnapshot.forEach((doc) => {
          toppingsList.push({ id: doc.id, ...doc.data() });
        });
        setToppings(toppingsList);
        setQuantities(new Array(toppingsList.length).fill(0));
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    if (id) {
      fetchToppings();
    }
  }, [id]);

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);

    const newTotalPrice = newQuantities.reduce((acc, qty, i) => {
      return acc + qty * toppings[i].price;
    }, price);

    setTotalPrice(newTotalPrice);
  };

  const handleAddToCart = async () => {
    const orderDetails = {
      foodId: id,
      foodName: title,
      foodPrice: price,
      toppings: toppings
        .filter((_, index) => quantities[index] > 0)
        .map((topping, index) => ({
          name: topping.name,
          price: topping.price,
          quantity: quantities[index],
        })),
      clientId: clientID,
      totalPrice: totalPrice,
      instructions: instructions,
    };

    try {
      await addDoc(collection(db, "tempOrders"), orderDetails);
      setAlertMessage("Order added to cart successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
      onClose();
    } catch (error) {
      console.error("Error adding to TempOrders:", error);
      setAlertMessage("Error adding order to cart. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>FOOD CHECK OUT</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={imageSrc}
                alt={title}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 5,
                  boxShadow: "0 0 10px grey",
                  mt: 2,
                }}
              />
              <Typography sx={{ fontWeight: "bold", fontSize: "large" }}>
                {title.toUpperCase()}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", color: "#333", fontSize: "small" }}
              >
                GHC {price}
              </Typography>
              <Rating
                value={rating}
                readOnly
                size="small"
                sx={{ position: "relative", top: -10 }}
              />
              <Tooltip title={description} arrow placement="bottom-start">
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    cursor: "pointer",
                  }}
                >
                  {description}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontWeight: "bold" }}>
                Choose Additional Toppings
              </Typography>
              <Grid container spacing={1} my={2}>
                {toppings.map((topping, index) => (
                  <Grid item xs={12} key={index} container alignItems="center">
                    <Grid item xs={9}>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          textTransform: "capitalize",
                        }}
                      >
                        {topping.name}
                        <sup
                          style={{
                            background: "#6439ff",
                            color: "#fff",
                            position: "relative",
                            padding: "0.1rem 0.2rem",
                            borderRadius: ".3rem",
                            left: -10,
                            top: -13,
                          }}
                        >
                          ghc {topping.price}
                        </sup>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        type="number"
                        defaultValue={0}
                        InputProps={{ inputProps: { min: 0, max: 10 } }}
                        size="small"
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <hr />
              <Typography sx={{ fontWeight: "bold", mt: 3 }}>
                Special Instructions
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
              <Button
                fullWidth
                startIcon={<ShoppingCart />}
                sx={{
                  mt: 2,
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
                variant="contained"
                onClick={handleAddToCart}
              >
                Add GHC {totalPrice.toFixed(2)} To Cart
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {alertOpen && (
        <Alert
          severity={alertSeverity}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setAlertOpen(false)}
            >
              <CloseIcon />
            </Button>
          }
          sx={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            zIndex: 1500,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default FoodDialog;
