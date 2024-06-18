import React, { useEffect, useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import Category from "./Category";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../helpers/firebase";

const SampFoods = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const categoriesCollection = collection(db, "category");
    const foodsCollection = collection(db, "food");

    const unsubscribeCategory = onSnapshot(categoriesCollection, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    });

    const unsubscribeFoods = onSnapshot(foodsCollection, (snapshot) => {
      const foodList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoods(foodList);
    });

    return () => {
      unsubscribeCategory();
      unsubscribeFoods();
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <TextField
        sx={{ mb: 2, p: 0, width: "100%", fontSize: "1em", fontWeight: "bold" }}
        placeholder="Search Category..."
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

      {filteredCategories.map((category) => (
        <Category
          key={category.id}
          type={category.type}
          link={category.id}
          category={category.name}
          foods={foods}
        />
      ))}
    </Box>
  );
};

export default SampFoods;
