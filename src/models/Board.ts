import {
  DRAW_REASONS,
  TBoardKing,
  TLocation,
  TPiece,
  TPieceMap,
} from "../@types";
import { COLORS, GAME_STATE } from "../utils/Constants";
import Cell from "./Cell";
import Direction from "./Direction";
import Game from "./Game";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";

export default class Board {
  private m_moveCount = 0;
  private m_board: Cell[][] = [];
  private m_piecesLocation: TPieceMap = {
    [COLORS.WHITE]: [],
    [COLORS.BLACK]: [],
  };

  private m_turn = COLORS.WHITE;
  private m_sound_type = {
    castle: false,
    check: false,
    checkmate: false,
    capture: false,
    move: true,
    draw: false,
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
  constructor(private m_game: Game) {}
  // setters
  public SwitchTurn() {
    this.m_turn = this.m_turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  }

  get moveCount() {
    return this.m_moveCount;
  }

  get turn(): COLORS {
    return this.m_turn;
  }

  set board(board: Cell[][]) {
    this.m_board = board;
  }
  set turn(val: COLORS) {
    this.m_turn = val;
  }
  // getters
  get board(): Cell[][] {
    return this.m_board;
  }
  get game() {
    return this.m_game;
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
    draw: boolean;
  } {
    return this.m_sound_type;
  }

  set pieceLocation(val: TPieceMap) {
    this.m_piecesLocation = val;
  }

  set sound(src: {
    castle: boolean;
    check: boolean;
    checkmate: boolean;
    capture: boolean;
    move: boolean;
    draw: boolean;
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
    const board = new Board(this.m_game);
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
  private ResetEnPassantEligible() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.piece instanceof Pawn) {
          cell.piece.enPassantEligible = false;
        }
      });
    });
  }
  private ResetEnPassantCapture() {
    this.m_board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.piece instanceof Pawn) {
          cell.piece.enPassantCapture = {
            left: false,
            right: false,
          };
        }
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
      draw: false,
    };
  }
  private GetValidMoves(board: Cell[][], piece: TPiece, cell: Cell) {
    // calculating Valid Locations for the piece that is clicked or that is active

    // Reset the Pinned status oif current iece
    piece.ResetPinnedStatus();
    // check if current piece is pinned
    this.PiecePinned();

    const currKing = this.m_kings[piece.color];

    let validLocations = [] as TLocation[];

    /**
     * if piece is king, set valid locations to all squares seperately as they check the directions for check if any
     * valid moves should contain location wthat is not in responsible squares,
     * except if the responsible square has a piece of opposite color
     * Find If King can castle, ie if king and rook has moved. If not, add them to valid locations
     * from location, find all coverage and see if that location will bring king in check.
     * ie. find king coverage from that location for king of curent player color.
     * if location exists, remove it from valid locations
     */
    if (piece instanceof King) {
      validLocations = piece
        .CalculateValidMoves(cell.location, board, currKing.checkInfo.direction)
        .filter((location) => {
          return !currKing.checkInfo.responsibleSquares
            .flat()
            .find((responsibleLocation) => {
              const pieceAtLocation =
                board[responsibleLocation.x][responsibleLocation.y].piece;
              if (pieceAtLocation === null)
                return (
                  responsibleLocation.x === location.x &&
                  responsibleLocation.y === location.y
                );
            });
        });
      piece.CanCastle(board, cell.location);
      validLocations = validLocations.filter((location) => {
        const isAttacked = Cell.CellIsAttacked(board, location, piece.color);
        return !isAttacked.status;
      });
      if (currKing.checkInfo.status === false && piece.castle.ks) {
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
            board,
            castleLocation,
            piece.color
          );
          if (!castleCellIsAttacked.status) validLocations.push(castleLocation);
        }
      }
      if (currKing.checkInfo.status === false && piece.castle.qs) {
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
            board,
            castleLocation,
            piece.color
          );
          if (!castleCellIsAttacked.status) validLocations.push(castleLocation);
        }
      }
    } else {
      validLocations = piece.CalculateValidMoves(cell.location, board);
    }

    /**
     * If Current King is in Check,
     * If Current Piece is a King, this block of code should not run As a King cant block check
     * Otherwise, see how many squares are responsible for check. If there are more than one,
     * this means that king is in check by 2 pieces. (In Regular Chess, no more than 2 pieces can Check the king at one time)
     * If king is in check by 2 pieces, then the only valid move for king is to move out of check.
     * Finding out the squares for king is not done here as we already did it in above block of code while calculating
     * valid moves for king
     * But if king is in check by only 1 piece, then the only valid move for king is to move out of check (calculated above)
     * or bring any other piece to responsible square
     */
    if (piece instanceof King === false) {
      if (currKing.checkInfo.status === true) {
        const responsibleSquares = currKing.checkInfo.responsibleSquares;
        if (responsibleSquares.length === 1) {
          validLocations = validLocations.filter((cell) => {
            return responsibleSquares.flat().find((sq) => {
              return sq.x == cell.x && sq.y == cell.y;
            });
          });
        } else validLocations = [];
      }
    }
    return validLocations;
  }

  public PieceClick(cell: Cell, turn: COLORS) {
    this.ResetSound();
    this.ResetBoardMarkers();

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
      if (cell.piece.color !== turn) return;
      cell.activeSq = true;
      this.m_currPiece.piece = cell.piece;
      this.m_currPiece.location = cell.location;
      this.m_currPiece.validLocations = this.GetValidMoves(
        this.m_board,
        this.m_currPiece.piece,
        cell
      );
      this.MarkValidState();
    }
  }

  public PiecePinned() {
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
    if (Direction.SameRow(playerKing.location, this.m_currPiece.location)) {
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
    } else if (
      Direction.SameCol(playerKing.location, this.m_currPiece.location)
    ) {
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
      Direction.SameDiagonal(playerKing.location, this.m_currPiece.location)
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
        Direction.TopLeft(playerKing.location, this.m_currPiece.location)
      ) {
        this.m_currPiece.piece.pinned.topLeft = false;
        this.m_currPiece.piece.pinned.bottomRight = false;
      } else if (
        pieceLocationInChecks &&
        Direction.TopRight(playerKing.location, this.m_currPiece.location)
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        Direction.BottomLeft(playerKing.location, this.m_currPiece.location)
      ) {
        this.m_currPiece.piece.pinned.topRight = false;
        this.m_currPiece.piece.pinned.bottomLeft = false;
      } else if (
        pieceLocationInChecks &&
        Direction.BottomRight(playerKing.location, this.m_currPiece.location)
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

  private AssignSound(type: string) {
    const soundType = {
      castle: false,
      check: false,
      checkmate: false,
      capture: false,
      move: false,
      draw: false,
    };
    switch (type) {
      case "castle":
        soundType.castle = true;
        break;
      case "check":
        soundType.check = true;
        break;
      case "checkmate":
        soundType.checkmate = true;
        break;
      case "draw":
        soundType.draw = true;
        break;
      case "capture":
        soundType.capture = true;
        break;
      default:
        soundType.move = true;
        break;
    }

    this.m_sound_type = soundType;
  }
  private RecordPiecesLocation(
    srcLocation: TLocation,
    destLocation: TLocation,
    isCapture: boolean,
    playerColor: COLORS,
    opponentColor: COLORS
  ) {
    const curPieceLocIdx = this.m_piecesLocation[playerColor].findIndex(
      (l) => l.x === srcLocation.x && l.y === srcLocation.y
    );

    if (curPieceLocIdx !== -1) {
      if (isCapture) {
        const oppPieceIdx = this.m_piecesLocation[opponentColor].findIndex(
          (l) => l.x === destLocation.x && l.y === destLocation.y
        );
        this.m_piecesLocation[opponentColor].splice(oppPieceIdx, 1);
      }
      this.m_piecesLocation[playerColor][curPieceLocIdx] = destLocation;
    }
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
      draw: false,
    };
  }
  public MovePiece(
    board: Cell[][],
    boardKing: TBoardKing,
    srcLocation: TLocation,
    destLocation: TLocation
  ) {
    this.m_moveCount++;

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
      this.m_moveCount = 0;
      const pawn = board[srcLocation.x][srcLocation.y].piece as Pawn;
      const pawnColor = pawn!.color;

      const enPassantEligibleOffset = pawnColor === "white" ? -2 : 2;
      if (destLocation.x === srcLocation.x + enPassantEligibleOffset)
        (pawn as Pawn).enPassantEligible = true;

      // see if move is enpassant move
      const enPassantCaptureOffsetX = pawnColor === "white" ? -1 : 1;
      if (
        pawn.enPassantCapture.left === true &&
        destLocation.x === srcLocation.x + enPassantCaptureOffsetX &&
        destLocation.y === srcLocation.y - 1
      ) {
        board[srcLocation.x][srcLocation.y - 1].piece = null;
        this.AssignSound("capture");
        this.ResetEnPassantCapture();
      } else if (
        pawn.enPassantCapture.right === true &&
        destLocation.x === srcLocation.x + enPassantCaptureOffsetX &&
        destLocation.y === srcLocation.y + 1
      ) {
        board[srcLocation.x][srcLocation.y + 1].piece = null;
        this.ResetEnPassantCapture();
        this.AssignSound("capture");
      }

      const promotionRow = pawnColor === "white" ? 0 : 7;
      if (destLocation.x === promotionRow) {
        finalPieceAtDestination = new Queen(pawnColor);
      }
    }

    const pieceAtDestination = board[destLocation.x][destLocation.y].piece;
    if (pieceAtDestination !== null) this.m_moveCount = 0;
    board[destLocation.x][destLocation.y].piece = finalPieceAtDestination;
    board[srcLocation.x][srcLocation.y].piece = null;

    console.log(this.m_moveCount);
  }
  public MoveAction(
    board: Cell[][],
    srcLocation: TLocation,
    destLocation: TLocation
  ) {
    const playerColor = this.m_currPiece.piece!.color;
    const opponentColor =
      playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    const oppPieceAtDestination = board[destLocation.x][destLocation.y].piece;

    this.RecordPiecesLocation(
      srcLocation,
      destLocation,
      oppPieceAtDestination !== null,
      playerColor,
      opponentColor
    );
    this.ResetCheck();
    this.ResetEnPassantEligible();

    this.m_kings[playerColor].checkInfo.status = false;
    this.m_kings[playerColor].checkInfo.responsibleSquares = [];

    if (oppPieceAtDestination) this.AssignSound("capture");
    else this.AssignSound("move");

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
      this.AssignSound("check");

      this.MarkCheckSquares(opponentColor);
      // check if it is checkmate
      const checkMate = this.IsCheckmate(board, opponentColor);
      if (checkMate) {
        this.AssignSound("checkmate");

        this.m_game.gameOverInfo = {
          status: true,
          reason: {
            draw: { status: false, reason: null },
            won: { status: true, reason: playerColor },
          },
        };
        this.m_game.gameOverStatus = true;
        this.m_game.winner = playerColor;
        return;
      }
    } else if (this.IsStalemate(board, opponentColor)) {
      this.AssignSound("draw");
      this.m_game.gameOverInfo = {
        status: true,
        reason: {
          draw: { status: true, reason: DRAW_REASONS.STALEMATE },
          won: { status: false, reason: null },
        },
      };
    }
    const draw = this.IsDraw(board, opponentColor);
    if (draw.status) {
      this.AssignSound("draw");
      this.m_game.gameOverInfo = {
        status: true,
        reason: {
          draw: { status: true, reason: draw.reason },
          won: { status: false, reason: null },
        },
      };
    }
    // }
    // check for draw
    this.SwitchTurn();
    this.ResetCurrPiece();
  }

  public IsCheckmate(board: Cell[][], opponentColor: COLORS) {
    const opponentKing = this.m_kings[opponentColor];
    const location = opponentKing.location;
    const responsibleSquares = opponentKing.checkInfo.responsibleSquares;
    const cell = board[location.x][location.y];
    const king = board[location.x][location.y].piece as King;
    const validMoves = this.GetValidMoves(board, king, cell);
    if (validMoves.length > 0) return false;
    // else {
    // for each responsible square, see if it has attacker. If yes, return false
    const playerColor =
      opponentColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    const kingIdx = responsibleSquares.findIndex(
      (sq) => sq.x === location.x && sq.y === location.y
    );
    responsibleSquares.splice(kingIdx, 1);

    const canBlock = responsibleSquares
      .flat()
      .some((sq) => Cell.CellIsAttacked(board, sq, playerColor).status);

    return !canBlock;
  }
  public IsStalemate(board: Cell[][], opponentColor: COLORS) {
    const opponentPieceLocations = this.m_piecesLocation[opponentColor];
    const isNotStalemate = opponentPieceLocations.some((loc) => {
      const piece = board[loc.x][loc.y].piece;
      if (piece === null) return false;
      const validMoves = this.GetValidMoves(board, piece, board[loc.x][loc.y]);
      return validMoves.length > 0;
    });
    return !isNotStalemate;
  }
  public IsDraw(board: Cell[][], opponentColor: COLORS) {
    if (this.m_moveCount >= 50)
      return { status: true, reason: DRAW_REASONS.FIFTY_MOVE_RULE };

    const playerColor =
      opponentColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

    //if only kings remain
    const opponentPieceLocations = this.m_piecesLocation[opponentColor];
    const playerPieceLocations = this.m_piecesLocation[playerColor];
    if (
      opponentPieceLocations.length === 1 &&
      playerPieceLocations.length === 1
    ) {
      const opLoc = opponentPieceLocations[0];
      const plLoc = playerPieceLocations[0];
      const opPiece = board[opLoc.x][opLoc.y].piece;
      const plPiece = board[plLoc.x][plLoc.y].piece;
      if (opPiece && plPiece) {
        if (opPiece instanceof King && plPiece instanceof King) {
          return {
            status: true,
            reason: DRAW_REASONS.INSUFFICIENT_MATERIAL,
          };
        }
      }
    }

    // if opponent has a king and knight
    if (opponentPieceLocations.length === 2) {
      const loc1 = opponentPieceLocations[0];
      const loc2 = opponentPieceLocations[1];
      const p1 = board[loc1.x][loc1.y].piece;
      const p2 = board[loc2.x][loc2.y].piece;
      if (
        (p1 instanceof King &&
          (p2 instanceof Knight || p2 instanceof Bishop)) ||
        (p2 instanceof King && (p1 instanceof Knight || p1 instanceof Bishop))
      )
        return { status: true, reason: DRAW_REASONS.INSUFFICIENT_MATERIAL };
    }

    return { status: false, reason: null };
  }
}
