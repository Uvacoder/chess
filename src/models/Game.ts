import FenParser from "@chess-fu/fen-parser";
import { TGameOverInfo, TPieceMap } from "../@types";
import { COLORS, GAME_STATE, PIECES, START_POSITION } from "../utils/Constants";
import Board from "./Board";

import Cell from "./Cell";
import Fen from "./Fen";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";
export default class Game {
  constructor() {}
  private m_boardPositions: Array<string> = [];
  private m_gameOver = false;
  private m_gameOverInfo: TGameOverInfo = {
    status: false,
    reason: {
      won: {
        status: false,
        reason: null,
      },
      draw: {
        status: false,
        reason: null,
      },
    },
  };
  private m_winner: COLORS | "DRAW" | "STALEMATE" | null = null;
  private m_board: Board = new Board(this);
  public NewGame(fenString?: string) {
    try {
      const parser = new Fen(fenString || START_POSITION);
      if (!parser.isValid) throw new Error("Invalid FEN String");
      const kings = {
        [COLORS.WHITE]: {
          location: { x: -1, y: -1 },
          checkInfo: {
            status: false,
            responsibleSquares: [],
            direction: {
              h: false,
              v: false,
              rd: false,
              ld: false,
            },
          },
        },
        [COLORS.BLACK]: {
          location: { x: -1, y: -1 },
          checkInfo: {
            status: false,
            responsibleSquares: [],
            direction: {
              h: false,
              v: false,
              rd: false,
              ld: false,
            },
          },
        },
      };
      const pieces: TPieceMap = {
        [COLORS.BLACK]: [],
        [COLORS.WHITE]: [],
      };
      const boardData = parser.ranks.map((rank, row) => {
        return rank.split("").map((piece, col) => {
          let pieceObj = null;
          if (piece !== "" && piece !== "-") {
            const color =
              piece === piece.toUpperCase() ? COLORS.WHITE : COLORS.BLACK;
            pieces[color].push({ x: row, y: col });
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
      const board = new Board(this);
      board.board = boardData;

      this.m_board = board;
      this.m_board.pieceLocation = pieces;
      this.m_board.turn = parser.turn === "w" ? COLORS.WHITE : COLORS.BLACK;
      this.m_board.kings = kings;
    } catch (e) {
      throw e;
    }
  }
  set board(board: Board) {
    this.m_board = board;
  }

  get boardPositions() {
    return this.m_boardPositions;
  }

  get board() {
    return this.m_board;
  }

  public PositionCount(position: string) {
    let count = 0;
    this.m_boardPositions.forEach((pos) => {
      if (pos.split(" ")[0] === position.split(" ")[0]) count++;
    });
    return count;
  }

  public AddToBoardPositions(position: string) {
    this.m_boardPositions.push(position);
  }
  set gameOverInfo(val: TGameOverInfo) {
    this.m_gameOverInfo = val;
  }

  set gameOverStatus(status: boolean) {
    this.m_gameOver = status;
  }
  get gameOverStatus() {
    return this.m_gameOver;
  }
  set winner(color: COLORS | "DRAW" | "STALEMATE" | null) {
    this.m_winner = color;
  }
  get gameOverInfo() {
    return this.m_gameOverInfo;
  }
  get winner() {
    return this.m_winner;
  }

  // getters
}
