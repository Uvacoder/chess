import FenParser from "@chess-fu/fen-parser";
import { TBoardKing } from "../@types";
import { COLORS, START_POSITION } from "../utils/Constants";
import Cell from "./Cell";
import { King } from "./Piece";

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
    kings: TBoardKing,
    turn: COLORS,
    totalMoves: number,
    totalHalfMoves: number
  ) {
    const fenTurn = turn === COLORS.WHITE ? "w" : "b";

    const whiteKingLoc = kings[COLORS.WHITE].location;
    const blackKingLoc = kings[COLORS.BLACK].location;

    const whiteKing = board[whiteKingLoc.x][whiteKingLoc.y].piece! as King;
    const blackKing = board[blackKingLoc.x][blackKingLoc.y].piece! as King;

    const whiteKingCastle = whiteKing.castle;
    const blackKingCastle = blackKing.castle;

    const fenBlackCastleKS = blackKingCastle.ks ? "K" : "";
    const fenBlackCastleQS = blackKingCastle.qs ? "Q" : "";
    const fenWhiteCastleKS = whiteKingCastle.ks ? "k" : "";
    const fenWhiteCastleQS = whiteKingCastle.qs ? "q" : "";

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
