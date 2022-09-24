import { TLocation } from "../@types";
import { COLORS, PIECES } from "../utils/Constants";
import Cell from "./Cell";
abstract class Piece {
  private m_sprite: string;
  private m_hasMoved = false;
  constructor(private m_color: COLORS, private m_name: PIECES) {
    this.m_sprite = `/assets/sprites/${m_color}/${m_name.toLowerCase()}.svg`;
  }

  // getters
  get color(): COLORS {
    return this.m_color;
  }
  get name(): string {
    return this.m_name;
  }
  get sprite(): string {
    return this.m_sprite;
  }
  get hasMoved(): boolean {
    return this.m_hasMoved;
  }

  // setters
  set color(color: COLORS) {
    this.m_color = color;
  }
  set name(name: string) {
    this.m_name = name as PIECES;
  }
  set sprite(sprite: string) {
    this.m_sprite = sprite;
  }
  set hasMoved(hasMoved: boolean) {
    this.m_hasMoved = hasMoved;
  }
  public static GenSlide(
    curLocation: TLocation,
    board: Cell[][],
    xOffset: number,
    yOffset: number
  ) {
    const slide: Array<TLocation> = [];
    let x = curLocation.x + xOffset;
    let y = curLocation.y + yOffset;

    while (!Cell.OutOfBounds({ x, y })) {
      if (
        board[x][y].piece?.color ===
        board[curLocation.x][curLocation.y].piece?.color
      )
        break;
      slide.push({ x, y });
      if (Cell.Occupied(board, { x, y })) break;
      x += xOffset;
      y += yOffset;
    }
    return slide;
  }
  public abstract CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[];
}

