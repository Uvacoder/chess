import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Game from "./pages/Game.Page";
import Analysis from "./pages/Analysis.Page";
import MenuPage from "./pages/Menu.Page";

import { Route, Routes } from "react-router-dom";
import CountDownProvider from "./hooks/CountdownContext";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route
        path="/game"
        element={
          <CountDownProvider>
            <Game />
          </CountDownProvider>
        }
      />
      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  );
}

export default App;
