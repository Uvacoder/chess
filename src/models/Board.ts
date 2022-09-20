import { COLORS, PIECES } from "../utils/Constants";
import Cell from "./Cell";
import Piece, { TMove } from "./Piece";
export default class Board {
  private count: number = 8;
  private m_turn = COLORS.WHITE;
  private OccupiedSpace = new Map<{ row: number; col: number }, boolean>();
  private m_board: Cell[][] = [];

  private m_kingPos: { black: Piece | null; white: Piece | null } = {
    black: null,
    white: null,
  };
  private m_checkStatus: {
    status: boolean;
    king: Piece | null;
    responsibleSquares: Array<any>;
  } = {
    status: false,
    king: null,
    responsibleSquares: [],
  };

  private m_activePiece: { piece: Piece | null; validMoves: TMove } = {
    piece: null,
    validMoves: [],
  };
  constructor() {
    for (let i = 0; i < this.count; i++) {
      this.m_board.push(
        Array.from(Array(this.count), (_, idx) => new Cell(0, 0, null))
      );
    }
  }
  public GetBoard() {
    return this.m_board;
  }
  public GetTurn() {
    return this.m_turn;
  }

  public SetKingPosition() {
    this.m_board.forEach((cellRow, row) => {
      cellRow.forEach((cell, col) => {
        if (cell.Piece !== null) {
          if (
            cell.Piece.GetName() === PIECES.KING ||
            cell.Piece.GetName() === PIECES.KING.toLowerCase()
          ) {
            const key: COLORS = cell.Piece.GetColor() as COLORS;
            this.m_kingPos[key] = cell.Piece;
          }
        }
      });
    });
  }

  public SetBoard(board: Cell[][]) {
    this.m_board = board;
    this.SetKingPosition();
  }
  public SetOccupiedSpace(cellRow: number, cellCol: number) {
    this.OccupiedSpace.set({ row: cellRow, col: cellCol }, true);
  }
  public ResetBoardMarkers() {
    this.m_board.forEach((cellRow) => {
      cellRow.forEach((cell) => {
        cell.SetMarked(false);
        cell.SetValidCellMark(false);
        // cell.SetCheckCellMark(false);
      });
    });
  }
  public MarkValidMoves(cell: Cell) {
    cell.SetMarked(true);
    this.m_activePiece.validMoves.forEach((move) => {
      if (this.m_board !== null) {
        this.m_board && this.m_board[move.col][move.row].SetValidCellMark(true);
      }
    });
  }
  public MarkCheckCellMoves() {
    console.log("MARKING");
    this.m_checkStatus.responsibleSquares.forEach((move) => {
      if (this.m_board !== null) {
        this.m_board && this.m_board[move.col][move.row].SetCheckCellMark(true);
      }
    });
  }

  public ValidMoves(cell: Cell) {
    this.ResetBoardMarkers();
    if (cell.Piece !== null) {
      const piece = cell.Piece;

      const moves = piece.GetValidMoves(this.m_board);
      if (this.m_checkStatus.status === false) {
        this.m_activePiece.piece = piece;
        this.m_activePiece.validMoves = moves;
      } else {
        // check if the attacking piece can be captures
        // if not, check if there are any moves in moves that blocks the check
        //  see if king can goto any other square that is not in squares of danger
        //
        this.m_activePiece.validMoves = [];
      }
    }
  }
  public Capture(cell: Cell) {
    this.MovePiece(cell);
  }
  public MovePiece(cell: Cell) {
    if (this.m_activePiece.piece && this.m_activePiece.piece) {
      const isValidRowCol = this.m_activePiece.validMoves.some(
        (move) => move.row === cell.GetRow() && move.col === cell.GetCol()
      );

      if (isValidRowCol) {
        this.m_activePiece.piece.SetHasMovePiece();
        const currPiece = this.m_activePiece.piece;
        const newCell = this.m_board[cell.GetCol()][cell.GetRow()];
        this.m_board[currPiece.GetCol()][currPiece.GetRow()].Piece = null;
        newCell.Piece = currPiece;
        currPiece.SetRow(cell.GetRow());
        currPiece.SetCol(cell.GetCol());

        this.ValidMoves(cell);
        if (this.m_activePiece.piece.GetName() === PIECES.KING) {
          const key: COLORS = this.m_activePiece.piece.GetColor() as COLORS;
          this.m_kingPos[key] = this.m_activePiece.piece;
        }

        const oppositeColor =
          this.m_activePiece.piece.GetColor() === COLORS.WHITE
            ? COLORS.BLACK
            : COLORS.WHITE;
        const isCheck = this.m_activePiece.validMoves.some((move) => {
          return (
            move.row === this.m_kingPos[oppositeColor]?.GetRow() &&
            move.col === this.m_kingPos[oppositeColor]?.GetCol()
          );
        });
        if (isCheck) {
          function findResponsibleSquare(
            attacker: { piece: Piece; validMoves: TMove },
            checkedKing: Piece
          ): Array<any> {
            const moves = [];
            let st = -1,
              end = -2;
            const kingPosInValidMoves = attacker.validMoves.find((move) => {
              return (
                move.row === checkedKing.GetRow() &&
                move.col === checkedKing.GetCol()
              );
            });
            if (!kingPosInValidMoves) return [];
            if (attacker.piece.GetRow() === checkedKing.GetRow()) {
              st = Math.min(kingPosInValidMoves.col, attacker.piece.GetCol());
              end = Math.max(kingPosInValidMoves.col, attacker.piece.GetCol());
              if (st === end) st = 0;
              if (st === end) st = 0;
              for (let i = st; i <= end; i++)
                moves.push({ row: checkedKing.GetRow(), col: i });
            } else if (attacker.piece.GetCol() === checkedKing.GetCol()) {
              st = Math.min(kingPosInValidMoves.row, attacker.piece.GetRow());
              end = Math.max(kingPosInValidMoves.row, attacker.piece.GetRow());
              if (st === end) st = 0;
              for (let i = st; i <= end; i++)
                moves.push({ col: checkedKing.GetCol(), row: i });
            } else if (
              Math.abs(attacker.piece.GetCol() - checkedKing.GetCol()) ===
              Math.abs(attacker.piece.GetRow() - checkedKing.GetRow())
            ) {
              const diff =
                Math.abs(attacker.piece.GetCol() - checkedKing.GetCol()) - 1;
              const kingInMoveIdx = attacker.validMoves.findIndex(
                (move) =>
                  move.row === checkedKing.GetRow() &&
                  move.col === checkedKing.GetCol()
              );

              for (let i = kingInMoveIdx; i >= kingInMoveIdx - diff; i--) {
                moves.push(attacker.validMoves[i]);
              }
              console.log("HERE", attacker.validMoves[0]);
              moves.push(attacker.validMoves[0]);
            }
            return moves;
          }
          this.m_checkStatus.status = true;
          this.m_checkStatus.king = this.m_kingPos[oppositeColor];
          this.m_checkStatus.responsibleSquares = findResponsibleSquare(
            this.m_activePiece as { piece: Piece; validMoves: TMove },
            this.m_checkStatus.king as Piece
          );
          this.MarkCheckCellMoves();
        }
        console.log(this.m_activePiece, this.m_kingPos, this.m_checkStatus);
      }
    }
  }
}