export class King extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.KING);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    const validMoves: TLocation[] = [];
    let u, d, l, r, ul, ur, dl, dr;
    u = { x: srcLocation.x, y: srcLocation.y - 1 };
    d = { x: srcLocation.x, y: srcLocation.y + 1 };
    l = { x: srcLocation.x - 1, y: srcLocation.y };
    r = { x: srcLocation.x + 1, y: srcLocation.y };
    ul = { x: srcLocation.x - 1, y: srcLocation.y - 1 };
    ur = { x: srcLocation.x + 1, y: srcLocation.y - 1 };
    dl = { x: srcLocation.x - 1, y: srcLocation.y + 1 };
    dr = { x: srcLocation.x + 1, y: srcLocation.y + 1 };
    if (Cell.OutOfBounds(u)) u = null;
    if (Cell.OutOfBounds(d)) d = null;
    if (Cell.OutOfBounds(l)) l = null;
    if (Cell.OutOfBounds(r)) r = null;

    if (Cell.OutOfBounds(ul)) ul = null;
    if (Cell.OutOfBounds(ur)) ur = null;
    if (Cell.OutOfBounds(dl)) dl = null;
    if (Cell.OutOfBounds(dr)) dr = null;

    function NeighbourIsKing(location: TLocation, prevLocation: TLocation) {
      //  find all neighhbous of location
      //  if any of them is king return true
      //  else return false
      let u, d, l, r, ul, ur, dl, dr;
      u = { x: location.x, y: location.y - 1 };
      d = { x: location.x, y: location.y + 1 };
      l = { x: location.x - 1, y: location.y };
      r = { x: location.x + 1, y: location.y };
      ul = { x: location.x - 1, y: location.y - 1 };
      ur = { x: location.x + 1, y: location.y - 1 };
      dl = { x: location.x - 1, y: location.y + 1 };
      dr = { x: location.x + 1, y: location.y + 1 };

      if (Cell.OutOfBounds(u)) u = null;
      if (Cell.OutOfBounds(d)) d = null;
      if (Cell.OutOfBounds(l)) l = null;
      if (Cell.OutOfBounds(r)) r = null;

      if (Cell.OutOfBounds(ul)) ul = null;
      if (Cell.OutOfBounds(ur)) ur = null;
      if (Cell.OutOfBounds(dl)) dl = null;
      if (Cell.OutOfBounds(dr)) dr = null;

      if (u && u.x === prevLocation.x && u.y === prevLocation.y) u = null;
      if (d && d.x === prevLocation.x && d.y === prevLocation.y) d = null;
      if (l && l.x === prevLocation.x && l.y === prevLocation.y) l = null;
      if (r && r.x === prevLocation.x && r.y === prevLocation.y) r = null;
      if (ul && ul.x === prevLocation.x && ul.y === prevLocation.y) ul = null;
      if (ur && ur.x === prevLocation.x && ur.y === prevLocation.y) ur = null;
      if (dl && dl.x === prevLocation.x && dl.y === prevLocation.y) dl = null;
      if (dr && dr.x === prevLocation.x && dr.y === prevLocation.y) dr = null;

      if (u && board[u.x][u.y].piece?.name === PIECES.KING) return true;
      if (d && board[d.x][d.y].piece?.name === PIECES.KING) return true;
      if (l && board[l.x][l.y].piece?.name === PIECES.KING) return true;
      if (r && board[r.x][r.y].piece?.name === PIECES.KING) return true;
      if (ul && board[ul.x][ul.y].piece?.name === PIECES.KING) return true;
      if (ur && board[ur.x][ur.y].piece?.name === PIECES.KING) return true;
      if (dl && board[dl.x][dl.y].piece?.name === PIECES.KING) return true;
      if (dr && board[dr.x][dr.y].piece?.name === PIECES.KING) return true;
      return false;
    }

    if (u && NeighbourIsKing(u, srcLocation)) u = null;
    if (d && NeighbourIsKing(d, srcLocation)) d = null;
    if (l && NeighbourIsKing(l, srcLocation)) l = null;
    if (r && NeighbourIsKing(r, srcLocation)) r = null;
    if (ul && NeighbourIsKing(ul, srcLocation)) ul = null;
    if (ur && NeighbourIsKing(ur, srcLocation)) ur = null;
    if (dl && NeighbourIsKing(dl, srcLocation)) dl = null;
    if (dr && NeighbourIsKing(dr, srcLocation)) dr = null;

    return [u, l, d, r, ul, ur, dl, dr].filter((loc) => {
      if (loc === null) return false;
      else {
        const occupied = Cell.Occupied(board, loc);
        if (!occupied) return true;
        else {
          if (board[loc.x][loc.y].piece?.color === this.color) return false;
          else return true;
        }
      }
    }) as TLocation[];
  }
}
export class Queen extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.QUEEN);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    const coverageSquares = [
      ...Piece.GenSlide(srcLocation, board, 1, 0),
      ...Piece.GenSlide(srcLocation, board, -1, 0),
      ...Piece.GenSlide(srcLocation, board, 0, 1),
      ...Piece.GenSlide(srcLocation, board, 0, -1),
      ...Piece.GenSlide(srcLocation, board, 1, -1),
      ...Piece.GenSlide(srcLocation, board, -1, 1),
      ...Piece.GenSlide(srcLocation, board, 1, 1),
      ...Piece.GenSlide(srcLocation, board, -1, -1),
    ];
    return coverageSquares;
  }
}
export class Rook extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.ROOK);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    return [
      srcLocation,
      ...Piece.GenSlide(srcLocation, board, 1, 0),
      ...Piece.GenSlide(srcLocation, board, -1, 0),
      ...Piece.GenSlide(srcLocation, board, 0, 1),
      ...Piece.GenSlide(srcLocation, board, 0, -1),
    ];
  }
}
export class Bishop extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.BISHOP);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    return [
      ...Piece.GenSlide(srcLocation, board, 1, 1),
      ...Piece.GenSlide(srcLocation, board, -1, -1),
      ...Piece.GenSlide(srcLocation, board, 1, -1),
      ...Piece.GenSlide(srcLocation, board, -1, 1),
    ];
  }
}
export class Knight extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.KNIGHT);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    let uul, uur, ddl, ddr;
    let rru, rrd, llu, lld;
    uul = { x: srcLocation.x - 2, y: srcLocation.y - 1 };
    uur = { x: srcLocation.x - 2, y: srcLocation.y + 1 };
    ddl = { x: srcLocation.x + 2, y: srcLocation.y - 1 };
    ddr = { x: srcLocation.x + 2, y: srcLocation.y + 1 };
    rru = { x: srcLocation.x - 1, y: srcLocation.y - 2 };
    rrd = { x: srcLocation.x + 1, y: srcLocation.y - 2 };
    llu = { x: srcLocation.x - 1, y: srcLocation.y + 2 };
    lld = { x: srcLocation.x + 1, y: srcLocation.y + 2 };
    if (Cell.OutOfBounds(uul)) uul = null;
    if (Cell.OutOfBounds(uur)) uur = null;
    if (Cell.OutOfBounds(ddl)) ddl = null;
    if (Cell.OutOfBounds(ddr)) ddr = null;

    if (Cell.OutOfBounds(rru)) rru = null;
    if (Cell.OutOfBounds(rrd)) rrd = null;
    if (Cell.OutOfBounds(llu)) llu = null;
    if (Cell.OutOfBounds(lld)) lld = null;

    return [uul, uur, ddl, ddr, rru, rrd, llu, lld].filter((loc) => {
      if (loc === null) return false;
      else {
        const occupied = Cell.Occupied(board, loc);
        if (!occupied) return true;
        else {
          if (board[loc.x][loc.y].piece?.color === this.color) return false;
          else return true;
        }
      }
    }) as TLocation[];
  }
}
export class Pawn extends Piece {
  constructor(color: COLORS) {
    super(color, PIECES.PAWN);
  }
  public CalculateValidMoves(
    srcLocation: TLocation,
    board: Cell[][]
  ): TLocation[] {
    let f, fl, fr;

    f = {
      x: srcLocation.x + (this.color === COLORS.WHITE ? -1 : 1),
      y: srcLocation.y,
    };

    fl = {
      x: srcLocation.x + (this.color === COLORS.WHITE ? -1 : 1),
      y: srcLocation.y - 1,
    };
    fr = {
      x: srcLocation.x + (this.color === COLORS.WHITE ? -1 : 1),
      y: srcLocation.y + 1,
    };
    if (Cell.OutOfBounds(f)) f = null;
    if (Cell.OutOfBounds(fl)) fl = null;
    if (Cell.OutOfBounds(fr)) fr = null;

    if (f && Cell.Occupied(board, f)) f = null;

    if (fl) {
      if (Cell.Occupied(board, fl)) {
        if (board[fl.x][fl.y].piece?.color === this.color) fl = null;
      } else fl = null;
    }
    if (fr) {
      if (Cell.Occupied(board, fr)) {
        if (board[fr.x][fr.y].piece?.color === this.color) fr = null;
      } else fr = null;
    }

    let ff = null;
    if (this.color === COLORS.WHITE) {
      if (srcLocation.x === 6) {
        ff = { x: 4, y: srcLocation.y };
      }
    } else if (this.color === COLORS.BLACK) {
      if (srcLocation.x === 1) {
        ff = { x: 3, y: srcLocation.y };
      }
    }
    if (!f) ff = null;
    if (ff && Cell.Occupied(board, ff)) ff = null;

    return [f, fl, fr, ff].filter((loc) => loc !== null) as TLocation[];
  }
}
