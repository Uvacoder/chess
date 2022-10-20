import React, { createContext, ReactNode } from "react";
import { TGameOverInfo } from "../@types";
import Board from "../models/Board";
import Game from "../models/Game";
import { toast } from "react-toastify";
import { COLORS, START_POSITION } from "../utils/Constants";

type TGameContextType = {
  fen: string;
  pgn: Array<string> | undefined;
  setPgn: Function;
  setFen: Function;
  board: Board | undefined;
  setBoard: Function;
  ChangeFenString: Function;
  fenError: boolean;
  gameOver: TGameOverInfo;
  setFenError: Function;
  setGameOver: Function;
  ResetGameOverStatus: Function;
  turn: COLORS;
  setTurn: Function;
};

const GameContext = createContext<TGameContextType>({
  fen: "",
  pgn: [],
  setPgn: () => {},
  setFen: () => {},
  board: undefined,
  setBoard: () => {},
  ChangeFenString: () => {},
  fenError: false,
  gameOver: {
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
  },
  setFenError: () => {},
  setGameOver: () => {},
  ResetGameOverStatus: () => {},
  turn: COLORS.WHITE,
  setTurn: () => {},
});

export const useGame = () => React.useContext<TGameContextType>(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [fen, setFen] = React.useState<string>(START_POSITION);
  const [board, setBoard] = React.useState<Board>();
  const [pgn, setPgn] = React.useState<Array<string>>();
  const [fenError, setFenError] = React.useState<boolean>(false);
  const [turn, setTurn] = React.useState<COLORS>(COLORS.WHITE);
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
      toast.success("Position Set on Board");
    } catch (error) {
      setFenError(true);
      console.error(error);
      toast.error("Invalid FEN string");
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
        turn,
        setTurn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
