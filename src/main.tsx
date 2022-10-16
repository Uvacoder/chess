import ReactDOM from "react-dom/client";
import App from "./App";
import Error from "./pages/Error.Page";
import "./index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",

    element: <App />,
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
