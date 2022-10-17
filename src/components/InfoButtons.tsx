import React from "react";

import { BrandGithub, AlertTriangle } from "tabler-icons-react";

export default function InfoButtons() {
  return (
    <div>
      <div className="absolute flex gap-2 bottom-[10px] right-[10px]">
        <a
          href="https://github.com/suparthghimire/chess"
          target="_blank"
          className="px-3 py-2 rounded bg-blue-500 text-lg font-bold text-white hover:text-white hover:opacity-80 transition"
        >
          <BrandGithub />
        </a>

        <a
          href="https://github.com/suparthghimire/chess/issues"
          target="_blank"
          className="px-3 py-2 rounded bg-red-500 text-lg font-bold text-white hover:text-white hover:opacity-80 transition"
        >
          <AlertTriangle />
        </a>
      </div>
    </div>
  );
}
