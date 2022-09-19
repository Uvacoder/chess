import { useEffect, useState } from "react";
import Board from "../models/Board";
import BoardComponent from "../components/board";
import Fen from "../models/Fen";
import { AVAILABLE_FENS, START_POSITION } from "../utils/Constants";
import PlayerBanner from "../components/PlayerBanner";
import { toast } from "react-toastify";
function FenComponent() {
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
    }
    return () => toast.dismiss();
  }, [startFen]);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex items-stretch gap-5">
        <div className="">
          <BoardComponent key={"board"} board={board as Board} />
        </div>
        <div className="grid w-[320px]">
          <div className="p-5 bg-neutral-900 rounded-lg">
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

              <div>
                <label htmlFor="fen-text">Enter Fen String</label>
                <textarea
                  rows={6}
                  className={`resize-none  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 border-${
                    fenErr.error === false ? "green" : "red"
                  }-500`}
                  name="fen-text"
                  id="fen-text"
                  placeholder="Enter Valid FEN String"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                  }}
                />
                {fenErr.error === true && (
                  <p className="text-red-500 mb-2">{fenErr.message}</p>
                )}
              </div>
              <p>OR</p>
              <div>
                <label htmlFor="fen-select">Select From Available Games</label>
                <select
                  name="fen-select"
                  id="fen-select"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none cursor-pointer"
                  onChange={(e) => {
                    setInputVal(e.target.value);
                  }}
                >
                  {AVAILABLE_FENS.map((fen, idx) => {
                    return (
                      <option value={fen} key={`fen-${idx}`}>
                        Fen {idx}
                      </option>
                    );
                  })}
                </select>
              </div>
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

export default FenComponent;
