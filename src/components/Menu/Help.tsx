export default function Help() {
  return (
    <div className="mt-10 p-10 text-white text-[1.5rem] bg-neutral-900">
      <div>
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          Game
        </h2>
        <ul className="space-y-1 list-disc list-inside dark:text-gray-400 ">
          <li className="text-lg leading-tight text-sans-serif">
            Click on a Piece to View its Possible Moves
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            After Clicking a piece and Valid Moves are shown, click on any valid
            square to move the piece (dragging a piece is not supported yet)
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            If King is in Check, all squares leading to check are highlighted
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          Local Multiplayer
        </h2>
        <ul className="mt-y-1 list-disc list-inside dark:text-gray-400">
          <li className="text-lg leading-tight text-sans-serif">
            Normal Rules of Chess Apply
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            Game Starts with Both players having 10 minutes each
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            If a player runs out of time, the other player wins
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          Analysis
        </h2>
        <ul className="mt-y-1 list-disc list-inside dark:text-gray-400">
          <li className="text-lg leading-tight text-sans-serif">
            Normal Rules of Chess Apply
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            There is a Button on Top Right to open a Drawer on Right
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            Initial Position of Board can be set using FEN strings or Choose
            from Available Positions
          </li>
          <li className="text-lg leading-tight text-sans-serif">
            See the Current Board Position in FEN String in Game Info Section in
            the Drawer
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          vs AI
        </h2>
        <ul className="mt-y-1 list-disc list-inside dark:text-gray-400">
          <li className="text-lg leading-tight text-sans-serif">
            Comming Soon
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <h2 className="overflow-hidden text-[2.5rem] leading-tight underline mb-3">
          Online Multiplayer
        </h2>
        <ul className="mt-y-1 list-disc list-inside dark:text-gray-400">
          <li className="text-lg leading-tight text-sans-serif">
            Comming Soon
          </li>
        </ul>
      </div>
    </div>
  );
}
