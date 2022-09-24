import { DragStart, DropResult } from "react-beautiful-dnd";
import { TLocation, TPiece } from "../@types";
import { COLORS, ConvertIdxToLocation } from "../utils/Constants";
import Cell from "./Cell";
import { King } from "./Piece";

export default class Board {
  private m_board: Cell[][] = [];
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
  private ResetCurrPiece() {
    this.m_currPiece.piece = null;
    this.m_currPiece.validMoves = [];
    this.m_currPiece.boardCoverage = [];
    this.m_currPiece.location = { x: -1, y: -1 };
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

  public PieceClick(cell: Cell) {
    this.ResetBoardMarkers();
    // if cell location is in current piece's valid moves, move piece
    const cellInValidMoves = this.m_currPiece.validMoves.find(
      (location) =>
        location.x === cell.location.x && location.y === cell.location.y
    );
    if (cellInValidMoves !== undefined) {
      console.log("CELL IS IN VAlID MOVES");
      this.MovePiece(this.m_currPiece.location, cell.location);
      this.ResetBoardMarkers();
    } else {
      if (cell.piece === null) return;
      cell.activeSq = true;
      this.m_currPiece.piece = cell.piece;
      this.m_currPiece.location = cell.location;

      const validMoves = cell.piece.CalculateValidMoves(
        cell.location,
        this.m_board
      );
      this.m_currPiece.validMoves = validMoves;
      this.MarkValidState();
    }
  }

  public MovePiece(srcLocation: TLocation, destLocation: TLocation) {
    this.m_board[destLocation.x][destLocation.y].piece = this.m_currPiece.piece;
    this.m_board[srcLocation.x][srcLocation.y].piece = null;
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
