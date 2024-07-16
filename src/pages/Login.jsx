import { useContext, useState } from "react";
import { auth, db } from "../helpers/firebase";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Button,
  InputAdornment,
  Snackbar,
  IconButton,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      //fetching customer details from customers db
      const user = userCredential.user;

      const customerQuery = query(
        collection(db, "customers"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(customerQuery);

      if (!querySnapshot.empty) {
        dispatch({ type: "LOGIN", payload: user });
        navigate(`/dashboard/${user.uid}`);
      } else {
        setError("You do not have admin access.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "95vh",
        backgroundImage:
          'url("https://img.freepik.com/free-photo/various-vegetables-black-table-with-space-message_1220-616.jpg?t=st=1721039055~exp=1721042655~hmac=305b3271d5ec752c5180a48c785cb7aac9aa4d658f1b40ffe7f0b9ee662c0a48&w=1060")',
        //'linear-gradient(to right, rgba(255,255,255,0), #ffffffe1),url("https://img.freepik.com/free-photo/copy-space-italian-food-ingredients_23-2148551732.jpg?t=st=1717905942~exp=1717909542~hmac=998a46f341815ae1a92cb1c373722e148210a0ba95201f3b7ee8fee488283fbf&w=1380")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundImage:
            'url("https://img.freepik.com/free-photo/fresh-colourful-ingredients-mexican-cuisine_23-2148254294.jpg?t=st=1717899132~exp=1717902732~hmac=986108276f3bb554e3249a7d57849453a595bd96ee731dddc3a27c38f35a83c0&w=1380")',

          height: "80vh",
        }}
      >
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              LOGIN
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Person />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              size="small"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ marginBottom: "10px" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Grid>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
