import FenParser from "@chess-fu/fen-parser";
import { COLORS, START_POSITION } from "../utils/Constants";
import Cell from "./Cell";

export default class Fen {
  private parser = new FenParser(START_POSITION);

  constructor(private m_fenString: string) {}

  get isValid() {
    this.parser = new FenParser(this.m_fenString);
    return this.parser.isValid;
  }
  get ranks() {
    return this.parser.ranks;
  }
  get turn() {
    return this.parser.turn;
  }

  public static GenerateFen(
    board: Cell[][],
    blackCastleKS: boolean,
    blackCastleQS: boolean,
    whiteCastleKS: boolean,
    whiteCastleQS: boolean,
    turn: COLORS,
    totalMoves: number,
    totalHalfMoves: number
  ) {
    const fenTurn = turn === COLORS.WHITE ? "w" : "b";
    const fenBlackCastleKS = blackCastleKS ? "k" : "";
    const fenBlackCastleQS = blackCastleQS ? "q" : "";
    const fenWhiteCastleKS = whiteCastleKS ? "K" : "";
    const fenWhiteCastleQS = whiteCastleQS ? "Q" : "";
    const fenCastle = `${fenWhiteCastleKS}${fenWhiteCastleQS}${fenBlackCastleKS}${fenBlackCastleQS}`;
    const fenCastleString = fenCastle.length > 0 ? fenCastle : "-";

    let boardRep = "";
    board.forEach((rank) => {
      let emptyCount = 0;
      rank.forEach((cell) => {
        if (cell.piece) {
          if (emptyCount > 0) {
            boardRep += emptyCount;
            emptyCount = 0;
          }
          const piece = cell.piece;
          let pieceName = piece.name;
          if (piece.color === COLORS.BLACK) pieceName = pieceName.toLowerCase();
          boardRep += pieceName;
        } else {
          emptyCount++;
        }
      });
      if (emptyCount > 0) {
        boardRep += emptyCount;
      }
      boardRep += "/";
    });
    //if last character in boardRep is a slash, remove it
    if (boardRep[boardRep.length - 1] === "/")
      boardRep = boardRep.slice(0, boardRep.length - 1);
    const finalFen = `${boardRep} ${fenTurn} ${fenCastleString} - ${totalHalfMoves} ${totalMoves}`;
    return finalFen;
  }
}
