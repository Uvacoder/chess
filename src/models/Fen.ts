import FenParser from "@chess-fu/fen-parser";
import { START_POSITION } from "../utils/Constants";

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
}
