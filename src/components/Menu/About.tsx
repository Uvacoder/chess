import { BrandGithub } from "tabler-icons-react";

export default function About() {
  return (
    <div className="mt-10 p-10 text-white text-[1.5rem] tracking-wide rounded-x h-fit bg-neutral-900">
      <div className="gap-5 flex flex-col lg:flex-row">
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          About The Project
        </h2>
        <a
          href="https://github.com/suparthghimire/chess"
          className={`mb-6 text-neutral-900 relative focus:outline-none z-[2] text-[2rem] overflow-hidden flex items-center gap-2 px-3 w-max h-[50px] text-[1.25rem] pt-1 bg-primary rounded-full hover:bg-neutral-600 hover:text-white transition`}
        >
          <BrandGithub />
          <p className="overflow-hidden">View Code</p>
        </a>
      </div>
      <p className="overflow-hidden text-sans-serif">
        I was bored one night, so decided to code Chess in React. It has been
        fun to write code for this complicated game. I don't have any concrete
        plans on what extent this project might grow, but I would like to try to
        create my own AI that can play against humans one day. That point is far
        though. For now, I am developing actual playable game with all rules of
        Chess.{" "}
        <a href="https://github.com/suparthghimire/chess#readme">[Read More]</a>
      </p>
    </div>
  );
}
