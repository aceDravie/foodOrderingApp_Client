import React from "react";
import {
  Box,
  Button,
  Typography,
  Rating,
  Grid,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import {
  useScroll,
  useTransform,
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";

const gridItemStyles = {
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  p: 2,
  display: "flex",
  flexDirection: "column",
  borderRadius: "5px",
};

const Welcome = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  return (
    <>
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Box
            sx={{
              height: "90vh",
              backgroundImage:
                // 'url("https://img.freepik.com/free-photo/fresh-colourful-ingredients-mexican-cuisine_23-2148254294.jpg?t=st=1717899132~exp=1717902732~hmac=986108276f3bb554e3249a7d57849453a595bd96ee731dddc3a27c38f35a83c0&w=1380")',
                // 'url("https://img.freepik.com/free-photo/flat-lay-composition-mexican-food-with-copyspace_23-2148140340.jpg?t=st=1717905678~exp=1717909278~hmac=af9a29ed64312a20c4d113005fb15bd0da57c542568f6ac9aa146791eb9252ea&w=996")',
                // 'url("https://img.freepik.com/free-photo/vegan-food-white-background-with-copy-space_23-2148305769.jpg?t=st=1717905809~exp=1717909409~hmac=aa3a6bc751fe4e97da38f3ce2ae89417688440bab12ea6e03f63378c5d66554c&w=740")',
                // 'url("https://img.freepik.com/free-photo/delicious-brazilian-food-composition-with-copy-space_23-2148739217.jpg?t=st=1717905866~exp=1717909466~hmac=d92fbecd82f80d850df176094f0db2cc488678bcc6eaf4e92400815cb9fc3eae&w=1380")',
                'linear-gradient(to right, rgba(255,255,255,0), #ffffffe1),url("https://img.freepik.com/free-photo/copy-space-italian-food-ingredients_23-2148551732.jpg?t=st=1717905942~exp=1717909542~hmac=998a46f341815ae1a92cb1c373722e148210a0ba95201f3b7ee8fee488283fbf&w=1380")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant={"h3"} sx={{ fontWeight: "bold", mb: 3 }}>
              Order delivery near you
            </Typography>
            <Button
              variant="contained"
              component={Link}
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
              to="/login"
            >
              Login
            </Button>
          </Box>
        </m.div>
      </LazyMotion>

      <Box px={3} my={3} sx={{ flexGrow: 1 }}>
        <Grid container justifyContent="space-between">
          <Grid item lg={3.8} sx={gridItemStyles}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              <LocationOnIcon /> Winneba, South Campus
            </Typography>
            <Typography
              my={1}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Necessitatibus ex maiores non perspiciatis odit sapiente aut!
            </Typography>
            <Rating value={5} readOnly />
            <Typography mt={1} sx={{ fontStyle: "italic", fontSize: "small" }}>
              - {"Atta Junior"}
            </Typography>
          </Grid>

          <Grid item lg={3.8} sx={gridItemStyles}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              <LocationOnIcon /> Pomadze, Libery Rd
            </Typography>
            <Typography
              my={1}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              provident optio, adipisci et ut. Architecto consequuntur ullam
              eaque qui similique.
            </Typography>
            <Rating value={5} readOnly />
            <Typography mt={1} sx={{ fontStyle: "italic", fontSize: "small" }}>
              - {"Daniel Dravie"}
            </Typography>
          </Grid>

          <Grid item lg={3.8} sx={gridItemStyles}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              <LocationOnIcon /> North Campus
            </Typography>
            <Typography
              my={1}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              officia reprehenderit magni commodi quod excepturi iste nulla!
            </Typography>
            <Rating value={5} readOnly />
            <Typography mt={1} sx={{ fontStyle: "italic", fontSize: "small" }}>
              - {"Joseph Quainoo"}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box className="leaflet map" px={3} my={3} sx={{ flexGrow: 1 }}>
        <MapContainer
          center={[5.34034, -0.62418]} // Set the initial map center coordinates
          zoom={12} // Set the initial zoom level
          scrollWheelZoom={false} // Disable scroll wheel zoom
          style={{ height: "400px", width: "100%" }} // Set the map container dimensions
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Add markers for the locations */}
          <Marker position={[5.34034, -0.62418]}>
            <Popup>Winneba, South Campus</Popup>
          </Marker>
          <Marker position={[5.36034, -0.67428]}>
            <Popup>Pomadze, Libery Rd</Popup>
          </Marker>
          <Marker position={[5.34734, -0.7318]}>
            <Popup>North Campus</Popup>
          </Marker>
        </MapContainer>
      </Box>

      <Box className="footer" px={3} my={3} sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ textAlign: "center" }}>
          <Grid item xs={3}>
            <Typography variant="body1" my={3}>
              Place 1
            </Typography>
            <Typography variant="body1" my={3}>
              Place 2
            </Typography>
            <Typography variant="body1" my={3}>
              Place 3
            </Typography>
            <Typography variant="body1" my={3}>
              Place 4
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" my={3}>
              Place 5
            </Typography>
            <Typography variant="body1" my={3}>
              Place 6
            </Typography>
            <Typography variant="body1" my={3}>
              Place 7
            </Typography>
            <Typography variant="body1" my={3}>
              Place 8
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" my={3}>
              Place 9
            </Typography>
            <Typography variant="body1" my={3}>
              Place 10
            </Typography>
            <Typography variant="body1" my={3}>
              Place 11
            </Typography>
            <Typography variant="body1" my={3}>
              Place 12
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" my={3}>
              Place 13
            </Typography>
            <Typography variant="body1" my={3}>
              Place 14
            </Typography>
            <Typography variant="body1" my={3}>
              Place 15
            </Typography>
            <Typography variant="body1" my={3}>
              Place 16
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Welcome;
