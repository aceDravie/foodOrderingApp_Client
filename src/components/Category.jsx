import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, IconButton, Skeleton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import FoodCard from "./FoodCard";
import { Link } from "react-router-dom";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Category = ({ type, link, category, foods }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (foods.length > 0) {
      setLoading(false);
    }
  }, [foods]);

  const filteredFoods = foods.filter((food) =>
    food.category.includes(category)
  );

  return (
    <Box sx={{ textAlign: "left", my: 3 }}>
      <div
        className="head"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {type}
        </Typography>
        <Link to={link}>
          <IconButton>
            <ArrowForwardIos />
          </IconButton>
        </Link>
      </div>
      {filteredFoods.length > 0 ? (
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
              : filteredFoods
                  .slice(0, 4)
                  .map((food) => (
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
      ) : (
        <Typography variant="body1">
          No matching foods found for this category.
        </Typography>
      )}
    </Box>
  );
};

export default Category;
