import { useState } from "react";
import BoardClass from "../models/Board";
import Cell from "../models/Cell";

export default function Board({ board }: { board: BoardClass }) {
  const [state, setState] = useState(0);
  return (
    board && (
      <div className="board">
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
                      board-col-movable board-col ${
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
                      <img src={cell.Piece?.GetSpriteSrc()} width="80px" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* {board.GetBoard().map((row: Cell[], cellRowIdx) => {
          return (
            <div className="board-row" key={`board-row-${cellRowIdx}`}>
              {row.map((cell: Cell, cellIdx) => {
                return (
                  <div
                    key={`board-piece-${cellIdx}`}
                    onClick={() => {
                      if (cell !== null) {
                        board.ValidMoves(cell);
                        setState((p) => p + 1);
                      }
                    }}
                    className={`
                      board-col-movable board-col ${
                        cellIdx % 2 == 0
                          ? cellRowIdx % 2 == 0
                            ? "white-cell"
                            : "black-cell"
                          : cellRowIdx % 2 == 0
                          ? "black-cell"
                          : "white-cell"
                      } ${cell.GetMarked() === true && "mark"} ${
                      cell.GetValidCellMark() === true && "valid-cell"
                    }
                    `}
                  >
                    <p className="board-idx">
                      {cellIdx},{cellRowIdx}
                    </p>
                    {cell.Piece?.GetSpriteSrc() && (
                      <img src={cell.Piece?.GetSpriteSrc()} width="80px" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })} */}
      </div>
    )
  );
}
