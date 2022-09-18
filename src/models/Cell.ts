import Piece from "./Piece";

export default class Cell {
  constructor(
    private m_row: number,
    private m_col: number,
    public Piece: Piece | null,
    private m_marked: boolean = false,
    private m_validCellMark: boolean = false
  ) {}
  public static IsValidCell(row: number, col: number) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
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
