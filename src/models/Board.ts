import { COLORS } from "../utils/Constants";
import Cell from "./Cell";
import Piece, { TMove } from "./Piece";
export default class Board {
  private count: number = 8;
  private m_turn = COLORS.WHITE;
  private OccupiedSpace = new Map<{ row: number; col: number }, boolean>();
  private m_board: Cell[][] = [];
  private m_activePiece: { piece: Piece | null; validMoves: TMove } = {
    piece: null,
    validMoves: [],
  };
  constructor() {
    for (let i = 0; i < this.count; i++) {
      this.m_board.push(
        Array.from(Array(this.count), (_, idx) => new Cell(0, 0, null))
      );
    }
  }
  public GetBoard() {
    return this.m_board;
  }
  public GetTurn() {
    return this.m_turn;
  }

  public SetBoard(board: Cell[][]) {
    this.m_board = board;
  }
  public SetOccupiedSpace(cellRow: number, cellCol: number) {
    this.OccupiedSpace.set({ row: cellRow, col: cellCol }, true);
  }
  public ResetBoardMarkers() {
    this.m_board.forEach((cellRow) => {
      cellRow.forEach((cell) => {
        cell.SetMarked(false);
        cell.SetValidCellMark(false);
      });
    });
  }
  public MarkValidMoves(cell: Cell) {
    cell.SetMarked(true);
    this.m_activePiece.validMoves.forEach((move) => {
      if (this.m_board !== null) {
        this.m_board && this.m_board[move.col][move.row].SetValidCellMark(true);
      }
    });
  }

  public ValidMoves(cell: Cell) {
    this.ResetBoardMarkers();
    if (cell.Piece !== null) {
      const piece = cell.Piece;

      const moves = piece.GetValidMoves(this.m_board);

      this.m_activePiece.piece = piece;
      this.m_activePiece.validMoves = moves;
    }
  }
  public Capture(cell: Cell) {
    this.MovePiece(cell);
  }
  public MovePiece(cell: Cell) {
    if (this.m_activePiece.piece && this.m_activePiece.piece) {
      const isValidRowCol = this.m_activePiece.validMoves.some(
        (move) => move.row === cell.GetRow() && move.col === cell.GetCol()
      );

      if (isValidRowCol) {
        console.log("VALID CELL");
        this.m_activePiece.piece.SetHasMovePiece();
        const currPiece = this.m_activePiece.piece;
        const newCell = this.m_board[cell.GetCol()][cell.GetRow()];
        this.m_board[currPiece.GetCol()][currPiece.GetRow()].Piece = null;
        newCell.Piece = currPiece;
        currPiece.SetRow(cell.GetRow());
        currPiece.SetCol(cell.GetCol());
      }
    }
  }
}
