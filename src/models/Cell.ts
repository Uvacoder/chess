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

  public static OutOfBounds(location: TLocation): boolean {
    if (location.x < 0 || location.x > 7 || location.y < 0 || location.y > 7)
      return true;
    return false;
  }
  public static Occupied(board: Cell[][], location: TLocation): boolean {
    const piece = board[location.x][location.y].piece;
    return piece !== null;
  }
}
