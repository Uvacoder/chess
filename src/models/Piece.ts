import { COLORS, PIECES } from "../utils/Constants";
import Cell from "./Cell";

export type TMove = Array<{ row: number; col: number }>;

export default class Piece {
  protected m_color: string;
  private m_marked = false;
  private m_spriteSrc: string = "";
  private m_hasMoved: boolean = false;

  protected static GenCoverage(
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

    const check = Cell.IsValidCell(board, currColor, newRow, newCol);

    if (!check.outOfBounds) {
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
  protected static GenSlide(
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

    const check = Cell.IsValidCell(board, currColor, newRow, newCol);

    if (!check.outOfBounds) {
      if (!check.hasPiece) {
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
      } else if (check.hasPiece && check.oppositeColor) {
        list.push({ row: newRow, col: newCol });
      }
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

  public GetName() {
    return this.pieceName;
  }

  public GetColor() {
    return this.m_color;
  }
  public SetRow(row: number) {
    this.row = row;
  }
  public SetCol(col: number) {
    this.col = col;
  }
  public GetRow() {
    return this.row;
  }
  public GetCol() {
    return this.col;
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

  public static GetValidMoves(
    board: Cell[][],
    pieceName: string,
    color: string,
    row: number,
    col: number,
    hasMoved: boolean = false
  ) {
    let move: TMove = [];
    switch (pieceName && pieceName.toUpperCase()) {
      case PIECES.KING:
        move = King.ValidMoves(board, color, row, col);
        break;
      case PIECES.QUEEN:
        move = Queen.ValidMoves(board, color, row, col);
        break;
      case PIECES.ROOK:
        move = Rook.ValidMoves(board, color, row, col, hasMoved);
        break;
      case PIECES.BISHOP:
        move = Bishop.ValidMoves(board, color, row, col);
        break;
      case PIECES.KNIGHT:
        move = Knight.ValidMoves(board, color, row, col);
        break;
      case PIECES.PAWN:
        move = Pawn.ValidMoves(board, color, row, col);
        break;
    }
    return move;
  }
}

export class King extends Piece {
  public readonly POINT = Infinity;
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
  public static CheckPinned(
    board: Cell[][],
    oppositeColor: COLORS,
    activePiece: Piece,
    row: number,
    col: number
  ) {
    const coverages = [{ row, col }];
    Piece.GenCoverage(board, oppositeColor, row, col, 0, 0, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, -1, 0, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, 1, 0, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, 0, -1, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, 0, 1, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, 1, 1, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, -1, 1, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, 1, -1, coverages);
    Piece.GenCoverage(board, oppositeColor, row, col, -1, -1, coverages);

    // if in coverages array, there is a valid move where the move is in the same row or col as the active piece or is in diagonal of active piece
    // then the active piece is pinned
    const curPiecePos = {
      row: activePiece.GetRow(),
      col: activePiece.GetCol(),
    };
    const pinned = coverages.map((move) => {
      const piece = board[move.row][move.col].Piece;
      if (piece === null) return false;
      else if (piece.GetColor() !== oppositeColor) return false;
      else {
        const pieceName = piece.GetName();
        const pieceCoverage = Piece.GetValidMoves(
          board,
          pieceName,
          piece.GetColor(),
          move.row,
          move.col
        );
      }
    });

    return coverages;
  }
  public static ValidMoves(
    board: Cell[][],
    currColor: string,
    row: number,
    col: number
  ) {
    const urCheck = Cell.IsValidCell(board, currColor, row - 1, col + 1);
    const uLCheck = Cell.IsValidCell(board, currColor, row - 1, col - 1);
    const dRCheck = Cell.IsValidCell(board, currColor, row + 1, col + 1);
    const dLCheck = Cell.IsValidCell(board, currColor, row + 1, col - 1);

    const uCheck = Cell.IsValidCell(board, currColor, row - 1, col);
    const dCheck = Cell.IsValidCell(board, currColor, row + 1, col);
    const rCheck = Cell.IsValidCell(board, currColor, row, col + 1);
    const lCheck = Cell.IsValidCell(board, currColor, row, col - 1);

    let uR = undefined,
      uL = undefined,
      dR = undefined,
      dL = undefined,
      u = undefined,
      d = undefined,
      l = undefined,
      r = undefined;
    if (!urCheck.outOfBounds) {
      if (urCheck.hasPiece === false) uR = { row: row - 1, col: col + 1 };
      else if (urCheck.hasPiece === true && urCheck.oppositeColor)
        uR = { row: row - 1, col: col + 1 };
    }
    if (!uLCheck.outOfBounds) {
      if (uLCheck.hasPiece === false) uL = { row: row - 1, col: col - 1 };
      else if (uLCheck.hasPiece === true && uLCheck.oppositeColor)
        uL = { row: row - 1, col: col - 1 };
    }
    if (!dRCheck.outOfBounds) {
      if (dRCheck.hasPiece === false) dR = { row: row + 1, col: col + 1 };
      else if (dRCheck.hasPiece === true && dRCheck.oppositeColor)
        dR = { row: row + 1, col: col + 1 };
    }
    if (!dLCheck.outOfBounds) {
      if (dLCheck.hasPiece === false) dL = { row: row + 1, col: col - 1 };
      else if (dLCheck.hasPiece === true && dLCheck.oppositeColor)
        dL = { row: row + 1, col: col - 1 };
    }
    if (!uCheck.outOfBounds) {
      if (uCheck.hasPiece === false) u = { row: row - 1, col: col };
      else if (uCheck.hasPiece === true && uCheck.oppositeColor)
        u = { row: row - 1, col: col };
    }
    if (!dCheck.outOfBounds) {
      if (dCheck.hasPiece === false) d = { row: row + 1, col: col };
      else if (dCheck.hasPiece === true && dCheck.oppositeColor)
        d = { row: row + 1, col: col };
    }
    if (!rCheck.outOfBounds) {
      if (rCheck.hasPiece === false) r = { row: row, col: col + 1 };
      else if (rCheck.hasPiece === true && rCheck.oppositeColor)
        r = { row: row, col: col + 1 };
    }
    if (!lCheck.outOfBounds) {
      if (lCheck.hasPiece === false) l = { row: row, col: col - 1 };
      else if (lCheck.hasPiece === true && lCheck.oppositeColor)
        l = { row: row, col: col - 1 };
    }

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
  public readonly POINT = 900;
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
    Piece.GenSlide(board, currColor, row, col, 0, 0, moves);
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
  public readonly POINT = 500;
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
  public readonly POINT = 300;

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
  public readonly POINT = 300;
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
    let uR = undefined,
      uL = undefined,
      dR = undefined,
      dL = undefined,
      rU = undefined,
      rD = undefined,
      lU = undefined,
      lD = undefined;
    const uRCheck = Cell.IsValidCell(board, currColor, row - 2, col + 1);
    const uLCheck = Cell.IsValidCell(board, currColor, row - 2, col - 1);
    const dRCheck = Cell.IsValidCell(board, currColor, row + 2, col + 1);
    const dLCheck = Cell.IsValidCell(board, currColor, row + 2, col - 1);
    const rUCheck = Cell.IsValidCell(board, currColor, row - 1, col + 2);
    const rDCheck = Cell.IsValidCell(board, currColor, row + 1, col + 2);
    const lUCheck = Cell.IsValidCell(board, currColor, row - 1, col - 2);
    const lDCheck = Cell.IsValidCell(board, currColor, row + 1, col - 2);

    if (!uRCheck.outOfBounds) {
      if (!uRCheck.hasPiece) uR = { row: row - 2, col: col + 1 };
      else if (uRCheck.hasPiece && uRCheck.oppositeColor)
        uR = { row: row - 2, col: col + 1 };
    }
    if (!uLCheck.outOfBounds) {
      if (!uLCheck.hasPiece) uL = { row: row - 2, col: col - 1 };
      else if (uLCheck.hasPiece && uLCheck.oppositeColor)
        uL = { row: row - 2, col: col - 1 };
    }
    if (!dRCheck.outOfBounds) {
      if (!dRCheck.hasPiece) dR = { row: row + 2, col: col + 1 };
      else if (dRCheck.hasPiece && dRCheck.oppositeColor)
        dR = { row: row + 2, col: col + 1 };
    }
    if (!dLCheck.outOfBounds) {
      if (!dLCheck.hasPiece) dL = { row: row + 2, col: col - 1 };
      else if (dLCheck.hasPiece && dLCheck.oppositeColor)
        dL = { row: row + 2, col: col - 1 };
    }
    if (!rUCheck.outOfBounds) {
      if (!rUCheck.hasPiece) rU = { row: row - 1, col: col + 2 };
      else if (rUCheck.hasPiece && rUCheck.oppositeColor)
        rU = { row: row - 1, col: col + 2 };
    }
    if (!rDCheck.outOfBounds) {
      if (!rDCheck.hasPiece) rD = { row: row + 1, col: col + 2 };
      else if (rDCheck.hasPiece && rDCheck.oppositeColor)
        rD = { row: row + 1, col: col + 2 };
    }
    if (!lUCheck.outOfBounds) {
      if (!lUCheck.hasPiece) lU = { row: row - 1, col: col - 2 };
      else if (lUCheck.hasPiece && lUCheck.oppositeColor)
        lU = { row: row - 1, col: col - 2 };
    }
    if (!lDCheck.outOfBounds) {
      if (!lDCheck.hasPiece) lD = { row: row + 1, col: col - 2 };
      else if (lDCheck.hasPiece && lDCheck.oppositeColor)
        lD = { row: row + 1, col: col - 2 };
    }

    const moves = [];

    if (uR) moves.push(uR);
    if (uL) moves.push(uL);
    if (dR) moves.push(dR);
    if (dL) moves.push(dL);
    if (rU) moves.push(rU);
    if (rD) moves.push(rD);
    if (lU) moves.push(lU);
    if (lD) moves.push(lD);
    return moves;
  }
}

class Pawn extends Piece {
  public readonly POINT = 100;
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
    col: number
  ): TMove {
    function getMoves(rowOffset: number, uniqeRank: number) {
      const moves = [];
      let uL = undefined,
        uR = undefined,
        u = undefined,
        uu = undefined;
      const uLCheck = Cell.IsValidCell(
        board,
        currColor,
        row + rowOffset,
        col - 1
      );
      const uRCheck = Cell.IsValidCell(
        board,
        currColor,
        row + rowOffset,
        col + 1
      );
      const uCheck = Cell.IsValidCell(board, currColor, row + rowOffset, col);
      if (!uLCheck.outOfBounds) {
        if (uLCheck.hasPiece && uLCheck.oppositeColor)
          uL = { row: row + rowOffset, col: col - 1 };
      }
      if (!uRCheck.outOfBounds) {
        if (uRCheck.hasPiece && uRCheck.oppositeColor)
          uR = { row: row + rowOffset, col: col + 1 };
      }
      if (!uCheck.outOfBounds) {
        if (!uCheck.hasPiece) u = { row: row + rowOffset, col: col };
      }
      if (row === uniqeRank) {
        const uuCheck = Cell.IsValidCell(
          board,
          currColor,
          row + rowOffset * 2,
          col
        );
        if (!uuCheck.outOfBounds) {
          if (!uuCheck.hasPiece) uu = { row: row + rowOffset * 2, col: col };
        }
      }
      if (uL) moves.push(uL);
      if (uR) moves.push(uR);
      if (u) moves.push(u);
      if (uu) moves.push(uu);
      return moves;
    }

    if (currColor === COLORS.WHITE) {
      return [{ row, col }, ...getMoves(-1, 6)];
    } else {
      return [{ row, col }, ...getMoves(1, 1)];
    }
  }
}
