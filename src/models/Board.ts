import { COLORS } from "../utils/Constants";
import Cell from "./Cell";
import Piece from "./Piece";
export default class Board {
  private count: number = 8;
  private m_turn = COLORS.WHITE;
  private OccupiedSpace = new Map<{ row: number; col: number }, boolean>();
  private m_board: Cell[][] = [];
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
  private ResetBoardMarkers() {
    this.m_board.forEach((cellRow) => {
      cellRow.forEach((cell) => {
        cell.SetMarked(false);
        cell.SetValidCellMark(false);
      });
    });
  }
  public ValidMoves(cell: Cell) {
    this.ResetBoardMarkers();
    if (cell.Piece !== null) {
      const piece = cell.Piece;
      cell.SetMarked(true);
      console.log(cell.Piece);
      const moves = piece.GetValidMoves(this.m_board);
      moves.forEach((move) => {
        if (this.m_board !== null) {
          this.m_board[move.col][move.row]!.SetValidCellMark(true);
        }
      });
    }
  }
}
