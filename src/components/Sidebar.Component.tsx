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
export default function SideBar({
  setDrawerOpen,
}: {
  setDrawerOpen: Function;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div>
        <button
          onClick={() => setModalOpen(true)}
          className="p-2 flex text-[1.5rem] items-center gap-3 bg-neutral-800 rounded hover:opacity-80"
        >
          <Chess size={20} />
          <p className="overflow-hidden text-sans-serif">Game Info</p>
        </button>
        <FenComponent setDrawerOpen={setDrawerOpen} />
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
          <GameInfo setDrawerOpen={setDrawerOpen} />
        </div>
      </ModalComponent>
    </>
  );
}

function FenComponent({ setDrawerOpen }: { setDrawerOpen: Function }) {
  const [fenString, setFenString] = useState(START_POSITION);
  const { ChangeFenString, fenError } = useGame();

  return (
    <div className="mt-5">
      <h2 className="font-bold mb-3 text-lg text-sans-serif">
        Set Board Position{" "}
        <a
          className="italic text-sm underline text-sans-serif"
          href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation"
          target="_blank"
        >
          What is Fen?
        </a>
      </h2>
      <div>
        <label className="text-lg text-sans-serif" htmlFor="fen-text">
          Enter Fen String
        </label>
        <textarea
          rows={6}
          className={`text-sans-serif border-2 resize-none appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
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
        <label className="text-lg text-sans-serif" htmlFor="fen-select">
          Select From Available Positions
        </label>
        <select
          name="fen-select"
          id="fen-select"
          value={fenString}
          onChange={(e) => {
            setFenString(e.target.value);
          }}
          className="text-sans-serif  bg-neutral-800 border-neutral-700 text-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none cursor-pointer"
        >
          {AVAILABLE_FENS_LABLED.map((fen, idx) => {
            return (
              <option
                className="text-sans-serif"
                value={fen.fen}
                key={`fen-${idx}`}
              >
                {fen.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            ChangeFenString(fenString);
            fenError && setDrawerOpen(false);
          }}
          className="text-sans-serif mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Apply Fen
        </button>
        <button
          className="text-sans-serif mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => {
            setFenString(START_POSITION);
            ChangeFenString(START_POSITION);
            fenError && setDrawerOpen(false);
          }}
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}

function GameInfo({ setDrawerOpen }: { setDrawerOpen: Function }) {
  const { fen, pgn, board } = useGame();

  return (
    <div className="mb-5 grid gap-2">
      <h2 className="text-[1.5rem] font-bold text-sans-serif">Game Info</h2>
      <div className="grid-item">
        <div className="grid-item">
          {board?.game.gameOverInfo.status === false ? (
            <>
              <h2 className="text-lg font-bold">Turn</h2>
              <p className="text-xl text-sans-serif">
                It{"'"}s {board?.turn[0].toUpperCase() + board.turn.slice(1)}{" "}
                {"'"}s Turn
              </p>
            </>
          ) : (
            <p className="text-xl text-sans-serif">Game Over!</p>
          )}
        </div>
      </div>
      <div className="grid-item">
        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-lg font-bold text-sans-serif">Board FEN</h2>
          <button
            className="text-sans-serif p-1 bg-neutral-600 rounded-full hover:opacity-80"
            title="Copy Fen"
            onClick={() => {
              CopyTextToClipBoard(fen);
              setDrawerOpen(false);
              toast.success("FEN Copied to Clipboard");
            }}
          >
            <Copy size={20} />
          </button>
        </div>
        <div className="text-sans-serif mt-1 break-words bg-neutral-800 resize-none appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline h-max">
          {fen}
        </div>
      </div>
      {/* {pgn?.length > 0 ? (
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
      )} */}
    </div>
  );
}
