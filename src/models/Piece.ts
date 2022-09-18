import { COLORS, PIECES } from "../utils/Constants";
import Cell from "./Cell";

type TMove = Array<{ row: number; col: number }>;

export default class Piece {
  protected m_color: string;
  private m_marked = false;
  private m_spriteSrc: string = "";
  private m_hasMoved: boolean = false;
  public m_getName() {
    return this.pieceName ? PIECES[this.pieceName as keyof typeof PIECES] : "";
  }

  public GetColor() {
    return this.m_color;
  }

  public static GenSlide(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number,
    rowOffset: number,
    colOffset: number,
    list: TMove
  ) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;

    if (Cell.IsValidCell(board, currColor, newRow, newCol)) {
      list.push({ row: newRow, col: newCol });
      Piece.GenSlide(
        board,
        currColor,
        newRow,
        newCol,
        rowOffset,
        colOffset,
        list
      );
    } else return list;
  }

  constructor(
    private pieceName: string,
    protected row: number,
    protected col: number
  ) {
    this.pieceName = pieceName;
    this.m_color = this.pieceName
      ? this.pieceName === this.pieceName.toUpperCase()
        ? COLORS.WHITE
        : COLORS.BLACK
      : "";

    this.m_spriteSrc = this.pieceName
      ? `/assets/sprites/${this.m_color.toLowerCase()}/${this.pieceName.toLowerCase()}.png`
      : "";
  }

  public MarkStatus() {
    return this.m_marked;
  }
  public GetSpriteSrc() {
    return this.m_spriteSrc;
  }
  public GetHasMovedStatus() {
    return this.m_hasMoved;
  }
  public SetHasMovePiece() {
    this.m_hasMoved = true;
  }
  public MarkPiece() {
    this.m_marked = true;
  }

  public GetValidMoves(board: Cell[][]) {
    let move: TMove = [];
    switch (this.pieceName && this.pieceName.toUpperCase()) {
      case PIECES.KING:
        move = King.ValidMoves(board, this.m_color, this.row, this.col);
        break;
      case PIECES.QUEEN:
        move = Queen.ValidMoves(board, this.m_color, this.row, this.col);
        break;
      case PIECES.ROOK:
        move = Rook.ValidMoves(
          board,
          this.m_color,
          this.row,
          this.col,
          this.m_hasMoved
        );
        break;
      case PIECES.BISHOP:
        move = Bishop.ValidMoves(board, this.m_color, this.row, this.col);
        break;
      case PIECES.KNIGHT:
        move = Knight.ValidMoves(board, this.m_color, this.row, this.col);
        break;
      case PIECES.PAWN:
        move = Pawn.ValidMoves(
          board,
          this.m_color,
          this.row,
          this.col,
          this.m_color,
          this.m_hasMoved
        );
        break;
    }
    return move;
  }
}

class King extends Piece {
  public m_pieceName: string = PIECES.KING;
  private static row: number;
  private static col: number;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number
  ) {
    super(PIECES.KING, row, col);
    this.m_color = m_color;
    King.row = this.row;
    King.col = this.col;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    let uR = Cell.IsValidCell(board, currColor, row - 1, col + 1)
      ? { row: row - 1, col: col + 1 }
      : undefined;
    let uL = Cell.IsValidCell(board, currColor, row - 1, col - 1)
      ? { row: row - 1, col: col - 1 }
      : undefined;
    let dR = Cell.IsValidCell(board, currColor, row + 1, col + 1)
      ? { row: row + 1, col: col + 1 }
      : undefined;
    let dL = Cell.IsValidCell(board, currColor, row + 1, col - 1)
      ? { row: row + 1, col: col - 1 }
      : undefined;
    let u = Cell.IsValidCell(board, currColor, row - 1, col)
      ? { row: row - 1, col: col }
      : undefined;
    let d = Cell.IsValidCell(board, currColor, row + 1, col)
      ? { row: row + 1, col: col }
      : undefined;
    let r = Cell.IsValidCell(board, currColor, row, col + 1)
      ? { row: row, col: col + 1 }
      : undefined;
    let l = Cell.IsValidCell(board, currColor, row, col - 1)
      ? { row: row, col: col - 1 }
      : undefined;

    const moves = [];
    if (uR) moves.push(uR);
    if (uL) moves.push(uL);
    if (dR) moves.push(dR);
    if (dL) moves.push(dL);
    if (u) moves.push(u);
    if (l) moves.push(l);
    if (d) moves.push(d);
    if (r) moves.push(r);
    return moves;
  }
}
class Queen extends Piece {
  public m_pieceName: string = PIECES.QUEEN;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number
  ) {
    super(PIECES.QUEEN, row, col);
    this.m_color = m_color;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    const moves = [{ row, col }];
    Piece.GenSlide(board, currColor, row, col, -1, 0, moves);
    Piece.GenSlide(board, currColor, row, col, 1, 0, moves);
    Piece.GenSlide(board, currColor, row, col, 0, -1, moves);
    Piece.GenSlide(board, currColor, row, col, 0, 1, moves);

    Piece.GenSlide(board, currColor, row, col, 1, 1, moves);
    Piece.GenSlide(board, currColor, row, col, -1, 1, moves);
    Piece.GenSlide(board, currColor, row, col, 1, -1, moves);
    Piece.GenSlide(board, currColor, row, col, -1, -1, moves);
    return moves;
  }
}

