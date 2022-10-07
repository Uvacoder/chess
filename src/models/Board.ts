import { TLocation, TPiece } from "../@types";
import { COLORS, ConvertIdxToLocation } from "../utils/Constants";
import Cell from "./Cell";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";

type TBoardKing = {
  [key in COLORS]: {
    location: TLocation;
    checkInfo: {
      status: boolean;
      responsibleSquares: TLocation[];
      direction: {
        h: boolean;
        v: boolean;
        rd: boolean;
        ld: boolean;
      };
    };
  };
};

export default class Board {
  private m_board: Cell[][] = [];
  private m_sound_type = {
    castle: false,
    check: false,
    checkmate: false,
    capture: false,
    move: true,
  };
  private m_kings: TBoardKing = {
    [COLORS.WHITE]: {
      location: { x: -1, y: -1 },
      checkInfo: {
        status: false,
        responsibleSquares: [],
        direction: {
          h: false,
          v: false,
          rd: false,
          ld: false,
        },
      },
    },
    [COLORS.BLACK]: {
      location: { x: -1, y: -1 },
      checkInfo: {
        status: false,
        responsibleSquares: [],
        direction: {
          h: false,
          v: false,
          rd: false,
          ld: false,
        },
      },
    },
  };

  private m_currPiece: {
    piece: TPiece | null;
    validLocations: TLocation[];
    boardCoverage: TLocation[];
    location: TLocation;
  } = {
    piece: null,
    validLocations: [],
    boardCoverage: [],
    location: { x: -1, y: -1 },
  };
  constructor() {}
  // setters
  set board(board: Cell[][]) {
    this.m_board = board;
  }
  // getters
  get board(): Cell[][] {
    return this.m_board;
  }

  get kings(): TBoardKing {
    return this.m_kings;
  }

  get sound(): {
    castle: boolean;
    check: boolean;
    checkmate: boolean;
    capture: boolean;
    move: boolean;
  } {
    return this.m_sound_type;
  }
  set sound(src: {
    castle: boolean;
    check: boolean;
    checkmate: boolean;
    capture: boolean;
    move: boolean;
  }) {
    this.m_sound_type = src;
  }
  set kings(kings: TBoardKing) {
    this.m_kings = kings;
  }

  private ResetCurrPiece() {
    this.m_currPiece.piece = null;
    this.m_currPiece.validLocations = [];
    this.m_currPiece.boardCoverage = [];
    this.m_currPiece.location = { x: -1, y: -1 };
  }

  public CopyBoard() {
    const board = new Board();
    const kingLocation = { x: -1, y: -1 };
    const kingDir = {
      h: false,
      v: false,
      rd: false,
      ld: false,
    };
    const kings = {
      [COLORS.WHITE]: {
        location: kingLocation,
        checkInfo: {
          status: false,
          responsibleSquares: [],
          direction: kingDir,
        },
      },
      [COLORS.BLACK]: {
        location: kingLocation,
        checkInfo: {
          status: false,
          responsibleSquares: [],
          direction: kingDir,
        },
      },
    };

    board.board = this.m_board.map((row, rIdx) => {
      return row.map((col, cIdx) => {
        const cellColor = (rIdx + cIdx) % 2 === 0 ? COLORS.WHITE : COLORS.BLACK;
        const piece = col.piece;
        if (piece instanceof King) {
          const color = piece.color;
          kings[color].location = { x: rIdx, y: cIdx };
        }
        return new Cell(col.location, cellColor, piece);
      });
    });
    board.kings = kings;
    return board;
  }

