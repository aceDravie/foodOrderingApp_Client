// import React from "react";
// import { Box, Container, TextField } from "@mui/material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
// import "../styles/slideshow.css";

// const Slideshow = () => {
//   return (
//     <div className="container">
//       <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         loop={true}
//         slidesPerView={"auto"}
//         coverflowEffect={{
//           rotate: 0,
//           stretch: 0,
//           depth: 100,
//           modifier: 2.5,
//         }}
//         pagination={{ el: ".swiper-pagination", clickable: true }}
//         navigation={{
//           nextEl: ".swiper-button-next",
//           prevEl: ".swiper-button-prev",
//           clickable: true,
//         }}
//         modules={[EffectCoverflow, Pagination, Navigation]}
//         className="swiper_container"
//       >
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?t=st=1717929130~exp=1717932730~hmac=387da611e6c2cce3f5c405379e959ce1351ce175bb45306d07489d54bbcb9f07&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1717929178~exp=1717932778~hmac=0ccd777233b6f0cabf0ce494609a3d2b215444c7e5788b86708c6eb864f41149&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/burger-hamburger-cheeseburger_505751-3697.jpg?t=st=1717929208~exp=1717932808~hmac=10452451e0e305efdc8bb513957fca30a69a88eb0ddea44710f77a266d8621af&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/fruit-salad-spilling-floor-was-mess-vibrant-colors-textures-generative-ai_8829-2895.jpg?t=st=1717929241~exp=1717932841~hmac=8e402adb91d1c50fa1e35f30db9303e9236c55b7a7d88971a632f30a2b4a42bf&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/top-view-meals-tasty-yummy-different-pastries-dishes-brown-surface_140725-14554.jpg?t=st=1717929282~exp=1717932882~hmac=64944a6965ad726e31282458eedd87d38c8ebf08d48b581c39d966eab5bab411&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img
//             src={
//               "https://img.freepik.com/free-photo/delicious-burger-with-many-ingredients-isolated-white-background-tasty-cheeseburger-splash-sauce_90220-1266.jpg?t=st=1717929015~exp=1717932615~hmac=16160e6632c0717452825358f1fae1fc99c9f813f91d0b9047075636ead9e371&w=740"
//             }
//             alt="slide_image"
//           />
//         </SwiperSlide>

//         <div className="slider-controler">
//           <div className="swiper-button-prev slider-arrow">
//             <ion-icon name="arrow-back-outline"></ion-icon>
//           </div>
//           <div className="swiper-button-next slider-arrow">
//             <ion-icon name="arrow-forward-outline"></ion-icon>
//           </div>
//           <div className="swiper-pagination"></div>
//         </div>
//       </Swiper>
//     </div>
//   );
// };

// export default Slideshow;
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "../styles/slideshow.css";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../helpers/firebase";
import FoodDialog from "../mod/FoodDialog";

const Slideshow = () => {
  const [topFoods, setTopFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTopFoods = () => {
      const foodsCollection = collection(db, "food");
      const q = query(foodsCollection, orderBy("count", "desc"), limit(10));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const topFoodsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTopFoods(topFoodsData);
        },
        (error) => {
          console.error("Error fetching top foods:", error);
        }
      );

      return unsubscribe; // Return the unsubscribe function to clean up the listener
    };

    const unsubscribe = fetchTopFoods();

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleImageClick = (food) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFood(null);
  };

  return (
    <div className="container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {topFoods.map((food) => (
          <SwiperSlide key={food.id}>
            <Box
              className="slide-content"
              onClick={() => handleImageClick(food)}
            >
              <img src={food.image} alt={food.name} />
              <Typography variant="h6" className="food-name">
                {food.name}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>

      {selectedFood && (
        <FoodDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          title={selectedFood.name}
          rating={selectedFood.rating}
          price={selectedFood.price}
          imageSrc={selectedFood.image}
          description={selectedFood.description}
          id={selectedFood.id}
        />
      )}
    </div>
  );
};

export default Slideshow;
