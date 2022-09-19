import Piece from "./Piece";

export class Player {
  private m_score: number = 0;
  private m_capturedPieces: Piece[] = [];
  private m_isTurn: boolean = false;
  private m_timeLeft: number = 0;
  constructor(private m_color: string, private m_name: string) {}
  public GetColor() {
    return this.m_color;
  }
  public GetName() {
    return this.m_name;
  }
  public GetScore() {
    return this.m_score;
  }
  public SetScore(score: number) {
    this.m_score = score;
  }
  public GetCapturedPieces() {
    return this.m_capturedPieces;
  }
  public AddCapturePiece(capturedPiece: Piece) {
    this.m_capturedPieces.push(capturedPiece);
  }

  public GetTimeLeft() {
    return this.m_timeLeft;
  }
  public SetTimeLeft(timeLeft: number) {
    this.m_timeLeft = timeLeft;
  }
  public GetIsTurn() {
    return this.m_isTurn;
  }
  public SetIsTurn(isTurn: boolean) {
    this.m_isTurn = isTurn;
  }
}
