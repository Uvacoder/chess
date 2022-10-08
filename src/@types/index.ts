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

export type TPiece = King | Queen | Rook | Bishop | Knight | Pawn;
