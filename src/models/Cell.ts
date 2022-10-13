import { TLocation, TPiece } from "../@types";
import { COLORS } from "../utils/Constants";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";
import Direction from "./Direction";
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
  public static GenSlideNew(
    curLocation: TLocation,
    opponentColor: string,
    board: Cell[][],
    xOffset: number,
    yOffset: number
  ) {
    const slide: Array<TLocation> = [];
    let x = curLocation.x + xOffset;
    let y = curLocation.y + yOffset;
    while (!Cell.OutOfBounds({ x, y })) {
      const newX = x + xOffset;
      const newY = y + yOffset;

      if (board[x][y].piece === null) slide.push({ x, y });
      else if (board[x][y].piece !== null) {
        if (board[x][y].piece?.color === opponentColor) {
          slide.push({ x, y });
          break;
        } else break;
      }
      x = newX;
      y = newY;
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
    const location = currentLocation;
    const opponentColor =
      playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    const arr = [
      ...Cell.GenSlideNew(location, opponentColor, board, 0, 1), //right
      ...Cell.GenSlideNew(location, opponentColor, board, 0, -1), //left
      ...Cell.GenSlideNew(location, opponentColor, board, 1, 0), //bottom
      ...Cell.GenSlideNew(location, opponentColor, board, -1, 0), //top
      ...Cell.GenSlideNew(location, opponentColor, board, -1, -1), //top left
      ...Cell.GenSlideNew(location, opponentColor, board, 1, 1), //bottom right
      ...Cell.GenSlideNew(location, opponentColor, board, -1, 1), //top right
      ...Cell.GenSlideNew(location, opponentColor, board, 1, -1), //bottom left
      ...Cell.GetLCoverage(currentLocation).filter((m) => m !== null),
    ];
    const data = Cell.FilterOccupancy(board, arr, playerColor);
    return data;
  }

  public static FindResponsibleSquares(
    attackerLocation: TLocation | null,
    defenderLocation: TLocation
  ) {
    const returnData = {
      direction: {
        h: false,
        v: false,
        rd: false,
        ld: false,
      },
      responsibleSquares: [] as TLocation[],
    };
    if (!attackerLocation) return returnData;

    // same row
    if (Direction.SameRow(attackerLocation, defenderLocation)) {
      const responsibleSquares = [];
      const start = Math.min(attackerLocation.y, defenderLocation.y);
      const end = Math.max(attackerLocation.y, defenderLocation.y);
      for (let i = start + 1; i < end; i++) {
        responsibleSquares.push({ x: attackerLocation.x, y: i });
      }
      return {
        direction: {
          ...returnData.direction,
          h: true,
        },
        responsibleSquares: [
          ...responsibleSquares,
          defenderLocation,
          attackerLocation,
        ],
      };
    }
    // same column
    else if (Direction.SameCol(attackerLocation, defenderLocation)) {
      const responsibleSquares = [];
      const start = Math.min(attackerLocation.x, defenderLocation.x);
      const end = Math.max(attackerLocation.x, defenderLocation.x);
      for (let i = start + 1; i < end; i++) {
        responsibleSquares.push({ x: i, y: attackerLocation.y });
      }
      return {
        direction: {
          ...returnData.direction,
          v: true,
        },
        responsibleSquares: [
          ...responsibleSquares,
          defenderLocation,
          attackerLocation,
        ],
      };
    }
    // same diagonal
    else if (Direction.SameDiagonal(attackerLocation, defenderLocation)) {
      if (Direction.RightDiagonal(attackerLocation, defenderLocation)) {
        const responsibleSquares = Direction.RightDiagCoord(
          attackerLocation.x,
          attackerLocation.y,
          defenderLocation.x,
          defenderLocation.y
        );
        return {
          direction: {
            ...returnData.direction,
            rd: true,
          },
          responsibleSquares,
        };
        // right diagonal
      } else {
        const responsibleSquares = Direction.LeftDiagCoord(
          attackerLocation.x,
          attackerLocation.y,
          defenderLocation.x,
          defenderLocation.y
        );
        return {
          direction: {
            ...returnData.direction,
            ld: true,
          },
          responsibleSquares,
        };
        // left diagonal
      }
    } else
      return {
        direction: {
          ...returnData.direction,
        },
        responsibleSquares: [attackerLocation],
      };
  }
  public static CellIsAttacked(
    board: Cell[][],
    location: TLocation,
    playerColor: COLORS
  ) {
    const returnData = {
      status: false,
      attackers: [] as TLocation[],
    };
    const coverage = Cell.GenAllCoverage(location, board, playerColor);
    const attackerColor =
      playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    const attackers = coverage
      .filter((loc) => {
        const attackingPiece = board[loc.x][loc.y].piece;
        if (attackingPiece === null) return null;
        if (attackingPiece.color !== attackerColor) return null;
        else {
          const validMoves = attackingPiece.CalculateValidMoves(loc, board);
          if (attackingPiece instanceof Pawn) {
            /**
             * Since pawn captures diagonally, we need to only check for those valid locations that are diagonal to the king.
             * If pawn is white, check top left and right diagonals for king. If black, check bottom left and right diagonals for king.
             */
            const attackerLD: TLocation = {
              x: attackingPiece.color === COLORS.WHITE ? loc.x - 1 : loc.x + 1,
              y: loc.y - 1,
            };
            const attackerRD: TLocation = {
              x: attackingPiece.color === COLORS.WHITE ? loc.x - 1 : loc.x + 1,
              y: loc.y + 1,
            };
            const findMove = [attackerLD, attackerRD].find((m) => {
              const locInMove = m.x === location.x && m.y === location.y;
              const locationPiece = board[m.x][m.y]?.piece;
              let pieceIsofPlayerColor =
                locationPiece && locationPiece.color === playerColor;
              return locInMove && pieceIsofPlayerColor;
            });
            if (!findMove) return null;
          } else {
            const findMove = validMoves.find((m) => {
              return m.x === location.x && m.y === location.y;
            });
            if (!findMove) {
              /**
               * if the move is not in validLocations,
               * see if attacking piece is a sliding piece.
               * If attacker is a sliding piece,
               * see if attackingPiece and the coverageLoc are in same row, col or diagonal
               * If no, return null
               */
              if (attackingPiece.slidingPiece === false) {
                // if piece is knight, see L directions of the location. If a knight is not found in any L direction, return null
                if (attackingPiece instanceof Knight) {
                  const LDirections = Cell.GetLCoverage(loc);
                  const findL = LDirections.find((m) => {
                    return m && m.x === location.x && m?.y === location.y;
                  });
                  if (!findL) return null;
                }
              } else {
                const sameRow = Direction.SameRow(loc, location);
                const sameCol = Direction.SameCol(loc, location);
                const sameDiagonal = Direction.SameDiagonal(loc, location);
                if (
                  attackingPiece instanceof Queen &&
                  !sameRow &&
                  !sameCol &&
                  !sameDiagonal
                )
                  return null;
                else if (attackingPiece instanceof Rook && !sameRow && !sameCol)
                  return null;
                else if (attackingPiece instanceof Bishop && !sameDiagonal)
                  return null;
              }
            }
          }
          return location;
        }
      })
      .filter((attackers) => attackers !== null);
    const finalRetData = {
      ...returnData,
      status: true,
      attackers,
    };
    if (attackers.length <= 0) return returnData;
    return finalRetData;
  }
}
