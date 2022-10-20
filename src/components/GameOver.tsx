import { Chess } from "tabler-icons-react";
import { useGame } from "../hooks/GameContext";
import { Capitalize, COLORS, START_POSITION } from "../utils/Constants";
import { Link } from "react-router-dom";
import { useEffect } from "react";
export default function GameOver() {
  const { gameOver, ChangeFenString, ResetGameOverStatus } = useGame();
  return (
    <div className="grid border-2 items-center justify-center h-full">
      <div className="grid place-items-center gap-5">
        <h2 className="text-center leading-tight text-[5rem] overflow-hidden font-black text-black">
          Game Over!
        </h2>
        <h2 className="text-center text-[2rem] font-black text-black">
          {gameOver.reason.won.status === true && (
            <div className="flex items-center gap-3">
              <p className="overflow-hidden text-[3rem] leading-tight">
                {Capitalize(gameOver.reason.won.reason as string)} Won!
              </p>
              <div
                className={`p-2 rounded shadow-sm border-[3px] ${
                  gameOver.reason.won.reason === "white"
                    ? "bg-white"
                    : "bg-black"
                }`}
              >
                <Chess
                  color={
                    gameOver.reason.won.reason === "white"
                      ? COLORS.BLACK
                      : COLORS.WHITE
                  }
                />
              </div>
            </div>
          )}
          {gameOver.reason.draw.status === true && (
            <div className="flex items-center gap-3">
              <p className="overflow-hidden">Game Drawn!</p>
              <p className="overflow-hidden">
                {gameOver.reason.draw.reason &&
                  gameOver.reason.draw.reason[0] +
                    gameOver.reason.draw.reason
                      .slice(1, gameOver.reason.draw.reason.length)
                      .toLowerCase()}
              </p>
            </div>
          )}
        </h2>
        <div className="flex w-full border gap-2">
          <button
            onClick={() => {
              ChangeFenString(START_POSITION);
              ResetGameOverStatus();
            }}
            className="py-2 pt-3 text-[2rem] w-full bg-primary text-black rounded hover:opacity-80"
          >
            Play Again
          </button>
          <Link to="/" className="w-full">
            <button className="text-white py-2 pt-3 text-[2rem] w-full bg-neutral-700 rounded hover:opacity-80">
              Main Menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
