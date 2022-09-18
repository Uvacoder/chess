export const START_POSITION =
  "rn2kbnr/pppQpppp/8/3p4/3P2b1/8/3KPPPP/2BN1BNR b kq - 2 11";
export enum COLORS {
  WHITE = "white",
  BLACK = "black",
}
export enum PIECES {
  KING = "K",
  QUEEN = "Q",
  BISHOP = "B",
  KNIGHT = "N",
  ROOK = "R",
  PAWN = "P",
}
export const DIM = 8;
export const CELL_SIZE = 75;
export const BOARD_SIZE = DIM * CELL_SIZE;
export const SPRITE_SIZE = 0.8 * CELL_SIZE;
