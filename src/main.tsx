import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import GameProvider from "./hooks/GameContext";
import { ToastContainer } from "react-toastify";
import "./index.css";
import "./menu.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <GameProvider>
      <App />
    </GameProvider>
    <ToastContainer theme="dark" position="bottom-right" />
  </BrowserRouter>
);
