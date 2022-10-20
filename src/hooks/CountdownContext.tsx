import React, { createContext, useContext, useState } from "react";

// convert time froms econds to minutes and hours
export type TConvertedTime = {
  hrs: number;
  mins: number;
  secs: number;
  strHrs: string | number;
  strMin: string | number;
  strSec: string | number;
};
export type TTimerContextType = {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  countdown: number | null;
  setCountdown: React.Dispatch<React.SetStateAction<number | null>>;
  countdownEnd: boolean;
  setCountdownEnd: React.Dispatch<React.SetStateAction<boolean>>;
  countdownPaused: boolean;
  setCountdownPaused: React.Dispatch<React.SetStateAction<boolean>>;
  GetFormattedTime: () => TConvertedTime;
  pauseCountdown: () => void;
  resumeCountdown: () => void;
  startCountdown: (v: number) => void;
  resetCountdown: () => void;
};
function convertTime(seconds: number): TConvertedTime {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hrs * 3600) / 60);
  const secs = Math.floor(seconds - hrs * 3600 - mins * 60);

  const strHrs = hrs.toString().length < 2 ? "0" + hrs : hrs;
  const strMin = mins.toString().length < 2 ? "0" + mins : mins;
  const strSec = secs.toString().length < 2 ? "0" + secs : secs;

  return {
    hrs,
    mins,
    secs,
    strHrs,
    strMin,
    strSec,
  };
}

const CountDownContext = createContext<TTimerContextType>({
  time: 0,
  setTime: () => {},
  countdown: null,
  setCountdown: () => {},
  countdownPaused: false,
  setCountdownPaused: () => {},
  countdownEnd: false,
  setCountdownEnd: () => {},
  GetFormattedTime: () => convertTime(0),
  pauseCountdown: () => {},
  resumeCountdown: () => {},
  startCountdown: (v: number) => {},
  resetCountdown: () => {},
});
export const useCountdown = () =>
  useContext<TTimerContextType>(CountDownContext);

export default function CountDownProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(0);
  const [countdownEnd, setCountdownEnd] = useState(false);
  const [countdownPaused, setCountdownPaused] = useState(false);

  function startCountdown(startTime: number) {
    if (countdown) return;
    setInitialTime(startTime);
    setTime(startTime);
    setCountdownEnd(false);
    setCountdown(
      setInterval(() => {
        setTime((time) => {
          const newTime = time - 1;
          if (newTime <= 0) {
            clearInterval(countdown as number);
            setCountdown(null);
            setCountdownEnd(true);
            return 0;
          }
          return newTime;
        });
      }, 1000)
    );
  }

  function stopCountdown() {
    if (!countdown) return;
    clearInterval(countdown);
    setCountdownEnd(true);
    setCountdown(null);
  }

  function pauseCountdown() {
    if (!countdown) return;
    setCountdownPaused(true);
    setCountdownEnd(false);
    clearInterval(countdown);
    setCountdown(null);
  }

  function resumeCountdown() {
    if (countdown) return;
    setCountdownPaused(false);
    setCountdownEnd(false);
    setTime((time) => time - 1);
    setCountdown(
      setInterval(() => {
        setTime((time) => time - 1);
      }, 1000)
    );
  }
  function resetCountdown() {
    setTime(initialTime);
  }

  function getTime() {
    return convertTime(time);
  }

  return (
    <CountDownContext.Provider
      value={{
        time,
        setTime,
        countdown,
        setCountdown,
        countdownEnd,
        setCountdownEnd,
        countdownPaused,
        setCountdownPaused,
        pauseCountdown,
        resumeCountdown,
        startCountdown,
        resetCountdown,
        GetFormattedTime: getTime,
      }}
    >
      {children}
    </CountDownContext.Provider>
  );
}