  public ResetBoardMarkers() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        cell.validSq = false;
        cell.activeSq = false;
      });
    });
  }
  public MarkValidState() {
    this.m_currPiece.validLocations.forEach((location) => {
      this.m_board[location.x][location.y].validSq = true;
    });
  }
  public MarkCheckSquares(color: COLORS) {
    const king = this.m_kings[color];
    king.checkInfo.responsibleSquares.flat().forEach((location) => {
      this.m_board[location.x][location.y].checkSq = true;
    });
    this.m_board[king.location.x][king.location.y].checkSq = true;
  }
  public ResetCheckMarkers() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        cell.checkSq = false;
      });
    });
  }
  public ResetCheck() {
    this.m_kings[COLORS.BLACK].checkInfo.status = false;
    this.m_kings[COLORS.BLACK].checkInfo.responsibleSquares = [];
    this.m_kings[COLORS.BLACK].checkInfo.direction = {
      h: false,
      v: false,
      rd: false,
      ld: false,
    };
    this.m_kings[COLORS.WHITE].checkInfo.status = false;
    this.m_kings[COLORS.WHITE].checkInfo.direction = {
      h: false,
      v: false,
      rd: false,
      ld: false,
    };
    this.m_kings[COLORS.WHITE].checkInfo.responsibleSquares = [];
    this.ResetCheckMarkers();
  }
  private ResetEnPassant(color: COLORS) {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.piece instanceof Pawn && cell.piece.color === color)
          cell.piece.enPassantEligible = false;
      });
    });
  }
  private ResetSound() {
    this.sound = {
      castle: false,
      check: false,
      checkmate: false,
      capture: false,
      move: false,
    };
  }
  private AssignValidMovesToPiece(cell: Cell) {
    // calculating Valid Locations for the piece that is clicked or that is active

    if (this.m_currPiece.piece === null) return;

    // Reset the Pinned status oif current iece
    this.m_currPiece.piece.ResetPinnedStatus();
    // check if current piece is pinned
    this.CurrPiecePinned();

    const currKing = this.m_kings[this.m_currPiece.piece.color];

    let validLocations = [] as TLocation[];

    /**
     * if current piece is king, set valid locations to all squares seperately as they check the directions for check if any
     * valid moves should contain location wthat is not in responsible squares,
     * except if the responsible square has a piece of opposite color
     * Find If King can castle, ie if king and rook has moved. If not, add them to valid locations
     * from location, find all coverage and see if that location will bring king in check.
     * ie. find king coverage from that location for king of curent player color.
     * if location exists, remove it from valid locations
     */
    if (this.m_currPiece.piece instanceof King) {
      validLocations = this.m_currPiece.piece
        .CalculateValidMoves(
          cell.location,
          this.m_board,
          currKing.checkInfo.direction
        )
        .filter((location) => {
          return !currKing.checkInfo.responsibleSquares
            .flat()
            .find((responsibleLocation) => {
              const pieceAtLocation =
                this.m_board[responsibleLocation.x][responsibleLocation.y]
                  .piece;
              if (pieceAtLocation === null)
                return (
                  responsibleLocation.x === location.x &&
                  responsibleLocation.y === location.y
                );
            });
        });
      this.m_currPiece.piece.CanCastle(this.m_board, cell.location);
      validLocations = validLocations.filter((location) => {
        const isAttacked = Cell.CellIsAttacked(
          this.m_board,
          location,
          this.m_currPiece.piece!.color
        );
        return !isAttacked.status;
      });
      if (
        currKing.checkInfo.status === false &&
        this.m_currPiece.piece.castle.ks
      ) {
        if (
          validLocations.find(
            (loc) => loc.x === cell.location.x && loc.y === cell.location.y + 1
          ) !== undefined
        ) {
          const castleLocation = {
            x: cell.location.x,
            y: cell.location.y + 2,
          };
          const castleCellIsAttacked = Cell.CellIsAttacked(
            this.m_board,
            castleLocation,
            this.m_currPiece.piece.color
          );
          if (!castleCellIsAttacked.status) validLocations.push(castleLocation);
        }
      }
      if (
        currKing.checkInfo.status === false &&
        this.m_currPiece.piece.castle.qs
      ) {
        if (
          validLocations.find(
            (loc) => loc.x === cell.location.x && loc.y === cell.location.y - 1
          ) !== undefined
        ) {
          const castleLocation = {
            x: cell.location.x,
            y: cell.location.y - 2,
          };
          const castleCellIsAttacked = Cell.CellIsAttacked(
            this.m_board,
            castleLocation,
            this.m_currPiece.piece.color
          );
          if (!castleCellIsAttacked.status) validLocations.push(castleLocation);
        }
      }
    }
    // else if (this.m_currPiece.piece instanceof Pawn) {
    /**
     * If current piece is pawn, see if it can capture by enpassant. If it can, add the location to validLocations
     */
    // }
    // for very other piece, find valid move normally
    else
      validLocations = this.m_currPiece.piece.CalculateValidMoves(
        cell.location,
        this.m_board
      );

    /**
     * As a King cant block check, this block of code should not run if the current piece is a king
     * Otherwise, see how many squares are responsible for check. If there are more than one,
     * this means that king is in check by 2 pieces.
     * If king is in check by 2 pieces, then the only valid move for king is to move out of check.
     * Finding out the squares for king is not done here as we already did it in above block of code while calculating
     * valid moves for king
     * But if king is in check by only 1 piece, then the only valid move for king is to move out of check (calculated above)
     * or bring any other piece to responsible square
     */
    if (
      this.m_currPiece.piece instanceof King === false &&
      currKing.checkInfo.status === true
    ) {
      const responsibleSquares = currKing.checkInfo.responsibleSquares;
      if (responsibleSquares.length === 1) {
        validLocations = validLocations.filter((cell) => {
          return responsibleSquares.flat().find((sq) => {
            return sq.x == cell.x && sq.y == cell.y;
          });
        });
      } else validLocations = [];
    }

    this.m_currPiece.validLocations = validLocations;
  }

  public PieceClick(cell: Cell) {
    this.ResetBoardMarkers();
    this.ResetSound();
    const cellInValidMoves = this.m_currPiece.validLocations.find(
      (location) =>
        location.x === cell.location.x && location.y === cell.location.y
    );
    if (cellInValidMoves !== undefined) {
      if (
        cell.location.x === this.m_currPiece.location.x &&
        cell.location.y === this.m_currPiece.location.y
      )
        return;
      this.MoveAction(this.m_board, this.m_currPiece.location, cell.location);
      this.ResetBoardMarkers();
    } else if (cell.piece === null) {
      this.ResetCurrPiece();
    } else {
      cell.activeSq = true;
      this.m_currPiece.piece = cell.piece;
      this.m_currPiece.location = cell.location;
      this.AssignValidMovesToPiece(cell);
      this.MarkValidState();
    }
  }

  public CurrPiecePinned() {
    if (!this.m_currPiece.piece || this.m_currPiece.piece instanceof King)
      return;
    const playerColor = this.m_currPiece.piece.color;

    const playerKing = this.m_kings[this.m_currPiece.piece.color];

    const tempBoard = this.CopyBoard().board;
    const currLocation = this.m_currPiece.location;
    tempBoard[currLocation.x][currLocation.y].piece = null;
    let kingChecks = [];

    kingChecks = this.KingInCheck(tempBoard, playerColor, this.kings).flat();
    // if king is in same row as the active piece
    if (playerKing.location.x === this.m_currPiece.location.x) {
      this.m_currPiece.piece.pinned.horizontal = false;
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomRight = true;
      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );

      if (pieceLocationInChecks !== undefined) {
        this.m_currPiece.piece.pinned.vertical = true;
      } else {
        this.m_currPiece.piece.pinned.vertical = false;
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else if (playerKing.location.y === this.m_currPiece.location.y) {
      this.m_currPiece.piece.pinned.vertical = false;
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomRight = true;
      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );

      if (pieceLocationInChecks !== undefined) {
        this.m_currPiece.piece.pinned.horizontal = true;
      } else {
        this.m_currPiece.piece.pinned.horizontal = false;
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else if (
      Math.abs(playerKing.location.x - this.m_currPiece.location.x) ===
      Math.abs(playerKing.location.y - this.m_currPiece.location.y)
    ) {
      this.m_currPiece.piece.pinned.topLeft = true;
      this.m_currPiece.piece.pinned.topRight = true;
      this.m_currPiece.piece.pinned.bottomLeft = true;
      this.m_currPiece.piece.pinned.bottomRight = true;

      const pieceLocationInChecks = kingChecks.find(
        (location) =>
          location &&
          location.x === this.m_currPiece.location.x &&
          location.y === this.m_currPiece.location.y
      );
      if (pieceLocationInChecks) {
        this.m_currPiece.piece.pinned.vertical = true;
        this.m_currPiece.piece.pinned.horizontal = true;
      }
      if (
        pieceLocationInChecks &&
        playerKing.location.x > this.m_currPiece.location.x &&
        playerKing.location.y > this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x > this.m_currPiece.location.x &&
        playerKing.location.y < this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x < this.m_currPiece.location.x &&
        playerKing.location.y > this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        playerKing.location.x < this.m_currPiece.location.x &&
        playerKing.location.y < this.m_currPiece.location.y
      ) {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      } else {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      }
    } else {
      this.m_currPiece.piece.pinned.vertical = false;
      this.m_currPiece.piece.pinned.topLeft = false;
      this.m_currPiece.piece.pinned.bottomLeft = false;
      this.m_currPiece.piece.pinned.topRight = false;
      this.m_currPiece.piece.pinned.bottomRight = false;
      this.m_currPiece.piece.pinned.horizontal = false;
    }
  }

  public KingInCheck(
    board: Cell[][],
    kingColor: COLORS,
    boardKing: TBoardKing
  ) {
    const responsibleSquares: TLocation[] = [];
    const kingLocation = boardKing[kingColor]!.location;
    const { status, attackers } = Cell.CellIsAttacked(
      board,
      kingLocation,
      kingColor
    );

    if (!status) return [];

    const _responsibleSquares = attackers
      .map((attacker) => {
        return Cell.FindResponsibleSquares(attacker, kingLocation);
      })
      .filter((sq) => {
        if (boardKing[kingColor]) {
          if (sq.direction.h) boardKing[kingColor].checkInfo.direction.h = true;
          if (sq.direction.v) boardKing[kingColor].checkInfo.direction.v = true;
          if (sq.direction.rd)
            boardKing[kingColor].checkInfo.direction.rd = true;
          if (sq.direction.ld)
            boardKing[kingColor].checkInfo.direction.ld = true;
        }
        return sq.responsibleSquares.length > 0;
      })
      .map((sq) => sq.responsibleSquares);

    return [...responsibleSquares, ..._responsibleSquares];
  }

  public PromotePawn(
    cell: Cell,
    pieceName: "queen" | "rook" | "bishop" | "knight"
  ) {
    const location = cell.location;
    const board = this.m_board;
    const piece = board[location.x][location.y].piece;
    if (piece === null) return;
    const color = piece.color;

    if (piece instanceof Pawn === false) return;
    let newPiece = null;
    switch (pieceName) {
      case "queen":
        newPiece = new Queen(color);
        break;
      case "rook":
        newPiece = new Rook(color);
        break;
      case "bishop":
        newPiece = new Bishop(color);
        break;
      case "knight":
        newPiece = new Knight(color);
        break;
      default:
        break;
    }
    if (newPiece === null) return;
    else {
      cell.piece = newPiece;
    }
  }

  private CastleKing(
    board: Cell[][],
    srcLocation: TLocation,
    side: "ks" | "qs"
  ) {
    const kingLoc = board[srcLocation.x][srcLocation.y].location;
    let rookLoc = board[srcLocation.x][side === "ks" ? 7 : 0].location;

    let newKingLoc = {
      x: kingLoc.x,
      y: kingLoc.y,
    };
    let newRookLoc = {
      x: rookLoc.x,
      y: rookLoc.y,
    };
    if (side === "ks") {
      newKingLoc.y += 2;
      newRookLoc.y -= 2;
    } else if (side === "qs") {
      newKingLoc.y -= 2;
      newRookLoc.y += 3;
    }
    board[newKingLoc.x][newKingLoc.y].piece = board[kingLoc.x][kingLoc.y].piece;
    board[newRookLoc.x][newRookLoc.y].piece = board[rookLoc.x][rookLoc.y].piece;
    board[kingLoc.x][kingLoc.y].piece = null;
    board[rookLoc.x][rookLoc.y].piece = null;
    this.sound = {
      capture: false,
      castle: true,
      check: false,
      checkmate: false,
      move: false,
    };
  }
  public MovePiece(
    board: Cell[][],
    boardKing: TBoardKing,
    srcLocation: TLocation,
    destLocation: TLocation
  ) {
    if (board[destLocation.x][destLocation.y].piece instanceof King) return;

    let finalPieceAtDestination = board[srcLocation.x][srcLocation.y].piece;

    if (board[srcLocation.x][srcLocation.y].piece instanceof King) {
      const kingColor = board[srcLocation.x][srcLocation.y].piece!.color;
      boardKing[kingColor].location = destLocation;
      if (destLocation.y == srcLocation.y + 2) {
        this.CastleKing(board, srcLocation, "ks");
        return;
      } else if (destLocation.y == srcLocation.y - 2) {
        this.CastleKing(board, srcLocation, "qs");
        return;
      }
    } else if (board[srcLocation.x][srcLocation.y].piece instanceof Pawn) {
      const pawn = board[srcLocation.x][srcLocation.y].piece;
      const pawnColor = pawn!.color;

      const offset = pawnColor === "white" ? -2 : 2;
      if (destLocation.x === srcLocation.x + offset)
        (pawn as Pawn).enPassantEligible = true;

      const promotionRow = pawnColor === "white" ? 0 : 7;
      if (destLocation.x === promotionRow) {
        finalPieceAtDestination = new Queen(pawnColor);
      }
    }

    board[destLocation.x][destLocation.y].piece = finalPieceAtDestination;
    board[srcLocation.x][srcLocation.y].piece = null;
  }
  public MoveAction(
    board: Cell[][],
    srcLocation: TLocation,
    destLocation: TLocation
  ) {
    const playerColor = this.m_currPiece.piece!.color;
    const opponentColor =
      playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    this.ResetCheck();
    this.ResetEnPassant(playerColor);

    this.m_kings[playerColor].checkInfo.status = false;
    this.m_kings[playerColor].checkInfo.responsibleSquares = [];

    const pieceAtDestination = board[destLocation.x][destLocation.y].piece;
    if (pieceAtDestination)
      this.sound = {
        move: false,
        capture: true,
        check: false,
        castle: false,
        checkmate: false,
      };
    else
      this.sound = {
        move: true,
        capture: false,
        check: false,
        castle: false,
        checkmate: false,
      };

    this.MovePiece(board, this.m_kings, srcLocation, destLocation);

    if (this.m_currPiece.piece) this.m_currPiece.piece.hasMoved = true;
    this.m_currPiece.location = destLocation;

    const checkSquares = this.KingInCheck(
      this.m_board,
      opponentColor,
      this.kings
    );

    if (checkSquares.length > 0) {
      this.m_kings[opponentColor]!.checkInfo.status = true;
      this.m_kings[opponentColor]!.checkInfo.responsibleSquares =
        checkSquares as TLocation[];
      this.sound = {
        move: false,
        capture: false,
        check: true,
        castle: false,
        checkmate: false,
      };
      this.MarkCheckSquares(opponentColor);
    }

    this.ResetCurrPiece();
  }
}
