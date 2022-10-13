// "5bn1/P2Q2B1/3p1N2/K2bP3/6P1/7k/1qP5/1R5r w - - 0 1";
// "8/3K4/2P4P/p3r3/2p3p1/1PkNnPB1/6p1/n2R4 w - - 0 1";
// "8/8/8/4q1K1/2k1R3/8/8/8 b - - 0 1";

import Cell from "../models/Cell";

export const AVAILABLE_FENS_LABLED = [
  {
    name: "Start Position",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  {
    name: "Random",
    fen: "5bn1/P2Q2B1/3p1N2/K2bP3/6P1/7k/1qP5/1R5r w - - 0 1",
  },
  {
    name: "Random",
    fen: "4r3/1pp3k1/6b1/bBQ5/3p3B/1Kp4P/P6P/4n3 w - - 0 1",
  },
  {
    name: "Random",
    fen: "4q3/3Pp3/pp5b/4R1P1/2kN3P/Pp4B1/6N1/5K2 w - - 0 1",
  },
  {
    name: "Random",
    fen: "K5k1/5pP1/7P/8/pP3p1Q/1pP5/3N3R/3b1n1B w - - 0 1",
  },
  {
    name: "Random",
    fen: "4n3/p3pk1n/2r4b/5K2/pP1P4/4Bb2/1P5N/2R5 w - - 0 1",
  },
  {
    name: "Random",
    fen: "8/3p1P2/2P1p2P/P1P5/1pR5/6pK/rq2k3/6bn w - - 0 1",
  },
  {
    name: "Random",
    fen: "4N3/3P2Pk/3Pr3/N3pP2/p6q/p1P2KR1/8/2n5 w - - 0 1",
  },
  {
    name: "Random",
    fen: "8/3K4/2P4P/p3r3/2p3p1/1PkNnPB1/6p1/n2R4 w - - 0 1",
  },
  {
    name: "Random",
    fen: "3rQ3/5q1B/p2Rnppp/3P4/4n1K1/8/6R1/k1B5 w - - 0 1",
  },
  {
    name: "Random",
    fen: "6Q1/2p2PK1/p7/q2Pn1k1/1b1p4/1p6/4pP1R/4B3 w - - 0 1",
  },
  {
    name: "Random",
    fen: "8/3q2R1/P5Pp/BPK5/P1n5/1N3R1P/k2P4/4r3 w - - 0 1",
  },
  {
    name: "Random",
    fen: "4B3/8/p2p1q2/1P2PP1p/1pk1bP2/P5p1/1K6/r7 w - - 0 1",
  },
  {
    name: "King Queen Endgame",
    fen: "8/8/8/4qQK1/2k5/8/8/8 b - - 0 1",
  },
  {
    name: "Valid Castle",
    fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
  },
  {
    name: "Black Castle, BSP, BSP Obstruction",
    fen: "r3k2r/pp1p3p/2pB2bb/3B4/8/1P2P3/P1PP1PPP/R3K1NR b KQ - 1 3",
  },
  {
    name: "Black Castle, KNT, BSP Obstruction",
    fen: "r3k2r/pppp3p/4N3/8/2B5/8/P1PP1PPP/R3K1NR w KQkq - 0 1",
  },
  {
    name: "King Eats pawn but Has Queen to give Check",
    fen: "rnbqkbnr/ppp1p1pp/8/8/8/3p4/PPPK2PP/RNBQ1BNR w KQkq - 0 1",
  },
  {
    name: "Ladder Checkmate - 1",
    fen: "4k3/Q7/8/8/1Q6/8/8/4K3 w - - 0 1",
  },
  {
    name: "Stalemate",
    fen: "4k3/4P3/3K4/8/8/8/8/8 w - - 0 1",
  },
  {
    name: "En Passant Pinned",
    fen: "8/2p5/3p4/KP5r/1R4pk/8/4P1P1/8 b - - 0 1",
  },
  {
    name: "Not Checkmate ",
    fen: "r1bq1r2/4n1p1/4N2k/3pPp1P/1b1n2Q1/2N5/PP3PP1/R1B1K2R b - - 0 1",
  },
];

const st = 0;
const end = AVAILABLE_FENS_LABLED.length - 1;
export const START_POSITION = AVAILABLE_FENS_LABLED[end].fen;

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
export enum GAME_STATE {
  GAME_OVER = "GAME_OVER",
}
export const ConvertIdxToLocation = (idx: number) => {
  const row = Math.floor(idx / 8);
  const col = idx % 8;
  return { x: row, y: col };
};

export function Flip(arr: Cell[][]) {
  return arr.reverse().map(function (item) {
    return item.reverse();
  });
}

export function Capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function CopyTextToClipBoard(text: string) {
  navigator.clipboard.writeText(text);
}