class Rook extends Piece {
  public m_pieceName: string = PIECES.ROOK;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number,
    protected hasMoved: boolean
  ) {
    super(PIECES.ROOK, row, col);
    this.m_color = m_color;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number,
    hasMoved: boolean
  ) {
    const moves = [{ row, col }];
    Piece.GenSlide(board, currColor, row, col, -1, 0, moves);
    Piece.GenSlide(board, currColor, row, col, 1, 0, moves);
    Piece.GenSlide(board, currColor, row, col, 0, -1, moves);
    Piece.GenSlide(board, currColor, row, col, 0, 1, moves);

    return moves;
  }
}
class Bishop extends Piece {
  public m_pieceName: string = PIECES.BISHOP;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number
  ) {
    super(PIECES.BISHOP, row, col);
    this.m_color = m_color;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    const moves = [{ row, col }];
    Piece.GenSlide(board, currColor, row, col, 1, 1, moves);
    Piece.GenSlide(board, currColor, row, col, -1, 1, moves);
    Piece.GenSlide(board, currColor, row, col, 1, -1, moves);
    Piece.GenSlide(board, currColor, row, col, -1, -1, moves);
    return moves;
  }
}

class Knight extends Piece {
  public m_pieceName: string = PIECES.KNIGHT;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number
  ) {
    super(PIECES.KNIGHT, row, col);
    this.m_color = m_color;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    let uR = Cell.IsValidCell(board, currColor, row - 2, col + 1)
      ? { row: row - 2, col: col + 1 }
      : undefined;
    let uL = Cell.IsValidCell(board, currColor, row - 2, col - 1)
      ? { row: row - 2, col: col - 1 }
      : undefined;
    let dR = Cell.IsValidCell(board, currColor, row + 2, col + 1)
      ? { row: row + 2, col: col + 1 }
      : undefined;
    let dL = Cell.IsValidCell(board, currColor, row + 2, col - 1)
      ? { row: row + 2, col: col - 1 }
      : undefined;

    let rR = Cell.IsValidCell(board, currColor, row - 1, col + 2)
      ? { row: row - 1, col: col + 2 }
      : undefined;
    let rL = Cell.IsValidCell(board, currColor, row - 1, col - 2)
      ? { row: row - 1, col: col - 2 }
      : undefined;
    let lR = Cell.IsValidCell(board, currColor, row + 1, col + 2)
      ? { row: row + 1, col: col + 2 }
      : undefined;
    let lL = Cell.IsValidCell(board, currColor, row + 1, col - 2)
      ? { row: row + 1, col: col - 2 }
      : undefined;
    const moves = [];
    if (uR) moves.push(uR);
    if (uL) moves.push(uL);
    if (dR) moves.push(dR);
    if (dL) moves.push(dL);
    if (rR) moves.push(rR);
    if (rL) moves.push(rL);
    if (lR) moves.push(lR);
    if (lL) moves.push(lL);
    return moves;
  }
}

class Pawn extends Piece {
  public m_pieceName: string = PIECES.PAWN;
  constructor(
    protected m_color: string,
    protected row: number,
    protected col: number
  ) {
    super(PIECES.PAWN, row, col);
    this.m_color = m_color;
  }

  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number,
    m_color: string,
    hasMoved: boolean
  ): TMove {
    if (m_color === COLORS.WHITE) {
      const moves = [];
      if (Cell.IsValidCell(board, currColor, row - 1, col))
        moves.push({ row: row - 1, col });

      if (!hasMoved && Cell.IsValidCell(board, currColor, row - 2, col))
        moves.push({ row: row - 2, col });
      return moves;
    } else {
      const moves = [{ row: row + 1, col }];
      if (Cell.IsValidCell(board, currColor, row + 1, col))
        moves.push({ row: row + 1, col });

      if (!hasMoved && Cell.IsValidCell(board, currColor, row + 2, col))
        moves.push({ row: row + 2, col });
      return moves;
    }
  }
}
