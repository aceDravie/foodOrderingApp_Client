// RatingDialog.jsx
import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";
import { useParams } from "react-router-dom";

function RatingDialog({ open, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setCustomerName(storedName);
    }
  }, []);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "ratings"), {
        rating: rating,
        comment: comment,
        location: location,
        customerName: customerName,

      });
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rate Our App</DialogTitle>
      <DialogContent>
        <Typography component="legend">
          How would you rate your experience?
        </Typography>
        <Rating name="rating" value={rating} onChange={handleRatingChange} />
        <TextField
          margin="dense"
          id="comment"
          label="Comments"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
        />
        <TextField
          margin="dense"
          id="location"
          label="Location"
          type="text"
          fullWidth
          value={location}
          onChange={handleLocationChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Skip</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RatingDialog;
