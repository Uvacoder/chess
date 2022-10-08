import { Chess } from "tabler-icons-react";
import { COLORS } from "../utils/Constants";

export default function ModalComponent({
  openStatus,
  setOpen,
  winner = "DRAW",
}: {
  openStatus: boolean;
  setOpen: any;
  winner: COLORS | "DRAW" | null;
}) {
  return (
    <div className="absolute z-[999999999999] top-0 w-full h-full backdrop-blur-sm bg-black/90 grid place-items-center">
      <div className="flex flex-col gap-5">
        <h2 className=" text-center text-lg overflow-hidden font-black">
          Game Over!
        </h2>
        <h2 className=" text-center text-[2rem] font-black">
          {winner && winner !== "DRAW" && (
            <div className="flex items-center text-center gap-5">
              <p className="text-center overflow-hidden">
                {winner[0].toUpperCase() + winner.slice(1, winner.length)} Won!
              </p>
              <div
                className={`p-2 bg-${
                  winner === COLORS.WHITE ? "black" : "white"
                } rounded`}
              >
                <Chess
                  color={`${winner === COLORS.WHITE ? "white" : "black"}`}
                />
              </div>
            </div>
          )}
          {winner === "DRAW" && (
            <div className="overflow-hidden flex items-center text-center ">
              Draw!
            </div>
          )}
        </h2>
      </div>
    </div>
  );
}
