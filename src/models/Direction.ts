import { TLocation } from "../@types";

export default class Direction {
  public static SameRow(loc1: TLocation, loc2: TLocation) {
    return loc1.x === loc2.x;
  }
  public static Left(loc1: TLocation, loc2: TLocation) {
    return loc1.y < loc2.y;
  }
  public static Right(loc1: TLocation, loc2: TLocation) {
    return loc1.y > loc2.y;
  }
  public static Top(loc1: TLocation, loc2: TLocation) {
    return loc1.x < loc2.x;
  }
  public static Bottom(loc1: TLocation, loc2: TLocation) {
    return loc1.x > loc2.x;
  }
  public static TopLeft(loc1: TLocation, loc2: TLocation) {
    return Direction.Top(loc1, loc2) && Direction.Left(loc1, loc2);
  }
  public static TopRight(loc1: TLocation, loc2: TLocation) {
    return Direction.Top(loc1, loc2) && Direction.Right(loc1, loc2);
  }
  public static BottomLeft(loc1: TLocation, loc2: TLocation) {
    return Direction.Bottom(loc1, loc2) && Direction.Left(loc1, loc2);
  }
  public static BottomRight(loc1: TLocation, loc2: TLocation) {
    return Direction.Bottom(loc1, loc2) && Direction.Right(loc1, loc2);
  }
  public static LeftDiagonal(loc1: TLocation, loc2: TLocation) {
    return Direction.TopLeft(loc1, loc2) || Direction.BottomRight(loc1, loc2);
  }
  public static RightDiagonal(loc1: TLocation, loc2: TLocation) {
    return Direction.TopRight(loc1, loc2) || Direction.BottomLeft(loc1, loc2);
  }

  public static RightDiagCoord(sx: number, sy: number, ex: number, ey: number) {
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
  public static LeftDiagCoord(sx: number, sy: number, ex: number, ey: number) {
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

  public static SameCol(loc1: TLocation, loc2: TLocation) {
    return loc1.y === loc2.y;
  }
  public static SameDiagonal(loc1: TLocation, loc2: TLocation) {
    return Math.abs(loc1.x - loc2.x) === Math.abs(loc1.y - loc2.y);
  }
}
