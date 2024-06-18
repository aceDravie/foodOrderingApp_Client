import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6439ff",
    },
  },
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
});

export default theme;
