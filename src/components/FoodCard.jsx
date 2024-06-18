import React, { useState } from "react";
import { Box, Grid, Typography, Rating, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import FoodDialog from "../mod/FoodDialog"; 

const ImageWrapper = styled("div")({
  width: "100%",
  height: "200px",
  overflow: "hidden",
  position: "relative", 
  borderRadius: 10,
});

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  height: "100%",
});

const AddButton = styled(IconButton)({
  position: "absolute",
  boxShadow: "0 0 10px grey",
  bottom: "5px",
  zIndex: 999,
  right: "5px",
  background: "white",
  color: "black",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.8)",
  },
});

const FoodCard = ({ id, imageSrc, title, rating, price, description, }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={6} md={4} lg={3}>
      <div className="top">
        <ImageWrapper>
          <AddButton aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
          </AddButton>
          <StyledImage src={imageSrc} alt={title} />
        </ImageWrapper>
        <Box
          className="down"
          sx={{
            my: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Typography sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {title}
            </Typography>
            <Rating value={rating} readOnly />
          </div>
          <Typography
            sx={{
              fontWeight: "bold",
              background: "#72727626",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            GHC {price}
          </Typography>
        </Box>
      </div>

      <FoodDialog
        open={open}
        onClose={handleClose}
        title={title}
        rating={rating}
        price={price}
        imageSrc={imageSrc} 
        description={description}
        id={id}
      />
    </Grid>
  );
};

export default FoodCard;
