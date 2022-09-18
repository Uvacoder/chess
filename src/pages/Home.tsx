import { useEffect, useState } from "react";
import Board from "../models/Board";
import BoardComponent from "../components/board";
import Fen from "../models/Fen";
import { START_POSITION } from "../utils/Constants";
import PlayerBanner from "../components/PlayerBanner";
import { toast } from "react-toastify";
function App() {
  const [board, setBoard] = useState<Board>();
  const [startFen, setStartFen] = useState(START_POSITION);
  const [inputVal, setInputVal] = useState(START_POSITION);
  const [fenErr, setFenErr] = useState({
    error: false,
    message: "",
  });
  useEffect(() => {
    try {
      const boardObj = new Board();
      new Fen(boardObj, startFen);
      setBoard(boardObj);
      toast.success("Position Applied to board", {
        autoClose: 1000,
      });
      setFenErr({
        error: false,
        message: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
        autoClose: 1000,
      });
      setFenErr({
        error: true,
        message: error.message || "Something went wrong",
      });
      console.log(error);
    }
    return () => toast.dismiss();
  }, [startFen]);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex items-stretch gap-5">
        <div className="">
          <PlayerBanner name="Player 1" />
          <BoardComponent key={"board"} board={board as Board} />
          <PlayerBanner name="Player 2" />
        </div>
        <div className="grid w-[320px]">
          <div className="my-5 p-5 bg-neutral-900 rounded-lg">
            <div>
              <h2 className="font-bold mb-3 text-lg">
                Set Board Position{" "}
                <a
                  className="italic text-sm underline"
                  href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation"
                  target="_blank"
                >
                  What is Fen?
                </a>
              </h2>

              <label htmlFor="fen">Enter Fen String</label>
              <textarea
                rows={6}
                className={`resize-none  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 border-${
                  fenErr.error === false ? "green" : "red"
                }-500`}
                name="fen"
                id="fen"
                placeholder="Enter Valid FEN String"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                }}
              />
              {fenErr.error === true && (
                <p className="text-red-500 mb-2">{fenErr.message}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setStartFen(inputVal);
                  }}
                  className="mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Apply Fen
                </button>
                <button
                  onClick={() => {
                    setInputVal(START_POSITION);
                    setStartFen(START_POSITION);
                  }}
                  className="mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Reset Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
