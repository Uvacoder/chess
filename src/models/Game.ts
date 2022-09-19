import { COLORS, START_POSITION } from "../utils/Constants";
import Board from "./Board";
import Fen from "./Fen";
import { Player } from "./Player";

export default class Game {
  private m_players: Array<Player> = [];
  private m_turn: string = COLORS.WHITE;
  private m_gameRunning: boolean = false;
  private m_board: Board = new Board();
  constructor(players: { name: string; color: string }[]) {
    this.m_players.push(new Player(players[0].color, players[0].name));
    this.m_players.push(new Player(players[1].color, players[1].name));
    this.StartGame();
  }

  public GetBoard() {
    return this.m_board;
  }
  public StartGame() {
    this.m_board = new Board();
    new Fen(this.m_board, START_POSITION);
  }
  public GameOver() {
    this.m_gameRunning = false;
  }
  public ChangeTurn() {
    this.m_turn = this.m_turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  }
  public GetTurn() {
    return this.m_turn;
  }

  public GetGameRunning() {
    return this.m_gameRunning;
  }
}
