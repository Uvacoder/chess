import { useEffect, useState } from "react";
import BoardClass from "../models/Board";
import Cell from "../models/Cell";
import Game from "../models/Game";
import Piece from "../models/Piece";

export default function Board({ board }: { board: BoardClass }) {
  const [state, setState] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);

  function handleClick(cell: Cell) {
    function movePiece() {
      if (cell !== null) {
        if (cell.Piece !== null) {
          setActivePiece(cell.Piece);
        }
        board.ValidMoves(cell);
        board.MarkValidMoves(cell);

        setClickCount((p) => p + 1);
        if (cell.Piece === null && clickCount !== 0 && clickCount + 1 > 1) {
          board.MovePiece(cell);
          setClickCount((p) => 0);
          board.ResetBoardMarkers();
        }
        setState((p) => p + 0.000000000001);
      }
    }
    if (activePiece !== null) {
      setActivePiece(null);
      board.Capture(cell);
      setClickCount((p) => 0);
      board.ResetBoardMarkers();
    } else {
      movePiece();
    }
  }

  return (
    board && (
      <div>
        <div className={`grid grid-cols-8 w-[600px]`}>
          {board.GetBoard().map((row: Cell[], rowIdx) => {
            return (
              <div className="board-row" key={`board-row-${rowIdx}`}>
                {row.map((cell: Cell, cellIdx: number) => {
                  return (
                    <div
                      onClick={() => {
                        handleClick(cell);
                      }}
                      key={`board-piece-${cellIdx}`}
                      className={`
                      board-col-movable grid w-[75px] h-[75px] place-items-center relative ${
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
                      <p className="board-idx text-black">
                        [{cellIdx}, {rowIdx}]
                      </p>
                      {cell.Piece?.GetSpriteSrc() && (
                        <img
                          src={cell.Piece?.GetSpriteSrc()}
                          className={`w-[60px]`}
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
