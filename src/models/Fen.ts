import FenParser from "@chess-fu/fen-parser";
import Board from "./Board";
import Cell from "./Cell";
import Piece from "./Piece";
export default class Fen {
  constructor(private board: Board, private fen: string) {
    try {
      const fenParser = new FenParser(fen);
      if (!fenParser.isValid)
        throw new Error("Please provide a valid FEN string");
      const fenParsedBoard = fenParser.ranks.map((rank, rankIndex) => {
        const splitRank = rank.split("");
        return splitRank.map((pieceName, pieceIndex) => {
          if (pieceName === "-") return new Cell(rankIndex, pieceIndex, null);
          else {
            const piece = new Piece(pieceName, rankIndex, pieceIndex);
            const cell = new Cell(rankIndex, pieceIndex, piece);
            this.board.SetOccupiedSpace(rankIndex, pieceIndex);
            return cell;
          }
        });
      });
      const transposedBoard = fenParsedBoard[0].map((_, colIndex) =>
        fenParsedBoard.map((row) => row[colIndex])
      );

      this.board.SetBoard(transposedBoard);
    } catch (error) {
      throw error;
    }
  }
}
