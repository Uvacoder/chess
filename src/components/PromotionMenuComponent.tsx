import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { useGame } from "../hooks/GameContext";
import Cell from "../models/Cell";
import { COLORS } from "../utils/Constants";

export default function PromotionMenuComponent({
  pieceColor,
  cell,
  callBack,
}: {
  callBack: Function;
  cell: Cell;
  pieceColor: COLORS;
}) {
  const { board } = useGame();
  const pieces = [
    { name: "Queen", rep: "q" }, //rep is representation
    { name: "Rook", rep: "r" },
    { name: "Bishop", rep: "b" },
    { name: "Knight", rep: "n" },
  ];
  return (
    <div className="grid place-items-center h-full">
      <div className="grid place-items-center gap-3">
        <h2 className="text-center text-black text-xl font-bold">
          Choose a Piece for Promotion
        </h2>
        <div className="flex flex-wrap gap-3">
          {pieces.map((info) => {
            return (
              <div
                className="flex flex-col"
                key={`promotion-button-${info.name}`}
              >
                <button
                  className="p-2 rounded-xl bg-neutral-200 hover:bg-neutral-300"
                  onClick={() => {
                    board?.PromotePawn(cell, info.rep);
                    toast.success("Promoted to " + info.name);
                    callBack();
                  }}
                >
                  <img
                    data-for={info.name}
                    className={"w-[13vw] max-w-[100px]"}
                    data-tip
                    src={`/assets/sprites/${pieceColor}/${info.rep}.svg`}
                    alt=""
                  />
                </button>
                <p className="text-center text-black font-bold">{info.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
