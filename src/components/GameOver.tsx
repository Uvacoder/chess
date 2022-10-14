import { Chess } from "tabler-icons-react";
import { TGameOverInfo } from "../@types";
import { useGame } from "../hooks/GameContext";
import { Capitalize, COLORS, START_POSITION } from "../utils/Constants";

export default function GameOver() {
  const { gameOver, ChangeFenString, ResetGameOverStatus } = useGame();
  return (
    <div className="grid border-2 items-center justify-center h-full">
      <div className="grid gap-5">
        <h2 className=" text-center text-lg overflow-hidden font-black text-black">
          Game Over!
        </h2>
        <h2 className="text-center text-[2rem] font-black text-black">
          {gameOver.reason.won.status === true && (
            <div className="flex items-center gap-3">
              <p className="overflow-hidden">
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
            className="p-2 w-full bg-neutral-700 rounded hover:opacity-80"
          >
            Play Again
          </button>
          {/* <button className="p-2 w-full bg-neutral-700 rounded hover:opacity-80">
            Goto Menu
          </button> */}
        </div>
      </div>
    </div>
  );
}
