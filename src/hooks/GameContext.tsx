import React, { createContext, ReactNode } from "react";
import { TGameOverInfo } from "../@types";
import Board from "../models/Board";
import Game from "../models/Game";

const GameContext = createContext<any>({});

export const useGame = () =>
  React.useContext<{
    fen: string;
    pgn: Array<string>;
    setPgn: Function;
    setFen: Function;
    board: Board;
    setBoard: Function;
    ChangeFenString: Function;
    fenError: boolean;
    gameOver: TGameOverInfo;
    setFenError: Function;
    setGameOver: Function;
    ResetGameOverStatus: Function;
  }>(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [fen, setFen] = React.useState<string>();
  const [board, setBoard] = React.useState<Board>();
  const [pgn, setPgn] = React.useState<Array<string>>();
  const [fenError, setFenError] = React.useState<boolean>(false);
  const [gameOver, setGameOver] = React.useState<TGameOverInfo>({
    status: false,
    reason: {
      won: {
        status: false,
        reason: null,
      },
      draw: {
        status: false,
        reason: null,
      },
    },
  });
  function ResetGameOverStatus() {
    setGameOver({
      status: false,
      reason: {
        won: {
          status: false,
          reason: null,
        },
        draw: {
          status: false,
          reason: null,
        },
      },
    });
  }
  function ChangeFenString(fen: string) {
    try {
      setFenError(false);
      setFen(fen);
      const game = new Game();
      game.NewGame(fen);
      const b = game.board;
      setBoard(b);
      setGameOver({
        status: false,
        reason: {
          won: {
            status: false,
            reason: null,
          },
          draw: {
            status: false,
            reason: null,
          },
        },
      });
    } catch (error) {
      setFenError(true);
      console.error(error);
    }
  }

  return (
    <GameContext.Provider
      value={{
        fen,
        setFen,
        board,
        setBoard,
        pgn,
        setPgn,
        fenError,
        gameOver,
        ChangeFenString,
        setFenError,
        setGameOver,
        ResetGameOverStatus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
