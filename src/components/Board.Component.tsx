import { useEffect, useState } from "react";

import Board from "../models/Board";
import Cell from "../models/Cell";
import { COLORS, Flip, START_POSITION } from "../utils/Constants";
import Piece from "./Piece";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useGame } from "../hooks/GameContext";
export default function BoardComponent() {
  const { board } = useGame();
  const { setFen, setGameOver } = useGame();
  const [state, setState] = useState(false);
  useEffect(() => {
    setFen(board.fen || START_POSITION);
    setGameOver(board.game.gameOverInfo);
  }, [state]);

  const [sounds, setSounds] = useState({
    move: new Audio("/assets/sounds/move.mp3"),
    capture: new Audio("/assets/sounds/capture.mp3"),
    check: new Audio("/assets/sounds/check.mp3"),
    castle: new Audio("/assets/sounds/castle.mp3"),
    checkmate: new Audio("/assets/sounds/checkmate.mp3"),
    draw: new Audio("/assets/sounds/draw.mp3"),
  });

  return !board ? (
    <p>Loading</p>
  ) : (
    <div className="w-screen px-5">
      <div
        style={{
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "auto",
          maxWidth: "800px",
        }}
      >
        {board.board.map((rank: Cell[], x: number) => {
          return rank.map((cell: Cell, y) => {
            const cellColorClass =
              cell.color === COLORS.WHITE ? "white-cell" : "black-cell";
            const cellClass = function () {
              if (cell.validSq) return "valid-cell";
              else if (cell.activeSq && cell.piece !== null)
                return "active-cell";
              else if (cell.checkSq) return "check-cell";
              else {
                if (cell.color === COLORS.WHITE) return "white-cell";
                else return "black-cell";
              }
            };

            return (
              <div
                key={x + y}
                className={`pt-[100%] text-black relative font-bold relative overflow-hidden ${
                  cell.piece !== null && "cursor-grab hover:opacity-80"
                } ${cellColorClass} ${cellClass()}`}
                onMouseDown={() => {
                  board.PieceClick(cell, board.turn);
                  setState(!state);
                  if (board.sound.capture) sounds.capture.play();
                  else if (board.sound.check) sounds.check.play();
                  else if (board.sound.castle) sounds.castle.play();
                  else if (board.sound.move) sounds.move.play();
                  else if (board.sound.checkmate) sounds.checkmate.play();
                  else if (board.sound.draw) sounds.draw.play();
                }}
              >
                {/* <div className="absolute top-0 left-0">
                  {x}, {y}
                </div> */}
                <Piece sprite={cell.piece?.sprite} />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
