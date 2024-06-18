import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import FoodCard from "./FoodCard";
import { db } from "../helpers/firebase";
import {
  collection,
  query,
  limit,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const AllCategoryFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryDetails, setCategoryDetails] = useState({
    type: "",
    name: "",
  });
  const { clientID, categoryID } = useParams();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (!categoryID) return;

    const categoryDoc = doc(db, "category", categoryID);

    const unsubscribe = onSnapshot(
      categoryDoc,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setCategoryDetails({ type: data.type, name: data.name });
        } else {
          console.error("No such category!");
        }
      },
      (error) => {
        console.error("Error fetching category details:", error);
      }
    );

    return () => unsubscribe();
  }, [categoryID]);

  useEffect(() => {
    if (!categoryDetails.name) return;

    const q = query(
      collection(db, "food"),
      where("category", "array-contains", categoryDetails.name)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let foodList = [];
        querySnapshot.forEach((doc) => {
          foodList.push({ id: doc.id, ...doc.data() });
        });

        foodList = shuffleArray(foodList);
        setFoods(foodList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching foods:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoryDetails]);

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      food.category.includes(categoryDetails.name)
  );

  return (
    <Box sx={{ textAlign: "left", my: 3 }}>
      <TextField
        sx={{ mb: 2, p: 0, width: "100%", fontSize: "1em", fontWeight: "bold" }}
        placeholder="Search Foods..."
        value={searchValue}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <div
        className="head"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {categoryDetails.type}
        </Typography>
      </div>
      <Box sx={{ my: 2 }}>
        <Grid container spacing={2}>
          {loading
            ? [1, 2, 3, 4].map((index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Grid>
              ))
            : filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  id={food.id}
                  imageSrc={food.image}
                  title={food.name}
                  rating={food.ratings}
                  price={food.price}
                  description={food.description}
                />
              ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllCategoryFoods;
