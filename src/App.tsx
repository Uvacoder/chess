import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import GameProvider from "./hooks/GameContext";
import Game from "./pages/Game.Page";
import MenuPage from "./pages/Menu.Page";
function App() {
  return (
    <GameProvider>
      <MenuPage />
      {/* <Game /> */}
      <ToastContainer theme="dark" position="bottom-right" />
    </GameProvider>
  );
}

export default App;
