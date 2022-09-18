import Board from "./Board";
import Piece from "./Piece";

export default class Cell {
  constructor(
    private m_row: number,
    private m_col: number,
    public Piece: Piece | null,
    private m_marked: boolean = false,
    private m_validCellMark: boolean = false
  ) {}
  public static IsValidCell(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    const notOutOfBounds = row >= 0 && row <= 7 && col >= 0 && col <= 7;
    if (!notOutOfBounds) return false;
    const piece = board[col][row].Piece;
    if (piece === null) {
      return notOutOfBounds;
    } else {
      return notOutOfBounds && piece.GetColor() !== currColor;
    }
  }
  public GetRow() {
    return this.m_row;
  }
  public GetCol() {
    return this.m_col;
  }
  public GetValidCellMark() {
    return this.m_validCellMark;
  }
  public SetValidCellMark(status: boolean) {
    this.m_validCellMark = status;
  }
  public SetMarked(status: boolean) {
    this.m_marked = status;
  }
  public GetMarked() {
    return this.m_marked;
  }
}
