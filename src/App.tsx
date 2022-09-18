import { useEffect, useState } from "react";
import "./App.css";
import Board from "./models/Board";
import BoardComponent from "./components/board";
import Fen from "./models/Fen";
import { START_POSITION } from "./utils/Constants";
import PlayerBanner from "./components/PlayerBanner";

function App() {
  const [board, setBoard] = useState<Board>();
  const [startFen, setStartFen] = useState<string>(START_POSITION);
  useEffect(() => {
    try {
      const boardObj = new Board();
      new Fen(boardObj, startFen);
      setBoard(boardObj);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
      console.log(error);
    }
  }, [startFen]);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex items-stretch gap-5">
        <div className="">
          <PlayerBanner name="Player 1" />
          <BoardComponent key={"board"} board={board as Board} />
          <PlayerBanner name="Player 2" />
        </div>
        <div className="grid w-[300px]">
          <div className="my-5 p-5 bg-neutral-900 rounded-lg">
            <div>
              <h2 className="font-bold text-lg">Set Board Position</h2>
              <input
                type="text"
                className="mt-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="fen"
                id="fen"
                placeholder="Enter Valid FEN String"
              />
              <button
                className="mt-3 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Set Board Position
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
