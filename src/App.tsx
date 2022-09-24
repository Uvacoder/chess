import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Game from "./pages/Game.Page";
function App() {
  return (
    <>
      <Game />
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  );
}

export default App;
