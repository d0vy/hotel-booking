import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import HotelPage from "../pages/HotelPage";
import RoomPage from "../pages/RoomPage";
import LoginPage from "../pages/LoginPage";
import CreateHotelPage from "../pages/CreateHotelPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateRoomPage from "../pages/CreateRoomPage";

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
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "hotel/:hotelId",
        element: <HotelPage />,
      },
      {
        path: "hotel",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateHotelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "hotel/:hotelId/room/:roomId",
        element: <RoomPage />,
      },
      {
        path: "hotel/:hotelId/room",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateRoomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
