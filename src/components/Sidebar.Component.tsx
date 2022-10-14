import { useState } from "react";
import { toast } from "react-toastify";
import { Chess, Copy } from "tabler-icons-react";
import { useGame } from "../hooks/GameContext";
import {
  AVAILABLE_FENS_LABLED,
  CopyTextToClipBoard,
  START_POSITION,
} from "../utils/Constants";
import InfoButtons from "./InfoButtons";
import ModalComponent from "./Modal";
export default function SideBar() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="grid relative h-full w-[400px]">
      <div className="p-5 bg-neutral-900">
        <button
          onClick={() => setModalOpen(true)}
          className="p-2 flex text-[1.5rem] items-center gap-3 bg-neutral-800 rounded hover:opacity-80"
        >
          <Chess size={20} />
          <p className="overflow-hidden">Game Info</p>
        </button>
        <FenComponent />
        <InfoButtons />
      </div>
      <ModalComponent
        closable={true}
        openStatus={modalOpen}
        setOpen={setModalOpen}
        backgroundClassName="bg-neutral-900/90"
        closeBtnBgVal={800}
        closeBtnIconColor="white"
      >
        <div className="p-3">
          <GameInfo />
        </div>
      </ModalComponent>
    </div>
  );
}

function FenComponent() {
  const [fenString, setFenString] = useState(START_POSITION);
  const { ChangeFenString, fenError } = useGame();

  return (
    <div className="mt-5">
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
          className={`border-2 resize-none appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            fenError && "animate-[shake_0.5s_ease-in-out_1]"
          } ${
            fenError
              ? " bg-rose-100 border-[2px] border-rose-500"
              : "bg-neutral-800 border-neutral-700 text-white"
          }`}
          name="fen-text"
          id="fen-text"
          value={fenString}
          onChange={(e) => {
            setFenString(e.target.value);
          }}
          placeholder="Enter Valid FEN String"
        />
      </div>
      <p className="text-center my-3">-OR-</p>
      <div>
        <label htmlFor="fen-select">Select From Available Positions</label>
        <select
          name="fen-select"
          id="fen-select"
          value={fenString}
          onChange={(e) => {
            setFenString(e.target.value);
          }}
          className="bg-neutral-800 border-neutral-700 text-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none cursor-pointer"
        >
          {AVAILABLE_FENS_LABLED.map((fen, idx) => {
            return (
              <option value={fen.fen} key={`fen-${idx}`}>
                {fen.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => ChangeFenString(fenString)}
          className="mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Apply Fen
        </button>
        <button
          className="mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => {
            setFenString(START_POSITION);
            ChangeFenString(START_POSITION);
          }}
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}

function GameInfo() {
  const { fen, pgn, board } = useGame();

  return (
    <div className="mb-5 p-3 grid gap-2">
      <h2 className="text-[1.5rem] font-bold">Game Info</h2>
      <div className="grid-item">
        <div className="grid-item">
          {board?.game.gameOverInfo.status === false ? (
            <>
              <h2 className="text-lg font-bold">Turn</h2>
              <p className="text-xl">
                It{"'"}s {board?.turn[0].toUpperCase() + board.turn.slice(1)}{" "}
                {"'"}s Turn
              </p>
            </>
          ) : (
            <p className="text-xl"> Game Over!</p>
          )}
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-lg font-bold">Board FEN</h2>
          <button
            className="p-1 bg-neutral-600 rounded-full hover:opacity-80"
            title="Copy Fen"
            onClick={() => {
              CopyTextToClipBoard(fen);
              toast.success("FEN Copied to Clipboard");
            }}
          >
            <Copy size={20} />
          </button>
        </div>
        <div className="mt-1 break-words bg-neutral-800 resize-none appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline h-max">
          {fen}
        </div>
      </div>
      {pgn?.length > 0 ? (
        <div className="grid-item">
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-lg font-bold">Board Moves (PGN)</h2>
            <button
              className="p-1 bg-neutral-600 rounded-full hover:opacity-80"
              title="Copy PGN"
              onClick={() => {
                CopyTextToClipBoard(fen);
                toast.success("PGN Copied to Clipboard");
              }}
            >
              <Copy size={20} />
            </button>
          </div>
          <ul className="mt-2 p-2 bg-neutral-800 text-white rounded max-h-[200px]">
            {pgn?.map((m, i) => {
              return (
                <li
                  className="hover:bg-neutral-700 py-3 text-lg font-bold px-2 rounded"
                  key={`pgn-${m}-${i}`}
                >
                  {i + 1}. {m}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-center font-bold italic">
          - Play Game to View Moves (PGN) -
        </p>
      )}
    </div>
  );
}
