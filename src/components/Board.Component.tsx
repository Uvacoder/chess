import { useState } from "react";

import Board from "../models/Board";
import Cell from "../models/Cell";
import { COLORS } from "../utils/Constants";
import Piece from "./Piece";

export default function BoardComponent({ board }: { board: Board }) {
  const [state, setState] = useState(false);
  const [sounds, setSounds] = useState({
    move: new Audio("/assets/sounds/move.mp3"),
    capture: new Audio("/assets/sounds/capture.mp3"),
    check: new Audio("/assets/sounds/check.mp3"),
    castle: new Audio("/assets/sounds/castle.mp3"),
  });
  return !board ? (
    <div>Loading...</div>
  ) : (
    <div className="grid w-[600px] grid-rows-8 grid-cols-8">
      {board.board.map((rank: Cell[], x) => {
        return rank.map((cell: Cell, y) => {
          const color = cell.color === COLORS.WHITE ? "#EBECD0" : "#769556";
          const cellStyle = function () {
            if (cell.validSq)
              return {
                background: "#D6C407",
                border: "2px solid #2a2a2a",
              };
            else if (cell.activeSq && cell.piece !== null)
              return {
                background: "#D6A707",
                border: "2px solid #2a2a2a",
              };
            else if (cell.validSq)
              return {
                background: "pink",
                border: "2px solid #2a2a2a",
              };
            else if (cell.checkSq)
              return {
                background: "red",
                border: "2px solid #2a2a2a",
              };
            else return { background: color };
          };
          return (
            <div
              className={`w-[75px] h-[75px] text-black font-bold relative overflow-hidden ${
                cell.piece !== null && "cursor-grab hover:opacity-80"
              }`}
              style={{
                borderCollapse: "collapse",
                ...cellStyle(),
              }}
              onMouseDown={() => {
                board.PieceClick(cell);
                setState(!state);
                if (board.sound.capture) sounds.capture.play();
                else if (board.sound.check) sounds.check.play();
                else if (board.sound.castle) sounds.castle.play();
                else if (board.sound.move) sounds.move.play();
              }}
            >
              <div className="absolute">
                {x}, {y}
              </div>
              <div className="w-[100%] h-[100%] overflow-hidden">
                <Piece sprite={cell.piece?.sprite} />
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
