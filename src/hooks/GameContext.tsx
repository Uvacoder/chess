import React, { createContext, ReactNode } from "react";
import Board from "../models/Board";

const GameContext = createContext<any>({});

export const useGame = () =>
  React.useContext<{
    fen: string;
    pgn: Array<string>;
    setPgn: Function;
    setFen: Function;
    board: Board;
    setBoard: Function;
  }>(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [fen, setFen] = React.useState<string>();
  const [board, setBoard] = React.useState<Board>();
  const [pgn, setPgn] = React.useState<Array<string>>();
  return (
    <GameContext.Provider value={{ fen, setFen, board, setBoard, pgn, setPgn }}>
      {children}
    </GameContext.Provider>
  );
}
