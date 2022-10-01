import { TLocation, TPiece } from "../@types";
import { COLORS } from "../utils/Constants";
import { King } from "./Piece";

export default class Cell {
  private m_validSq = false;
  private m_activeSq = false;
  private m_checkSq = false;
  constructor(
    private m_location: TLocation,
    private m_color: COLORS,
    private m_piece: TPiece | null
  ) {}
  // getters
  get location(): TLocation {
    return this.m_location;
  }
  get color(): COLORS {
    return this.m_color;
  }
  get piece(): TPiece | null {
    return this.m_piece;
  }
  get validSq(): boolean {
    return this.m_validSq;
  }

  get activeSq(): boolean {
    return this.m_activeSq;
  }
  get checkSq(): boolean {
    return this.m_checkSq;
  }

  // setters
  set location(location: TLocation) {
    this.m_location = location;
  }
  set color(color: COLORS) {
    this.m_color = color;
  }
  set piece(piece: TPiece | null) {
    this.m_piece = piece;
  }
  set validSq(valid: boolean) {
    this.m_validSq = valid;
  }
  set activeSq(active: boolean) {
    this.m_activeSq = active;
  }
  set checkSq(check: boolean) {
    this.m_checkSq = check;
  }
  public SetPiece(p: TPiece | null) {
    this.m_piece = p;
  }

  public static OutOfBounds(location: TLocation): boolean {
    if (location.x < 0 || location.x > 7 || location.y < 0 || location.y > 7)
      return true;
    return false;
  }
  public static Occupied(board: Cell[][], location: TLocation): boolean {
    const piece = board[location.x][location.y].piece;
    return piece !== null;
  }
  public static GenSlide(
    curLocation: TLocation,
    board: Cell[][],
    xOffset: number,
    yOffset: number,
    checkOccupancy = true
  ) {
    const slide: Array<TLocation> = [];
    let x = curLocation.x + xOffset;
    let y = curLocation.y + yOffset;

    while (!Cell.OutOfBounds({ x, y })) {
      if (
        checkOccupancy &&
        board[x][y].piece?.color ===
          board[curLocation.x][curLocation.y].piece?.color
      )
        break;

      slide.push({ x, y });
      if (checkOccupancy && Cell.Occupied(board, { x, y })) break;

      x += xOffset;
      y += yOffset;
    }
    return slide;
  }
  public static GetLCoverage(srcLocation: TLocation) {
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

    return [uul, uur, ddl, ddr, rru, rrd, llu, lld];
  }
  public static FilterOccupancy(
    board: Cell[][],
    arr: (TLocation | null)[],
    playerColor: COLORS
  ) {
    return arr.filter((loc) => {
      if (loc === null) return false;
      else {
        const occupied = Cell.Occupied(board, loc);
        if (!occupied) return true;
        else {
          if (board[loc.x][loc.y].piece?.color === playerColor) return false;
          else return true;
        }
      }
    }) as TLocation[];
  }
  public static GenAllCoverage(
    currentLocation: TLocation,
    board: Cell[][],
    playerColor: COLORS
  ) {
    const location = { x: 0, y: 5 };
    const arr = [
      ...Cell.GenSlide(location, board, 0, 1, true), //right
      ...Cell.GenSlide(location, board, 0, -1, true), //left
      ...Cell.GenSlide(location, board, 1, 0, true), //bottom
      ...Cell.GenSlide(location, board, -1, 0, true), //top
      ...Cell.GenSlide(location, board, -1, -1, true), //top left
      ...Cell.GenSlide(location, board, 1, 1, true), //bottom right
      ...Cell.GenSlide(location, board, -1, 1, true), //top right
      ...Cell.GenSlide(location, board, 1, -1, true), //bottom left
      // ...Cell.GetLCoverage(currentLocation).filter(
      //   (m) => m && board[m.x][m.y].piece !== null
      // ),
    ];
    console.log(currentLocation, arr);
    const data = Cell.FilterOccupancy(board, arr, playerColor);
    // console.log(currentLocation, arr, data);

    return data;
  }
  public static CellIsAttacked(
    board: Cell[][],
    location: TLocation,
    playerColor: COLORS
  ) {
    const coverage = Cell.GenAllCoverage(location, board, playerColor);
    console.log(coverage);
    return coverage.some((loc) => {
      const piece = board[loc.x][loc.y].piece;
      if (piece === null) return false;
      else {
        const validMoves = piece.CalculateValidMoves(loc, board);
        return validMoves.some((move) => {
          return move.x === location.x && move.y === location.y;
        });
      }
    });
  }
}
