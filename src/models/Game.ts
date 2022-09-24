import FenParser from "@chess-fu/fen-parser";
import { COLORS, PIECES, START_POSITION } from "../utils/Constants";
import Board from "./Board";

import Cell from "./Cell";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";
export default class Game {
  constructor() {}
  private m_board: Board = new Board();
  public NewGame(fenString?: string) {
    try {
      const parser = new FenParser(fenString || START_POSITION);
      if (!parser.isValid) throw new Error("Invalid FEN String");
      const kings = {
        [COLORS.WHITE]: {
          location: { x: -1, y: -1 },
          checkInfo: {
            status: false,
            responsibleSquares: [],
          },
        },
        [COLORS.BLACK]: {
          location: { x: -1, y: -1 },
          checkInfo: {
            status: false,
            responsibleSquares: [],
          },
        },
      };
      const boardData = parser.ranks.map((rank, row) => {
        return rank.split("").map((piece, col) => {
          let pieceObj = null;
          if (piece !== "" && piece !== "-") {
            const color =
              piece === piece.toUpperCase() ? COLORS.WHITE : COLORS.BLACK;
            switch (piece.toUpperCase()) {
              case PIECES.KING:
                pieceObj = new King(color);
                kings[color].location = { x: row, y: col };
                break;
              case PIECES.QUEEN:
                pieceObj = new Queen(color);
                break;
              case PIECES.ROOK:
                pieceObj = new Rook(color);
                break;
              case PIECES.BISHOP:
                pieceObj = new Bishop(color);
                break;
              case PIECES.KNIGHT:
                pieceObj = new Knight(color);
                break;
              case PIECES.PAWN:
                pieceObj = new Pawn(color);
                break;
            }
          }
          const cellColor = (row + col) % 2 === 0 ? COLORS.WHITE : COLORS.BLACK;
          return new Cell({ x: row, y: col }, cellColor, pieceObj);
        });
      });
      const board = new Board();
      board.board = boardData;

      this.m_board = board;
      this.m_board.kings = kings;
    } catch (e) {
      throw e;
    }
  }
  // getters

  public GameOver() {
    console.log("Game End");
  }
  get board(): Board {
    return this.m_board;
  }
}
