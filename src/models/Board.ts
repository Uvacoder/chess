import { DropResult } from "react-beautiful-dnd";
import { TLocation, TPiece } from "../@types";
import { COLORS, ConvertIdxToLocation } from "../utils/Constants";
import Cell from "./Cell";
import { King, Knight } from "./Piece";

export default class Board {
  private m_board: Cell[][] = [];
  private m_kings: {
    [key in COLORS]: {
      location: TLocation;
      checkInfo: {
        status: boolean;
        responsibleSquares: TLocation[];
      };
    };
  } = {
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

  private m_currPiece: {
    piece: TPiece | null;
    validMoves: TLocation[];
    boardCoverage: TLocation[];
    location: TLocation;
  } = {
    piece: null,
    validMoves: [],
    boardCoverage: [],
    location: { x: -1, y: -1 },
  };
  constructor() {}
  // setters
  set board(board: Cell[][]) {
    this.m_board = board;
  }
  // getters
  get board(): Cell[][] {
    return this.m_board;
  }
  set kings(kings: {
    [key in COLORS]: {
      location: TLocation;
      checkInfo: {
        status: boolean;
        responsibleSquares: TLocation[];
      };
    };
  }) {
    this.m_kings = kings;
  }
  private ResetCurrPiece() {
    this.m_currPiece.piece = null;
    this.m_currPiece.validMoves = [];
    this.m_currPiece.boardCoverage = [];
    this.m_currPiece.location = { x: -1, y: -1 };
  }

  public CopyBoard() {
    return this.m_board.map((row, rIdx) => {
      return row.map((col, cIdx) => {
        const cellColor = (rIdx + cIdx) % 2 === 0 ? COLORS.WHITE : COLORS.BLACK;
        return new Cell(col.location, cellColor, col.piece);
      });
    });
  }

  public ResetBoardMarkers() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        cell.validSq = false;
        cell.activeSq = false;
      });
    });
  }
  public MarkValidState() {
    this.m_currPiece.validMoves.forEach((location) => {
      this.m_board[location.x][location.y].validSq = true;
    });
  }
  public MarkCheckSquares(color: COLORS) {
    const king = this.m_kings[color];
    // if (!this.m_kings[color].checkInfo.responsibleSquares) return;
    king.checkInfo.responsibleSquares.forEach((location) => {
      this.m_board[location.x][location.y].checkSq = true;
    });
    this.m_board[king.location.x][king.location.y].checkSq = true;
  }
  public ResetCheckMarkers() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        cell.checkSq = false;
      });
    });
  }

  public PieceClick(cell: Cell) {
    this.ResetBoardMarkers();
    const cellInValidMoves = this.m_currPiece.validMoves.find(
      (location) =>
        location.x === cell.location.x && location.y === cell.location.y
    );
    if (cellInValidMoves !== undefined) {
      if (
        cell.location.x === this.m_currPiece.location.x &&
        cell.location.y === this.m_currPiece.location.y
      )
        return;
      this.MovePiece(this.m_currPiece.location, cell.location);
      this.ResetBoardMarkers();
    } else {
      if (cell.piece === null) return;
      cell.activeSq = true;
      this.m_currPiece.piece = cell.piece;
      this.m_currPiece.location = cell.location;

      this.m_currPiece.piece.ResetPinnedStatus();
      this.CurrPiecePinned();

      const validMoves = cell.piece.CalculateValidMoves(
        cell.location,
        this.m_board
      );

      this.m_currPiece.validMoves = validMoves;

      this.MarkValidState();
    }
  }

  public CurrPiecePinned() {
    if (!this.m_currPiece.piece || this.m_currPiece.piece instanceof King)
      return;
    const playerColor = this.m_currPiece.piece.color;
    const opponentColor =
      this.m_currPiece.piece.color === COLORS.WHITE
        ? COLORS.BLACK
        : COLORS.WHITE;
    // check if piece is pinned
    const playerKing = this.m_kings[this.m_currPiece.piece.color];

    const tempBoard = this.CopyBoard();
    const currLocation = this.m_currPiece.location;
    tempBoard[currLocation.x][currLocation.y].piece = null;
    let kingChecks = [];

    kingChecks = this.KingInCheck(
      tempBoard,
      playerColor,
      opponentColor,
      King.CalculateCoverage
    );
    // if king is in same row as the active piece
    if (playerKing.location.x === this.m_currPiece.location.x) {
      this.m_currPiece.piece.pinned.horizontal = false;
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomRight = true;
      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );

      if (pieceLocationInChecks !== undefined) {
        this.m_currPiece.piece.pinned.vertical = true;
      } else {
        this.m_currPiece.piece.pinned.vertical = false;
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else if (playerKing.location.y === this.m_currPiece.location.y) {
      this.m_currPiece.piece.pinned.vertical = false;
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomRight = true;
      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );

      if (pieceLocationInChecks !== undefined) {
        this.m_currPiece.piece.pinned.horizontal = true;
      } else {
        this.m_currPiece.piece.pinned.horizontal = false;
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else if (
      Math.abs(playerKing.location.x - this.m_currPiece.location.x) ===
      Math.abs(playerKing.location.y - this.m_currPiece.location.y)
    ) {
      // this.m_currPiece.piece.pinned.horizontal = true;
      // this.m_currPiece.piece.pinned.vertical = true;
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.bottomRight = true;

      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );
      if (pieceLocationInChecks) {
        this.m_currPiece.piece.pinned.vertical = true;
        this.m_currPiece.piece.pinned.horizontal = true;
      }
      if (
        pieceLocationInChecks &&
        playerKing.location.x > this.m_currPiece.location.x &&
        playerKing.location.y > this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x > this.m_currPiece.location.x &&
        playerKing.location.y < this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x < this.m_currPiece.location.x &&
        playerKing.location.y > this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x < this.m_currPiece.location.x &&
        playerKing.location.y < this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      } else {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else {
      this.m_currPiece.piece.pinned.vertical = false;
      this.m_currPiece.piece.pinned.topLeft = false;
      this.m_currPiece.piece.pinned.bottomLeft = false;
      this.m_currPiece.piece.pinned.topRight = false;
      this.m_currPiece.piece.pinned.bottomRight = false;
      this.m_currPiece.piece.pinned.horizontal = false;
    }
  }

  public KingInCheck(
    board: Cell[][],
    kingColor: COLORS,
    attackerColor: COLORS,
    coverageFunction: (board: Cell[][], location: TLocation) => TLocation[]
  ) {
    const responsibleSquares: TLocation[] = [];

    const kingLocation = this.m_kings[kingColor]!.location;
    console.log(kingLocation);
    // const kingCoverage = (king as King)!.CalculateCoverage(board, kingLocation);
    const kingCoverage = coverageFunction(board, kingLocation);

    const attackers = kingCoverage.map((location) => {
      const piece = board[location.x][location.y].piece;
      if (piece === null) return null;
      if (piece.color !== attackerColor) return null;
      const pieceValidMoves = piece.CalculateValidMoves(location, board);
      const kingInValidMoves = pieceValidMoves.find(
        (location) =>
          location.x === kingLocation.x && location.y === kingLocation.y
      );

      if (kingInValidMoves) return location;
      else return null;
    });
    const attackerCells = attackers
      .filter((attacker) => attacker !== null)
      .flat();

    console.log(attackerCells);
    if (attackerCells.length === 0) return [];
    function FindResponsibleSquares(
      attackerLocation: TLocation,
      kingLocation: TLocation
    ) {
      // same row
      if (attackerLocation.x === kingLocation.x) {
        const responsibleSquares = [];
        const start = Math.min(attackerLocation.y, kingLocation.y);
        const end = Math.max(attackerLocation.y, kingLocation.y);
        for (let i = start + 1; i < end; i++) {
          responsibleSquares.push({ x: attackerLocation.x, y: i });
        }
        return [...responsibleSquares, kingLocation, attackerLocation];
      }
      // same column
      else if (attackerLocation.y === kingLocation.y) {
        const responsibleSquares = [];
        const start = Math.min(attackerLocation.x, kingLocation.x);
        const end = Math.max(attackerLocation.x, kingLocation.x);
        for (let i = start + 1; i < end; i++) {
          responsibleSquares.push({ x: i, y: attackerLocation.y });
        }
        return [...responsibleSquares, kingLocation, attackerLocation];
      }
      // same diagonal
      else if (
        Math.abs(attackerLocation.x - kingLocation.x) ===
        Math.abs(attackerLocation.y - kingLocation.y)
      ) {
        if (
          attackerLocation.x + attackerLocation.y ===
          kingLocation.x + kingLocation.y
        ) {
          function rightDiagonal(
            sx: number,
            sy: number,
            ex: number,
            ey: number
          ) {
            const m = [];
            const _sx = Math.min(sx, ex);
            const _sy = Math.max(sy, ey);
            const _ex = Math.max(sx, ex);
            const _ey = Math.min(sy, ey);

            let col = _sy;
            for (let i = _sx; i <= _ex; i++) {
              for (let j = col; j >= _ey; j++) {
                m.push({ x: i, y: j });
                col--;
                break;
              }
            }
            return m;
          }
          const responsibleSquares = rightDiagonal(
            attackerLocation.x,
            attackerLocation.y,
            kingLocation.x,
            kingLocation.y
          );
          return [...responsibleSquares];
          // right diagonal
        } else {
          function leftDiagonal(
            sx: number,
            sy: number,
            ex: number,
            ey: number
          ) {
            const m = [];
            const _sx = Math.min(sx, ex);
            const _sy = Math.min(sy, ey);
            const _ex = Math.max(sx, ex);
            const _ey = Math.max(sy, ey);

            let col = _sy;

            for (let i = _sx; i <= _ex; i++) {
              for (let j = col; j <= _ey; j++) {
                m.push({ x: i, y: j });
                col++;
                break;
              }
            }
            return m;
          }
          const responsibleSquares = leftDiagonal(
            attackerLocation.x,
            attackerLocation.y,
            kingLocation.x,
            kingLocation.y
          );
          return [...responsibleSquares];
          // left diagonal
        }
      } else return attackerLocation;
    }
    const _responsibleSquares = attackerCells
      .map((attacker) => {
        if (attacker) return FindResponsibleSquares(attacker, kingLocation);
      })
      .flat();

    return [...responsibleSquares, ..._responsibleSquares];
  }

  public MovePiece(srcLocation: TLocation, destLocation: TLocation) {
    this.ResetCheckMarkers();

    if (this.m_currPiece.piece instanceof King)
      this.m_kings[this.m_currPiece.piece.color]!.location = destLocation;

    const playerColor = this.m_currPiece.piece!.color;
    const opponentColor =
      playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    this.m_board[destLocation.x][destLocation.y].piece = this.m_currPiece.piece;
    this.m_board[srcLocation.x][srcLocation.y].piece = null;

    this.m_currPiece.location = destLocation;
    const checkSquares = this.KingInCheck(
      this.m_board,
      opponentColor,
      playerColor,
      King.CalculateCoverage
    );

    if (checkSquares.length > 0) {
      this.m_kings[opponentColor]!.checkInfo.status = true;
      this.m_kings[opponentColor]!.checkInfo.responsibleSquares =
        checkSquares as TLocation[];
      this.MarkCheckSquares(opponentColor);
    }

    this.ResetCurrPiece();
  }

  public PieceDragEnd(dropResult: DropResult) {
    if (dropResult.destination === undefined || dropResult.source === undefined)
      return;
    const destIdx = dropResult.destination.index;
    const srcIdx = dropResult.source.index;
    if (destIdx === srcIdx) return;
    const destLocation = ConvertIdxToLocation(destIdx);
    const srcLocation = ConvertIdxToLocation(srcIdx);

    const destInValidMove = this.m_currPiece.validMoves.find(
      (location) =>
        location.x === destLocation.x && location.y === destLocation.y
    );
    if (destInValidMove === undefined) return;
    else {
      const pieceAtNewLoc = this.m_board[destLocation.x][destLocation.y].piece;
      if (pieceAtNewLoc && pieceAtNewLoc instanceof King) {
        return;
      } else {
        this.MovePiece(srcLocation, destLocation);
      }
    }
    this.ResetBoardMarkers();
  }
}
