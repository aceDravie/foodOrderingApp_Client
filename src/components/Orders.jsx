import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { db } from "../helpers/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Skeleton from "@mui/material/Skeleton";
import SkeletonAnimation from "@mui/lab/Skeleton";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

const Orders = () => {
  const { clientID } = useParams();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); 

    const ordersCollection = collection(db, "orders");
    const ordersQuery = query(
      ordersCollection,
      where("clientId", "==", clientID)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedOrders = fetchedOrders.sort(
        (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
      );

      setOrders(sortedOrders);
      setIsLoading(false); // Set loading state to false after fetching orders
    });

    return () => unsubscribe();
  }, [clientID]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ position: "relative", top: "3em", padding: "1em" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        ORDERS
      </Typography>
      {isLoading ? (
        <Box>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ marginBottom: "1em" }}>
              <SkeletonAnimation variant="rectangular" height={60} />
            </Box>
          ))}
        </Box>
      ) : orders.length === 0 ? (
        <Typography variant="body1">No orders found.</Typography>
      ) : (
        <>
          {orders.map((order, index) => (
            <Accordion
              key={order.id}
              expanded={expanded === index}
              onChange={handleChange(index)}
              sx={{ marginBottom: "1em" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: "#f5f5f5" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="body1">
                    {formatDate(order.orderTime)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    GHC {order.totalPrice}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    {order.orderType}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
                <Box sx={{ marginBottom: "1em" }}>
                  <Typography variant="h6">{order.orders.foodName}</Typography>
                  {order.orderType === "delivery" ? (
                    <>
                      <Typography variant="body2">
                        Delivery Guy: {order.deliveryGuy.name}
                      </Typography>
                      <Typography variant="body2">
                        Contact: {order.deliveryGuy.contact}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2">
                        Token: {order.token}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: order.claimed ? "red" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        Claimed: {order.claimed ? "Yes" : "No"}
                      </Typography>
                    </>
                  )}
                </Box>

                {order.orders.map((orderItem, index) => (
                  <Box key={index} sx={{ marginBottom: "1em" }}>
                    <Typography variant="body2">
                      Food Name: {orderItem.foodName}
                    </Typography>
                    <Typography variant="body2">
                      Total Price: GHC {orderItem.totalPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Quantity: {orderItem.quantity}
                    </Typography>
                    {orderItem.toppings && (
                      <Box sx={{ marginTop: "0.5em" }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Toppings:
                        </Typography>
                        {orderItem.toppings.map((topping, toppingIndex) => (
                          <Box key={toppingIndex} sx={{ marginLeft: "1em" }}>
                            <Typography variant="body2">
                              {topping.name} (Quantity: {topping.quantity})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Box>
  );
};

export default Orders;
