import { Bishop, King, Knight, Pawn, Queen, Rook } from "../models/Piece";

export type TLocation = {
  x: number;
  y: number;
};

export type TPiece = King | Queen | Rook | Bishop | Knight | Pawn;
