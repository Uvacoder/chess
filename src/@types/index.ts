import { Bishop, King, Knight, Pawn, Queen, Rook } from "../models/Piece";
import { COLORS } from "../utils/Constants";

export type TLocation = {
  x: number;
  y: number;
};

export type TBoardKing = {
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

export type TPieceMap = {
  [key in COLORS]: Array<TLocation>;
};

export enum DRAW_REASONS {
  STALEMATE = "Stalemate",
  INSUFFICIENT_MATERIAL = "Insufficient Material",
  FIFTY_MOVE_RULE = "50 Move Rule",
  THREEFOLD_REPETITION = "Three Fold Repeteation",
  AGREEMENT = "Agreement",
}
export type TGameOverInfo = {
  status: boolean;
  reason: {
    won: {
      status: boolean;
      reason: COLORS | null;
    };
    draw: {
      status: boolean;
      reason: DRAW_REASONS | null;
    };
  };
};

export type TCurrPiece = {
  piece: TPiece | null;
  validLocations: TLocation[];
  boardCoverage: TLocation[];
  location: TLocation;
};

export type TPiece = King | Queen | Rook | Bishop | Knight | Pawn;
