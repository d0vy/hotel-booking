import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import HotelPage from "../pages/HotelPage";
import RoomPage from "../pages/RoomPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "hotel/:hotelId",
        element: <HotelPage />,
      },
      {
        path: "hotel/:hotelId/room/:roomId",
        element: <RoomPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
