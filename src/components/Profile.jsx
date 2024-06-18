import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../helpers/firebase";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  where,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const Profile = ({ open, onOpen, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const { clientID } = useParams();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      setSnackbarMessage("Both password fields must be filled!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (oldPassword !== newPassword) {
      setSnackbarMessage("Old and new password do not match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      const customersCollection = collection(db, "customers");
      const q = query(
        customersCollection,
        where("email", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const customerDocRef = querySnapshot.docs[0].ref;
        await updateDoc(customerDocRef, {
          name,
          contact,
          email: currentUser.email,
          nickName,
        });
      } else {
        console.error("Error updating profile:", error);
        setSnackbarMessage("Error updating profile: " + error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Error updating profile: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const customersCollection = collection(db, "customers");
        const q = query(
          customersCollection,
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setName(userData.name);
          setContact(userData.contact);
          setEmail(userData.email);
          setNickName(userData.nickName);
        } else {
          console.log("No matching user document found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="form-dialog-title">PROFILE</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="contact"
              label="Contact"
              type="text"
              fullWidth
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="nickName"
              label="Nick Name"
              type="text"
              fullWidth
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <hr />

            <TextField
              required
              autoFocus
              margin="dense"
              id="old-password"
              label="Old Password"
              type="password"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="new-password"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Change
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
