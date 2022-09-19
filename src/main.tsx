import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Error from "./pages/error";
import "./index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import GameComponent from "./pages/Game";
import FenComponent from "./pages/Fen";
const router = createBrowserRouter([
  {
    path: "/",

    element: <App />,
    errorElement: <Error />,
  },
  // {
  //   path: "game",
  //   element: <GameComponent />,
  // },
  // {
  //   path: "fen",
  //   element: <FenComponent />,
  // },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
