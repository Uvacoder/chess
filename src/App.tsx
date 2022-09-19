import Index from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import FenComponent from "./pages/Fen";
function App() {
  return (
    <>
      <FenComponent />
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  );
}

export default App;
