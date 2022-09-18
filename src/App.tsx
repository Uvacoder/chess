import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function App() {
  return (
    <>
      <div className="grid h-screen place-items-center">
        <Home />
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  );
}

export default App;
