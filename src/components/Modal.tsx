import { Chess } from "tabler-icons-react";
import { TGameOverInfo } from "../@types";
import { Capitalize, COLORS } from "../utils/Constants";

export default function ModalComponent({
  openStatus,
  setOpen,
  gameOverInfo,
}: {
  openStatus: boolean;
  setOpen: any;
  gameOverInfo: TGameOverInfo;
}) {
  return (
    <div className="absolute z-[999999999999] top-0 w-full h-full backdrop-blur-sm bg-white/90 grid place-items-center">
      <div className="flex flex-col gap-5">
        <h2 className=" text-center text-lg overflow-hidden font-black text-black">
          Game Over!
        </h2>
        <h2 className="text-center text-[2rem] font-black text-black">
          {gameOverInfo.reason.won.status === true && (
            <div className="flex items-center gap-3">
              <p className="overflow-hidden">
                {Capitalize(gameOverInfo.reason.won.reason as string)} Won!
              </p>
              <div
                className={`p-2 rounded shadow-sm border-[3px] ${
                  gameOverInfo.reason.won.reason === "white"
                    ? "bg-white"
                    : "bg-black"
                }`}
              >
                <Chess
                  color={
                    gameOverInfo.reason.won.reason === "white"
                      ? COLORS.BLACK
                      : COLORS.WHITE
                  }
                />
              </div>
            </div>
          )}
          {gameOverInfo.reason.draw.status === true && (
            <div className="flex items-center gap-3">
              <p className="overflow-hidden">Game Drawn!</p>
              <p className="overflow-hidden">
                {gameOverInfo.reason.draw.reason &&
                  gameOverInfo.reason.draw.reason[0] +
                    gameOverInfo.reason.draw.reason
                      .slice(1, gameOverInfo.reason.draw.reason.length)
                      .toLowerCase()}
              </p>
            </div>
          )}
        </h2>
      </div>
    </div>
  );
}
