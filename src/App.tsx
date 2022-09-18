import { useEffect, useState } from "react";
import "./App.css";
import Board from "./models/Board";
import BoardComponent from "./components/board";
import Fen from "./models/Fen";
import { START_POSITION } from "./utils/Constants";

function App() {
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    try {
      const boardObj = new Board();
      new Fen(boardObj, START_POSITION);
      setBoard(boardObj);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
      console.log(error);
    }
  }, []);

  return (
    <div className="App">
      <BoardComponent key={"board"} board={board as Board} />
    </div>
  );
}

export default App;
