export const START_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// "5bn1/P2Q2B1/3p1N2/K2bP3/6P1/7k/1qP5/1R5r w - - 0 1";
// "8/3K4/2P4P/p3r3/2p3p1/1PkNnPB1/6p1/n2R4 w - - 0 1";

export const AVAILABLE_FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "5bn1/P2Q2B1/3p1N2/K2bP3/6P1/7k/1qP5/1R5r w - - 0 1",
  "4r3/1pp3k1/6b1/bBQ5/3p3B/1Kp4P/P6P/4n3 w - - 0 1",
  "4q3/3Pp3/pp5b/4R1P1/2kN3P/Pp4B1/6N1/5K2 w - - 0 1",
  "K5k1/5pP1/7P/8/pP3p1Q/1pP5/3N3R/3b1n1B w - - 0 1",
  "4n3/p3pk1n/2r4b/5K2/pP1P4/4Bb2/1P5N/2R5 w - - 0 1",
  "8/3p1P2/2P1p2P/P1P5/1pR5/6pK/rq2k3/6bn w - - 0 1",
  "4N3/3P2Pk/3Pr3/N3pP2/p6q/p1P2KR1/8/2n5 w - - 0 1",
  "8/3K4/2P4P/p3r3/2p3p1/1PkNnPB1/6p1/n2R4 w - - 0 1",
  "3rQ3/5q1B/p2Rnppp/3P4/4n1K1/8/6R1/k1B5 w - - 0 1",
  "6Q1/2p2PK1/p7/q2Pn1k1/1b1p4/1p6/4pP1R/4B3 w - - 0 1",
  "8/3q2R1/P5Pp/BPK5/P1n5/1N3R1P/k2P4/4r3 w - - 0 1",
  "4B3/8/p2p1q2/1P2PP1p/1pk1bP2/P5p1/1K6/r7 w - - 0 1",
];

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

export const ConvertIdxToLocation = (idx: number) => {
  const row = Math.floor(idx / 8);
  const col = idx % 8;
  return { x: row, y: col };
};
