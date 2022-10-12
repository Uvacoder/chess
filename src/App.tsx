import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import GameProvider from "./hooks/GameContext";
import Game from "./pages/Game.Page";
function App() {
  return (
    <GameProvider>
      <Game />
      <ToastContainer theme="dark" position="bottom-right" />
    </GameProvider>
  );
}

export default App;
