import Cell from "./Cell";
import Piece from "./Piece";
export default class Board {
  private count: number = 8;
  private board: Cell[][] = [];
  // private board: (Piece | null)[][] = [];
  constructor() {
    for (let i = 0; i < this.count; i++) {
      this.board.push(
        Array.from(Array(this.count), (_, idx) => new Cell(0, 0, null))
      );
    }
  }
  public GetBoard() {
    return this.board;
  }

  public SetBoard(board: Cell[][]) {
    this.board = board;
  }
  public ValidMoves(cell: Cell) {
    if (cell.Piece !== null) {
      const piece = cell.Piece;
      cell.SetMarked(true);
      console.log(cell.Piece);
      const moves = piece.GetValidMoves(this.board);
      console.log(moves);
      moves.forEach((move) => {
        if (this.board !== null) {
          this.board[move.col][move.row]!.SetValidCellMark(true);
        }
      });
    }
  }
}
