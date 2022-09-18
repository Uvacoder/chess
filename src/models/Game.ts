import Board from "./Board";

export default class Game {
  constructor(private m_turn: string, private m_board: Board) {}
  public StartGame() {}
  public GameOver() {}
}
