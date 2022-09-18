import { useState } from "react";
import BoardClass from "../models/Board";
import Cell from "../models/Cell";
import { BOARD_SIZE, CELL_SIZE, SPRITE_SIZE } from "../utils/Constants";

export default function Board({ board }: { board: BoardClass }) {
  const [state, setState] = useState(0);

  return (
    board && (
      <div>
        <div className={`grid grid-cols-8 w-[${BOARD_SIZE}px]`}>
          {board.GetBoard().map((row: Cell[], rowIdx) => {
            return (
              <div className="board-row" key={`board-row-${rowIdx}`}>
                {row.map((cell: Cell, cellIdx: number) => {
                  return (
                    <div
                      onClick={() => {
                        if (cell !== null) {
                          board.ValidMoves(cell);
                          setState((p) => p + 1);
                        }
                      }}
                      key={`board-piece-${cellIdx}`}
                      className={`
                      board-col-movable grid w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] place-items-center relative ${
                        cellIdx % 2 == 0
                          ? rowIdx % 2 == 0
                            ? "white-cell"
                            : "black-cell"
                          : rowIdx % 2 == 0
                          ? "black-cell"
                          : "white-cell"
                      } ${cell.GetMarked() === true && "mark"} ${
                        cell.GetValidCellMark() === true && "valid-cell"
                      }
                    `}
                    >
                      <p className="board-idx">
                        [{cellIdx}, {rowIdx}]
                      </p>
                      {cell.Piece?.GetSpriteSrc() && (
                        <img
                          src={cell.Piece?.GetSpriteSrc()}
                          className={`w-[${SPRITE_SIZE}px]`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
