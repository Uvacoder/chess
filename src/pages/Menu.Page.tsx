import { useEffect, useState } from "react";
import About from "../components/Menu/About";
import Settings from "../components/Menu/Settings";
import Play from "../components/Menu/Play";
import { useGame } from "../hooks/GameContext";
import { START_POSITION } from "../utils/Constants";

export default function MenuPage() {
  const { ChangeFenString, ResetGameOverStatus } = useGame();

  const [tabIdx, setTabIdx] = useState(0);
  const [tabs, _] = useState({
    0: {
      name: "Play",
      component: <Play />,
    },
    1: {
      name: "About",
      component: <About />,
    },
    2: {
      name: "Settings",
      component: <Settings />,
    },
  });
  useEffect(() => {
    ChangeFenString(START_POSITION);
    ResetGameOverStatus();
  }, []);
  return (
    <div className="text-black h-screen lg:h-fit w-screen lg:w-[75vw] lg:min-w-[1000px] p-10 lg:px-[100px] bg-white">
      <header className="flex gap-4 items-center h-fit">
        <img src="/logo.svg" className="w-[3rem] md:w-[5rem]" alt="APP Logo" />
        <h1 className="logo text-primary overflow-hidden text-[3rem] md:text-[5rem] leading-loose">
          Shakuni
        </h1>
      </header>
      <section className="flex gap-3 h-fit">
        <div className="rounded-md flex w-fit relative bg-neutral-900">
          <div
            className={`absolute isolate z-[1] h-full top-0 transition left-0 bg-primary`}
            style={{
              width: "calc(100% / 3)",
              transform:
                tabIdx === 0
                  ? "translateX(0)"
                  : `translateX(calc(${tabIdx} * 100%))`,
            }}
          ></div>
          {Object.entries(tabs).map(([k, v], i) => (
            <button
              className={`focus:outline-none z-[2] overflow-hidden w-[100px] lg:w-[120px] h-[50px] text-[1.5rem] lg:text-[2rem] pt-1 transition hover:opacity-80 ${
                tabIdx === i ? "text-neutral-900 " : "text-white"
              }`}
              onClick={() => setTabIdx(i)}
            >
              {v.name}
            </button>
          ))}
        </div>
      </section>
      {(tabs as any)[`${tabIdx}`].component}
    </div>
  );
}
